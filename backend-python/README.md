# TastyBites - Python FastAPI Backend

A complete REST API backend for the TastyBites food delivery application built with **Python** and **FastAPI**.

## 🚀 Features

- **User Authentication** - JWT-based registration, login, and profile management
- **Order Management** - Create, view, and cancel orders
- **Admin Dashboard** - Full CRUD for foods, categories, users, and orders
- **Security** - Separate roles table prevents privilege escalation attacks

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |
| PUT | `/api/users/me` | Update profile |
| PUT | `/api/users/me/password` | Change password |

### Foods
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods` | List all foods (with filters) |
| GET | `/api/foods/categories` | List all categories |
| GET | `/api/foods/{id}` | Get single food |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create new order |
| GET | `/api/orders` | List user's orders |
| GET | `/api/orders/{id}` | Get order details |
| POST | `/api/orders/{id}/cancel` | Cancel pending order |

### Admin (Requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard statistics |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/{id}/toggle-active` | Activate/deactivate user |
| POST | `/api/admin/categories` | Create category |
| POST | `/api/admin/foods` | Create food item |
| PUT | `/api/admin/foods/{id}` | Update food item |
| DELETE | `/api/admin/foods/{id}` | Delete food item |
| GET | `/api/admin/orders` | List all orders |
| PUT | `/api/admin/orders/{id}/status` | Update order status |

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.10+
- PostgreSQL database
- pip (Python package manager)

### 2. Create Virtual Environment
```bash
cd backend-python
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
```

### 5. Create Database
```sql
-- In PostgreSQL
CREATE DATABASE tastybites;
```

### 6. Seed Database
```bash
python seed_data.py
```

### 7. Run the Server
```bash
uvicorn app.main:app --reload --port 8000
```

## 📚 API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔐 Default Credentials

| User Type | Email | Password |
|-----------|-------|----------|
| Admin | admin@tastybites.com | admin123 |
| Demo User | demo@tastybites.com | demo123 |

## 📁 Project Structure

```
backend-python/
├── app/
│   ├── __init__.py
│   ├── config.py          # Settings & environment
│   ├── database.py         # SQLAlchemy setup
│   ├── main.py             # FastAPI app entry
│   ├── models/             # SQLAlchemy models
│   │   ├── user.py
│   │   ├── food.py
│   │   └── order.py
│   ├── schemas/            # Pydantic schemas
│   │   ├── user.py
│   │   ├── food.py
│   │   └── order.py
│   ├── routers/            # API routes
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── foods.py
│   │   ├── orders.py
│   │   └── admin.py
│   └── utils/
│       ├── security.py     # JWT & password hashing
│       └── helpers.py      # Utility functions
├── requirements.txt
├── seed_data.py
├── .env.example
└── README.md
```

## 🔗 Connect to Frontend

Update your React frontend to call the Python backend:

```typescript
// src/lib/api.ts
const API_URL = 'http://localhost:8000';

export const api = {
  login: (email: string, password: string) =>
    fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),
  
  getFoods: () => 
    fetch(`${API_URL}/api/foods`).then(res => res.json()),
  
  createOrder: (orderData: any, token: string) =>
    fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    })
};
```

## 📄 License

MIT License
