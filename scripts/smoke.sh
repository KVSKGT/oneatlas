#!/usr/bin/env bash
# OneAtlas Automated API Smoke Test Script
# Usage: ./scripts/smoke.sh [BASE_URL]
# Default BASE_URL is http://localhost:3000

BASE_URL="${1:-http://localhost:3000}"
echo "=================================================="
echo "🚀 Running OneAtlas API Smoke Tests against: $BASE_URL"
echo "=================================================="

FAILED=0
PASSED=0

assert_status() {
  local endpoint="$1"
  local expected="$2"
  local description="$3"
  
  echo -n "Testing $description ($endpoint) ... "
  status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint")
  
  if [ "$status" -eq "$expected" ]; then
    echo "✅ PASSED (HTTP $status)"
    ((PASSED++))
  else
    echo "❌ FAILED (Expected $expected, got $status)"
    ((FAILED++))
  fi
}

# 1. Models API Tests
assert_status "/api/models" 200 "GET /api/models default listing"
assert_status "/api/models?search=gpt" 200 "GET /api/models with search parameter"
assert_status "/api/models?lab=openai" 200 "GET /api/models with lab filter"
assert_status "/api/models?sort=price_asc" 200 "GET /api/models sort by price asc"
assert_status "/api/models?sort=invalid_sort" 400 "GET /api/models with invalid sort (expect 400)"

# 2. Model Detail API Tests
assert_status "/api/models/non-existent-slug-404" 404 "GET /api/models/[slug] missing slug (expect 404)"

# 3. Compare API Tests
assert_status "/api/compare?models=slug-one,slug-two" 200 "GET /api/compare with 2 models"
assert_status "/api/compare?models=single-model" 400 "GET /api/compare with 1 model (expect 400)"
assert_status "/api/compare?models=m1,m2,m3,m4,m5" 400 "GET /api/compare with 5 models (expect 400)"

# 4. Rankings API Tests
assert_status "/api/rankings?benchmark=overall" 200 "GET /api/rankings overall"
assert_status "/api/rankings?benchmark=mmlu-pro" 200 "GET /api/rankings specific benchmark"

# 5. Search API Tests
assert_status "/api/search?q=claude" 200 "GET /api/search valid query"
assert_status "/api/search" 400 "GET /api/search without query (expect 400)"

# 6. Labs & Providers API Tests
assert_status "/api/labs" 200 "GET /api/labs directory"
assert_status "/api/providers" 200 "GET /api/providers directory"

echo "=================================================="
echo "📊 Smoke Test Results: $PASSED Passed, $FAILED Failed"
echo "=================================================="

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi

exit 0
