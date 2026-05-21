from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


VALID_CATEGORIES = {"electronics", "clothing", "books", "home"}


class Product(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: int
    name: str
    category: str
    price: float
    description: str
    in_stock: bool


class ProductSearchParams(BaseModel):
    model_config = ConfigDict(extra="forbid")

    q: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = Field(default=None, ge=0)
    max_price: Optional[float] = Field(default=None, ge=0)

    @field_validator("category")
    @classmethod
    def normalize_category(cls, value: Optional[str]) -> Optional[str]:
        if value is None or value == "":
            return None

        normalized = value.lower()
        if normalized not in VALID_CATEGORIES:
            valid = ", ".join(sorted(VALID_CATEGORIES))
            raise ValueError(f"category must be one of: {valid}")
        return normalized

    @model_validator(mode="after")
    def validate_price_range(self) -> "ProductSearchParams":
        if (
            self.min_price is not None
            and self.max_price is not None
            and self.max_price < self.min_price
        ):
            raise ValueError("max_price must be greater than or equal to min_price")
        return self


class SearchResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    results: List[Product]
    total: int
    query: ProductSearchParams
