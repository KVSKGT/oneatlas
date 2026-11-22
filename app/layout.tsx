import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OneAtlas — AI Model Discovery, Comparison & Benchmarking",
  description: "Discover, explore, compare, and evaluate AI models across top providers and AI research laboratories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
