from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, users, foods, orders, admin

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="TastyBites Food Delivery API - Python FastAPI Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "https://id-preview--5b320ee0-4457-41a6-8de9-a4efc0a8f608.lovable.app",
        "*"  # In production, replace with specific origins
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(foods.router)
app.include_router(orders.router)
app.include_router(admin.router)


@app.get("/")
def root():
    """API Root - Health check"""
    return {
        "message": "Welcome to TastyBites API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "healthy"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "tastybites-api"}
