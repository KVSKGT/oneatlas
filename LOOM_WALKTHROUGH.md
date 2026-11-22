# OneAtlas — 5-to-10 Minute Demonstration Video Script

This script is structured for recording your demonstration video (either via Loom or recorded via OBS/QuickTime and uploaded to Google Drive as permitted by the submission form).

---

## Part 1: Introduction & Role (1 Minute)
- **Greeting & Objective**: "Hi everyone, I'm presenting **OneAtlas.dev**, a full-stack AI model discovery, intelligence, and benchmarking platform built for the AI Software Engineer evaluation."
- **Role Selected**: "I chose the **Full Stack Engineer** role, taking full end-to-end ownership of the system architecture: from database schema and reproducible OpenRouter ingestion, to thin REST API route handlers with Zod validation, and a modern, accessible user experience built with Next.js 15 and Tailwind CSS."
- **Core Problem Solved**: "With over 460 foundation models available across dozens of research labs, developers and researchers struggle to navigate token pricing, context length tradeoffs, provider hosting latency, and empirical benchmark evaluations. OneAtlas solves this with unified discovery, multi-model side-by-side comparison, and transparent benchmark leaderboards."

---

## Part 2: Feature Walkthrough & Product Experience (4–5 Minutes)

### 1. Homepage & Discovery Entry Points (`/`)
- Showcase the hero section with instant search and platform metrics (460+ models, 66 research labs, 8 inference providers, 6 benchmark suites).
- Demonstrate the **Quick Jump** pills (Reasoning models, High context 1M+, Budget efficient <$0.50/1M).
- Highlight the **Featured Releases** grid and **Top AI Labs** cards.

### 2. Models Directory & Advanced Filtering (`/models`)
- **Search & Filtering**: Search for `"claude"` or `"gpt"`. Filter by research laboratory (`Anthropic`), model type (`Multimodal`), and capabilities (`Reasoning`, `Tool Calling`).
- **URL-Persisted State**: Point out the browser address bar: notice how every filter, sort order, and page number is synchronized to URL query parameters (`/models?lab=anthropic&capability=reasoning&sort=price_asc`), ensuring direct link sharing and refresh resilience.
- **Sorting**: Toggle sorting by Price (Low to High), Context Window (Largest), and Release Date.
- **Compare Tray**: Click "Compare" on 2 to 3 model cards. Show the floating bottom tray updating with selected models.

### 3. Model Detail Profile (`/models/[slug]`)
- Click into a model profile (e.g., `openai-gpt-4o` or `thinkingmachines-inkling-2-mini`).
- Showcase the **Specifications Grid** (context length, modalities, release date, verified capabilities).
- Highlight the **Provider Hosting Matrix**: comparative pricing per 1M tokens, latency in milliseconds, throughput in TPS, and the automated "Best Price" badge.
- Highlight the **Benchmark Evaluation Cards**: visual progress bars and transparent **"Sample Benchmark Data"** badge.

### 4. Side-by-Side Comparison Engine (`/compare`)
- Open the comparison matrix with 2–4 models (e.g. `/compare?models=thinkingmachines-inkling-2-mini,openai-gpt-4o`).
- Show the synchronized side-by-side table:
  - Token pricing with **Best Value** green badges.
  - Context windows with **Largest Context** badge.
  - Capability comparison matrix.
  - Benchmark scores with **★ Top Score** highlights.
- Demonstrate adding or removing models dynamically.

### 5. Benchmark Leaderboard (`/rankings`)
- Show the interactive benchmark switcher: MMLU-Pro, HumanEval, GSM8K, GPQA Diamond, SWE-bench Verified, and MMBench.
- Demonstrate the **Overall Composite Ranking**: explain the algorithmic aggregation (mean score across evaluated benchmarks for models with at least 3 benchmark evaluations).
- Emphasize transparent labeling: all simulated telemetry is explicitly tagged with `source: "sample"` to ensure zero misrepresentation.

### 6. AI Research Labs & Inference Providers (`/labs`, `/providers`)
- Open the **Labs Directory** (`/labs`) showing 60+ institutions and click into a lab profile (e.g., `/labs/anthropic` or `/labs/mistralai`) displaying all associated models.
- Open the **Providers Directory** (`/providers`) displaying infrastructure hosts (Together AI, Groq, Fireworks, Azure, AWS Bedrock) and their hosted endpoints.

### 7. Global Search (`⌘K`)
- Trigger the search modal using `⌘K` / `Ctrl+K`.
- Type `"meta"`: show grouped instant search results categorizing Models, Research Labs, and Providers.

---

## Part 3: Architecture & Engineering Decisions (2–3 Minutes)

- **Next.js App Router Architecture**:
  - Explain the **Server vs. Client Component split**: static/content-rich views (Home, Model Detail, Lab Detail, Provider Detail) execute server-side database services directly for instant render and zero client-server hops. Interactive surfaces (Directory, Comparison, Rankings, Global Search) fetch through thin REST API handlers and synchronize with the URL.
- **Database Design (Prisma & PostgreSQL)**:
  - Show the Prisma schema: clean relations between `Lab`, `Model`, `Provider`, `ModelProvider`, `Benchmark`, and `BenchmarkScore`.
  - Explain the **Denormalized Minimum Pricing**: `minInputPrice` and `minOutputPrice` are denormalized and indexed directly on `Model`, enabling sub-millisecond multi-field sorting and paginated filtering without heavy multi-table aggregate joins.
- **Reproducible Ingestion**:
  - Highlight `data/openrouter-snapshot.json` (frozen 476 models). The seed script converts per-token pricing to USD per 1M tokens ($Price \times 1,000,000$), extracts capabilities from `supported_parameters`, and uses seeded pseudorandom generation (`seedrandom`) so mock offers and benchmark scores are 100% deterministic and reproducible.
- **Resilience & Validation**:
  - Show Zod validation on API handlers returning structured HTTP 200, 400, and 404 responses without exposing raw internal database errors.

---

## Part 4: Automated Testing & Wrap-Up (1 Minute)
- Run `npm run smoke` in the terminal to demonstrate automated passing tests across all 14 API validation scenarios.
- Summarize: "The platform is fully modular, type-safe, responsive, and ready for deployment to Vercel and Neon."
- Thank the viewer!
