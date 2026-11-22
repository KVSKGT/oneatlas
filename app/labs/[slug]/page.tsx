import React from "react";
import { notFound } from "next/navigation";
import { getLabDetail } from "@/lib/services/labs";

export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar } from "@/components/Avatar";
import { ModelCard } from "@/components/ModelCard";
import { Building2, Globe, ExternalLink, ArrowLeft, Layers } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LabDetailPage({ params }: Props) {
  const { slug } = await params;
  const lab = await getLabDetail(slug);

  if (!lab) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <a href="/labs" className="flex items-center gap-1 hover:text-slate-200 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Laboratories</span>
          </a>
          <span>/</span>
          <span className="text-slate-200 font-medium">{lab.name}</span>
        </div>

        {/* Hero Banner */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <Avatar name={lab.name} size="lg" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{lab.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-slate-500" />
                    {lab.country || "Global"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-slate-500" />
                    {lab.models.length} Released Models
                  </span>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {lab.description || `Leading AI research organization specializing in foundation models.`}
                </p>
              </div>
            </div>

            {lab.website && (
              <a
                href={lab.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition-colors flex-shrink-0"
              >
                <span>Official Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Models Released by Lab */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Released Models ({lab.models.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lab.models.map((model) => (
              <ModelCard key={model.id} model={model} canCompare={true} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
