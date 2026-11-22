"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar } from "@/components/Avatar";
import {
  Scale,
  X,
  Plus,
  CheckCircle2,
  Sparkles,
  Cpu,
  Eye,
  Braces,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Trophy,
} from "lucide-react";

interface CompareModelData {
  id: string;
  slug: string;
  name: string;
  modelType: string;
  description: string | null;
  contextWindow: number;
  releaseDate: string | Date | null;
  inputModalities: string[];
  outputModalities: string[];
  capabilities: string[];
  minInputPrice: number | string | null;
  minOutputPrice: number | string | null;
  lab: {
    id: string;
    slug: string;
    name: string;
    country: string | null;
  };
  providers: Array<{
    id: string;
    inputPricePerM: number | string;
    outputPricePerM: number | string;
    latencyMs: number | null;
    throughputTps: number | string | null;
    provider: {
      name: string;
      slug: string;
    };
  }>;
  benchmarkScores: Array<{
    id: string;
    score: number | string;
    benchmark: {
      slug: string;
      name: string;
      category: string;
    };
  }>;
}

interface BenchmarkInfo {
  slug: string;
  name: string;
  category: string;
}

interface Highlights {
  cheapestInputModel?: string;
  cheapestOutputModel?: string;
  largestContextModel?: string;
  bestBenchmarkModels?: Record<string, string>;
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modelsParam = searchParams.get("models") || "";

  const [models, setModels] = useState<CompareModelData[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkInfo[]>([]);
  const [highlights, setHighlights] = useState<Highlights>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Model adder search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ name: string; slug: string; labName: string }>>([]);

  const currentSlugs = modelsParam ? modelsParam.split(",").map((s) => s.trim()).filter(Boolean) : [];

