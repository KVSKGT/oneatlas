"use client";

import React from "react";
import { ArrowDownAZ, ArrowUpDown } from "lucide-react";

interface SortSelectProps {
  value: string;
  onChange: (sort: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  const options = [
    { value: "date_desc", label: "Release Date: Newest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "context_desc", label: "Context Window: Largest" },
    { value: "name_asc", label: "Model Name: A to Z" },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-slate-400 hidden sm:block" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
