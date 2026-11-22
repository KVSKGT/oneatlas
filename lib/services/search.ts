import { prisma } from "@/lib/prisma";

export async function globalSearch(query: string, limit: number = 6) {
  const q = query.trim();
  if (!q) {
    return { models: [], labs: [], providers: [] };
  }

  const [models, labs, providers] = await Promise.all([
    prisma.model.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      include: {
        lab: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { releaseDate: "desc" },
    }),
    prisma.lab.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      include: {
        _count: {
          select: { models: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.provider.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      },
      take: limit,
      include: {
        _count: {
          select: { models: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    models: models.map((m) => ({
      id: m.id,
      slug: m.slug,
      name: m.name,
      modelType: m.modelType,
      labName: m.lab.name,
      labSlug: m.lab.slug,
      minInputPrice: m.minInputPrice ? Number(m.minInputPrice) : null,
      contextWindow: m.contextWindow,
    })),
    labs: labs.map((l) => ({
      id: l.id,
      slug: l.slug,
      name: l.name,
      country: l.country,
      modelCount: l._count.models,
    })),
    providers: providers.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      modelCount: p._count.models,
    })),
  };
}
