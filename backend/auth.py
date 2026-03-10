import os
import json
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from google_auth_oauthlib.flow import Flow
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

router = APIRouter(prefix="/auth", tags=["Authentication"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/callback")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

# In-memory token storage (in production, use a database or encrypted session)
token_store = {}


def get_flow():
    """Create and return a Google OAuth2 flow."""
    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uris": [GOOGLE_REDIRECT_URI],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
        }
    }
    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )
    return flow


@router.get("/login")
async def login():
    """Redirect user to Google OAuth login page."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
        )

    flow = get_flow()
    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
    )
    # Store state and code_verifier for verification (PKCE)
    token_store["oauth_state"] = state
    token_store["code_verifier"] = flow.code_verifier
    return RedirectResponse(url=authorization_url)


@router.get("/callback")
async def callback(request: Request):
    """Handle Google OAuth callback."""
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code not found")

    try:
        flow = get_flow()
        # Retrieve the code_verifier we stored in the /login step
        code_verifier = token_store.get("code_verifier")
        flow.fetch_token(code=code, code_verifier=code_verifier)
        credentials = flow.credentials

        # Store credentials
        token_store["credentials"] = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": list(credentials.scopes),
        }

        # Redirect back to frontend with success
        return RedirectResponse(url=f"{FRONTEND_URL}?auth=success")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to authenticate: {str(e)}")


@router.get("/status")
async def auth_status():
    """Check if user is authenticated."""
    is_authenticated = "credentials" in token_store and token_store["credentials"].get("token")
    return {"authenticated": bool(is_authenticated)}


@router.post("/logout")
async def logout():
    """Clear stored credentials."""
    token_store.clear()
    return {"message": "Logged out successfully"}


def get_credentials():
    """Get stored Google credentials."""
    creds_data = token_store.get("credentials")
    if not creds_data:
        return None

    from google.oauth2.credentials import Credentials
    credentials = Credentials(
        token=creds_data["token"],
        refresh_token=creds_data.get("refresh_token"),
        token_uri=creds_data["token_uri"],
        client_id=creds_data["client_id"],
        client_secret=creds_data["client_secret"],
        scopes=creds_data.get("scopes"),
    )
    return credentials
