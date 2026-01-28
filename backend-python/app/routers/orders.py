from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.models.food import Food
from app.models.order import Order, OrderItem, OrderStatus
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from app.utils.security import get_current_user
from app.utils.helpers import generate_order_number, calculate_order_total

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must have at least one item"
        )
    
    # Calculate subtotal from items
    subtotal = 0.0
    order_items = []
    
    for item in order_data.items:
        food = db.query(Food).filter(Food.id == item.food_id).first()
        if not food:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food with ID {item.food_id} not found"
            )
        if not food.is_available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{food.name} is currently unavailable"
            )
        
        item_total = food.price * item.quantity
        subtotal += item_total
        order_items.append({
            "food": food,
            "quantity": item.quantity,
            "price": food.price
        })
    
    # Calculate totals
    totals = calculate_order_total(subtotal)
    
    # Create order
    new_order = Order(
        order_number=generate_order_number(),
        user_id=current_user.id,
        delivery_address=order_data.delivery_address,
        delivery_city=order_data.delivery_city,
        delivery_zip=order_data.delivery_zip,
        delivery_phone=order_data.delivery_phone,
        subtotal=totals["subtotal"],
        delivery_fee=totals["delivery_fee"],
        tax=totals["tax"],
        total=totals["total"],
        payment_method=order_data.payment_method,
        notes=order_data.notes,
        status=OrderStatus.PENDING
    )
    
    db.add(new_order)
    db.flush()  # Get order ID
    
    # Create order items
    for item_data in order_items:
        order_item = OrderItem(
            order_id=new_order.id,
            food_id=item_data["food"].id,
            quantity=item_data["quantity"],
            price=item_data["price"]
        )
        db.add(order_item)
    
    db.commit()
    db.refresh(new_order)
    
    # Build response
    items_response = [
        OrderItemResponse(
            id=item.id,
            food_id=item.food_id,
            quantity=item.quantity,
            price=item.price,
            food_name=item.food.name if item.food else None
        )
        for item in new_order.items
    ]
    
    return OrderResponse(
        id=new_order.id,
        order_number=new_order.order_number,
        user_id=new_order.user_id,
        delivery_address=new_order.delivery_address,
        delivery_city=new_order.delivery_city,
        delivery_zip=new_order.delivery_zip,
        delivery_phone=new_order.delivery_phone,
        subtotal=new_order.subtotal,
        delivery_fee=new_order.delivery_fee,
        tax=new_order.tax,
        total=new_order.total,
        payment_method=new_order.payment_method,
        notes=new_order.notes,
        status=new_order.status,
        created_at=new_order.created_at,
        updated_at=new_order.updated_at,
        delivered_at=new_order.delivered_at,
        items=items_response
    )


@router.get("/", response_model=list[OrderResponse])
def get_my_orders(
    status: Optional[OrderStatus] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's orders"""
    query = db.query(Order).filter(Order.user_id == current_user.id)
    
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


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    return OrderResponse(
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


@router.post("/{order_id}/cancel")
def cancel_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Cancel an order (only if pending)"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be cancelled"
        )
    
    order.status = OrderStatus.CANCELLED
    db.commit()
    
    return {"message": "Order cancelled successfully"}
