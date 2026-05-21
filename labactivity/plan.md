# AI-Driven Full-Stack Feature: Project Plan

### `/api/products/search` — FastAPI + React TypeScript + Vitest

**Methodology: Prompt-first engineering with honest AI-vs-manual benchmark**

---

## Table of Contents

1. [Project Objective & Scope](#1-project-objective--scope)
2. [What "Minimal Manual Code" Means Here](#2-what-minimal-manual-code-means-here)
3. [Repo Structure](#3-repo-structure)
4. [Phase Breakdown with AI Prompts](#4-phase-breakdown-with-ai-prompts)
   - Phase 0: Setup & Scaffolding
   - Phase 1: FastAPI Backend
   - Phase 2: React TypeScript Frontend
   - Phase 3: Vitest Test Suite
   - Phase 4: Integration & GitHub Delivery
5. [Time Tracking Protocol](#5-time-tracking-protocol)
6. [Manual Estimate Baseline](#6-manual-estimate-baseline)
7. [Benchmark Methodology & Output Doc](#7-benchmark-methodology--output-doc)
8. [Failure Modes & Mitigations](#8-failure-modes--mitigations)
9. [Negative Constraints (What to Avoid)](#9-negative-constraints-what-to-avoid)
10. [Testing Guide](#10-testing-guide)
11. [Prompt Chain Index](#11-prompt-chain-index)

---

## 1. Project Objective & Scope

**Goal:** Build a working full-stack search feature using AI prompts as the primary implementation vehicle — not as autocomplete. Every non-trivial code artifact must originate from a deliberate prompt. Measure whether this approach is faster or slower than a competent developer writing the same thing manually, and _explain why_ either way.

**Deliverables:**

- `GET /api/products/search` — FastAPI endpoint with full-text search + filters (name, category, price range) backed by a mock in-memory product list
- `<ProductSearch />` — React TypeScript component that calls the endpoint, displays results, and handles loading/error states
- Vitest test suite — unit tests for the component using `msw` for network mocking
- GitHub repo — clean commit history with meaningful checkpoints
- `TIME_COMPARISON.md` — honest benchmark doc with methodology, actuals, and analysis

**Out of scope for v1:**

- Authentication
- Pagination (unless the AI adds it unprompted — note it if it does)
- Database (mock in-memory only)
- Deployment / CI/CD pipeline

---

## 2. What "Minimal Manual Code" Means Here

This needs a precise definition or the benchmark is useless.

| Category                             | Counts as AI-generated                  | Counts as Manual                  |
| ------------------------------------ | --------------------------------------- | --------------------------------- |
| Business logic                       | AI wrote it from a prompt               | You typed it from scratch         |
| Boilerplate                          | AI wrote it (even if trivial)           | You wrote it without prompting    |
| Bug fixes                            | AI fixed it after you described the bug | You spotted and fixed it yourself |
| Prompt engineering                   | Your time — always manual               | —                                 |
| Glue code between AI outputs         | Manual if you wrote it                  | AI if you prompted for it         |
| Config files (tsconfig, vite.config) | AI if prompted                          | Manual if hand-edited             |

**Tracking rule:** Keep a running log. Every time you write more than one line of code yourself, note it in `TIME_LOG.md` with a reason. No judgment — honesty is the point.

---

## 3. Repo Structure

```
product-search-ai/
├── backend/
│   ├── main.py                  # FastAPI app entry
│   ├── routers/
│   │   └── products.py          # /api/products/search route
│   ├── models/
│   │   └── product.py           # Pydantic models
│   ├── data/
│   │   └── mock_products.py     # In-memory product list
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProductSearch/
│   │   │       ├── ProductSearch.tsx
│   │   │       ├── ProductSearch.test.tsx
│   │   │       └── ProductSearch.module.css
│   │   ├── api/
│   │   │   └── products.ts      # Typed API client
│   │   └── types/
│   │       └── product.ts       # Shared TS types
│   ├── vite.config.ts
│   ├── vitest.setup.ts
│   ├── package.json
│   └── README.md
├── TIME_LOG.md                  # Running time log (fill as you go)
├── TIME_COMPARISON.md           # Final benchmark doc (filled at end)
└── README.md
```

**Branching strategy:**

- `main` — only receives PRs, never direct commits
- `feat/backend-search` — Phase 1 work
- `feat/frontend-component` — Phase 2 work
- `feat/vitest-suite` — Phase 3 work
- Merge order: backend → frontend → tests → main

**Commit checkpoints (required):**

```
feat: scaffold FastAPI project structure
feat: add mock product data (20+ products, 4+ categories)
feat: implement /api/products/search with filters
fix: <anything you had to correct after AI output>
feat: scaffold React + Vite TypeScript frontend
feat: add typed API client for product search
feat: implement ProductSearch component
feat: add msw handlers for product API
feat: add Vitest unit tests for ProductSearch
docs: add TIME_COMPARISON.md with benchmark results
```

---

## 4. Phase Breakdown with AI Prompts

Each phase includes: **the prompt to use**, **what to verify before moving on**, and **common failure points**.

---

### Phase 0: Setup & Scaffolding (~20 min)

**Do this manually** — project scaffolding is fastest done by hand and isn't interesting to benchmark. Start the timer _after_ this phase.

```bash
# Backend
mkdir -p product-search-ai/backend/{routers,models,data}
cd product-search-ai/backend
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn pydantic

# Frontend
cd ../
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install -D vitest @vitest/ui jsdom @testing-library/react \
  @testing-library/jest-dom @testing-library/user-event msw
```

Initialize `TIME_LOG.md`:

```markdown
# Time Log

| Phase | Task        | Start | End   | AI or Manual | Notes           |
| ----- | ----------- | ----- | ----- | ------------ | --------------- |
| 0     | Scaffolding | HH:MM | HH:MM | Manual       | Not benchmarked |
```

**Start the benchmark clock here.**

---

### Phase 1: FastAPI Backend

#### Prompt 1-A — Mock Data

> **Use this prompt verbatim in Claude:**
>
> ```
> Generate a Python file `mock_products.py` that exports a list called `PRODUCTS`.
> The list should contain 25 products. Each product must be a dict with these fields:
>   - id: int (sequential, starting at 1)
>   - name: str (realistic product name)
>   - category: str (one of: "electronics", "clothing", "books", "home")
>   - price: float (between 5.00 and 999.99, two decimal places)
>   - description: str (one sentence)
>   - in_stock: bool
>
> Requirements:
>   - At least 5 products per category
>   - Price range must span from under $20 to over $500
>   - No placeholder names like "Product 1" — use real-sounding names
>   - Do not import anything — pure data file only
> ```

**Verify before continuing:**

- [ ] 25 products present
- [ ] All 4 categories represented (≥5 each)
- [ ] Price range spans $5–$999
- [ ] No imports in the file

---

#### Prompt 1-B — Pydantic Models

> ```
> Create a Pydantic v2 models file `models/product.py` for a FastAPI app.
>
> Define these models:
>
> 1. `Product` — mirrors the mock data dict:
>    - id: int
>    - name: str
>    - category: str
>    - price: float
>    - description: str
>    - in_stock: bool
>
> 2. `ProductSearchParams` — query parameters for search:
>    - q: Optional[str] = None  (searches name and description)
>    - category: Optional[str] = None
>    - min_price: Optional[float] = None
>    - max_price: Optional[float] = None
>
> 3. `SearchResponse`:
>    - results: List[Product]
>    - total: int
>    - query: ProductSearchParams
>
> Use Pydantic v2 syntax. Add field validators:
>   - min_price must be >= 0 if provided
>   - max_price must be >= min_price if both are provided
>   - category must be one of: electronics, clothing, books, home (case-insensitive, normalize to lowercase)
>
> Do not add any FastAPI imports — pure Pydantic only.
> ```

**Verify before continuing:**

- [ ] Pydantic v2 syntax (`model_config`, not `class Config`)
- [ ] Validator for min/max price relationship exists
- [ ] Category normalization works

---

#### Prompt 1-C — Search Router

> ```
> Create a FastAPI router file `routers/products.py`.
>
> It should expose one endpoint:
>   GET /api/products/search
>
> Behavior:
>   - Accept query parameters matching `ProductSearchParams` (import from models.product)
>   - Load products from `data.mock_products.PRODUCTS`
>   - Filter logic (all filters are AND conditions, all optional):
>       1. If `q` is provided: case-insensitive substring match against name OR description
>       2. If `category` is provided: exact match (already normalized by model validator)
>       3. If `min_price` is provided: price >= min_price
>       4. If `max_price` is provided: price <= max_price
>   - Return a `SearchResponse` with filtered results and total count
>   - If no filters provided, return all products
>   - Add CORS headers — allow all origins (development only)
>
> Requirements:
>   - Use FastAPI's `Depends()` for query param injection via `ProductSearchParams`
>   - Add proper HTTP exception: 400 if max_price < min_price (double-check after validator)
>   - Include docstring on the endpoint for auto-generated OpenAPI docs
>   - Do not use a database — filter from the in-memory list directly
> ```

**Verify before continuing:**

- [ ] `GET /api/products/search?q=laptop` returns filtered results
- [ ] `?category=electronics&min_price=100&max_price=500` stacks filters correctly
- [ ] No query params returns all 25
- [ ] Swagger UI at `http://localhost:8000/docs` shows the endpoint

---

#### Prompt 1-D — Main Entry Point

> ```
> Create `main.py` for a FastAPI application.
>
> Requirements:
>   - Import and include the products router from routers.products
>   - Mount it with prefix `/api` and tag `products`
>   - Add CORSMiddleware: allow all origins, methods, and headers (dev config)
>   - Add a root GET `/` health check that returns {"status": "ok"}
>   - App title: "Product Search API", version: "0.1.0"
> ```

**Manual test after Phase 1:**

```bash
uvicorn main:app --reload
curl "http://localhost:8000/api/products/search?q=laptop&min_price=50"
```

Expected: JSON with `results`, `total`, `query` fields.

---

### Phase 2: React TypeScript Frontend

#### Prompt 2-A — TypeScript Types

> ```
> Create `src/types/product.ts` for a React TypeScript project.
>
> Mirror the FastAPI models exactly:
>
> export interface Product {
>   id: number;
>   name: string;
>   category: string;
>   price: number;
>   description: string;
>   in_stock: boolean;
> }
>
> export interface ProductSearchParams {
>   q?: string;
>   category?: string;
>   min_price?: number;
>   max_price?: number;
> }
>
> export interface SearchResponse {
>   results: Product[];
>   total: number;
>   query: ProductSearchParams;
> }
>
> Add these utility types too:
>   - `ProductCategory` — union type of the four valid categories
>   - `SearchStatus` — union type: 'idle' | 'loading' | 'success' | 'error'
>
> No imports needed. Export everything.
> ```

---

#### Prompt 2-B — API Client

> ```
> Create `src/api/products.ts` — a typed API client for the product search endpoint.
>
> Requirements:
>   - Base URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
>   - One exported async function: `searchProducts(params: ProductSearchParams): Promise<SearchResponse>`
>   - Build the query string from params — omit undefined/null/empty values
>   - Throw a typed error if response is not ok: include status code and error body
>   - No external HTTP libraries — use native fetch only
>   - Export a custom error class `ApiError` with fields: message, status, body
>
> Import types from ../types/product.
> ```

**Why native fetch matters:** `axios` would add a dependency and hide how the request is built — which matters for testing with `msw`.

---

#### Prompt 2-C — ProductSearch Component

> ```
> Create a React TypeScript component `src/components/ProductSearch/ProductSearch.tsx`.
>
> The component should:
>
> STATE:
>   - searchQuery: string (text input)
>   - selectedCategory: ProductCategory | '' (dropdown)
>   - minPrice: string (input, convert to number on submit)
>   - maxPrice: string (input, convert to number on submit)
>   - searchStatus: SearchStatus
>   - results: Product[]
>   - totalCount: number
>   - errorMessage: string
>
> UI ELEMENTS:
>   - Text input for keyword search (label: "Search products")
>   - Dropdown for category ('', 'electronics', 'clothing', 'books', 'home')
>   - Number input for min price
>   - Number input for max price
>   - Submit button: "Search" — disabled while loading
>   - Clear/Reset button: resets all fields and results
>   - Loading state: show "Searching..." text (not a spinner)
>   - Error state: show error message in a red-bordered box
>   - Results: render a list of product cards (name, category, price, in_stock badge)
>   - Results count: "Showing X of Y products"
>   - Empty state: "No products found" when results is empty after a search
>
> BEHAVIOR:
>   - Call searchProducts() from ../../api/products on form submit
>   - Do NOT call API on every keystroke
>   - Validate: if both minPrice and maxPrice are set, minPrice must be <= maxPrice (show inline error, don't call API)
>   - Handle ApiError: show errorMessage from the error
>
> CONSTRAINTS:
>   - No UI libraries (no MUI, no Chakra) — plain HTML elements with CSS module
>   - No useEffect for the search — only fire on user action
>   - Export as named export AND default export
>   - Props: none (self-contained)
>
> Import types from ../../types/product and the API function from ../../api/products.
> ```

**Verify before continuing:**

- [ ] Component renders without props
- [ ] Search fires only on button click, not on input change
- [ ] Price validation error shows before any API call
- [ ] `data-testid` attributes present (the AI often adds these — check, and if missing, prompt for them)

**If `data-testid` attributes are missing, use this follow-up:**

> ```
> Add data-testid attributes to ProductSearch.tsx:
>   - data-testid="search-input" on the keyword input
>   - data-testid="category-select" on the category dropdown
>   - data-testid="min-price-input" on the min price input
>   - data-testid="max-price-input" on the max price input
>   - data-testid="search-button" on the submit button
>   - data-testid="reset-button" on the clear button
>   - data-testid="results-list" on the results container
>   - data-testid="result-item" on each product card
>   - data-testid="error-message" on the error box
>   - data-testid="loading-indicator" on the loading text
>   - data-testid="empty-state" on the "No products found" message
> ```

---

#### Prompt 2-D — CSS Module

> ```
> Create `src/components/ProductSearch/ProductSearch.module.css`.
>
> Style the ProductSearch component with these requirements:
>   - Clean, functional design — no frameworks
>   - Filter row: flexbox, wraps on mobile
>   - Input/select elements: consistent height (38px), border: 1px solid #ccc, border-radius: 4px
>   - Search button: blue (#0066cc), white text, hover darkens by 10%
>   - Reset button: grey, outlined (no fill)
>   - Product card: white background, subtle box-shadow, padding 16px, border-radius 6px
>   - Product card grid: CSS Grid, auto-fill columns (min 240px)
>   - In-stock badge: green background; out-of-stock badge: red background, white text, border-radius 12px
>   - Error box: red border (#cc0000), light red background (#fff0f0)
>   - Results count: muted grey text, font-size smaller than body
>   - No hardcoded px for font-sizes where rem is more appropriate
> ```

---

### Phase 3: Vitest Test Suite

This phase is where AI-generated code most commonly fails. Read this section carefully before prompting.

#### Prompt 3-A — MSW Handlers

> ```
> Create `src/mocks/handlers.ts` using Mock Service Worker (msw) v2.
>
> Set up request handlers for the product search API:
>
> Base URL: http://localhost:8000
>
> Handler 1 — success case:
>   - Intercept GET /api/products/search
>   - Read query params from the request URL
>   - Return a mock SearchResponse:
>     {
>       results: [
>         { id: 1, name: "Test Laptop", category: "electronics", price: 299.99, description: "A test laptop", in_stock: true },
>         { id: 2, name: "Test Book", category: "books", price: 14.99, description: "A test book", in_stock: false }
>       ],
>       total: 2,
>       query: { q: the q param if present, else undefined }
>     }
>   - Status 200, Content-Type application/json
>
> Handler 2 — error case (export separately as `errorHandlers`):
>   - Same URL but returns status 500 with { detail: "Internal server error" }
>   - This will be used in specific tests via server.use(errorHandlers)
>
> Use msw v2 syntax: import { http, HttpResponse } from 'msw'
> Do NOT use RestHandler or rest — that's msw v1.
> Export: export const handlers = [...]
> Export: export const errorHandlers = [...]
> ```

---

#### Prompt 3-B — MSW Server Setup

> ```
> Create `src/mocks/server.ts` for msw v2 Node.js integration with Vitest.
>
> import { setupServer } from 'msw/node'
> import { handlers } from './handlers'
>
> export const server = setupServer(...handlers)
>
> That's it — keep it minimal.
>
> Then create `vitest.setup.ts` at the project root:
>   - Import server from ./src/mocks/server
>   - beforeAll: server.listen({ onUnhandledRequest: 'error' })
>   - afterEach: server.resetHandlers()
>   - afterAll: server.close()
>   - Import '@testing-library/jest-dom/vitest' for custom matchers
>
> Also show the required vitest.config.ts settings:
>   - environment: 'jsdom'
>   - setupFiles: ['./vitest.setup.ts']
>   - globals: true
> ```

---

#### Prompt 3-C — Test Suite

> ```
> Create `src/components/ProductSearch/ProductSearch.test.tsx` using Vitest and React Testing Library.
>
> Import: render, screen, waitFor, userEvent from the appropriate packages.
> Import: server from ../../mocks/server
> Import: errorHandlers from ../../mocks/handlers
> Import: ProductSearch from ./ProductSearch
>
> Write tests for these cases:
>
> RENDERING:
>   1. "renders search form with all filter inputs" — check all inputs and buttons present
>   2. "shows empty state message initially" — no results message visible before any search
>
> SEARCH BEHAVIOR:
>   3. "calls API and displays results on search" — type in search input, click Search, await results
>   4. "shows loading state while searching" — check "Searching..." appears during fetch
>   5. "shows result count after successful search" — "Showing 2 of 2 products" text visible
>   6. "displays product name, category, price, stock status" — verify card content
>
> FILTERING:
>   7. "reset button clears all inputs and results"
>   8. "shows client-side error when min price > max price" — no API call should fire
>
> ERROR HANDLING:
>   9. "shows error message on API failure" — use server.use(...errorHandlers), verify error box visible
>
> EDGE CASES:
>   10. "shows empty state when search returns no results" — override handler to return empty results array
>
> Requirements:
>   - Use userEvent.setup() for all interactions
>   - Use data-testid selectors where available, role/label selectors otherwise
>   - Each test is independent — no shared state between tests
>   - Use waitFor() for all async assertions
>   - Do NOT use act() manually — let Testing Library handle it
>   - Do NOT use snapshot tests
> ```

---

### Phase 4: Integration & GitHub Delivery

**Prompt 4-A — CORS Proxy Config (if needed)**

> ```
> Add a Vite dev server proxy to vite.config.ts so that frontend fetch calls to /api
> are proxied to http://localhost:8000. This avoids CORS issues in development.
>
> Show the complete vite.config.ts with the proxy setting added.
> ```

**Prompt 4-B — README**

> ```
> Write a README.md for the root of the project `product-search-ai/`.
>
> Include:
>   - Project overview (2-3 sentences)
>   - Prerequisites: Python 3.11+, Node 18+
>   - Quick start: commands to run backend and frontend
>   - Running tests: vitest command
>   - Architecture decisions section: why mock data, why native fetch, why msw
>   - Known limitations
>
> Use clear markdown headers. Keep it under 250 lines.
> ```

---

## 5. Time Tracking Protocol

**Start the clock** after Phase 0 scaffolding is complete.

Log every activity in `TIME_LOG.md` as you go. Capture:

| Field        | What to Record                                |
| ------------ | --------------------------------------------- |
| Phase        | Phase number + label                          |
| Task         | Specific thing you did                        |
| Start        | HH:MM (24h)                                   |
| End          | HH:MM (24h)                                   |
| Minutes      | Calculated                                    |
| AI or Manual | Who wrote the code                            |
| Prompt #     | Which prompt from this doc                    |
| Iterations   | How many back-and-forths before usable output |
| Notes        | Bugs found, unexpected behavior, manual fixes |

**Count these separately:**

- Time spent writing/refining prompts (manual time — always)
- Time waiting for AI response (dead time — log but note separately)
- Time debugging AI output (manual time)
- Time reading docs because AI output was wrong (manual time)

---

## 6. Manual Estimate Baseline

This is what a competent mid-level developer would take working _without_ AI assistance, writing quality code, not rushing.

| Task                                   | Manual Estimate |
| -------------------------------------- | --------------- |
| Mock data (25 products)                | 10 min          |
| Pydantic models + validators           | 20 min          |
| FastAPI search router                  | 35 min          |
| FastAPI main.py + CORS                 | 10 min          |
| Backend integration test (manual curl) | 10 min          |
| TypeScript types                       | 10 min          |
| API client with error handling         | 20 min          |
| ProductSearch component                | 60 min          |
| CSS module                             | 25 min          |
| MSW handlers setup                     | 20 min          |
| Vitest config + setup                  | 15 min          |
| Test suite (10 tests)                  | 60 min          |
| README                                 | 20 min          |
| Git commits + PR structure             | 15 min          |
| **Total Manual Estimate**              | **~5.8 hours**  |

> **Important caveat:** This estimate assumes no rework, no context switching, and familiarity with all tools. Real manual time is typically 1.2–1.5× this. Adjust your comparison accordingly.

---

## 7. Benchmark Methodology & Output Doc

At the end, write `TIME_COMPARISON.md` using this structure:

```markdown
# AI vs Manual: Time Comparison Report

## Methodology

- What counts as AI-generated vs manual (link to definition in README)
- How time was tracked (TIME_LOG.md)
- Manual estimate source and assumptions
- AI model used, date, interface used

## Results Summary

| Metric                         | AI-Assisted | Manual Estimate |
| ------------------------------ | ----------- | --------------- |
| Total wall-clock time          | X hr Y min  | ~5.8 hours      |
| Time writing prompts           | X min       | N/A             |
| Time debugging AI output       | X min       | N/A             |
| Lines of code written manually | X           | ~all            |
| Number of AI iterations needed | X total     | N/A             |
| Rework required                | X instances | Typically fewer |

## Phase Breakdown

[Table with actual time per phase vs estimate]

## Where AI Won

[Specific examples of where it was faster — be precise]

## Where AI Lost

[Specific examples of where it was slower or caused rework]

## Quality Comparison

[Did the AI output have the same quality? Worse? Better? Any patterns?]

## Honest Conclusion

[Your actual conclusion — avoid hype in both directions]

## Surprise Findings

[Anything unexpected]
```

---

## 8. Failure Modes & Mitigations

| Risk                                                             | Likelihood | Mitigation                                                         |
| ---------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| AI generates msw v1 syntax instead of v2                         | High       | Prompt explicitly says v2, specify the import syntax               |
| Pydantic v1 syntax in models                                     | Medium     | Prompt specifies v2; verify `model_config` not `class Config`      |
| AI adds `axios` or `react-query` despite "no external libraries" | Medium     | Negative constraint in prompt; check `package.json` before running |
| Component uses `useEffect` for search                            | Medium     | Explicit negative constraint in prompt                             |
| Test uses `act()` manually                                       | Medium     | Explicit negative constraint; causes flaky tests                   |
| CORS errors when frontend hits backend                           | High       | Phase 4-A Vite proxy prompt handles this                           |
| AI invents types that don't match the API                        | Medium     | Prompts 2-A and 1-B mirror each other deliberately                 |
| AI generates snapshot tests                                      | Low-Medium | Explicit negative constraint                                       |
| Mock data has all products in one category                       | Low        | Prompt requires ≥5 per category                                    |
| Price validator doesn't survive Pydantic v2 upgrade              | Low        | Test it manually with `?min_price=500&max_price=100`               |

---

## 9. Negative Constraints (What to Avoid)

These are absolute. If any AI output violates them, reject and re-prompt.

**Backend:**

- Do NOT use a database, ORM, or any file I/O — mock data only
- Do NOT add authentication or API keys
- Do NOT use synchronous `time.sleep()` or blocking calls
- Do NOT use `from __future__ import annotations` (causes Pydantic v2 issues)

**Frontend:**

- Do NOT install MUI, Chakra, Ant Design, or any component library
- Do NOT use `axios` — native `fetch` only
- Do NOT fire the search API on every keystroke (no `useEffect` watching input state)
- Do NOT use `any` type in TypeScript without a comment explaining why
- Do NOT use `act()` manually in tests

**Tests:**

- Do NOT write snapshot tests
- Do NOT mock the entire `api/products` module — use msw to intercept at the network level
- Do NOT share state between tests via module-level variables
- Do NOT use `setTimeout` or `sleep` in tests — use `waitFor`

**General:**

- Do NOT commit directly to `main`
- Do NOT add `.env` files to git
- Do NOT add `console.log` statements in production code (test code is fine)

---

## 10. Testing Guide

Use this to verify the project actually works before finalizing.

### Backend Tests

```bash
cd backend
uvicorn main:app --reload

# All products
curl "http://localhost:8000/api/products/search"
# Expected: 25 results

# Keyword search
curl "http://localhost:8000/api/products/search?q=book"
# Expected: subset matching "book" in name or description

# Category filter
curl "http://localhost:8000/api/products/search?category=electronics"
# Expected: only electronics

# Price range
curl "http://localhost:8000/api/products/search?min_price=50&max_price=200"
# Expected: only products priced 50–200

# Combined
curl "http://localhost:8000/api/products/search?q=pro&category=electronics&min_price=100"
# Expected: electronics matching "pro" at ≥$100

# Validation error
curl "http://localhost:8000/api/products/search?min_price=500&max_price=100"
# Expected: 400 or 422 error response

# Docs
open http://localhost:8000/docs
# Expected: Swagger UI shows /api/products/search with query params
```

### Frontend Tests

```bash
cd frontend
npm run test
# Expected: 10 tests, all green, no console errors about unhandled requests
```

### Manual E2E

```bash
# Terminal 1
cd backend && uvicorn main:app --reload

# Terminal 2
cd frontend && npm run dev

# Browser: http://localhost:5173
# 1. Type "laptop" in search — click Search — results appear
# 2. Select "electronics" category — click Search — only electronics shown
# 3. Set min price 1000, max price 5 — click Search — inline error appears, no API call
# 4. Click Reset — form clears, results disappear
# 5. Leave all blank — click Search — all 25 products shown
```

### Definition of Done

- [ ] All 10 Vitest tests pass with `npm run test`
- [ ] Backend returns correct filtered results for all 5 curl tests above
- [ ] Frontend renders and interacts correctly in browser
- [ ] Price validation error appears client-side (no API call fired)
- [ ] Reset clears everything
- [ ] Git history has all required checkpoint commits
- [ ] `TIME_COMPARISON.md` is complete and filled with real numbers
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] No ESLint errors (if configured)

---

## 11. Prompt Chain Index

| Prompt                 | File Created                                            | Phase       |
| ---------------------- | ------------------------------------------------------- | ----------- |
| 1-A                    | `data/mock_products.py`                                 | Backend     |
| 1-B                    | `models/product.py`                                     | Backend     |
| 1-C                    | `routers/products.py`                                   | Backend     |
| 1-D                    | `main.py`                                               | Backend     |
| 2-A                    | `src/types/product.ts`                                  | Frontend    |
| 2-B                    | `src/api/products.ts`                                   | Frontend    |
| 2-C                    | `src/components/ProductSearch/ProductSearch.tsx`        | Frontend    |
| 2-D                    | `src/components/ProductSearch/ProductSearch.module.css` | Frontend    |
| 3-A                    | `src/mocks/handlers.ts`                                 | Tests       |
| 3-B                    | `src/mocks/server.ts` + `vitest.setup.ts`               | Tests       |
| 3-C                    | `src/components/ProductSearch/ProductSearch.test.tsx`   | Tests       |
| 4-A                    | `vite.config.ts` (proxy)                                | Integration |
| 4-B                    | Root `README.md`                                        | Docs        |
| Follow-up: data-testid | `ProductSearch.tsx` (amended)                           | Frontend    |

**Total distinct prompts: 13–14** depending on whether the follow-up is needed.

---

_Plan version: 1.0 | Target model: Claude Sonnet 4 | Audience: Developer executing solo_
