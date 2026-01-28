from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.models.user import User, Role, UserRole
from app.models.food import Food, Category
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.user import UserResponse
from app.schemas.food import FoodCreate, FoodUpdate, FoodResponse, CategoryCreate, CategoryResponse
from app.schemas.order import OrderResponse, OrderUpdate, OrderItemResponse
from app.utils.security import require_admin

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# ==================== Dashboard Stats ====================

@router.get("/dashboard")
def get_dashboard_stats(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics"""
    # Total users
    total_users = db.query(func.count(User.id)).scalar()
    
    # Total orders
    total_orders = db.query(func.count(Order.id)).scalar()
    
    # Total revenue
    total_revenue = db.query(func.sum(Order.total)).filter(
        Order.status != OrderStatus.CANCELLED
    ).scalar() or 0
    
    # Orders by status
    orders_by_status = dict(
        db.query(Order.status, func.count(Order.id))
        .group_by(Order.status)
        .all()
    )
    
    # Recent orders
    recent_orders = db.query(Order).order_by(
        Order.created_at.desc()
    ).limit(5).all()
    
    # Top selling foods
    top_foods = db.query(
        Food.name,
        func.sum(OrderItem.quantity).label("total_sold")
    ).join(OrderItem).group_by(Food.id).order_by(
        func.sum(OrderItem.quantity).desc()
    ).limit(5).all()
    
    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": round(total_revenue, 2),
        "orders_by_status": {str(k.value): v for k, v in orders_by_status.items()},
        "recent_orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "total": o.total,
                "status": o.status.value,
                "created_at": o.created_at.isoformat()
            }
            for o in recent_orders
        ],
        "top_selling_foods": [
            {"name": name, "total_sold": int(total)} 
            for name, total in top_foods
        ]
    }


# ==================== Users Management ====================

@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    query = db.query(User)
    
    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (User.email.ilike(search_term)) |
            (User.first_name.ilike(search_term)) |
            (User.last_name.ilike(search_term))
        )
    
    users = query.offset(skip).limit(limit).all()
    
    return [
        UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone,
            address=user.address,
            city=user.city,
            zip_code=user.zip_code,
            is_active=user.is_active,
            created_at=user.created_at,
            roles=[r.role.value for r in user.roles]
        )
        for user in users
    ]


@router.put("/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Toggle user active status"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    db.commit()
    
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}"}


@router.post("/users/{user_id}/make-admin")
def make_user_admin(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Grant admin role to a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already admin
    existing_role = db.query(Role).filter(
        Role.user_id == user_id,
        Role.role == UserRole.ADMIN
    ).first()
    
    if existing_role:
        raise HTTPException(status_code=400, detail="User is already an admin")
    
    new_role = Role(user_id=user_id, role=UserRole.ADMIN)
    db.add(new_role)
    db.commit()
    
    return {"message": "Admin role granted"}


# ==================== Categories Management ====================

@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(
    category_data: CategoryCreate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create a new category"""
    existing = db.query(Category).filter(Category.name == category_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    
    category = Category(**category_data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return category


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete a category"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has foods
    foods_count = db.query(func.count(Food.id)).filter(Food.category_id == category_id).scalar()
    if foods_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category with {foods_count} food items"
        )
    
    db.delete(category)
    db.commit()
    
    return {"message": "Category deleted"}


# ==================== Foods Management ====================

@router.get("/foods", response_model=list[FoodResponse])
def get_all_foods_admin(
    include_unavailable: bool = Query(True),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all foods including unavailable ones"""
    query = db.query(Food)
    
    if not include_unavailable:
        query = query.filter(Food.is_available == True)
    
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


@router.post("/foods", response_model=FoodResponse, status_code=201)
def create_food(
    food_data: FoodCreate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Create a new food item"""
    # Verify category exists
    category = db.query(Category).filter(Category.id == food_data.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    food = Food(**food_data.model_dump())
    db.add(food)
    db.commit()
    db.refresh(food)
    
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
            id=category.id,
            name=category.name,
            description=category.description,
            created_at=category.created_at
        )
    )


@router.put("/foods/{food_id}", response_model=FoodResponse)
def update_food(
    food_id: int,
    food_data: FoodUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update a food item"""
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    update_data = food_data.model_dump(exclude_unset=True)
    
    if "category_id" in update_data:
        category = db.query(Category).filter(Category.id == update_data["category_id"]).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
    
    for field, value in update_data.items():
        setattr(food, field, value)
    
    db.commit()
    db.refresh(food)
    
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


@router.delete("/foods/{food_id}")
def delete_food(
    food_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Delete a food item"""
    food = db.query(Food).filter(Food.id == food_id).first()
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    db.delete(food)
    db.commit()
    
    return {"message": "Food deleted"}


# ==================== Orders Management ====================

@router.get("/orders", response_model=list[OrderResponse])
def get_all_orders(
    status: Optional[OrderStatus] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get all orders (admin only)"""
    query = db.query(Order)
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        OrderResponse(
            id=order.id,
            order_number=order.order_number,
            user_id=order.user_id,
            delivery_address=order.delivery_address,
            delivery_city=order.delivery_city,
            delivery_zip=order.delivery_zip,
            delivery_phone=order.delivery_phone,
            subtotal=order.subtotal,
            delivery_fee=order.delivery_fee,
            tax=order.tax,
            total=order.total,
            payment_method=order.payment_method,
            notes=order.notes,
            status=order.status,
            created_at=order.created_at,
            updated_at=order.updated_at,
            delivered_at=order.delivered_at,
            items=[
                OrderItemResponse(
                    id=item.id,
                    food_id=item.food_id,
                    quantity=item.quantity,
                    price=item.price,
                    food_name=item.food.name if item.food else None
                )
                for item in order.items
            ]
        )
        for order in orders
    ]


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    order_update: OrderUpdate,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update order status"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order_update.status:
        order.status = order_update.status
        if order_update.status == OrderStatus.DELIVERED:
            order.delivered_at = datetime.utcnow()
    
    if order_update.notes is not None:
        order.notes = order_update.notes
    
    db.commit()
    
    return {"message": f"Order status updated to {order.status.value}"}
