from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.products import router as products_router

app = FastAPI(title="Product Search API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router, prefix="/api", tags=["products"])


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
