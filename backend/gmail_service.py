import base64
import re
from datetime import datetime
from typing import List, Dict, Optional
from googleapiclient.discovery import build
from auth import get_credentials


# Keywords that indicate job application emails
JOB_KEYWORDS = [
    "application", "resume", "cv", "job", "position", "hiring",
    "recruitment", "career", "opportunity", "apply", "applying",
    "candidate", "cover letter", "job opening", "vacancy",
]


def get_gmail_service():
    """Build and return Gmail API service."""
    credentials = get_credentials()
    if not credentials:
        raise Exception("Not authenticated. Please login first via /auth/login")
    service = build("gmail", "v1", credentials=credentials)
    return service


def fetch_emails(max_results: int = 500) -> List[Dict]:
    """
    Fetch both sent and received emails from Gmail.
    """
    service = get_gmail_service()
    emails = []
    
    # Construct a search query to pre-filter emails in Gmail and save API calls/time
    search_query = " OR ".join([f'"{kw}"' for kw in JOB_KEYWORDS])
    
    # We'll fetch from both SENT and INBOX
    for label in ["SENT", "INBOX"]:
        next_page_token = None
        fetched = 0
        limit = max_results // 2  # Split quota between sent and received

        while fetched < limit:
            batch_size = min(100, limit - fetched)
            results = service.users().messages().list(
                userId="me",
                labelIds=[label],
                q=search_query,
                maxResults=batch_size,
                pageToken=next_page_token,
            ).execute()

            messages = results.get("messages", [])
            if not messages:
                break

            for msg_meta in messages:
                try:
                    msg = service.users().messages().get(
                        userId="me",
                        id=msg_meta["id"],
                        format="full",
                    ).execute()

                    email_data = parse_email(msg, folder=label)
                    if email_data and is_job_application(email_data):
                        emails.append(email_data)

                except Exception as e:
                    print(f"Error fetching email {msg_meta['id']}: {e}")
                    continue

            fetched += len(messages)
            next_page_token = results.get("nextPageToken")
            if not next_page_token:
                break

    return emails


def parse_email(message: dict, folder: str = "SENT") -> Optional[Dict]:
    """Parse a Gmail message into a structured dictionary."""
    headers = message.get("payload", {}).get("headers", [])

    subject = ""
    to_email = ""
    from_email = ""
    date_str = ""

    for header in headers:
        name = header.get("name", "").lower()
        if name == "subject":
            subject = header.get("value", "")
        elif name == "to":
            to_email = header.get("value", "")
        elif name == "from":
            from_email = header.get("value", "")
        elif name == "date":
            date_str = header.get("value", "")

    # For SENT, we care about 'to'. For INBOX, we care about 'from' (the company)
    contact_email = to_email if folder == "SENT" else from_email

    # Extract body
    body = extract_body(message.get("payload", {}))

    # Parse date
    date = parse_date(date_str)

    if not contact_email:
        return None

    # Clean the contact email (use simple regex to extract email between < > if needed)
    email_match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', contact_email)
    clean_email = email_match.group(0) if email_match else contact_email

    # Determine source (Direct if SENT, Portal if INBOX)
    source = "Direct" if folder == "SENT" else "Portal"

    return {
        "contact_email": clean_email,
        "subject": subject,
        "body": body[:5000] if body else "",  # Limit body size
        "date": date,
        "folder": folder,
        "source": source,
    }


def extract_body(payload: dict) -> str:
    """Extract plain text body from email payload."""
    body = ""

    if payload.get("body", {}).get("data"):
        body = base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", errors="ignore")
    elif payload.get("parts"):
        for part in payload["parts"]:
            mime_type = part.get("mimeType", "")
            if mime_type == "text/plain" and part.get("body", {}).get("data"):
                body = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="ignore")
                break
            elif mime_type == "text/html" and part.get("body", {}).get("data") and not body:
                html = base64.urlsafe_b64decode(part["body"]["data"]).decode("utf-8", errors="ignore")
                # Strip HTML tags for plain text
                body = re.sub(r'<[^>]+>', ' ', html)
                body = re.sub(r'\s+', ' ', body).strip()
            elif part.get("parts"):
                body = extract_body(part)
                if body:
                    break

    return body


def parse_date(date_str: str) -> Optional[str]:
    """Parse email date string to ISO format."""
    if not date_str:
        return None

    # Common email date formats
    formats = [
        "%a, %d %b %Y %H:%M:%S %z",
        "%d %b %Y %H:%M:%S %z",
        "%a, %d %b %Y %H:%M:%S",
        "%Y-%m-%dT%H:%M:%S",
    ]

    for fmt in formats:
        try:
            dt = datetime.strptime(date_str.strip(), fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue

    # Try to extract date with regex
    match = re.search(r'(\d{1,2}\s+\w+\s+\d{4})', date_str)
    if match:
        try:
            dt = datetime.strptime(match.group(1), "%d %b %Y")
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            pass

    return None


def is_job_application(email_data: Dict) -> bool:
    """Check if an email is likely a job application based on keywords."""
    text = f"{email_data.get('subject', '')} {email_data.get('body', '')}".lower()
    return any(keyword in text for keyword in JOB_KEYWORDS)
