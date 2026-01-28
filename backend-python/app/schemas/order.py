from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.order import OrderStatus, PaymentMethod


class OrderItemBase(BaseModel):
    food_id: int
    quantity: int
    price: float


class OrderItemCreate(BaseModel):
    food_id: int
    quantity: int


class OrderItemResponse(OrderItemBase):
    id: int
    food_name: Optional[str] = None

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    delivery_address: str
    delivery_city: str
    delivery_zip: str
    delivery_phone: str
    payment_method: PaymentMethod = PaymentMethod.COD
    notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: list[OrderItemCreate]


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    notes: Optional[str] = None


class OrderResponse(OrderBase):
    id: int
    order_number: str
    user_id: int
    subtotal: float
    delivery_fee: float
    tax: float
    total: float
    status: OrderStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True
