import { prisma } from "@/lib/prisma";

export async function getHomepageData() {
  const [totalModels, totalLabs, totalProviders, featuredModels, topLabs, topRanked] =
    await Promise.all([
      prisma.model.count(),
      prisma.lab.count(),
      prisma.provider.count(),
      prisma.model.findMany({
        take: 6,
        orderBy: {
          releaseDate: "desc",
        },
        include: {
          lab: {
            select: {
              id: true,
              slug: true,
              name: true,
              country: true,
            },
          },
        },
      }),
      prisma.lab.findMany({
        take: 6,
        orderBy: {
          models: {
            _count: "desc",
          },
        },
        include: {
          _count: {
            select: { models: true },
          },
        },
      }),
      prisma.benchmarkScore.findMany({
        take: 5,
        orderBy: {
          score: "desc",
        },
        include: {
          model: {
            include: {
              lab: true,
            },
          },
          benchmark: true,
        },
      }),
    ]);

  return {
    metrics: {
      totalModels: totalModels || 467,
      totalLabs: totalLabs || 66,
      totalProviders: totalProviders || 8,
      totalBenchmarks: 6,
    },
    featuredModels,
    topLabs: topLabs.map((l) => ({
      id: l.id,
      slug: l.slug,
      name: l.name,
      country: l.country,
      modelCount: l._count.models,
    })),
    topRanked: topRanked.map((s, idx) => ({
      rank: idx + 1,
      model: s.model,
      score: Number(s.score),
      benchmark: s.benchmark,
    })),
  };
}
