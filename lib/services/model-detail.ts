import { prisma } from "@/lib/prisma";

export async function getModelDetail(slug: string) {
  const model = await prisma.model.findUnique({
    where: { slug },
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
        orderBy: {
          score: "desc",
        },
      },
    },
  });

  if (!model) return null;

  // Calculate best-in-class metrics among offers
  const cheapestOffer = model.providers.length > 0 ? model.providers[0] : null;
  const fastestOffer = model.providers
    .filter((p) => p.latencyMs != null)
    .sort((a, b) => (a.latencyMs ?? 9999) - (b.latencyMs ?? 9999))[0] ?? null;
  const highestThroughput = model.providers
    .filter((p) => p.throughputTps != null)
    .sort((a, b) => Number(b.throughputTps ?? 0) - Number(a.throughputTps ?? 0))[0] ?? null;

  return {
    ...model,
    bestMetrics: {
      cheapestOffer,
      fastestOffer,
      highestThroughput,
    },
  };
}
