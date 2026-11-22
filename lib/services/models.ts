import { prisma } from "@/lib/prisma";
import { ModelFilterInput } from "@/lib/validators/models";
import { Prisma } from "@prisma/client";

export async function getModels(params: ModelFilterInput) {
  const {
    search,
    lab,
    type,
    capability,
    minPrice,
    maxPrice,
    minContext,
    maxContext,
    sort,
    page,
    pageSize,
  } = params;

  const where: Prisma.ModelWhereInput = {};

  // Search filter
  if (search && search.trim() !== "") {
    const s = search.trim();
    where.OR = [
      { name: { contains: s, mode: "insensitive" } },
      { slug: { contains: s, mode: "insensitive" } },
      { description: { contains: s, mode: "insensitive" } },
    ];
  }

  // Lab filter
  if (lab && lab !== "all") {
    where.lab = {
      slug: lab,
    };
  }

  // Model Type filter
  if (type && type !== "all") {
    where.modelType = type;
  }

  // Capability filter
  if (capability && capability !== "all") {
    const caps = capability.split(",").map((c) => c.trim()).filter(Boolean);
    if (caps.length > 0) {
      where.capabilities = {
        hasEvery: caps,
      };
    }
  }

  // Pricing filter
  if (minPrice != null || maxPrice != null) {
    where.minInputPrice = {};
    if (minPrice != null) {
      where.minInputPrice.gte = new Prisma.Decimal(minPrice);
    }
    if (maxPrice != null) {
      where.minInputPrice.lte = new Prisma.Decimal(maxPrice);
    }
  }

  // Context window filter
  if (minContext != null || maxContext != null) {
    where.contextWindow = {};
    if (minContext != null) {
      where.contextWindow.gte = minContext;
    }
    if (maxContext != null) {
      where.contextWindow.lte = maxContext;
    }
  }

  // Sorting
  let orderBy: Prisma.ModelOrderByWithRelationInput = { releaseDate: "desc" };
  if (sort === "price_asc") {
    orderBy = { minInputPrice: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { minInputPrice: "desc" };
  } else if (sort === "context_desc") {
    orderBy = { contextWindow: "desc" };
  } else if (sort === "date_desc") {
    orderBy = { releaseDate: "desc" };
  } else if (sort === "name_asc") {
    orderBy = { name: "asc" };
  }

  const skip = (page - 1) * pageSize;

  const [total, models] = await Promise.all([
    prisma.model.count({ where }),
    prisma.model.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        lab: {
          select: {
            id: true,
            slug: true,
            name: true,
            country: true,
          },
        },
        _count: {
          select: {
            providers: true,
            benchmarkScores: true,
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return {
    models,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

export async function getFilterOptions() {
  const [labs, modelTypesRaw, capabilitiesRaw, priceAggregate, contextAggregate] =
    await Promise.all([
      prisma.lab.findMany({
        select: {
          slug: true,
          name: true,
          _count: {
            select: { models: true },
          },
        },
        orderBy: {
          models: {
            _count: "desc",
          },
        },
      }),
      prisma.model.findMany({
        select: { modelType: true },
        distinct: ["modelType"],
      }),
      prisma.model.findMany({
        select: { capabilities: true },
      }),
      prisma.model.aggregate({
        _min: { minInputPrice: true },
        _max: { minInputPrice: true },
      }),
      prisma.model.aggregate({
        _min: { contextWindow: true },
        _max: { contextWindow: true },
      }),
    ]);

  const allCaps = new Set<string>();
  capabilitiesRaw.forEach((m) => {
    m.capabilities.forEach((c) => allCaps.add(c));
  });

  return {
    labs: labs.map((l) => ({
      slug: l.slug,
      name: l.name,
      modelCount: l._count.models,
    })),
    modelTypes: modelTypesRaw.map((m) => m.modelType).filter(Boolean),
    capabilities: Array.from(allCaps),
    priceRange: {
      min: Number(priceAggregate._min.minInputPrice ?? 0),
      max: Number(priceAggregate._max.minInputPrice ?? 100),
    },
    contextRange: {
      min: contextAggregate._min.contextWindow ?? 4096,
      max: contextAggregate._max.contextWindow ?? 2000000,
    },
  };
}
