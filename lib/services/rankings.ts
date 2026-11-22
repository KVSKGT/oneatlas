import { prisma } from "@/lib/prisma";
import { RankingsQueryInput } from "@/lib/validators/rankings";

export async function getBenchmarkRankings(params: RankingsQueryInput) {
  const { benchmark, category, limit } = params;

  // 1. Fetch available benchmarks for the tabs
  const benchmarks = await prisma.benchmark.findMany({
    orderBy: { name: "asc" },
  });

  const categories = Array.from(new Set(benchmarks.map((b) => b.category)));

  // If specific benchmark requested
  if (benchmark && benchmark !== "overall") {
    const targetBenchmark = await prisma.benchmark.findUnique({
      where: { slug: benchmark },
    });

    if (!targetBenchmark) {
      return {
        benchmark: null,
        benchmarks,
        categories,
        rankings: [],
      };
    }

    const scores = await prisma.benchmarkScore.findMany({
      where: { benchmarkId: targetBenchmark.id },
      orderBy: { score: "desc" },
      take: limit,
      include: {
        model: {
          include: {
            lab: true,
          },
        },
      },
    });

    const rankings = scores.map((s, index) => ({
      rank: index + 1,
      model: s.model,
      score: Number(s.score),
      benchmark: targetBenchmark,
    }));

    return {
      benchmark: targetBenchmark,
      benchmarks,
      categories,
      rankings,
    };
  }

  // "Overall" Ranking:
  // Rule: Calculate mean of benchmark scores for models that have at least 3 benchmark scores!
  const filterBenchmarkWhere: Record<string, unknown> = {};
  if (category && category !== "all") {
    filterBenchmarkWhere.benchmark = { category };
  }

  const modelsWithScores = await prisma.model.findMany({
    where: {
      benchmarkScores: {
        some: filterBenchmarkWhere,
      },
    },
    include: {
      lab: true,
      benchmarkScores: {
        where: filterBenchmarkWhere,
        include: {
          benchmark: true,
        },
      },
    },
  });

  // Filter models with at least 3 benchmark scores
  const qualified = modelsWithScores
    .map((m) => {
      const scores = m.benchmarkScores.map((s) => Number(s.score));
      if (scores.length < 3) return null;
      const mean = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
      return {
        model: m,
        scoreCount: scores.length,
        overallScore: Number(mean.toFixed(2)),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, limit);

  const rankings = qualified.map((q, idx) => ({
    rank: idx + 1,
    model: q.model,
    score: q.overallScore,
    scoreCount: q.scoreCount,
    benchmark: {
      name: category && category !== "all" ? `Overall (${category.toUpperCase()})` : "Overall (Composite Mean)",
      category: category ?? "general",
      source: "sample",
    },
  }));

  return {
    benchmark: {
      name: "Overall Rankings",
      slug: "overall",
      category: category ?? "all",
      description: "Mean score across all evaluated benchmarks for models with 3+ benchmark evaluations.",
      source: "sample",
    },
    benchmarks,
    categories,
    rankings,
  };
}
