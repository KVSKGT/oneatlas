import { PrismaClient, Prisma } from "@prisma/client";
import seedrandom from "seedrandom";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// High-quality metadata for known AI research labs
const KNOWN_LABS: Record<string, { name: string; country: string; website: string; description: string }> = {
  openai: {
    name: "OpenAI",
    country: "United States",
    website: "https://openai.com",
    description: "Pioneer in artificial general intelligence, creator of the GPT series, ChatGPT, and Sora.",
  },
  anthropic: {
    name: "Anthropic",
    country: "United States",
    website: "https://anthropic.com",
    description: "AI safety and research company behind Claude, dedicated to building steerable and reliable systems.",
  },
  google: {
    name: "Google DeepMind",
    country: "United States",
    website: "https://deepmind.google",
    description: "World-leading AI laboratory developing the Gemini multimodal model family and foundational scientific models.",
  },
  mistralai: {
    name: "Mistral AI",
    country: "France",
    website: "https://mistral.ai",
    description: "European champion in open-weight and frontier AI models, creator of Mistral, Mixtral, and Pixtral.",
  },
  "meta-llama": {
    name: "Meta AI",
    country: "United States",
    website: "https://ai.meta.com",
    description: "Leading open science and open-weights AI laboratory, creator of the Llama series.",
  },
  meta: {
    name: "Meta AI",
    country: "United States",
    website: "https://ai.meta.com",
    description: "Leading open science and open-weights AI laboratory, creator of the Llama series.",
  },
  cohere: {
    name: "Cohere",
    country: "Canada",
    website: "https://cohere.com",
    description: "Enterprise AI pioneer specializing in retrieval-augmented generation (RAG) and Command models.",
  },
  deepseek: {
    name: "DeepSeek",
    country: "China",
    website: "https://deepseek.com",
    description: "High-efficiency open-weight foundation model lab pioneering reasoning architectures and MoE scaling.",
  },
  qwen: {
    name: "Alibaba Cloud (Qwen)",
    country: "China",
    website: "https://qwenlm.github.io",
    description: "Alibaba's advanced open-weight multimodal and reasoning model family.",
  },
  "x-ai": {
    name: "xAI",
    country: "United States",
    website: "https://x.ai",
    description: "AI lab founded by Elon Musk focused on accelerating scientific discovery with Grok.",
  },
  thinkingmachines: {
    name: "Thinking Machines Lab",
    country: "United States",
    website: "https://thinkingmachines.ai",
    description: "Research laboratory pioneering looped transformer architectures and multimodal reasoning.",
  },
  amazon: {
    name: "Amazon Web Services",
    country: "United States",
    website: "https://aws.amazon.com",
    description: "Cloud computing and AI provider, developer of the Titan model family.",
  },
  microsoft: {
    name: "Microsoft",
    country: "United States",
    website: "https://microsoft.com",
    description: "Global technology leader developing the Phi small language model family and Copilot ecosystem.",
  },
  tencent: {
    name: "Tencent AI",
    country: "China",
    website: "https://ai.tencent.com",
    description: "Research arm of Tencent developing Hunyuan large multimodal and reasoning models.",
  },
  baidu: {
    name: "Baidu",
    country: "China",
    website: "https://baidu.com",
    description: "Chinese search and AI leader, developer of the ERNIE (Wenxin Yiyan) model family.",
  },
  radixark: {
    name: "RadixArk",
    country: "United States",
    website: "https://radixark.com",
    description: "Independent AI research institute focused on domain-specialized foundation models.",
  },
};

