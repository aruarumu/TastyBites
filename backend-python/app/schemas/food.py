from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FoodBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    image: Optional[str] = None
    category_id: int
    prep_time: Optional[str] = None
    is_special: bool = False
    is_available: bool = True


class FoodCreate(FoodBase):
    pass


class FoodUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    image: Optional[str] = None
    category_id: Optional[int] = None
    prep_time: Optional[str] = None
    is_special: Optional[bool] = None
    is_available: Optional[bool] = None


class FoodResponse(FoodBase):
    id: int
    rating: float
    reviews_count: int
    created_at: datetime
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
