/**
 * Cross-platform Smoke Testing Script for OneAtlas API
 * Can be executed on Windows, Linux, and macOS via:
 * npx tsx scripts/smoke.ts [BASE_URL]
 */

const BASE_URL = process.argv[2] || process.env.BASE_URL || "http://localhost:3000";

interface TestCase {
  endpoint: string;
  expectedStatus: number;
  description: string;
}

const tests: TestCase[] = [
  // 1. Models Listing & Filtering
  {
    endpoint: "/api/models",
    expectedStatus: 200,
    description: "Models listing (default parameters)",
  },
  {
    endpoint: "/api/models?search=gpt",
    expectedStatus: 200,
    description: "Models search query filter",
  },
  {
    endpoint: "/api/models?lab=openai",
    expectedStatus: 200,
    description: "Models lab filter",
  },
  {
    endpoint: "/api/models?sort=price_asc",
    expectedStatus: 200,
    description: "Models sort by price ascending",
  },
  {
    endpoint: "/api/models?sort=invalid_sort_param",
    expectedStatus: 400,
    description: "Models invalid sort parameter (Validation Error)",
  },

  // 2. Model Detail
  {
    endpoint: "/api/models/non-existent-test-slug-404",
    expectedStatus: 404,
    description: "Model detail for non-existent slug (Not Found)",
  },

  // 3. Compare Endpoint
  {
    endpoint: "/api/compare?models=slug-one,slug-two",
    expectedStatus: 200,
    description: "Compare with 2 model slugs",
  },
  {
    endpoint: "/api/compare?models=single-model",
    expectedStatus: 400,
    description: "Compare with only 1 model (Requires 2-4)",
  },
  {
    endpoint: "/api/compare?models=m1,m2,m3,m4,m5",
    expectedStatus: 400,
    description: "Compare with 5 models (Exceeds max 4)",
  },

  // 4. Rankings Endpoint
  {
    endpoint: "/api/rankings?benchmark=overall",
    expectedStatus: 200,
    description: "Benchmark rankings (Overall composite)",
  },
  {
    endpoint: "/api/rankings?benchmark=mmlu-pro",
    expectedStatus: 200,
    description: "Benchmark rankings (Specific benchmark)",
  },

  // 5. Global Search Endpoint
  {
    endpoint: "/api/search?q=claude",
    expectedStatus: 200,
    description: "Global search with query string",
  },
  {
    endpoint: "/api/search",
    expectedStatus: 400,
    description: "Global search without query parameter",
  },

  // 6. Labs & Providers Directories
  {
    endpoint: "/api/labs",
    expectedStatus: 200,
    description: "Labs directory list",
  },
  {
    endpoint: "/api/providers",
    expectedStatus: 200,
    description: "Providers directory list",
  },
];

async function runTests() {
  console.log("==================================================");
  console.log(`🚀 Running OneAtlas API Smoke Tests against: ${BASE_URL}`);
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const url = `${BASE_URL}${test.endpoint}`;
    process.stdout.write(`Testing: ${test.description} (${test.endpoint}) ... `);

    try {
      const res = await fetch(url);
      if (res.status === test.expectedStatus) {
        console.log(`✅ PASSED (HTTP ${res.status})`);
        passed++;
      } else {
        console.log(`❌ FAILED (Expected HTTP ${test.expectedStatus}, got ${res.status})`);
        failed++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`❌ FAILED (Network Error: ${msg})`);
      failed++;
    }
  }

  console.log("==================================================");
  console.log(`📊 Smoke Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
