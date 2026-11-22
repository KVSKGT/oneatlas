"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-slate-800 text-xs text-slate-400">
      <div>
        Showing <span className="font-semibold text-slate-200">{startRecord}</span> to{" "}
        <span className="font-semibold text-slate-200">{endRecord}</span> of{" "}
        <span className="font-semibold text-slate-200">{totalRecords}</span> models
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === p
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-2 text-slate-600">
                ...
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 hover:text-white transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
