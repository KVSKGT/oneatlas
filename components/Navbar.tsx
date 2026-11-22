"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import { Search, Scale, Trophy, Building2, Server, Menu, X, Sparkles, Layers } from "lucide-react";
import { GlobalSearchModal } from "./GlobalSearchModal";

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = [
    { href: "/models", label: "Models", icon: Layers },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/rankings", label: "Rankings", icon: Trophy },
    { href: "/labs", label: "Labs", icon: Building2 },
    { href: "/providers", label: "Providers", icon: Server },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
                  <Sparkles className="h-4 w-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  OneAtlas
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Intelligence
                  </span>
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-800 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Right Header Section: Search & Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors shadow-inner"
              title="Search AI models, labs and providers"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search models, labs, providers...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden sm:inline-block rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Sample Data Indicator */}
            <span
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20"
              title="Benchmark scores and provider telemetry include calibrated sample data for evaluation"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Sample Benchmarks
            </span>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
            <div className="pt-2 border-t border-slate-900">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs text-amber-400 bg-amber-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Sample Benchmark Scores
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