  useEffect(() => {
    async function loadComparison() {
      if (currentSlugs.length < 2) {
        setIsLoading(false);
        setModels([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/compare?models=${encodeURIComponent(currentSlugs.join(","))}`);
        const json = await res.json();

        if (json.success) {
          setModels(json.data.models);
          setBenchmarks(json.data.benchmarks);
          setHighlights(json.data.highlights || {});
        } else {
          setError(json.error || "Failed to load comparison");
        }
      } catch (err) {
        console.error("Comparison load error:", err);
        setError("Error connecting to comparison API");
      } finally {
        setIsLoading(false);
      }
    }

    loadComparison();
  }, [modelsParam]);

  const removeModel = (slugToRemove: string) => {
    const next = currentSlugs.filter((s) => s !== slugToRemove);
    if (next.length > 0) {
      router.push(`/compare?models=${next.join(",")}`);
    } else {
      router.push("/compare");
    }
  };

  const addModel = (slugToAdd: string) => {
    if (currentSlugs.includes(slugToAdd)) return;
    if (currentSlugs.length >= 4) {
      alert("Maximum 4 models can be compared side-by-side.");
      return;
    }
    const next = [...currentSlugs, slugToAdd];
    router.push(`/compare?models=${next.join(",")}`);
    setIsSearching(false);
    setSearchQuery("");
  };

  // Search models to add
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`);
        const json = await res.json();
        if (json.success) {
          setSearchResults(
            json.data.models
              .filter((m: { slug: string }) => !currentSlugs.includes(m.slug))
              .map((m: { name: string; slug: string; labName: string }) => ({
                name: m.name,
                slug: m.slug,
                labName: m.labName,
              }))
          );
        }
      } catch (e) {
        console.error(e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, currentSlugs]);

  const formatContext = (ctx: number) => {
    if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1).replace(".0", "")}M tokens`;
    if (ctx >= 1_000) return `${(ctx / 1_000).toFixed(0)}K tokens`;
    return `${ctx} tokens`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Scale className="h-3.5 w-3.5" />
              <span>Side-by-Side Multi-Model Comparison</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Model Comparison Matrix
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Evaluate pricing, token context windows, inference speed, capabilities, and benchmark performance across 2 to 4 AI models simultaneously.
            </p>
          </div>

          {/* Add Model Button */}
          {currentSlugs.length < 4 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSearching(!isSearching)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add Model ({currentSlugs.length}/4)</span>
              </button>

              {/* Add Search Dropdown */}
              {isSearching && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model to add..."
                    autoFocus
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                    {searchResults.map((m) => (
                      <button
                        key={m.slug}
                        type="button"
                        onClick={() => addModel(m.slug)}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="truncate">
                          <div className="font-medium text-slate-200 truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-500">{m.labName}</div>
                        </div>
                        <Plus className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                      </button>
                    ))}
                    {searchQuery.trim() && searchResults.length === 0 && (
                      <div className="text-center py-3 text-xs text-slate-500">No matching models</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
            <p className="text-sm">Retrieving model specifications and benchmark telemetry...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center my-8">
            <h3 className="text-base font-semibold text-white">Comparison Error</h3>
            <p className="text-xs text-red-300 mt-1">{error}</p>
            <a
              href="/models"
              className="inline-block mt-4 px-4 py-2 rounded-xl bg-red-600 text-xs font-semibold text-white"
            >
              Back to Models Directory
            </a>
          </div>
        ) : models.length < 2 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center my-8 max-w-xl mx-auto">
            <Scale className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">Select at Least 2 Models</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              To view a side-by-side comparison, select between 2 and 4 models from the Models Directory or use the &quot;Add Model&quot; button above.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <a
                href="/models"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md"
              >
                Browse Models Directory
              </a>
            </div>
          </div>
        ) : (
          <div className="my-8 overflow-x-auto pb-6">
            {/* Comparison Matrix Table */}
            <div className="min-w-[700px] border border-slate-800 rounded-3xl bg-slate-900/60 overflow-hidden shadow-2xl">
              {/* Model Headers Row */}
              <div
                className="grid border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-16 z-20"
                style={{
                  gridTemplateColumns: `200px repeat(${models.length}, minmax(220px, 1fr))`,
                }}
              >
                <div className="p-5 font-semibold text-xs uppercase tracking-wider text-slate-400 flex items-center">
                  Model Profile
                </div>
                {models.map((model) => (
                  <div key={model.id} className="p-5 border-l border-slate-800/80 relative">
                    <button
                      type="button"
                      onClick={() => removeModel(model.slug)}
                      className="absolute top-4 right-4 p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={model.lab.name} size="sm" />
                      <span className="text-xs text-indigo-400 font-medium truncate">
                        {model.lab.name}
                      </span>
                    </div>
                    <a
                      href={`/models/${model.slug}`}
                      className="text-base font-bold text-white hover:text-indigo-400 transition-colors block truncate"
                    >
                      {model.name}
                    </a>
                  </div>
                ))}
              </div>

              {/* Pricing Section */}
              <div className="bg-slate-950/40 px-5 py-2 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Token Pricing & Efficiency
              </div>

              {/* Min Input Price */}
              <div
                className="grid border-b border-slate-800/60 hover:bg-slate-850/40 transition-colors"
                style={{
                  gridTemplateColumns: `200px repeat(${models.length}, minmax(220px, 1fr))`,
                }}
              >
                <div className="p-4 text-xs font-medium text-slate-400">Min Input Price / 1M</div>
                {models.map((m) => {
                  const isBest = highlights.cheapestInputModel === m.slug;
                  const price = m.minInputPrice != null ? Number(m.minInputPrice) : null;
                  return (
                    <div key={m.id} className="p-4 border-l border-slate-800/60 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">
                          {price != null ? `$${price.toFixed(2)}` : "—"}
                        </span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Best Value
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Min Output Price */}
              <div
                className="grid border-b border-slate-800/60 hover:bg-slate-850/40 transition-colors"
                style={{
                  gridTemplateColumns: `200px repeat(${models.length}, minmax(220px, 1fr))`,
                }}
              >
                <div className="p-4 text-xs font-medium text-slate-400">Min Output Price / 1M</div>
                {models.map((m) => {
                  const isBest = highlights.cheapestOutputModel === m.slug;
                  const price = m.minOutputPrice != null ? Number(m.minOutputPrice) : null;
                  return (
                    <div key={m.id} className="p-4 border-l border-slate-800/60 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">
                          {price != null ? `$${price.toFixed(2)}` : "—"}
                        </span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Best Value
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Specifications Section */}
              <div className="bg-slate-950/40 px-5 py-2 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Specifications & Context
              </div>

              {/* Context Window */}
              <div
                className="grid border-b border-slate-800/60 hover:bg-slate-850/40 transition-colors"
                style={{
                  gridTemplateColumns: `200px repeat(${models.length}, minmax(220px, 1fr))`,
                }}
              >
                <div className="p-4 text-xs font-medium text-slate-400">Context Window</div>
                {models.map((m) => {
                  const isBest = highlights.largestContextModel === m.slug;
                  return (
                    <div key={m.id} className="p-4 border-l border-slate-800/60 text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100">
                          {formatContext(m.contextWindow)}
                        </span>
                        {isBest && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Largest
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Model Type */}
              <div
                className="grid border-b border-slate-800/60 hover:bg-slate-850/40 transition-colors"
                style={{
                  gridTemplateColumns: `200px repeat(${models.length}, minmax(220px, 1fr))`,
                }}
              >
                <div className="p-4 text-xs font-medium text-slate-400">Model Type</div>
                {models.map((m) => (
                  <div key={m.id} className="p-4 border-l border-slate-800/60 text-xs capitalize text-slate-300">
                    {m.modelType}
                  </div>
                ))}
              </div>

              {/* Capabilities */}
              <div
                className="grid border-b border-slate-800/60 hover:bg-slate-850/40 transition-colors"
                style={{
                  gridTemplateColumns: `200px repeat(${models.length}, minmax(220px, 1fr))`,
                }}
              >
                <div className="p-4 text-xs font-medium text-slate-400">Capabilities</div>
                {models.map((m) => (
                  <div key={m.id} className="p-4 border-l border-slate-800/60 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {m.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-300 text-[10px] capitalize"
                        >
                          {cap.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Benchmark Performance Section */}
              <div className="bg-slate-950/40 px-5 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                <span>Benchmark Evaluations (Sample Data)</span>
                <span className="text-[10px] text-amber-400 lowercase font-normal">source: sample</span>
              </div>

              {benchmarks.map((b) => {
                const bestModelSlug = highlights.bestBenchmarkModels?.[b.slug];
                return (
                  <div
                    key={b.slug}
                    className="grid border-b border-slate-800/60 hover:bg-slate-850/40 transition-colors"
                    style={{
                      gridTemplateColumns: `200px repeat(${models.length}, minmax(220px, 1fr))`,
                    }}
                  >
                    <div className="p-4 text-xs">
                      <div className="font-semibold text-slate-200">{b.name}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{b.category}</div>
                    </div>
                    {models.map((m) => {
                      const scoreItem = m.benchmarkScores.find((s) => s.benchmark.slug === b.slug);
                      const isBest = bestModelSlug === m.slug;
                      const scoreNum = scoreItem ? Number(scoreItem.score) : null;

                      return (
                        <div key={m.id} className="p-4 border-l border-slate-800/60 text-xs">
                          {scoreNum != null ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-100 text-sm">
                                  {scoreNum.toFixed(1)}%
                                </span>
                                {isBest && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    ★ Top Score
                                  </span>
                                )}
                              </div>
                              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-indigo-500 h-full rounded-full"
                                  style={{ width: `${Math.min(100, scoreNum)}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-600 text-xs">N/A</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