// Known providers
const KNOWN_PROVIDERS = [
  {
    slug: "openrouter",
    name: "OpenRouter",
    website: "https://openrouter.ai",
    description: "Unified AI API aggregator routing to top models with competitive pricing and fallbacks.",
  },
  {
    slug: "together",
    name: "Together AI",
    website: "https://together.ai",
    description: "Leading cloud platform for open-source AI inference and fine-tuning with low latency.",
  },
  {
    slug: "groq",
    name: "Groq",
    website: "https://groq.com",
    description: "Ultra-fast LPU inference engine delivering industry-leading tokens-per-second throughput.",
  },
  {
    slug: "fireworks",
    name: "Fireworks AI",
    website: "https://fireworks.ai",
    description: "Production-grade AI inference platform optimized for compound AI systems and fine-tuned models.",
  },
  {
    slug: "deepinfra",
    name: "DeepInfra",
    website: "https://deepinfra.com",
    description: "Cost-effective, serverless AI model inference and embeddings hosting.",
  },
  {
    slug: "azure",
    name: "Microsoft Azure AI",
    website: "https://azure.microsoft.com",
    description: "Enterprise-grade cloud infrastructure providing OpenAI and open-weight model endpoints.",
  },
  {
    slug: "aws-bedrock",
    name: "AWS Bedrock",
    website: "https://aws.amazon.com/bedrock",
    description: "Fully managed service offering choice of high-performing foundation models from top AI companies.",
  },
  {
    slug: "lepton",
    name: "Lepton AI",
    website: "https://lepton.ai",
    description: "Developer-first cloud platform for running AI apps efficiently at production scale.",
  },
];

// Standard benchmarks
const BENCHMARKS = [
  {
    slug: "mmlu-pro",
    name: "MMLU-Pro",
    category: "knowledge",
    description: "Massive Multitask Language Understanding Pro across humanities, science, and engineering.",
    source: "sample",
  },
  {
    slug: "humaneval",
    name: "HumanEval",
    category: "coding",
    description: "Python functional code generation and problem solving evaluation.",
    source: "sample",
  },
  {
    slug: "gsm8k",
    name: "GSM8K",
    category: "math",
    description: "Grade school math multi-step numerical reasoning challenge.",
    source: "sample",
  },
  {
    slug: "gpqa-diamond",
    name: "GPQA Diamond",
    category: "reasoning",
    description: "Graduate-level Google-proof scientific reasoning benchmark.",
    source: "sample",
  },
  {
    slug: "swe-bench",
    name: "SWE-bench Verified",
    category: "agentic",
    description: "Resolving real-world software engineering issues from GitHub repositories.",
    source: "sample",
  },
  {
    slug: "mmbench",
    name: "MMBench",
    category: "vision",
    description: "Multimodal perception and reasoning evaluation across diverse visual tasks.",
    source: "sample",
  },
];

