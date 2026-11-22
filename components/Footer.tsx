import React from "react";
import { Sparkles, Layers, Scale, Trophy, Building2, Server } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">OneAtlas</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Open intelligence platform for discovering, evaluating, and comparing frontier AI foundation models across providers.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/models" className="hover:text-slate-200 transition-colors">
                  Model Directory
                </a>
              </li>
              <li>
                <a href="/compare" className="hover:text-slate-200 transition-colors">
                  Side-by-Side Comparison
                </a>
              </li>
              <li>
                <a href="/rankings" className="hover:text-slate-200 transition-colors">
                  Benchmark Leaderboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/labs" className="hover:text-slate-200 transition-colors">
                  AI Research Labs
                </a>
              </li>
              <li>
                <a href="/providers" className="hover:text-slate-200 transition-colors">
                  Model Providers & Routers
                </a>
              </li>
              <li>
                <a href="/api/models" target="_blank" className="hover:text-slate-200 transition-colors">
                  Public API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Transparency
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2">
              Model specifications are normalized from OpenRouter. Provider performance measurements and benchmark leaderboards are reproducible sample evaluations clearly tagged with <code className="text-amber-400 text-[11px]">source: &quot;sample&quot;</code>.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} OneAtlas Intelligence. Built with Next.js 15, PostgreSQL & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
