"use client";

import React from "react";
import { Filter, RotateCcw, Check } from "lucide-react";

interface FilterSidebarProps {
  labs: Array<{ slug: string; name: string; modelCount: number }>;
  modelTypes: string[];
  capabilities: string[];
  selectedLab: string;
  selectedType: string;
  selectedCapabilities: string[];
  selectedSort: string;
  maxPrice: number | undefined;
  minContext: number | undefined;
  onFilterChange: (updates: Record<string, string | number | undefined | null>) => void;
  onReset: () => void;
}

export function FilterSidebar({
  labs,
  modelTypes,
  capabilities,
  selectedLab,
  selectedType,
  selectedCapabilities,
  maxPrice,
  minContext,
  onFilterChange,
  onReset,
}: FilterSidebarProps) {
  const toggleCapability = (cap: string) => {
    let next: string[];
    if (selectedCapabilities.includes(cap)) {
      next = selectedCapabilities.filter((c) => c !== cap);
    } else {
      next = [...selectedCapabilities, cap];
    }
    onFilterChange({
      capability: next.length > 0 ? next.join(",") : null,
      page: 1,
    });
  };

  const hasActiveFilters =
    (selectedLab && selectedLab !== "all") ||
    (selectedType && selectedType !== "all") ||
    selectedCapabilities.length > 0 ||
    maxPrice != null ||
    minContext != null;

  return (
    <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Filter className="h-4 w-4 text-indigo-400" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Lab Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Research Laboratory
        </label>
        <select
          value={selectedLab || "all"}
          onChange={(e) => onFilterChange({ lab: e.target.value === "all" ? null : e.target.value, page: 1 })}
          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Laboratories</option>
          {labs.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.name} ({l.modelCount})
            </option>
          ))}
        </select>
      </div>

      {/* Model Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Model Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onFilterChange({ type: null, page: 1 })}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              !selectedType || selectedType === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-800/80 text-slate-400 hover:text-white"
            }`}
          >
            All
          </button>
          {modelTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onFilterChange({ type: selectedType === t ? null : t, page: 1 })}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                selectedType === t
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Capabilities Checkboxes */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Capabilities
        </label>
        <div className="space-y-1.5">
          {capabilities.map((cap) => {
            const isChecked = selectedCapabilities.includes(cap);
            const labelMap: Record<string, string> = {
              tool_calling: "Tool Calling & Function Execution",
              reasoning: "Advanced Reasoning (CoT)",
              structured_output: "Structured Output (JSON)",
              vision: "Vision & Multimodal Input",
            };

            return (
              <label
                key={cap}
                onClick={() => toggleCapability(cap)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-850 cursor-pointer select-none group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isChecked
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "border-slate-700 bg-slate-900 group-hover:border-slate-500"
                  }`}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span className="text-xs text-slate-300 group-hover:text-slate-100">
                  {labelMap[cap] || cap}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Maximum Input Price Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold uppercase tracking-wider text-slate-400">
            Max Input Price
          </label>
          <span className="font-mono text-slate-300">
            {maxPrice ? `$${maxPrice}/1M` : "Any"}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="30"
          step="0.5"
          value={maxPrice ?? 30}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onFilterChange({ maxPrice: val >= 30 ? null : val, page: 1 });
          }}
          className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>$0/1M</span>
          <span>$15/1M</span>
          <span>$30+/1M</span>
        </div>
      </div>

      {/* Minimum Context Window Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold uppercase tracking-wider text-slate-400">
            Min Context Length
          </label>
          <span className="font-mono text-slate-300">
            {minContext ? `${(minContext / 1000).toFixed(0)}k+` : "Any"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-xs">
          {[
            { label: "Any", val: null },
            { label: "32K+", val: 32000 },
            { label: "128K+", val: 128000 },
            { label: "200K+", val: 200000 },
            { label: "1M+", val: 1000000 },
            { label: "2M+", val: 2000000 },
          ].map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => onFilterChange({ minContext: c.val, page: 1 })}
              className={`py-1 px-1.5 rounded-lg text-center font-mono text-[11px] transition-colors ${
                (c.val === null && !minContext) || minContext === c.val
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
