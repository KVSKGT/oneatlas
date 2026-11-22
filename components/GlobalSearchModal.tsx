"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Layers, Building2, Server, ArrowRight, Loader2 } from "lucide-react";
import { Avatar } from "./Avatar";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResults {
  models: Array<{
    id: string;
    slug: string;
    name: string;
    modelType: string;
    labName: string;
    labSlug: string;
    minInputPrice: number | null;
    contextWindow: number;
  }>;
  labs: Array<{
    id: string;
    slug: string;
    name: string;
    country: string | null;
    modelCount: number;
  }>;
  providers: Array<{
    id: string;
    slug: string;
    name: string;
    modelCount: number;
  }>;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
        }
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const hasResults =
    results &&
    (results.models.length > 0 || results.labs.length > 0 || results.providers.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI models, research labs, or providers..."
            className="w-full bg-transparent px-3 py-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {isLoading && <Loader2 className="h-4 w-4 text-indigo-400 animate-spin mr-2" />}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query.trim() && (
            <div className="py-8 text-center text-xs text-slate-500">
              Type to search across 460+ foundation models, 60+ AI research labs, and top API providers.
            </div>
          )}

          {query.trim() && !isLoading && !hasResults && (
            <div className="py-8 text-center text-sm text-slate-400">
              No results found for &quot;<span className="text-white">{query}</span>&quot;
            </div>
          )}

          {/* Models Group */}
          {results && results.models.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
                <Layers className="h-3.5 w-3.5 text-indigo-400" />
                AI Models ({results.models.length})
              </div>
              <div className="space-y-1">
                {results.models.map((model) => (
                  <a
                    key={model.id}
                    href={`/models/${model.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={model.labName} size="sm" />
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
                          {model.name}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{model.labName}</span>
                          <span>•</span>
                          <span>{(model.contextWindow / 1000).toFixed(0)}k ctx</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
                      {model.minInputPrice != null && (
                        <span>${model.minInputPrice.toFixed(2)}/1M</span>
                      )}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Labs Group */}
          {results && results.labs.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
                <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                AI Research Labs ({results.labs.length})
              </div>
              <div className="space-y-1">
                {results.labs.map((lab) => (
                  <a
                    key={lab.id}
                    href={`/labs/${lab.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={lab.name} size="sm" />
                      <div>
                        <div className="text-sm font-medium text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {lab.name}
                        </div>
                        <div className="text-xs text-slate-500">{lab.country || "Global"}</div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                      {lab.modelCount} models
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Providers Group */}
          {results && results.providers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">
                <Server className="h-3.5 w-3.5 text-cyan-400" />
                Providers & Routers ({results.providers.length})
              </div>
              <div className="space-y-1">
                {results.providers.map((prov) => (
                  <a
                    key={prov.id}
                    href={`/providers/${prov.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={prov.name} size="sm" />
                      <div className="text-sm font-medium text-slate-100 group-hover:text-cyan-400 transition-colors">
                        {prov.name}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
                      {prov.modelCount} models
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ESC to close</span>
          <span>OneAtlas Unified Search</span>
        </div>
      </div>
    </div>
  );
}