function formatLabName(slug: string): string {
  if (KNOWN_LABS[slug]) return KNOWN_LABS[slug].name;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function cleanModelSlug(id: string): string {
  return id.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
}

async function main() {
  console.log("🚀 Starting OneAtlas database seeding...");

  const snapshotPath = path.join(__dirname, "../data/openrouter-snapshot.json");
  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Snapshot file not found at ${snapshotPath}`);
  }

  const raw = fs.readFileSync(snapshotPath, "utf8");
  const parsed = JSON.parse(raw);
  const rawModels = parsed.data || [];
  console.log(`📦 Loaded ${rawModels.length} models from snapshot.`);

  // 1. Seed Benchmarks
  console.log("📊 Seeding benchmarks...");
  const benchmarkMap = new Map<string, string>();
  for (const b of BENCHMARKS) {
    const record = await prisma.benchmark.upsert({
      where: { slug: b.slug },
      update: { name: b.name, category: b.category, description: b.description, source: b.source },
      create: b,
    });
    benchmarkMap.set(b.slug, record.id);
  }

  // 2. Seed Providers
  console.log("🏢 Seeding providers...");
  const providerMap = new Map<string, string>();
  for (const p of KNOWN_PROVIDERS) {
    const record = await prisma.provider.upsert({
      where: { slug: p.slug },
      update: { name: p.name, website: p.website, description: p.description },
      create: p,
    });
    providerMap.set(p.slug, record.id);
  }

  // 3. Process Models & Labs
  console.log("🔬 Ingesting labs and models...");
  let insertedModels = 0;
  let skippedModels = 0;

  for (const m of rawModels) {
    // Quality filters: skip routers, missing or negative pricing
    if (!m.id || m.id.startsWith("openrouter/")) {
      skippedModels++;
      continue;
    }
    const pricing = m.pricing;
    if (!pricing || pricing.prompt == null || pricing.completion == null) {
      skippedModels++;
      continue;
    }

    const rawPromptPrice = parseFloat(pricing.prompt);
    const rawComplPrice = parseFloat(pricing.completion);

    if (isNaN(rawPromptPrice) || isNaN(rawComplPrice) || rawPromptPrice < 0 || rawComplPrice < 0) {
      skippedModels++;
      continue;
    }

    // Convert price per token to USD per 1 Million tokens
    const promptPricePerM = new Prisma.Decimal((rawPromptPrice * 1_000_000).toFixed(6));
    const complPricePerM = new Prisma.Decimal((rawComplPrice * 1_000_000).toFixed(6));

    // Lab extraction
    const labSlug = m.id.split("/")[0].toLowerCase();
    const labMeta = KNOWN_LABS[labSlug] || {
      name: formatLabName(labSlug),
      country: "Global",
      website: `https://${labSlug}.ai`,
      description: `AI research laboratory developing frontier foundation models.`,
    };

    const lab = await prisma.lab.upsert({
      where: { slug: labSlug },
      update: {},
      create: {
        slug: labSlug,
        name: labMeta.name,
        country: labMeta.country,
        website: labMeta.website,
        description: labMeta.description,
      },
    });

    // Derive model type
    const outMods: string[] = m.architecture?.output_modalities || ["text"];
    let modelType = "text";
    if (outMods.includes("image") && outMods.includes("text")) {
      modelType = "multimodal";
    } else if (outMods.includes("image")) {
      modelType = "image";
    } else if (outMods.includes("embedding")) {
      modelType = "embedding";
    } else if (outMods.length > 1) {
      modelType = "multimodal";
    }

    // Derive capabilities
    const params: string[] = m.supported_parameters || [];
    const inMods: string[] = m.architecture?.input_modalities || ["text"];
    const capabilities: string[] = [];
    if (params.includes("tools") || params.includes("tool_choice")) {
      capabilities.push("tool_calling");
    }
    if (params.includes("reasoning") || params.includes("include_reasoning") || m.reasoning) {
      capabilities.push("reasoning");
    }
    if (params.includes("structured_outputs") || params.includes("response_format")) {
      capabilities.push("structured_output");
    }
    if (inMods.includes("image")) {
      capabilities.push("vision");
    }

    const modelSlug = cleanModelSlug(m.id);
    const contextWindow = m.context_length || 8192;
    const releaseDate = m.created ? new Date(m.created * 1000) : new Date("2024-01-01");

    // Upsert Model
    const modelRecord = await prisma.model.upsert({
      where: { slug: modelSlug },
      update: {
        name: m.name || m.id,
        labId: lab.id,
        modelType,
        description: m.description || `High-performance ${modelType} model by ${lab.name}.`,
        contextWindow,
        releaseDate,
        inputModalities: inMods,
        outputModalities: outMods,
        capabilities,
        minInputPrice: promptPricePerM,
        minOutputPrice: complPricePerM,
      },
      create: {
        slug: modelSlug,
        name: m.name || m.id,
        labId: lab.id,
        modelType,
        description: m.description || `High-performance ${modelType} model by ${lab.name}.`,
        contextWindow,
        releaseDate,
        inputModalities: inMods,
        outputModalities: outMods,
        capabilities,
        minInputPrice: promptPricePerM,
        minOutputPrice: complPricePerM,
      },
    });

    // Seed reproducible provider offers
    const rng = seedrandom(modelSlug);
    const providerSlugs = Array.from(providerMap.keys());
    // Pick 1 to 3 providers
    const numOffers = 1 + Math.floor(rng() * 3);
    const chosenProviders: string[] = [];
    for (let i = 0; i < numOffers; i++) {
      const idx = Math.floor(rng() * providerSlugs.length);
      const chosen = providerSlugs[idx];
      if (!chosenProviders.includes(chosen)) chosenProviders.push(chosen);
    }
    // Always include openrouter
    if (!chosenProviders.includes("openrouter")) {
      chosenProviders.push("openrouter");
    }

    let minIn = Number(promptPricePerM);
    let minOut = Number(complPricePerM);

    for (const pSlug of chosenProviders) {
      const providerId = providerMap.get(pSlug)!;
      // Slight variation: 0.85x to 1.15x
      const mult = 0.85 + rng() * 0.3;
      const offerInput = new Prisma.Decimal((Number(promptPricePerM) * mult).toFixed(6));
      const offerOutput = new Prisma.Decimal((Number(complPricePerM) * mult).toFixed(6));

      if (Number(offerInput) < minIn) minIn = Number(offerInput);
      if (Number(offerOutput) < minOut) minOut = Number(offerOutput);

      const latencyMs = Math.round(180 + rng() * 500);
      const throughputTps = new Prisma.Decimal((30 + rng() * 120).toFixed(1));

      await prisma.modelProvider.upsert({
        where: {
          modelId_providerId: {
            modelId: modelRecord.id,
            providerId,
          },
        },
        update: {
          inputPricePerM: offerInput,
          outputPricePerM: offerOutput,
          contextWindow,
          latencyMs,
          throughputTps,
        },
        create: {
          modelId: modelRecord.id,
          providerId,
          inputPricePerM: offerInput,
          outputPricePerM: offerOutput,
          contextWindow,
          latencyMs,
          throughputTps,
        },
      });
    }

    // Seed reproducible benchmark scores (3 to 6 benchmarks per model)
    const benchKeys = Array.from(benchmarkMap.keys());
    // Quality base factor: premium models score higher
    const baseScore = 55 + rng() * 30 + (contextWindow > 128000 ? 6 : 0) + (capabilities.length * 2);

    for (const bKey of benchKeys) {
      // Deterministically decide whether to include this benchmark score (~80% chance)
      if (rng() > 0.25 || benchKeys.indexOf(bKey) < 3) {
        const benchmarkId = benchmarkMap.get(bKey)!;
        const jitter = (rng() - 0.5) * 12;
        const clampedScore = Math.min(98.5, Math.max(35.0, baseScore + jitter));
        const decimalScore = new Prisma.Decimal(clampedScore.toFixed(2));

        await prisma.benchmarkScore.upsert({
          where: {
            modelId_benchmarkId: {
              modelId: modelRecord.id,
              benchmarkId,
            },
          },
          update: { score: decimalScore },
          create: {
            modelId: modelRecord.id,
            benchmarkId,
            score: decimalScore,
          },
        });
      }
    }

    // Update denormalized min prices
    await prisma.model.update({
      where: { id: modelRecord.id },
      data: {
        minInputPrice: new Prisma.Decimal(minIn.toFixed(6)),
        minOutputPrice: new Prisma.Decimal(minOut.toFixed(6)),
      },
    });

    insertedModels++;
  }

  console.log(`✅ Seeding complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Labs: ${await prisma.lab.count()}`);
  console.log(`   - Models: ${await prisma.model.count()}`);
  console.log(`   - Providers: ${await prisma.provider.count()}`);
  console.log(`   - Model Providers (Offers): ${await prisma.modelProvider.count()}`);
  console.log(`   - Benchmarks: ${await prisma.benchmark.count()}`);
  console.log(`   - Benchmark Scores: ${await prisma.benchmarkScore.count()}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
