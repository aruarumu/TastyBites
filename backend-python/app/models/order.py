from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class PaymentMethod(str, enum.Enum):
    CARD = "card"
    PAYPAL = "paypal"
    COD = "cod"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Delivery Address
    delivery_address = Column(String(500), nullable=False)
    delivery_city = Column(String(100), nullable=False)
    delivery_zip = Column(String(20), nullable=False)
    delivery_phone = Column(String(20), nullable=False)
    
    # Order Details
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, default=4.99)
    tax = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    
    # Payment
    payment_method = Column(Enum(PaymentMethod), default=PaymentMethod.COD)
    
    # Status
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    delivered_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    food_id = Column(Integer, ForeignKey("foods.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price at time of order
    
    # Relationships
    order = relationship("Order", back_populates="items")
    food = relationship("Food", back_populates="order_items")
