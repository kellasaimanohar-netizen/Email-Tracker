# 📧 Email Job Application Tracker

A full-stack application that connects to your Gmail account, scans sent emails for job applications, uses AI to extract company details, and presents a beautiful dashboard to track your job search progress.

![Tech Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=google&logoColor=white)

---

## ✨ Features

- **Google OAuth2 Authentication** — Securely connect your Gmail account
- **Smart Email Scanning** — Fetches last 500 sent emails and filters job applications
- **AI-Powered Extraction** — Uses Google Gemini to extract company name, role, HR email, and date
- **Duplicate Detection** — Prevents duplicate entries using company + HR email uniqueness
- **Interactive Dashboard** — View total applications with click-to-expand details
- **Company Table** — Searchable, paginated table of all tracked applications
- **Email Resync** — Re-scan emails anytime to catch new applications
- **Premium Dark UI** — Glassmorphism design with smooth animations

---

## 📁 Project Structure

```
Job Application/
├── .env                          # Environment variables
├── .env.example                  # Environment variable template
├── .gitignore
├── README.md
│
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── auth.py                   # Google OAuth2 authentication
│   ├── gmail_service.py          # Gmail API email fetching
│   ├── ai_parser.py              # Gemini extraction logic
│   ├── database.py               # SQLAlchemy DB configuration (SQLite)
│   ├── models.py                 # Database models
│   ├── routes.py                 # API endpoints
│   └── requirements.txt          # Python dependencies
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   └── vite.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js                # Axios API client
        ├── index.css             # Global styles + Tailwind
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Table.jsx
        │   └── Pagination.jsx
        └── pages/
            ├── Dashboard.jsx
            └── Companies.jsx
```

---

## 🔧 Prerequisites

Before you begin, make sure you have:

1. **Python 3.9+** installed
2. **Node.js 18+** and **npm** installed
3. **Google Cloud Console** project with Gmail API enabled
4. **Google Gemini API Key**

---

## 🚀 Setup Instructions

### 1. Clone and Configure Environment

```bash
# Navigate to the project
cd "Job Application"

# Copy the example env file
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/callback
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=sqlite:///./job_tracker.db
SECRET_KEY=generate_a_random_secret_key
FRONTEND_URL=http://localhost:5173
```

---

### 2. Set Up Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing one)
3. Enable the **Gmail API**:
   - Go to **APIs & Services → Library**
   - Search for "Gmail API" and enable it
4. Create **OAuth 2.0 Credentials**:
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:8000/auth/callback`
5. Copy the **Client ID** and **Client Secret** to your `.env` file
6. Configure the **OAuth Consent Screen**:
   - Go to **APIs & Services → OAuth consent screen**
   - Add test users (your Gmail address)
   - Add scope: `https://www.googleapis.com/auth/gmail.readonly`

---

### 3. Set Up Backend

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

The database (`job_tracker.db`) will be automatically created in the backend directory when you start the server.

The backend API will be running at: **http://localhost:8000**

API Documentation (auto-generated): **http://localhost:8000/docs**

---

### 4. Set Up Frontend

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at: **http://localhost:5173**

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/auth/login` | Redirect to Google OAuth login |
| `GET` | `/auth/callback` | Handle OAuth callback |
| `GET` | `/auth/status` | Check authentication status |
| `POST` | `/auth/logout` | Clear stored credentials |
| `GET` | `/sync-emails` | Fetch & process emails from Gmail |
| `GET` | `/applications/count` | Get total application count |
| `GET` | `/applications` | List applications (paginated + search) |
| `DELETE` | `/applications/{id}` | Delete a specific application |

### Query Parameters for `/applications`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `page_size` | int | 20 | Items per page (max 100) |
| `search` | string | null | Search by company name |

---

## 🗄️ Database Schema (SQLite)

```sql
CREATE TABLE applications (
    id VARCHAR(36) PRIMARY KEY,
    company_name TEXT NOT NULL,
    hr_email TEXT NOT NULL,
    role TEXT,
    date_applied DATETIME,
    email_subject TEXT,
    email_body TEXT,
    UNIQUE (company_name, hr_email)
);
```

> **Note:** The table is automatically created via SQLAlchemy when the backend starts.

---

## 🔄 How It Works

1. **User connects Gmail** → Clicks "Sign in with Google" → OAuth2 flow
2. **User clicks "Sync Emails"** → Backend fetches last 500 sent emails
3. **Keyword filtering** → Emails are filtered for job-related keywords
4. **AI extraction** → Matching emails are sent to Google Gemini for structured data extraction
5. **Database storage** → Extracted data is saved in SQLite (duplicates are skipped)
6. **Dashboard display** → Frontend shows count + detailed table view

---

## 🛠️ Development Notes

- **Token Storage**: Currently uses in-memory storage. For production, store tokens in the database or encrypted sessions.
- **Rate Limiting**: Be mindful of Gmail API and Gemini API rate limits during sync.
- **CORS**: Backend allows requests from `http://localhost:5173` and `http://localhost:3000`.

---

## 📝 License

MIT License — feel free to use and modify.
