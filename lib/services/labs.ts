import { prisma } from "@/lib/prisma";

export async function getLabsList() {
  const labs = await prisma.lab.findMany({
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

  return labs.map((l) => ({
    id: l.id,
    slug: l.slug,
    name: l.name,
    country: l.country,
    website: l.website,
    description: l.description,
    modelCount: l._count.models,
  }));
}

export async function getLabDetail(slug: string) {
  const lab = await prisma.lab.findUnique({
    where: { slug },
    include: {
      models: {
        include: {
          lab: true,
          _count: {
            select: {
              providers: true,
              benchmarkScores: true,
            },
          },
        },
        orderBy: {
          releaseDate: "desc",
        },
      },
    },
  });

  return lab;
}
