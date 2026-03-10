import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./job_tracker.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all database tables and perform simple migrations."""
    from models import Application  # noqa: F401
    Base.metadata.create_all(bind=engine)
    
    # Simple migration for SQLite to add new columns if they don't exist
    from sqlalchemy import text
    with engine.connect() as conn:
        # Check if source column exists
        try:
            conn.execute(text("SELECT source FROM applications LIMIT 1"))
        except:
            print("Migration: Adding 'source' column to applications table")
            conn.execute(text("ALTER TABLE applications ADD COLUMN source TEXT DEFAULT 'Direct'"))
            conn.commit()

        # Check if status column exists
        try:
            conn.execute(text("SELECT status FROM applications LIMIT 1"))
        except:
            print("Migration: Adding 'status' column to applications table")
            conn.execute(text("ALTER TABLE applications ADD COLUMN status TEXT DEFAULT 'Applied'"))
            conn.commit()
            
        # Check if last_updated column exists
        try:
            conn.execute(text("SELECT last_updated FROM applications LIMIT 1"))
        except:
            print("Migration: Adding 'last_updated' column to applications table")
            conn.execute(text("ALTER TABLE applications ADD COLUMN last_updated DATETIME"))
            conn.commit()
