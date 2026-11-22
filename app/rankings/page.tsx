"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar } from "@/components/Avatar";
import {
  Trophy,
  Medal,
  Award,
  Layers,
  ArrowRight,
  Loader2,
  Info,
  Scale,
  Sparkles,
} from "lucide-react";

interface RankingItem {
  rank: number;
  score: number;
  scoreCount?: number;
  model: {
    id: string;
    slug: string;
    name: string;
    modelType: string;
    contextWindow: number;
    minInputPrice: number | string | null;
    minOutputPrice: number | string | null;
    lab: {
      name: string;
      slug: string;
    };
  };
}

interface BenchmarkInfo {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string | null;
  source: string;
}

function RankingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeBenchmark = searchParams.get("benchmark") || "overall";
  const activeCategory = searchParams.get("category") || "all";

  const [benchmarks, setBenchmarks] = useState<BenchmarkInfo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [currentBenchmark, setCurrentBenchmark] = useState<Partial<BenchmarkInfo>>({
    name: "Overall Rankings",
    description: "Mean benchmark score across models with at least 3 evaluated benchmarks.",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (activeBenchmark) query.set("benchmark", activeBenchmark);
        if (activeCategory && activeCategory !== "all") query.set("category", activeCategory);

        const res = await fetch(`/api/rankings?${query.toString()}`);
        const json = await res.json();

        if (json.success) {
          setRankings(json.data.rankings);
          setBenchmarks(json.data.benchmarks);
          setCategories(json.data.categories);
          if (json.data.benchmark) {
            setCurrentBenchmark(json.data.benchmark);
          }
        }
      } catch (err) {
        console.error("Rankings fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRankings();
  }, [activeBenchmark, activeCategory]);

  const selectBenchmark = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("benchmark", slug);
    router.push(`/rankings?${params.toString()}`);
  };

  const selectCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/rankings?${params.toString()}`);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-400/20">
          <Medal className="h-4 w-4" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-slate-950 font-bold text-xs shadow-md">
          <Award className="h-4 w-4" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-700 text-amber-100 font-bold text-xs shadow-md">
          <Award className="h-4 w-4" />
        </div>
      );
    }
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-400 font-mono font-medium text-xs">
        {rank}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Benchmark Leaderboard & Intelligence Index</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Foundation Model Rankings
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Compare AI models ranked by empirical evaluation benchmarks across reasoning, coding, knowledge, agentic workflows, and vision.
            </p>
          </div>

          {/* Sample Data Disclaimer Pill */}
          <div className="flex items-center gap-2 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 text-xs text-amber-300 max-w-sm">
            <Info className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Sample Benchmark Data:</strong> Scores are generated via reproducible seeded calculations for demonstration and framework testing.
            </span>
          </div>
        </div>

        {/* Benchmark Selector Tabs */}
        <div className="my-6 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => selectBenchmark("overall")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeBenchmark === "overall"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Overall Index</span>
            </button>

            {benchmarks.map((b) => (
              <button
                key={b.slug}
                onClick={() => selectBenchmark(b.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeBenchmark === b.slug
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850"
                }`}
              >
                <span>{b.name}</span>
                <span className="ml-1.5 text-[10px] opacity-70 uppercase">({b.category})</span>
              </button>
            ))}
          </div>

          {/* Category Filter if on Overall */}
          {activeBenchmark === "overall" && categories.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
                Filter Category:
              </span>
              <button
                onClick={() => selectCategory("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === "all"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => selectCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                    activeCategory === c
                      ? "bg-slate-800 text-white font-semibold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Benchmark Info Banner */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <span>{currentBenchmark.name}</span>
              {currentBenchmark.category && (
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 capitalize">
                  {currentBenchmark.category}
                </span>
              )}
            </div>
            <p className="text-slate-400 mt-0.5">
              {currentBenchmark.description || "Empirical performance evaluations across standard tasks."}
            </p>
          </div>
          <div className="text-slate-400 text-right flex-shrink-0">
            {rankings.length} models ranked
          </div>
        </div>

        {/* Leaderboard Table */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
            <p className="text-sm">Calculating rankings and aggregations...</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
            No models qualified for this benchmark filter.
          </div>
        ) : (
          <div className="border border-slate-800 rounded-3xl bg-slate-900/60 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 w-14 text-center">Rank</th>
                    <th className="py-3.5 px-4">Model & Laboratory</th>
                    <th className="py-3.5 px-4 w-64">Score Performance</th>
                    <th className="py-3.5 px-4">Context</th>
                    <th className="py-3.5 px-4">Min Price</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {rankings.map((item) => {
                    const price = item.model.minInputPrice ? Number(item.model.minInputPrice) : null;
                    const ctx = item.model.contextWindow;
                    const ctxStr = ctx >= 1_000_000 ? `${(ctx / 1_000_000).toFixed(1)}M` : `${(ctx / 1000).toFixed(0)}k`;

                    return (
                      <tr key={item.model.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center">{getRankBadge(item.rank)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={item.model.lab.name} size="sm" />
                            <div>
                              <a
                                href={`/models/${item.model.slug}`}
                                className="font-semibold text-sm text-slate-100 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                              >
                                <span>{item.model.name}</span>
                              </a>
                              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                <span>{item.model.lab.name}</span>
                                <span>•</span>
                                <span className="capitalize">{item.model.modelType}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-slate-100 text-sm">
                                {item.score.toFixed(1)}%
                              </span>
                              {item.scoreCount && (
                                <span className="text-[10px] text-slate-500">
                                  ({item.scoreCount} benchmarks avg)
                                </span>
                              )}
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-300">{ctxStr}</td>
                        <td className="py-4 px-4 font-mono text-slate-300">
                          {price != null ? `$${price.toFixed(2)}/1M` : "Custom"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/compare?models=${item.model.slug}`}
                              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                              title="Compare this model"
                            >
                              <Scale className="h-3.5 w-3.5" />
                            </a>
                            <a
                              href={`/models/${item.model.slug}`}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1 transition-colors"
                            >
                              <span>Inspect</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function RankingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <RankingsContent />
    </Suspense>
  );
}
