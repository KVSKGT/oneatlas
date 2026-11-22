"use client";

import React from "react";
import { Avatar } from "./Avatar";
import { Plus, Check, Zap, Eye, Cpu, Braces, Sparkles, ArrowUpRight } from "lucide-react";

export interface ModelCardData {
  id: string;
  slug: string;
  name: string;
  modelType: string;
  description: string | null;
  contextWindow: number;
  releaseDate: string | Date | null;
  capabilities: string[];
  minInputPrice: unknown;
  minOutputPrice: unknown;
  lab: {
    id: string;
    slug: string;
    name: string;
    country?: string | null;
  };
  _count?: {
    providers: number;
    benchmarkScores: number;
  };
}

interface ModelCardProps {
  model: ModelCardData;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (slug: string) => void;
  canCompare?: boolean;
}

export function ModelCard({
  model,
  isSelectedForCompare = false,
  onToggleCompare,
  canCompare = true,
}: ModelCardProps) {
  const inPriceNum = model.minInputPrice != null ? Number(model.minInputPrice) : null;
  const outPriceNum = model.minOutputPrice != null ? Number(model.minOutputPrice) : null;

  const formatContext = (ctx: number) => {
    if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1).replace(".0", "")}M`;
    if (ctx >= 1_000) return `${(ctx / 1_000).toFixed(0)}K`;
    return `${ctx}`;
  };

  const getCapabilityBadge = (cap: string) => {
    switch (cap) {
      case "tool_calling":
        return { label: "Tools", icon: Cpu, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
      case "reasoning":
        return { label: "Reasoning", icon: Sparkles, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
      case "vision":
        return { label: "Vision", icon: Eye, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      case "structured_output":
        return { label: "JSON", icon: Braces, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
      default:
        return { label: cap, icon: Zap, color: "text-slate-400 bg-slate-800 border-slate-700" };
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border transition-all duration-200 bg-slate-900/70 hover:bg-slate-900 ${
        isSelectedForCompare
          ? "border-indigo-500 ring-1 ring-indigo-500/40 shadow-lg shadow-indigo-500/10"
          : "border-slate-800/80 hover:border-slate-700 hover:shadow-xl hover:shadow-black/40"
      }`}
    >
      <div className="p-5">
        {/* Top Header: Lab & Action */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <a
            href={`/labs/${model.lab.slug}`}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Avatar name={model.lab.name} size="sm" />
            <span className="text-xs font-medium text-slate-400 hover:text-slate-200 truncate max-w-[140px]">
              {model.lab.name}
            </span>
          </a>

          <div className="flex items-center gap-1.5">
            {/* Compare Toggle Button */}
            {canCompare && onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(model.slug)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelectedForCompare
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                title={isSelectedForCompare ? "Remove from comparison" : "Add to comparison (2-4 models)"}
              >
                {isSelectedForCompare ? (
                  <>
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" />
                    <span>Compare</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Model Title & Specs */}
        <div className="mb-3">
          <a
            href={`/models/${model.slug}`}
            className="group/link flex items-center justify-between gap-2"
          >
            <h3 className="text-base font-semibold text-slate-100 group-hover/link:text-indigo-400 transition-colors line-clamp-1">
              {model.name}
            </h3>
            <ArrowUpRight className="h-4 w-4 text-slate-500 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
          </a>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {model.description || `High-performance ${model.modelType} model developed by ${model.lab.name}.`}
          </p>
        </div>

        {/* Capabilities Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60 uppercase tracking-wider">
            {model.modelType}
          </span>
          {model.capabilities.map((cap) => {
            const badge = getCapabilityBadge(cap);
            const Icon = badge.icon;
            return (
              <span
                key={cap}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${badge.color}`}
              >
                <Icon className="h-3 w-3" />
                {badge.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Card Footer: Pricing & Context length */}
      <div className="mt-auto border-t border-slate-800/80 bg-slate-950/40 px-5 py-3 rounded-b-2xl flex items-center justify-between text-xs">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Pricing / 1M</span>
          <div className="font-semibold text-slate-200">
            {inPriceNum != null ? (
              <span>
                ${inPriceNum.toFixed(2)}{" "}
                <span className="text-slate-500 font-normal">in</span> / $
                {outPriceNum?.toFixed(2)}{" "}
                <span className="text-slate-500 font-normal">out</span>
              </span>
            ) : (
              <span className="text-slate-500">Custom</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Context</span>
          <span className="font-semibold text-slate-200 font-mono">
            {formatContext(model.contextWindow)} tokens
          </span>
        </div>
      </div>
    </div>
  );
}
