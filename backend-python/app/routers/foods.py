from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.food import Food, Category
from app.schemas.food import FoodResponse, CategoryResponse

router = APIRouter(prefix="/api/foods", tags=["Foods"])


@router.get("/", response_model=list[FoodResponse])
def get_foods(
    category: Optional[str] = Query(None, description="Filter by category name"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    is_special: Optional[bool] = Query(None, description="Filter special items"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all foods with optional filters"""
    query = db.query(Food).filter(Food.is_available == True)
    
    if category and category != "All":
        query = query.join(Category).filter(Category.name == category)
    
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (Food.name.ilike(search_term)) | 
            (Food.description.ilike(search_term))
        )
    
    if is_special is not None:
        query = query.filter(Food.is_special == is_special)
    
    foods = query.offset(skip).limit(limit).all()
    
    return [
        FoodResponse(
            id=food.id,
            name=food.name,
            description=food.description,
            price=food.price,
            original_price=food.original_price,
            image=food.image,
            category_id=food.category_id,
            prep_time=food.prep_time,
            is_special=food.is_special,
            is_available=food.is_available,
            rating=food.rating,
            reviews_count=food.reviews_count,
            created_at=food.created_at,
            category=CategoryResponse(
                id=food.category.id,
                name=food.category.name,
                description=food.category.description,
                created_at=food.category.created_at
            ) if food.category else None
        )
        for food in foods
    ]


@router.get("/categories", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Get all food categories"""
    categories = db.query(Category).all()
    return categories


@router.get("/{food_id}", response_model=FoodResponse)
def get_food(food_id: int, db: Session = Depends(get_db)):
    """Get a specific food by ID"""
    food = db.query(Food).filter(Food.id == food_id).first()
    
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food not found"
        )
    
    return FoodResponse(
        id=food.id,
        name=food.name,
        description=food.description,
        price=food.price,
        original_price=food.original_price,
        image=food.image,
        category_id=food.category_id,
        prep_time=food.prep_time,
        is_special=food.is_special,
        is_available=food.is_available,
        rating=food.rating,
        reviews_count=food.reviews_count,
        created_at=food.created_at,
        category=CategoryResponse(
            id=food.category.id,
            name=food.category.name,
            description=food.category.description,
            created_at=food.category.created_at
        ) if food.category else None
    )
