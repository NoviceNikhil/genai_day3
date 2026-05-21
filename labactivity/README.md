# Product Search AI

AI-assisted full-stack product search demo with a FastAPI backend and React TypeScript frontend. The backend serves a mock in-memory catalog through `GET /api/products/search`; the frontend provides keyword, category, and price filters with loading, error, empty, and result states.

## Prerequisites

- Python 3.11+
- Node 18+

## Quick Start

Run the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Running Tests

```bash
cd frontend
npm install
npm run test
```

## API Examples

```bash
curl "http://localhost:8000/api/products/search"
curl "http://localhost:8000/api/products/search?q=laptop"
curl "http://localhost:8000/api/products/search?category=electronics&min_price=100&max_price=700"
```

## Architecture Decisions

- Mock data keeps the benchmark focused on feature delivery rather than database setup.
- Native `fetch` keeps the API client small and transparent.
- MSW tests intercept real network calls, so the component is tested closer to production behavior than with module mocks.
- Vite proxies `/api` to `http://localhost:8000` during local development.

## Known Limitations

- No authentication.
- No pagination.
- No database persistence.
- No deployment or CI/CD configuration.
- GitHub repository creation and pushing are intentionally left to the project owner.
