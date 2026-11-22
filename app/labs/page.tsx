import React from "react";
import { getLabsList } from "@/lib/services/labs";

export const dynamic = "force-dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar } from "@/components/Avatar";
import { Building2, Globe, Layers, ArrowRight } from "lucide-react";

export default async function LabsPage() {
  const labs = await getLabsList();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="pb-8 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Building2 className="h-3.5 w-3.5" />
            <span>AI Research Labs & Organizations</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frontier AI Research Laboratories
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Discover the organizations driving foundation model breakthroughs, from open-weights institutions to enterprise frontier labs.
          </p>
        </div>

        {/* Labs Grid */}
        <div className="my-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <a
              key={lab.id}
              href={`/labs/${lab.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-700 hover:bg-slate-900 transition-all duration-200 shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={lab.name} size="md" />
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {lab.name}
                      </h3>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {lab.country || "Global"}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                    <Layers className="h-3 w-3 text-emerald-400" />
                    {lab.modelCount} models
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {lab.description || `AI research laboratory developing high-performance foundation models.`}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                <span>View Lab Profile & Models</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
