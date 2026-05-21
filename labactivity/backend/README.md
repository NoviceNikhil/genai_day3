# Product Search API

FastAPI backend for the AI-assisted product search feature. It exposes `GET /api/products/search` and filters an in-memory product list by keyword, category, and price range.

## Run

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Example

```bash
curl "http://localhost:8000/api/products/search?q=laptop&min_price=50"
```
