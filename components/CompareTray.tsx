"use client";

import React from "react";
import { Scale, X, ArrowRight } from "lucide-react";

interface CompareTrayProps {
  selectedSlugs: string[];
  onRemove: (slug: string) => void;
  onClear: () => void;
}

export function CompareTray({ selectedSlugs, onRemove, onClear }: CompareTrayProps) {
  if (selectedSlugs.length === 0) return null;

  const compareUrl = `/compare?models=${selectedSlugs.join(",")}`;
  const isReady = selectedSlugs.length >= 2;

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-6 duration-300">
      <div className="pointer-events-auto flex items-center gap-3 sm:gap-4 rounded-2xl border border-indigo-500/40 bg-slate-950/95 p-3 sm:px-5 sm:py-3.5 shadow-2xl shadow-indigo-950/50 backdrop-blur-md max-w-2xl w-full">
        <div className="flex items-center gap-2 text-indigo-400 flex-shrink-0">
          <Scale className="h-5 w-5" />
          <span className="text-xs sm:text-sm font-semibold text-slate-100 hidden sm:inline">
            Compare ({selectedSlugs.length}/4)
          </span>
        </div>

        {/* Selected model tags */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-grow">
          {selectedSlugs.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200 flex-shrink-0"
            >
              <span className="max-w-[100px] sm:max-w-[120px] truncate">{slug}</span>
              <button
                type="button"
                onClick={() => onRemove(slug)}
                className="text-slate-400 hover:text-white rounded"
                title="Remove model"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
          >
            Clear
          </button>
          <a
            href={isReady ? compareUrl : "#"}
            aria-disabled={!isReady}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md ${
              isReady
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed pointer-events-none"
            }`}
          >
            <span>{isReady ? "Compare" : "Select 2+"}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
