import React from "react";
import { notFound } from "next/navigation";
import { getProviderDetail } from "@/lib/services/providers";

export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar } from "@/components/Avatar";
import { Server, ExternalLink, ArrowLeft, Layers, Activity, ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProviderDetailPage({ params }: Props) {
  const { slug } = await params;
  const provider = await getProviderDetail(slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <a href="/providers" className="flex items-center gap-1 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Providers</span>
          </a>
          <span>/</span>
          <span className="text-slate-200 font-medium">{provider.name}</span>
        </div>

        {/* Hero Banner */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar name={provider.name} size="lg" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{provider.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Server className="h-3.5 w-3.5 text-cyan-400" />
                    Inference Infrastructure Provider
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-slate-500" />
                    {provider.models.length} Available Model Offers
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {provider.description || `Cloud infrastructure and serverless API endpoints.`}
                </p>
              </div>
            </div>

            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition-colors flex-shrink-0"
              >
                <span>Provider Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Hosted Models Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-base font-bold text-white mb-4">
            Available Models Hosted by {provider.name}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Model Name</th>
                  <th className="py-3 px-4">Lab</th>
                  <th className="py-3 px-4">Input / 1M</th>
                  <th className="py-3 px-4">Output / 1M</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Throughput</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {provider.models.map((offer) => {
                  const inP = Number(offer.inputPricePerM);
                  const outP = Number(offer.outputPricePerM);

                  return (
                    <tr key={offer.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">
                        <a
                          href={`/models/${offer.model.slug}`}
                          className="hover:text-indigo-400 transition-colors"
                        >
                          {offer.model.name}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{offer.model.lab.name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-200">${inP.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-200">${outP.toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        {offer.latencyMs ? (
                          <span className="flex items-center gap-1 font-mono text-slate-300">
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
                        <a
                          href={`/models/${offer.model.slug}`}
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                          <span>Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
