# Architectural Decisions Record (ADR) — OneAtlas.dev

## 1. Tech Stack & Framework Architecture
- **Framework:** Next.js 15+ App Router with TypeScript and Tailwind CSS.
- **Data Query Strategy:** 
  - Server components directly invoke database services (`lib/services/*`) on static/server-rendered views (Homepage, Model Detail, Lab Detail, Provider Detail).
  - Client components fetch through `/api/*` route handlers for dynamic, interactive user workflows (Model Directory filtering/pagination, Comparison table, Rankings leaderboard, Global Search).
  - Filter and sort states are kept in URL query parameters (`useSearchParams` / `useRouter`) to ensure shareable, refresh-resilient state.

## 2. Ingestion & Data Integrity
- **Snapshot Isolation:** Model data is sourced from `data/openrouter-snapshot.json` (frozen snapshot of 476 models from OpenRouter API) to guarantee 100% deterministic, offline-capable database seeding.
- **Price Normalization:** OpenRouter per-token prices are normalized to USD per 1 Million tokens ($Price \times 1,000,000$) and stored as high-precision `Decimal` values.
- **Denormalized Minimum Pricing:** `Model.minInputPrice` and `Model.minOutputPrice` are denormalized and indexed directly on the `Model` table. This avoids multi-table aggregate joins during paginated price sorting.
- **Derived Enums & Capabilities:**
  - `modelType` is derived from output modalities (`text`, `image`, `embedding`, `multimodal`).
  - `capabilities` array (`tool_calling`, `reasoning`, `structured_output`, `vision`) is extracted from `supported_parameters` and input modalities.
- **Honest Sample Labeling:** Provider offers and benchmark evaluations are generated deterministically using a seeded PRNG (`seedrandom`), flagged with `source = "sample"`, and prominently badged in the UI.

## 3. Database & Deployment
- **Database:** PostgreSQL on Neon with dual connection strings (`DATABASE_URL` with connection pooling for runtime queries, and `DIRECT_URL` direct unpooled connection for Prisma migrations).
- **Deployment Platform:** Vercel with automatic `prisma generate` postinstall step.
