import React from "react";
import { notFound } from "next/navigation";
import { getModelDetail } from "@/lib/services/model-detail";

export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar } from "@/components/Avatar";
import {
  Sparkles,
  Calendar,
  Layers,
  Cpu,
  Eye,
  Braces,
  Zap,
  Scale,
  Server,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Activity,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ModelDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = await getModelDetail(slug);

  if (!model) {
    notFound();
  }

  const formatContext = (ctx: number) => {
    if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1).replace(".0", "")}M tokens`;
    if (ctx >= 1_000) return `${(ctx / 1_000).toFixed(0)}K tokens`;
    return `${ctx} tokens`;
  };

  const getCapabilityBadge = (cap: string) => {
    switch (cap) {
      case "tool_calling":
        return { label: "Tool Calling & Functions", icon: Cpu, desc: "Executes tools and structured API calls" };
      case "reasoning":
        return { label: "Deep Reasoning", icon: Sparkles, desc: "Chain-of-thought mathematical and logic reasoning" };
      case "vision":
        return { label: "Vision & Multimodal", icon: Eye, desc: "Understands high-resolution images and visual inputs" };
      case "structured_output":
        return { label: "Structured JSON", icon: Braces, desc: "Guarantees strict schema compliance" };
      default:
        return { label: cap, icon: Zap, desc: "Supported model capability" };
    }
  };

  const inPrice = model.minInputPrice ? Number(model.minInputPrice) : null;
  const outPrice = model.minOutputPrice ? Number(model.minOutputPrice) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <a href="/models" className="flex items-center gap-1 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Models</span>
          </a>
          <span>/</span>
          <a href={`/labs/${model.lab.slug}`} className="hover:text-slate-200 transition-colors">
            {model.lab.name}
          </a>
          <span>/</span>
          <span className="text-slate-200 font-medium truncate">{model.name}</span>
        </div>

        {/* Hero Profile Card */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              {/* Lab identity */}
              <div className="flex items-center gap-3">
                <Avatar name={model.lab.name} size="md" />
                <div>
                  <a
                    href={`/labs/${model.lab.slug}`}
                    className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                  >
                    <span>{model.lab.name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-xs text-slate-500">{model.lab.country || "Global Research"}</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {model.name}
                </h1>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {model.description || `Comprehensive foundational AI model engineered by ${model.lab.name}.`}
                </p>
              </div>

              {/* Meta tags */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium uppercase tracking-wider">
                  {model.modelType}
                </span>

                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  {formatContext(model.contextWindow)}
                </span>

                {model.releaseDate && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(model.releaseDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action & Pricing Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px] flex-shrink-0">
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 text-left">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Baseline Token Pricing
                </span>
                <div className="text-xl font-bold text-white">
                  {inPrice != null ? (
                    <>
                      ${inPrice.toFixed(2)}{" "}
                      <span className="text-xs font-normal text-slate-400">/ 1M input</span>
                    </>
                  ) : (
                    <span>Custom</span>
                  )}
                </div>
                <div className="text-sm font-medium text-slate-400 mt-0.5">
                  {outPrice != null ? (
                    <>
                      ${outPrice.toFixed(2)}{" "}
                      <span className="text-xs font-normal text-slate-500">/ 1M output</span>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Compare Button */}
              <a
                href={`/compare?models=${model.slug}`}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all text-center"
              >
                <Scale className="h-4 w-4" />
                <span>Compare with Other Models</span>
              </a>
            </div>
          </div>
        </div>

        {/* Specifications & Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Architecture Specifications */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>Model Specifications</span>
            </h3>

            <dl className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <dt className="text-slate-400 mb-1">Context Window</dt>
                <dd className="font-semibold text-slate-100 font-mono text-sm">
                  {formatContext(model.contextWindow)}
                </dd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <dt className="text-slate-400 mb-1">Architecture Type</dt>
                <dd className="font-semibold text-slate-100 capitalize text-sm">{model.modelType}</dd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <dt className="text-slate-400 mb-1">Input Modalities</dt>
                <dd className="font-semibold text-slate-100 capitalize text-sm">
                  {model.inputModalities.join(", ") || "Text"}
                </dd>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <dt className="text-slate-400 mb-1">Output Modalities</dt>
                <dd className="font-semibold text-slate-100 capitalize text-sm">
                  {model.outputModalities.join(", ") || "Text"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Capabilities breakdown */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified Capabilities</span>
            </h3>

            {model.capabilities.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">Standard text completion capabilities.</p>
            ) : (
              <div className="space-y-2.5">
                {model.capabilities.map((cap) => {
                  const b = getCapabilityBadge(cap);
                  const Icon = b.icon;
                  return (
                    <div
                      key={cap}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80"
                    >
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{b.label}</div>
                        <div className="text-[11px] text-slate-400">{b.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Provider Offers Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Server className="h-4 w-4 text-cyan-400" />
                <span>Provider Offers & Hosting Infrastructure ({model.providers.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparative pricing and latency performance across independent inference hosts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Input / 1M</th>
                  <th className="py-3 px-4">Output / 1M</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Throughput</th>
                  <th className="py-3 px-4 text-right">Offer Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {model.providers.map((offer, idx) => {
                  const isCheapest = idx === 0;
                  const inP = Number(offer.inputPricePerM);
                  const outP = Number(offer.outputPricePerM);

                  return (
                    <tr key={offer.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <a
                          href={`/providers/${offer.provider.slug}`}
                          className="flex items-center gap-2.5 font-medium text-slate-200 hover:text-cyan-400 transition-colors"
                        >
                          <Avatar name={offer.provider.name} size="sm" />
                          <span>{offer.provider.name}</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-200">${inP.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-200">${outP.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        {offer.latencyMs ? (
                          <span className="flex items-center gap-1.5 font-mono text-slate-300">
                            <Activity className="h-3 w-3 text-emerald-400" />
                            {offer.latencyMs} ms
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {offer.throughputTps ? `${Number(offer.throughputTps).toFixed(1)} tps` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {isCheapest ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Best Price
                          </span>
                        ) : (
                          <span className="text-slate-500">Standard</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Benchmark Evaluations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span>Benchmark Evaluations & Intelligence Index</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparative capability scores evaluated across standard reasoning and coding benchmarks.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Sample Benchmark Data
            </span>
          </div>

          {model.benchmarkScores.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No benchmark scores evaluated yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {model.benchmarkScores.map((scoreItem) => {
                const scoreNum = Number(scoreItem.score);
                return (
                  <div
                    key={scoreItem.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {scoreItem.benchmark.name}
                      </span>
                      <span className="font-mono font-bold text-indigo-400 text-sm">
                        {scoreNum.toFixed(1)}%
                      </span>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, scoreNum))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="capitalize">{scoreItem.benchmark.category}</span>
                      <a
                        href={`/rankings?benchmark=${scoreItem.benchmark.slug}`}
                        className="text-indigo-400 hover:underline"
                      >
                        View Leaderboard →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
