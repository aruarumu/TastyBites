import random
import string
from datetime import datetime


def generate_order_number() -> str:
    """Generate a unique order number"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M")
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"TB-{timestamp}-{random_suffix}"


def calculate_tax(subtotal: float, tax_rate: float = 0.08) -> float:
    """Calculate tax amount"""
    return round(subtotal * tax_rate, 2)


def calculate_order_total(subtotal: float, delivery_fee: float = 4.99, tax_rate: float = 0.08) -> dict:
    """Calculate order totals"""
    tax = calculate_tax(subtotal, tax_rate)
    total = round(subtotal + delivery_fee + tax, 2)
    return {
        "subtotal": round(subtotal, 2),
        "delivery_fee": delivery_fee,
        "tax": tax,
        "total": total
    }
