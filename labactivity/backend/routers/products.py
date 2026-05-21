from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import ValidationError

from data.mock_products import PRODUCTS
from models.product import Product, ProductSearchParams, SearchResponse

router = APIRouter()


def get_search_params(
    q: Annotated[Optional[str], Query()] = None,
    category: Annotated[Optional[str], Query()] = None,
    min_price: Annotated[Optional[float], Query(ge=0)] = None,
    max_price: Annotated[Optional[float], Query(ge=0)] = None,
) -> ProductSearchParams:
    try:
        return ProductSearchParams(
            q=q,
            category=category,
            min_price=min_price,
            max_price=max_price,
        )
    except ValidationError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/products/search", response_model=SearchResponse)
def search_products(
    params: Annotated[ProductSearchParams, Depends(get_search_params)],
) -> SearchResponse:
    """Search products by text, category, and optional price range."""
    if (
        params.min_price is not None
        and params.max_price is not None
        and params.max_price < params.min_price
    ):
        raise HTTPException(
            status_code=400,
            detail="max_price must be greater than or equal to min_price",
        )

    results = [Product(**product) for product in PRODUCTS]

    if params.q:
        query = params.q.lower()
        results = [
            product
            for product in results
            if query in product.name.lower() or query in product.description.lower()
        ]

    if params.category:
        results = [
            product for product in results if product.category == params.category
        ]

    if params.min_price is not None:
        results = [
            product for product in results if product.price >= params.min_price
        ]

    if params.max_price is not None:
        results = [
            product for product in results if product.price <= params.max_price
        ]

    return SearchResponse(results=results, total=len(results), query=params)
