import React from "react";
import { getHomepageData } from "@/lib/services/home";

export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModelCard } from "@/components/ModelCard";
import { Avatar } from "@/components/Avatar";
import {
  Sparkles,
  ArrowRight,
  Layers,
  Building2,
  Server,
  Trophy,
  Scale,
  Search,
  Cpu,
  Eye,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default async function HomePage() {
  const data = await getHomepageData();

  const discoveryTags = [
    { label: "Reasoning & Math", href: "/models?capability=reasoning", icon: Sparkles },
    { label: "Vision & Multimodal", href: "/models?type=multimodal", icon: Eye },
    { label: "Tool Calling & Agents", href: "/models?capability=tool_calling", icon: Cpu },
    { label: "Budget Efficient (<$0.50/1M)", href: "/models?maxPrice=0.5", icon: Zap },
    { label: "High Context (1M+ Tokens)", href: "/models?minContext=1000000", icon: Layers },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Independent AI Model Discovery & Intelligence Layer</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
              Discover, Compare & Benchmark{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                Frontier AI Models
              </span>
            </h1>

            <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore 460+ foundation models across 60+ AI research laboratories. Compare real-time provider pricing, token context windows, inference throughput, and standardized benchmark rankings.
            </p>

            {/* Quick Hero Search Input */}
            <div className="mt-8 max-w-xl mx-auto">
              <form action="/models" method="GET" className="relative flex items-center shadow-2xl">
                <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search models (e.g. Claude 3.5, GPT-4o, Llama 3.3, Gemini)..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-12 pr-28 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 backdrop-blur-md shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors"
                >
                  Explore
                </button>
              </form>
            </div>

            {/* Quick Tag Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-500 font-medium mr-1">Quick Jump:</span>
              {discoveryTags.map((tag) => {
                const Icon = tag.icon;
                return (
                  <a
                    key={tag.label}
                    href={tag.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                  >
                    <Icon className="h-3 w-3 text-indigo-400" />
                    <span>{tag.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Hero CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="/models"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all"
              >
                <Layers className="h-4 w-4" />
                <span>Browse Full Directory</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="/compare"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-slate-200 transition-colors"
              >
                <Scale className="h-4 w-4 text-slate-400" />
                <span>Side-by-Side Comparison</span>
              </a>
              <a
                href="/rankings"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-sm font-semibold text-slate-200 transition-colors"
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Leaderboard Rankings</span>
              </a>
            </div>
          </div>
        </section>

        {/* Platform Metrics Bar */}
        <section className="border-b border-slate-900 bg-slate-950/60 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-2xl sm:text-4xl font-extrabold text-white font-mono">
                  {data.metrics.totalModels}+
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                  AI Models Indexed
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
                  {data.metrics.totalLabs}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                  Research Laboratories
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-2xl sm:text-4xl font-extrabold text-cyan-400 font-mono">
                  {data.metrics.totalProviders}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                  Provider Ecosystems
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">
                  {data.metrics.totalBenchmarks}
                </div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
                  Evaluation Benchmarks
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Models Section */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                Featured Releases
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Latest Frontier AI Models
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore recent model additions, specifications, and provider token rates.
              </p>
            </div>
            <a
              href="/models"
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <span>View All Models ({data.metrics.totalModels})</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.featuredModels.map((model) => (
              <ModelCard key={model.id} model={model} canCompare={true} />
            ))}
          </div>
        </section>

        {/* AI Research Laboratories Section */}
        <section className="py-16 border-t border-slate-900 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                  AI Organizations
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Top AI Research Labs
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Explore foundational research companies and open science institutions.
                </p>
              </div>
              <a
                href="/labs"
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Browse All Labs ({data.metrics.totalLabs})</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.topLabs.map((lab) => (
                <a
                  key={lab.id}
                  href={`/labs/${lab.slug}`}
                  className="group flex items-center justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar name={lab.name} size="md" />
                    <div className="truncate">
                      <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {lab.name}
                      </div>
                      <div className="text-xs text-slate-500">{lab.country || "Global"}</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 px-3 py-1 rounded-full bg-slate-800 flex-shrink-0">
                    {lab.modelCount} models
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Leaderboard Section */}
        <section className="py-16 border-t border-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                  Evaluation Intelligence
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Benchmark Leaderboard Preview
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Empirical rankings based on calibrated multi-task evaluations.
                </p>
              </div>
              <a
                href="/rankings"
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Full Leaderboards & Categories</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="border border-slate-800 rounded-3xl bg-slate-900/60 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 w-14 text-center">Rank</th>
                      <th className="py-3.5 px-4">Model & Lab</th>
                      <th className="py-3.5 px-4">Benchmark Test</th>
                      <th className="py-3.5 px-4 w-48">Score</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.topRanked.map((item) => (
                      <tr key={`${item.model.id}-${item.benchmark.id}`} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-300">
                          #{item.rank}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={item.model.lab.name} size="sm" />
                            <div>
                              <a
                                href={`/models/${item.model.slug}`}
                                className="font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
                              >
                                {item.model.name}
                              </a>
                              <div className="text-[10px] text-slate-500">{item.model.lab.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-slate-300">{item.benchmark.name}</span>
                          <span className="text-[10px] text-slate-500 block uppercase">
                            {item.benchmark.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-100">
                              {item.score.toFixed(1)}%
                            </span>
                            <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, item.score)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={`/models/${item.model.slug}`}
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            <span>Inspect</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
