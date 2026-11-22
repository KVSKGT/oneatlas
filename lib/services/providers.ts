import { prisma } from "@/lib/prisma";

export async function getProvidersList() {
  const providers = await prisma.provider.findMany({
    include: {
      _count: {
        select: { models: true },
      },
    },
    orderBy: {
      models: {
        _count: "desc",
      },
    },
  });

  return providers.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    website: p.website,
    description: p.description,
    modelCount: p._count.models,
  }));
}

export async function getProviderDetail(slug: string) {
  const provider = await prisma.provider.findUnique({
    where: { slug },
    include: {
      models: {
        include: {
          model: {
            include: {
              lab: true,
            },
          },
        },
        orderBy: {
          inputPricePerM: "asc",
        },
      },
    },
  });

  return provider;
}
