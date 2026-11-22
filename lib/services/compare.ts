import { prisma } from "@/lib/prisma";

export async function getComparisonData(slugs: string[]) {
  const models = await prisma.model.findMany({
    where: {
      slug: { in: slugs },
    },
    include: {
      lab: true,
      providers: {
        include: {
          provider: true,
        },
        orderBy: {
          inputPricePerM: "asc",
        },
      },
      benchmarkScores: {
        include: {
          benchmark: true,
        },
      },
    },
  });

  if (models.length === 0) return { models: [], highlights: {} };

  // Calculate best-value indicators across selected models
  let minInputPriceVal = Infinity;
  let minOutputPriceVal = Infinity;
  let maxContextVal = -1;
  const bestBenchmarkScore: Record<string, number> = {};

  let minInputModelSlug = "";
  let minOutputModelSlug = "";
  let maxContextModelSlug = "";
  const bestBenchmarkModelSlug: Record<string, string> = {};

  models.forEach((m) => {
    const inPrice = Number(m.minInputPrice ?? 999999);
    const outPrice = Number(m.minOutputPrice ?? 999999);

    if (inPrice < minInputPriceVal) {
      minInputPriceVal = inPrice;
      minInputModelSlug = m.slug;
    }
    if (outPrice < minOutputPriceVal) {
      minOutputPriceVal = outPrice;
      minOutputModelSlug = m.slug;
    }
    if (m.contextWindow > maxContextVal) {
      maxContextVal = m.contextWindow;
      maxContextModelSlug = m.slug;
    }

    m.benchmarkScores.forEach((b) => {
      const bSlug = b.benchmark.slug;
      const scoreNum = Number(b.score);
      if (!bestBenchmarkScore[bSlug] || scoreNum > bestBenchmarkScore[bSlug]) {
        bestBenchmarkScore[bSlug] = scoreNum;
        bestBenchmarkModelSlug[bSlug] = m.slug;
      }
    });
  });

  // Collect all unique benchmarks across the models
  const benchmarksMap = new Map<string, { slug: string; name: string; category: string }>();
  models.forEach((m) => {
    m.benchmarkScores.forEach((b) => {
      benchmarksMap.set(b.benchmark.slug, {
        slug: b.benchmark.slug,
        name: b.benchmark.name,
        category: b.benchmark.category,
      });
    });
  });

  return {
    models,
    benchmarks: Array.from(benchmarksMap.values()),
    highlights: {
      cheapestInputModel: minInputModelSlug,
      cheapestOutputModel: minOutputModelSlug,
      largestContextModel: maxContextModelSlug,
      bestBenchmarkModels: bestBenchmarkModelSlug,
    },
  };
}
