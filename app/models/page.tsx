"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ModelCard, ModelCardData } from "@/components/ModelCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SortSelect } from "@/components/SortSelect";
import { Pagination } from "@/components/Pagination";
import { CompareTray } from "@/components/CompareTray";
import { Search, Loader2, Sparkles, Filter, SlidersHorizontal, AlertCircle } from "lucide-react";

interface FilterOptions {
  labs: Array<{ slug: string; name: string; modelCount: number }>;
  modelTypes: string[];
  capabilities: string[];
}

function ModelsDirectoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state params
  const search = searchParams.get("search") || "";
  const lab = searchParams.get("lab") || "all";
  const type = searchParams.get("type") || "all";
  const capabilityParam = searchParams.get("capability") || "";
  const capabilities = capabilityParam ? capabilityParam.split(",") : [];
  const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
  const minContext = searchParams.get("minContext") ? parseInt(searchParams.get("minContext")!, 10) : undefined;
  const sort = searchParams.get("sort") || "date_desc";
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Local state
  const [searchInput, setSearchInput] = useState(search);
  const [models, setModels] = useState<ModelCardData[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 18,
    totalPages: 1,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    labs: [],
    modelTypes: [],
    capabilities: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Fetch filter metadata on mount
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await fetch("/api/models?meta=filters");
        const json = await res.json();
        if (json.success) {
          setFilterOptions(json.data);
        }
      } catch (err) {
        console.error("Failed to load filter metadata:", err);
      }
    }
    loadMeta();
  }, []);

  // Update URL query parameters
  const updateUrl = useCallback(
    (updates: Record<string, string | number | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`/models?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Fetch models whenever URL params change
  useEffect(() => {
    async function fetchModels() {
      setIsLoading(true);
      setError(null);
      try {
        const query = searchParams.toString();
        const res = await fetch(`/api/models?${query}`);
        const json = await res.json();

        if (json.success) {
          setModels(json.data.models);
          setPagination(json.data.pagination);
        } else {
          setError(json.error || "Failed to load models");
        }
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Network error while connecting to OneAtlas intelligence API");
      } finally {
        setIsLoading(false);
      }
    }

    fetchModels();
  }, [searchParams]);

  // Search input debounced submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchInput.trim() || null, page: 1 });
  };

  // Compare tray toggling
  const handleToggleCompare = (slug: string) => {
    if (selectedForCompare.includes(slug)) {
      setSelectedForCompare(selectedForCompare.filter((s) => s !== slug));
    } else {
      if (selectedForCompare.length >= 4) {
        alert("You can compare up to 4 models at once.");
        return;
      }
      setSelectedForCompare([...selectedForCompare, slug]);
    }
  };

  const resetAllFilters = () => {
    router.push("/models");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Model Directory & Exploration</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Discover Frontier AI Models
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Explore 460+ foundation models across 60+ AI research labs. Filter by modality, context window, capabilities, and provider pricing.
            </p>
          </div>

          {/* Quick Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-sm font-medium text-slate-200"
          >
            <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
            <span>{isMobileFilterOpen ? "Hide Filters" : "Filter & Sort"}</span>
          </button>
        </div>

        {/* Search & Sort Bar */}
        <div className="my-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by model name, slug, or keywords..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <span className="text-xs text-slate-400 hidden md:inline">
              <strong className="text-slate-200">{pagination.total}</strong> models found
            </span>
            <SortSelect value={sort} onChange={(s) => updateUrl({ sort: s, page: 1 })} />
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              labs={filterOptions.labs}
              modelTypes={filterOptions.modelTypes}
              capabilities={filterOptions.capabilities}
              selectedLab={lab}
              selectedType={type}
              selectedCapabilities={capabilities}
              selectedSort={sort}
              maxPrice={maxPrice}
              minContext={minContext}
              onFilterChange={updateUrl}
              onReset={resetAllFilters}
            />
          </div>

          {/* Mobile Collapsible Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="lg:hidden w-full p-4 rounded-2xl border border-slate-800 bg-slate-900 mb-6">
              <FilterSidebar
                labs={filterOptions.labs}
                modelTypes={filterOptions.modelTypes}
                capabilities={filterOptions.capabilities}
                selectedLab={lab}
                selectedType={type}
                selectedCapabilities={capabilities}
                selectedSort={sort}
                maxPrice={maxPrice}
                minContext={minContext}
                onFilterChange={(u) => {
                  updateUrl(u);
                  setIsMobileFilterOpen(false);
                }}
                onReset={() => {
                  resetAllFilters();
                  setIsMobileFilterOpen(false);
                }}
              />
            </div>
          )}

          {/* Models Grid & States */}
          <div className="flex-1 w-full min-w-0">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                <p className="text-sm">Filtering and loading model specifications...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center my-8">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">Error Loading Directory</h3>
                <p className="text-xs text-red-300 mt-1 max-w-md mx-auto">{error}</p>
                <button
                  onClick={() => router.refresh()}
                  className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                >
                  Retry Request
                </button>
              </div>
            ) : models.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center my-6">
                <Filter className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-white">No Models Match Criteria</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Try broadening your search query, increasing maximum price, or resetting applied filters.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {models.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      isSelectedForCompare={selectedForCompare.includes(model.slug)}
                      onToggleCompare={handleToggleCompare}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalRecords={pagination.total}
                  pageSize={pagination.pageSize}
                  onPageChange={(p) => updateUrl({ page: p })}
                />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Floating Compare Tray */}
      <CompareTray
        selectedSlugs={selectedForCompare}
        onRemove={(slug) => setSelectedForCompare(selectedForCompare.filter((s) => s !== slug))}
        onClear={() => setSelectedForCompare([])}
      />

      <Footer />
    </div>
  );
}

export default function ModelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </div>
      }
    >
      <ModelsDirectoryContent />
    </Suspense>
  );
}
