from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database import get_db
from models import Application
from gmail_service import fetch_emails
from ai_parser import extract_application_info

router = APIRouter(tags=["Applications"])


@router.get("/sync-emails")
async def sync_emails(db: Session = Depends(get_db)):
    """
    Sync emails from Gmail (SENT and INBOX).
    """
    try:
        from gmail_service import fetch_emails
        emails = fetch_emails(max_results=500)
        
        # Debug printing
        sent_fetched = len([e for e in emails if e.get("folder") == "SENT"])
        inbox_fetched = len([e for e in emails if e.get("folder") == "INBOX"])
        print(f"--- SYNC DEBUG --- Fetched {len(emails)} total (SENT: {sent_fetched}, INBOX: {inbox_fetched})")

        if not emails:
            return {"message": "No emails found", "new": 0, "updated": 0}

        new_count = 0
        updated_count = 0
        error_count = 0

        for email_data in emails:
            try:
                # Map 'contact_email' to expected AI field for compatibility
                email_for_ai = {**email_data, "recipient": email_data["contact_email"]}
                app_info = extract_application_info(email_for_ai)
                
                if not app_info:
                    error_count += 1
                    continue

                if not app_info.get("is_valid_application", True):
                    print(f"Skipping promotional/invalid email: {email_data.get('subject')}")
                    continue

                company = app_info.get("company", "Unknown")
                email = app_info.get("hr_email", email_data["contact_email"])
                
                print(f"Processing {email_data['folder']} email for {company} ({email})")

                # Check if application already exists
                existing_app = db.query(Application).filter(
                    Application.company_name == company,
                    Application.hr_email == email
                ).first()

                if existing_app:
                    # Update status if it's an INBOX email
                    if email_data["folder"] == "INBOX":
                        existing_app.status = app_info.get("status", "Replied/Update")
                        db.commit()
                        updated_count += 1
                    continue

                # Create new application
                date_applied = None
                if app_info.get("date"):
                    try:
                        date_applied = datetime.strptime(app_info["date"], "%Y-%m-%d")
                    except:
                        pass

                new_app = Application(
                    company_name=company,
                    hr_email=email,
                    role=app_info.get("role", "Unknown"),
                    date_applied=date_applied,
                    email_subject=email_data.get("subject", ""),
                    email_body=email_data.get("body", "")[:5000],
                    status=app_info.get("status", "Applied"),
                    source=email_data.get("source", "Direct")
                )

                db.add(new_app)
                db.commit()
                new_count += 1

            except Exception as e:
                print(f"Error processing email: {e}")
                db.rollback()
                error_count += 1

        return {
            "message": "Sync completed",
            "new": new_count,
            "updated": updated_count,
            "errors": error_count,
            "total": len(emails)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync emails: {str(e)}")


@router.get("/applications/count")
async def get_applications_count(db: Session = Depends(get_db)):
    """Get total count of tracked applications, separated by source."""
    total = db.query(Application).count()
    direct = db.query(Application).filter(Application.source == "Direct").count()
    portal = db.query(Application).filter(Application.source == "Portal").count()
    return {
        "total_applications": total,
        "direct_count": direct,
        "portal_count": portal
    }


@router.get("/applications")
async def get_applications(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by company name"),
    source: Optional[str] = Query(None, description="Filter by source (Direct or Portal)"),
    db: Session = Depends(get_db),
):
    """
    Get all tracked applications with pagination and search.
    """
    query = db.query(Application)

    # Apply search filter
    if search:
        query = query.filter(Application.company_name.ilike(f"%{search}%"))

    # Apply source filter
    if source:
        query = query.filter(Application.source == source)

    # Get total count for pagination
    total = query.count()

    # Apply pagination
    offset = (page - 1) * page_size
    applications = (
        query.order_by(Application.date_applied.desc().nullslast())
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "applications": [app.to_dict() for app in applications],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size if total > 0 else 0,
    }


@router.delete("/applications/{app_id}")
async def delete_application(app_id: str, db: Session = Depends(get_db)):
    """Delete a specific application."""
    application = db.query(Application).filter(Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(application)
    db.commit()
    return {"message": "Application deleted successfully"}
