import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from database import init_db
from auth import router as auth_router
from routes import router as app_router

# Initialize FastAPI
app = FastAPI(
    title="Email Job Application Tracker",
    description="Track your job applications by scanning sent emails from Gmail",
    version="1.0.0",
)

# CORS middleware
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(app_router)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    init_db()
    print("✅ Database tables initialized")
    print("🚀 Email Job Application Tracker API is running!")


@app.get("/")
async def root():
    return {
        "app": "Email Job Application Tracker",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "auth_login": "/auth/login",
            "auth_status": "/auth/status",
            "sync_emails": "/sync-emails",
            "applications_count": "/applications/count",
            "applications": "/applications",
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
