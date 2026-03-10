import sqlite3
from ai_parser import extract_application_info, genai, GEMINI_API_KEY
from sqlalchemy.orm import Session
from database import get_db, SessionLocal
from models import Application
import json

def clean_database():
    print("Connecting to database...")
    db = SessionLocal()
    applications = db.query(Application).all()
    print(f"Total applications found: {len(applications)}")
    
    deleted_count = 0
    kept_count = 0
    
    for app in applications:
        # Create a mock email_data to pass to AI parser
        email_data = {
            "subject": app.email_subject,
            "body": app.email_body,
            "recipient": app.hr_email,
            "date": app.date_applied.strftime("%Y-%m-%d") if app.date_applied else "",
            "folder": "INBOX" # Dummy folder
        }
        
        print(f"\nEvaluating: '{app.email_subject}'")
        app_info = extract_application_info(email_data)
        
        if app_info and not app_info.get("is_valid_application", True):
            print(f"  -> Marked as promotional/invalid. DELETING.")
            db.delete(app)
            deleted_count += 1
        else:
            print(f"  -> Valid application. KEEPING.")
            kept_count += 1
            
    db.commit()
    db.close()
    
    print("\n--- Summary ---")
    print(f"Deleted promotional/invalid: {deleted_count}")
    print(f"Kept valid applications: {kept_count}")

if __name__ == '__main__':
    clean_database()
