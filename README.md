# OneAtlas.dev — AI Model Discovery, Comparison & Benchmarking Platform

![OneAtlas Platform](https://img.shields.io/badge/Next.js-15+-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat&logo=prisma)

OneAtlas is an enterprise-grade AI model discovery, intelligence, and benchmarking platform inspired by OpenRouter, RouterPlus, and LiteLLM. It allows developers, researchers, and enterprises to explore 460+ foundation models across 60+ AI research laboratories, compare real-time provider pricing, evaluate context window sizes, and assess model performance through standardized benchmark leaderboards.

---

## 1. Core Platform Features

- **Model Directory & Search**: Browse 460+ models with multi-dimensional filtering by AI Research Lab, Model Type (text, multimodal, embedding), Capabilities (tool calling, reasoning, vision, structured output), Context Window, and Max Price.
- **URL-Persisted State**: All filter and sort selections are continuously synchronized to URL query parameters (`/models?lab=anthropic&capability=reasoning&sort=price_asc`), allowing direct sharing, bookmarking, and refresh resilience.
- **Individual Model Profiles (`/models/[slug]`)**: Deep-dive views featuring model specifications, input/output token pricing, supported modalities, provider hosting matrix (latency & throughput), and empirical benchmark scores.
- **Side-by-Side Comparison Engine (`/compare?models=slug1,slug2`)**: Compare 2 to 4 models simultaneously across pricing, context lengths, architecture capabilities, and performance metrics, with automated **Best-Value** and **Top-Score** indicator badges.
- **Benchmark Leaderboards (`/rankings`)**: Standardized rankings across reasoning, coding, math, agentic, knowledge, and vision benchmarks. Computes an aggregate **Overall Mean Score** for models with $\ge 3$ evaluations, with honest **Sample Data** labeling.
- **AI Laboratories & Providers Directories**: Explore 60+ AI labs (OpenAI, Anthropic, Google DeepMind, Mistral, Meta) and provider ecosystems (Together AI, Groq, Fireworks, Azure, AWS Bedrock).
- **Unified Global Search (`⌘K`)**: Instant modal search across models, research labs, and providers with keyboard navigation.
- **Responsive & Accessible Design**: Engineered with a modern dark aesthetic, tested at 375px mobile, 768px tablet, and full desktop width with zero unwanted horizontal scroll.

---

## 2. Technology Stack & Architectural Decisions

| Layer | Technology | Decision Rationale |
|---|---|---|
| **Frontend Framework** | Next.js 15+ (App Router) | Server Components for SEO and fast initial renders; Client Components for dynamic filter interactions. |
| **Language** | TypeScript | End-to-end type safety across database entities, service layers, and UI components. |
| **Styling** | Tailwind CSS | Utility-first CSS with modern slate/indigo theme and system fonts for zero external font network blocking. |
| **Database** | PostgreSQL (Neon) | Serverless PostgreSQL with connection pooling (`DATABASE_URL`) and direct migration support (`DIRECT_URL`). |
| **ORM** | Prisma ORM | Type-safe schema definition, automated migrations, and relations management. |
| **Validation** | Zod | Strict runtime query parameter and payload validation on all Route Handlers. |
| **Data Ingestion** | OpenRouter API Snapshot | Frozen 476-model snapshot (`data/openrouter-snapshot.json`) guaranteeing 100% deterministic, offline-capable seeding. |
| **Testing** | Bash & Node Smoke Tests | Automated verification of all endpoints for 200, 400, and 404 response compliance. |

For detailed rationale on every design choice, consult [DECISIONS.md](./DECISIONS.md).

---

## 3. Database Schema

The database is designed with normalized entities and denormalized minimum pricing for optimal query and sorting performance:

```mermaid
erDiagram
    LAB ||--o{ MODEL : "develops"
    PROVIDER ||--o{ MODEL_PROVIDER : "hosts"
    MODEL ||--o{ MODEL_PROVIDER : "offered by"
    BENCHMARK ||--o{ BENCHMARK_SCORE : "evaluates"
    MODEL ||--o{ BENCHMARK_SCORE : "achieves"

    LAB {
        string id PK
        string slug UK
        string name
        string country
        string website
        string description
    }

    MODEL {
        string id PK
        string slug UK
        string name
        string labId FK
        string modelType
        string description
        int contextWindow
        datetime releaseDate
        string[] inputModalities
        string[] outputModalities
        string[] capabilities
        decimal minInputPrice
        decimal minOutputPrice
    }

    PROVIDER {
        string id PK
        string slug UK
        string name
        string website
        string description
    }

    MODEL_PROVIDER {
        string id PK
        string modelId FK
        string providerId FK
        decimal inputPricePerM
        decimal outputPricePerM
        int contextWindow
        int latencyMs
        decimal throughputTps
    }

    BENCHMARK {
        string id PK
        string slug UK
        string name
        string category
        string description
        string source
    }

    BENCHMARK_SCORE {
        string id PK
        string modelId FK
        string benchmarkId FK
        decimal score
    }
```

---

## 4. Getting Started & Installation

### Prerequisites
- Node.js 18.x or 20.x+
- npm or pnpm
- PostgreSQL database instance (local or Neon)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/oneatlas.git
cd oneatlas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the example environment file:
```bash
cp .env.example .env
```
Update `.env` with your PostgreSQL connection strings:
```env
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Ingestion
Generate Prisma Client:
```bash
npx prisma generate
```

Push schema to database or run migrations:
```bash
npx prisma db push
```

Run the deterministic seed script:
```bash
npm run seed
```
The seed script will:
1. Ingest 460+ models from `data/openrouter-snapshot.json`.
2. Extract and associate 60+ AI research laboratories.
3. Generate reproducible provider hosting offers (Together, Groq, Fireworks, DeepInfra, Azure, AWS Bedrock).
4. Evaluate reproducible benchmark scores across reasoning, coding, math, agentic, knowledge, and vision benchmarks.
5. Recompute and index denormalized minimum pricing fields (`minInputPrice`, `minOutputPrice`) on `Model`.

---

## 5. Development & Local Execution

Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 6. Automated Testing & Verification

Run the automated smoke testing suite:

**Cross-platform (Node.js):**
```bash
npm run smoke
# or against a custom URL:
npx tsx scripts/smoke.ts https://your-deployment.vercel.app
```

**Bash / Shell:**
```bash
chmod +x scripts/smoke.sh
./scripts/smoke.sh http://localhost:3000
```

The smoke test suite verifies:
- ✅ Models listing with default pagination and combined filters (HTTP 200)
- ✅ Search parameter queries across names and slugs (HTTP 200)
- ✅ Invalid query parameter handling (HTTP 400 with structured Zod errors)
- ✅ Missing model slug handling (HTTP 404)
- ✅ Model comparison validation (HTTP 200 for 2–4 models; HTTP 400 for <2 or >4 models)
- ✅ Overall composite benchmark ranking calculation (HTTP 200)
- ✅ Global search endpoint (HTTP 200) and missing query error (HTTP 400)
- ✅ AI Labs & Providers directory listings (HTTP 200)

---

## 7. API Reference

All API routes validate parameters with Zod and return consistent JSON structures:

- `GET /api/models`: Query models with parameters `search`, `lab`, `type`, `capability`, `minPrice`, `maxPrice`, `minContext`, `sort`, `page`, `pageSize`. (Pass `?meta=filters` to retrieve distinct filter options).
- `GET /api/models/[slug]`: Retrieve full specification, provider offers, and benchmark scores for a model.
- `GET /api/compare?models=slug1,slug2`: Retrieve side-by-side comparison matrix with automated best-value highlights.
- `GET /api/rankings?benchmark=overall&category=coding`: Retrieve benchmark leaderboards.
- `GET /api/search?q=query`: Fast multi-entity search querying models, labs, and providers.
- `GET /api/labs`: List all research labs with model counts.
- `GET /api/providers`: List all inference providers with hosted model counts.

---

## 8. Deployment to Vercel

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Configure the following environment variables in Vercel Project Settings:
   - `DATABASE_URL`: Your pooled Neon connection string.
   - `DIRECT_URL`: Your direct unpooled Neon connection string.
4. Ensure the `package.json` contains `"postinstall": "prisma generate"`.
5. Deploy. Vercel will build and launch the application seamlessly.

---

## 9. License & Attribution

Built for the OneAtlas AI Software Engineering Evaluation. Sourced data from OpenRouter. All generated evaluations are explicitly badged and labeled as sample evaluation data.
