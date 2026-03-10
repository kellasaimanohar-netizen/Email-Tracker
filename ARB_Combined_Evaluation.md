## ⚡ Adani Landed Tariff Platform — ARB Combined Evaluation & Submission Document  

> This merged document consolidates `ARB_Evaluation_Document1.md` and `ARB_Submission_Landed_Tariff2.md`.  
> Where the two differed, the **current codebase (monorepo at `d:\Landed Tariff`)** is treated as the source of truth, and the earlier full automation stack (Selenium + PostgreSQL pipeline) is captured as **legacy / future-state capability**.

---

## ═══════════════════════════════════════════════  
## SLIDE 1 — COVER PAGE  
## ═══════════════════════════════════════════════  

| Field | Value |
|---|---|
| **Date of Submission** | 10 March 2026 |
| **Project Title** | Adani Landed Tariff Intelligence Platform / **Landed Tariff AI — Automated Electricity Tariff Extraction & Analytics Platform** |
| **BU / Function** | ⚠️ TO BE CONFIRMED — (e.g., Adani Green Energy Ltd (AGEL) / Energy Operations & Business Analytics / Power Trading / Renewables) |
| **CIO / CDO Name** | ⚠️ TO BE CONFIRMED |
| **Project Lead / IT Owner** | ⚠️ TO BE CONFIRMED |
| **Business Sponsor / Functional Owner** | ⚠️ TO BE CONFIRMED |

---

## ═══════════════════════════════════════════════  
## SLIDES 2–3 — PRE-SUBMISSION CHECKLIST  
## ═══════════════════════════════════════════════  

> Responses are based on the current monorepo implementation (`d:\Landed Tariff`) and the earlier full automation backend (`d:\landed-Tariff-Ai-backend`). Items with ⚠️ require BU / CISO confirmation.

| # | Checklist Item | Status | Remarks |
|---|---|---|---|
| 1 | Checked in APM that no existing solution can be leveraged? | **Yes** | No existing Adani tool consolidates state-wise SERC tariff data from 7+ portals into a single analytics dashboard with automated extraction. |
| 2 | BRD available and signed off by BU stakeholders/owners? | ⚠️ TO BE CONFIRMED | Functional needs are captured in code and screens; formal BRD sign‑off to be confirmed. |
| 3 | Business needs categorized into "must have" and "good to have"? | **Yes** | Prioritized as P1–P4 (see Slide 9 — combined requirements). |
| 4 | Functional evaluation completed against BRD and rankings established? | ⚠️ TO BE CONFIRMED | Core dashboard and data APIs validated against extraction/aggregation needs; formal sign‑off pending. |
| 5 | Partner responses to Technology questionnaire attached? | **NA** | In‑house development; no external OEM/ISV. |
| 6 | CIA (Confidentiality–Integrity–Availability) aspects captured? | **Yes** | See Slide 23; CIA rating: Confidentiality **Low**, Integrity **Medium**, Availability **Medium** (public tariff data used for internal decisions). |
| 7 | As-is architecture provided? | **Yes** | See Slide 13 (manual multi‑state spreadsheet process). |
| 8 | BU landscape diagram provided? | ⚠️ TO BE CONFIRMED | Logical and integration architectures are documented; formal BU landscape diagram to be attached if required. |
| 9 | Logical architecture provided? | **Yes** | See Slide 15 — current monorepo SPA + FastAPI + SQLite cache, plus legacy automation pipeline overview. |
| 10 | End-to-end integration architecture provided? | **Yes** | See Slides 14, 16, 18–21 (data, web, and deployment flows). |
| 11 | Cyber Security Architecture available? | **Yes** | See Slide 23; covers RBAC (current and planned), CORS, TLS, network zoning recommendations. |
| 12 | Data Flow Architecture provided? | **Yes** | See Slides 16 and 19 for current file-based and historical PDF-based flows. |
| 13 | Privacy Impact Assessment available? | **Yes / NA** | Only public regulatory data is processed; no PII. Privacy impact is low. |
| 14 | Deployment architecture provided (network zoning/segmentation)? | **Yes** | Current single-node deployment plus recommended Azure-based, multi‑subnet target (Slide 20). |
| 15 | Data Security controls in place (encryption, tokenization, masking)? | **Yes (appropriate for public data)** | TLS planned for API, encrypted disks; no PII so masking/tokenization not applicable. |
| 16 | Legal and Regulatory compliance controls in place? | **Yes / NA** | All data sourced from public SERC/central portals; no restrictive licensing identified. |
| 17 | Application profile details added (user base, deployment model, interfaces)? | **Yes** | See Slide 10 — internal users, web SPA + REST APIs. |
| 18 | Integration details provided (API, interconnects, communication medium)? | **Yes** | See Slide 11 — CSV/Excel, SQLite, PDFs, and (legacy) PostgreSQL/email integrations. |
| 19 | Non-Functional Requirements captured (uptime, RPO/RTO, scalability, etc.)? | **Yes** | See Slides 24–31. |
| 20 | High-level TCO for at least 3 years provided and within budget? | ⚠️ TO BE CONFIRMED | Infra cost minimal (single VM/container, storage). Formal TCO to be prepared. |
| 21 | Technical evaluation completed against NFRs and rankings established? | **Yes (draft)** | Initial NFR assessment completed; BU to ratify. |

---

## ═══════════════════════════════════════════════  
## SLIDE 4 — PARTNER SELECTION CHECKLIST  
## ═══════════════════════════════════════════════  

> In-house project; partner criteria are NA except where noted.

| # | Checklist Item | Status | Remarks |
|---|---|---|---|
| 1 | OEM/Service Provider turnover ≥ ₹200 Cr avg over last 3 FYs? | **NA** | In‑house development. |
| 2 | Bidder has minimum 200 full-time rostered manpower? | **NA** | Not applicable; no external bidder. |
| 3 | Security certifications (HIPAA, GDPR, ISO27001, SOC2 Type2)? | **NA** | Covered by Adani Group's own certifications and governance. |
| 4 | VA & PT reports available for complete solution stack? | ⚠️ TO BE CONFIRMED | Recommended before production go‑live (especially if exposed on cloud). |
| 5 | Solution deployed ≥1 year for an org with 10+ sites / 15k users? | **NA** | Internal purpose‑built tool, first deployment within Adani. |
| 6 | Partner shared Cyber Security Policy? | **NA** | Adani Cyber Security Policy applies. |
| 7 | Partner shared ISO20k certification and ITSM processes? | **NA** | Managed under Adani ITSM. |
| 8 | All third-party/open-source software dependencies documented? | **Yes** | See Slide 12 and `Frontend/package.json`, `backend/requirements.txt`. Older automation stack dependencies (selenium, pdfplumber, psycopg2, etc.) also documented where relevant. |
| 9 | Penalty clauses for security breaches agreed? | **NA** | No external partner. |
| 10 | Defined disclosure process for security breaches? | **NA** | Covered by Adani internal processes. |

---

## ═══════════════════════════════════════════════  
## SLIDE 5 — VENDOR CREDENTIALS EVALUATION  
## ═══════════════════════════════════════════════  

| Field | Value |
|---|---|
| **Vendor/Option Name** | In-house Development (Adani Digital / IT Team) |
| **Team / Organization** | Adani Group — In-House IT / Digital Labs / Energy Analytics |
| **Development Center** | Adani Corporate House, Shantigram, Ahmedabad, Gujarat 382421 |
| **Technology Stack Experience** | Python (FastAPI; legacy: Selenium, pdfplumber, PyMuPDF), React/Vite, pandas, PostgreSQL & SQLite, Azure IaaS/PaaS |
| **India Deployment Base** | Internal deployment across Adani Group entities (AGEL, Adani Power, Adani Transmission / Adani Energy Solutions, etc.) |
| **Product Strategy & Roadmap** | Phase 1: Multi‑state tariff dashboard from curated CSV/Excel. Phase 2: Automated scraping & PDF extraction pipeline (legacy backend). Phase 3: Predictive analytics & AI/RAG Q&A. Phase 4: SAP and trading platform integration. |
| **Partner Ecosystem** | Microsoft Azure (hosting, planned), open‑source technologies (React, FastAPI, pandas, SheetJS/xlsx, Selenium, pdfplumber, PostgreSQL, SQLite). |
| **Presence in Adani Group** | Primarily for AGEL; extendable to AEML, ATL and other BUs. |
| **Reference Deployment** | Operational dashboard for 7 states (CSV/Excel), legacy automation PoC for Gujarat and Rajasthan (full PDF pipeline). |
| **Open-Source Dependencies (legacy + current)** | Current backend: `fastapi`, `uvicorn[standard]`, `pandas`, `python-dotenv`. Legacy stack additionally: `selenium`, `webdriver-manager`, `pdfplumber`, `pymupdf`, `psycopg2`, `openpyxl`, `sqlalchemy`, etc. |
| **Scalability Proof** | Current design supports adding states by dropping new CSV/Excel files; legacy design shows pipeline scalability with state‑plug‑in extraction engines. |

---

## ═══════════════════════════════════════════════  
## SLIDE 7 — AT A GLANCE / EXECUTIVE SUMMARY  
## ═══════════════════════════════════════════════  

### Overall Business Need  

Adani’s power, renewables and trading businesses require **timely, accurate, state‑wise electricity tariff visibility**—covering Fixed Charges, Energy Charges, Wheeling Losses/Charges, Cross Subsidy Surcharge, Additional Surcharge, ISTS/InSTS charges, etc., across multiple voltage levels and DISCOMs. Today this data is mostly **manually extracted from SERC tariff order PDFs and spreadsheets**, which is slow, error‑prone, and hinders financial planning and landed cost analysis.

### Recommended Solution Approach  

- **Centralized tariff intelligence platform** consolidating tariff data from **7+ states** into a single dashboard and API layer.  
- **Current implementation (monorepo)**:  
  - CSV/Excel based ingestion (`backend/Db/`) per state.  
  - FastAPI backend with SQLite cache (`tariff.db`) serving standardized JSON APIs.  
  - React/Vite SPA with KPI cards and multi‑series charts for ISTS/InSTS, Wheeling, Fixed Charges, CSS, Fuel Surcharge.  
  - Document explorer for state‑grouped PDFs (browse/preview/download).  
- **Legacy / extended capability (pipeline)**:  
  - Selenium‑based PDF download from GERC/RERC/Grid‑India and other portals.  
  - `pdfplumber` + PyMuPDF based extraction with state‑specific engines (Gujarat/Rajasthan) populating PostgreSQL and Excel models.  
  - Change detection and HTML email notifications.  
- **Future**: Re‑enable automated scraping modules in the new architecture, introduce ML/RAG for tariff Q&A, and integrate with SAP/trading systems.

### Solution Options  

| Option | Description |
|---|---|
| **Option 1** | Continue manual Excel/PDF workflow — **not recommended**. |
| **Option 2** | Buy external energy/tariff SaaS — high cost, limited control, often lacks Indian SERC granularity. |
| **Option 3 — Recommended** | **Adani Landed Tariff Intelligence Platform** — in‑house, React + FastAPI solution with future‑ready automation pipeline. |

---

## ═══════════════════════════════════════════════  
## SLIDE 8 — IMPACT TO BUSINESS CAPABILITIES  
## ═══════════════════════════════════════════════  

| # | Capability | Impact Level | Description |
|---|---|---|---|
| 1 | Tariff Data Accuracy / Intelligence | 🔴 High | Replaces manual extraction with structured state‑wise tariff data; legacy pipeline shows ability to directly parse PDFs with validation ranges and scoring logic. |
| 2 | Financial Planning & Power Trading Speed | 🔴 High | Cuts data availability from days/weeks to near‑real‑time dashboard refresh; supports landed cost and trading decisions. |
| 3 | Regulatory Compliance Monitoring | 🟡 Medium | Tracks tariff order changes across multiple SERC portals; supports audit trails via PDFs and versioned data (legacy pipeline). |
| 4 | Cross-State Benchmarking | 🟡 Medium | Multi‑series charts compare ISTS/InSTS, Fixed Charges, CSS, Wheeling across states and voltages. |
| 5 | Document & Knowledge Management | 🟡 Medium | Central repository of 100+ tariff order PDFs, grouped by state with preview/download. |
| 6 | Operational Efficiency | 🔴 High | Eliminates ~40+ hours/month of manual work; automated or semi‑automated ingestion significantly reduces turnaround. |
| 7 | Change Management & Audit | 🟡 Medium | Legacy pipeline includes previous/current value versioning, change detection and email alerts; current design retains at least versioned source files and auditability. |

---

## ═══════════════════════════════════════════════  
## SLIDE 9 — BUSINESS NEEDS / REQUIREMENTS  
## ═══════════════════════════════════════════════  

> Combined and deduplicated requirements; “legacy pipeline” entries indicate requirements already addressed in the older end‑to‑end design.

| # | Priority | Requirement | Must‑Have / Nice‑to‑Have |
|---|---|---|---|
| 1 | P1 | State-wise tariff data aggregation from CSV/Excel sources for at least 7 states (AP, GJ, MH, RJ, TN, TG, UP) | Must‑Have |
| 2 | P1 | Automated / semi‑automated ingestion of tariff order PDFs and derived data (current: file‑drop; legacy: full scraping pipeline) | Must‑Have (phased) |
| 3 | P1 | Executive dashboard with KPI cards (States monitored, DISCOMs, ISTS Loss, InSTS Loss, Fuel Surcharge) | Must‑Have |
| 4 | P1 | Multi‑series chart comparisons: InSTS Loss & Charges, Fixed Charges, Wheeling Loss & Charges, CSS across voltages and states | Must‑Have |
| 5 | P1 | State monitoring page with DISCOM count, portal URLs and Excel‑style preview | Must‑Have |
| 6 | P1 | REST API for tariff‑data access, CSV/Excel export and status/health | Must‑Have |
| 7 | P2 | PDF document management — browse by state, preview in‑browser, download | Must‑Have |
| 8 | P2 | Change detection engine comparing Previous vs Current tariff values across all columns (legacy pipeline) | Must‑Have (when automation is enabled) |
| 9 | P2 | Automated HTML email notifications on tariff changes | Nice‑to‑Have / Phase‑2 Must‑Have |
| 10 | P2 | Cascading filters (State → Region → Substation) in explorer | Nice‑to‑Have |
| 11 | P2 | Role‑based access (Admin / Operator / Viewer) and authentication (session/JWT/AD SSO) | Must‑Have |
| 12 | P3 | End‑to‑end automated web scraping of SERC portals (Gujarat, Rajasthan, others) | Nice‑to‑Have (supported by legacy backend) |
| 13 | P3 | AI‑powered PDF extraction / RAG‑based tariff Q&A | Nice‑to‑Have |
| 14 | P3 | Integration with centralized database (PostgreSQL or similar) in addition to SQLite cache | Nice‑to‑Have / Future Must‑Have |
| 15 | P4 | SAP integration and predictive tariff / landed cost analytics | Nice‑to‑Have |

---

## ═══════════════════════════════════════════════  
## SLIDE 10 — APPLICATION PROFILE  
## ═══════════════════════════════════════════════  

### Application Category  

| Category | Selected |
|---|---|
| Web Application | ✅ — React/Vite SPA served by FastAPI |
| Thick Client (desktop) | ☐ |
| Mobile Application | ☐ (responsive web only) |
| Analytics | ✅ — KPI cards, trend charts, cross‑state comparisons |

### Deployment vs. Development Type  

|  | SaaS | PaaS | IaaS | On‑Premise |
|---|---|---|---|---|
| **Custom** | ☐ | ☐ | ✅ (Azure ACI / VM planned) | ✅ (current dev/on‑prem) |
| **COTS** | ☐ | ☐ | ☐ | ☐ |

> Custom-built application running on a single FastAPI process today, with a path to Azure IaaS/ACI for production.

### Integration Category  

| Category | Selected |
|---|---|
| Integration with SAP | ☐ (planned) |
| Integration with non-SAP Systems | ✅ — CSV/Excel sources, PDFs; legacy: PostgreSQL, SMTP |
| OT Integration | ☐ |
| ADFS / IDM / IAM / PIM / PAM | ✅ Planned — Azure AD SSO + RBAC |

### User Category  

| Category | Selected |
|---|---|
| External Users | ☐ |
| Internal Users | ✅ — Analysts, Finance, Trading, Planning teams |
| Available Over Internet | ✅ via Adani internal network/VPN (not public internet) |

### Architecture  

| Type | Selected |
|---|---|
| Monolithic | ☐ (legacy pipeline was multi‑script but single deployment) |
| Micro-Services / Modular | ✅ — SPA + API server + modular backend utilities; future services (scraper, RAG, etc.) already packaged as modules |

---

## ═══════════════════════════════════════════════  
## SLIDE 11 — INTEGRATION / INTERCONNECTS DETAILS  
## ═══════════════════════════════════════════════  

### Integration 1: State CSV/Excel Data Files (Current)  

| Field | Value |
|---|---|
| Interfacing Application | Local file system (`backend/Db/` — CSV/Excel) |
| Auth/Authorization | OS‑level file permissions; no external auth |
| Type of Data Exchanged | State‑wise tariff parameters (ISTS Loss, InSTS Loss, Wheeling Charges, Fixed Charges, CSS, Fuel Surcharge, DISCOM, FY, etc.) |
| Direction | Inbound |
| Mode | On‑Demand (data refreshed by dropping new files) |
| Interface Method | `pandas.read_csv` / `pandas.read_excel` |
| Deployment Type | On‑Premise / Azure VM to local storage or attached volume |
| Integration Middleware | Point‑to‑point |
| Monitoring & Error Handling | Missing/invalid files yield 404 or error JSON; errors logged in backend. |

### Integration 2: SQLite Cache (Current)  

| Field | Value |
|---|---|
| Interfacing Application | SQLite file `tariff.db` under `backend/Db/` |
| Type of Data Exchanged | Cached per‑state tariff tables (normalized headers) |
| Direction | Bi‑directional (write on rebuild, read on queries) |
| Mode | Auto‑triggered when any source file is newer than DB |
| Interface Method | Python `sqlite3` + pandas `to_sql` / `read_sql_query` |
| Monitoring & Error Handling | If cache fails, backend falls back to direct CSV/Excel read. |

### Integration 3: SERC Portal Links (Current Frontend)  

| Field | Value |
|---|---|
| Interfacing Application | 7 State Electricity Regulatory Commission (SERC) web portals |
| Type of Data Exchanged | Hyperlinks to tariff order pages (for user navigation) |
| Direction | Outbound (user opens portal in new tab) |
| Interface Method | HTTP browser navigation only; **no live scraping in current stack**. |

### Integration 4: Legacy Automation Integrations (Optional / Future Reuse)  

These apply to the earlier fully automated backend and may be re‑activated as future phases:

- **GERC, RERC, Grid‑India portals** — Selenium + HTTP PDF download, ASP.NET postbacks, MD5/hash‑based change detection.  
- **PostgreSQL** — Structured tariff tables with previous/current value columns and UPSERT logic.  
- **SMTP Email (Gmail or internal relay)** — HTML change‑notification emails with Adani branding.

(For detailed legacy interfaces, see the original evaluation document; these are captured here as future‑state options rather than current deployment.)

---

## ═══════════════════════════════════════════════  
## SLIDE 12 — TECHNOLOGY STACK  
## ═══════════════════════════════════════════════  

### Current Monorepo Stack (`d:\Landed Tariff`)  

| # | Component | Details |
|---|---|---|
| 1 | Web Server & OS | Uvicorn (ASGI) on Windows dev; production target: Linux/Windows on Azure. |
| 2 | Application Server | FastAPI ≥0.115.0 (Python 3.10+). |
| 3 | Container Registry | ⚠️ Azure Container Registry planned (per `aci-deployment.yml`). |
| 4 | Database Platform | SQLite 3.x file cache; CSV/Excel as system of record. PostgreSQL planned for production. |
| 5 | Development Technology — Frontend | React 19 + TypeScript + Vite; SheetJS/xlsx, framer‑motion, react-router-dom, Axios. |
| 6 | Development Technology — Backend | Python + FastAPI, pandas, python-dotenv. |
| 7 | Compatible Browsers | Chrome, Edge, Firefox (latest) and internal aNet browser (⚠️ to confirm). |
| 8 | Security Components | CORS middleware, planned Azure AD SSO, JWT/session auth, `.env` config, disk encryption. |
| 9 | Other Components | Vite dev proxy, CSS Modules, charting libs, SPA static serving from FastAPI. |

### Legacy / Extended Automation Stack  

Additional components used in the earlier fully automated pipeline (still relevant as options):

- **Web Scraping**: Selenium 4, Chrome WebDriver, webdriver‑manager.  
- **PDF Parsing**: `pdfplumber`, PyMuPDF (`fitz`).  
- **Data Processing**: `pandas`, `openpyxl`, JSONL intermediate formats.  
- **Database**: PostgreSQL 14+ with `psycopg2` / SQLAlchemy.  
- **Notification & Logging**: SMTP via `smtplib`, HTML email templates, `logging` to `automation.log`.

---

## ═══════════════════════════════════════════════  
## SLIDE 13 — AS-IS ARCHITECTURE (Current Manual State)  
## ═══════════════════════════════════════════════  

(Combined narrative)

- Analysts manually download tariff order PDFs (100–500+ pages) from SERC portals for Gujarat, Maharashtra, Rajasthan, Tamil Nadu, Telangana, Andhra Pradesh, Uttar Pradesh, etc.  
- Key tariff parameters (ISTS Loss, InSTS, Wheeling, Fixed Charges, CSS, Fuel Surcharge) are manually read and entered into Excel/CSV.  
- Files are stored on local machines/shared drives; there is **no centralized database** or consolidated dashboard.  
- Reporting is via manual Excel pivots and email, with **no real‑time cross‑state comparison** or formal audit trail.  
- Pain points: high effort (~40+ hours/month), transcription errors, delayed visibility, fragmented data, and no single source of truth.

---

## ═══════════════════════════════════════════════  
## SLIDE 14 — PROPOSED SOLUTION ARCHITECTURE (High Level)  
## ═══════════════════════════════════════════════  

### Current Implemented Architecture (Monorepo)  

- **Input Sources**:  
  - CSV/Excel files per state in `backend/Db/`.  
  - Tariff order PDFs stored under `backend/Db/STATE PDFS/STATE PDFS/<state>/`.  
  - `States_Data.xlsx` for monitoring metadata.  
- **Processing Layer**:  
  - FastAPI service exposing `/api/*` endpoints.  
  - `tariff_data.py` to map state files, normalize headers, build SQLite cache and serve JSON rows.  
- **Intermediate Storage**:  
  - SQLite `tariff.db` with one table per state.  
  - Original CSV/Excel and PDFs retained for downloads and audits.  
- **Workflow**: Drop/refresh files → backend auto‑detects changes by `mtime` → cache rebuild → updated data visible in dashboard.  
- **Output**:  
  - React dashboard (KPIs + charts).  
  - Monitoring and documents pages.  
  - CSV/Excel download and PDF serving APIs.

### Legacy / Future Automation Architecture (Optional Layer)  

- Selenium automation against GERC/RERC/Grid‑India, SmartScraper suite, JSONL intermediates, PostgreSQL, Excel model updates, and HTML email alerts as described in the original evaluation document.  
- These modules illustrate the **full automation roadmap** and can be re‑platformed into the current architecture when required.

---

## ═══════════════════════════════════════════════  
## SLIDE 15 — PROPOSED LOGICAL / FUNCTIONAL ARCHITECTURE  
## ═══════════════════════════════════════════════  

(Combined from both documents)

- **Presentation Layer**: React SPA with Dashboard, Monitoring, Documents, Login, Settings, Notifications, and History pages; CSS Modules and responsive layout.  
- **Application / Business Logic Layer**:  
  - FastAPI router `tariff.py` handling health, status, monitoring, tariff-data, download, PDF listing and Db file serving.  
  - Frontend services (`ApiService`) for API calls, authentication wrappers, and role‑based route guards.  
  - (Legacy) pipeline orchestrator, state‑specific extraction engines, and change detection services.  
- **Data Storage Layer**:  
  - SQLite `tariff.db`, CSV/Excel source files, PDFs, and browser storage (session/localStorage for auth/session).  
- **Integration & Processing**: REST JSON APIs, SPA served via the same backend, Vite dev proxy during development.  
- **User Roles** (conceptual): Admin (full), Operator (update/monitor), Viewer (read‑only).

---

## ═══════════════════════════════════════════════  
## SLIDE 16 — DATA FLOW ARCHITECTURE  
## ═══════════════════════════════════════════════  

- **Sources**: 7 CSVs, `States_Data.xlsx`, state‑wise PDFs.  
- **Ingestion**: `list_data_files()` enumerates data files; `state_name_from_filename()` normalizes names using `STATE_DISPLAY_NAMES`.  
- **Transformation**: `_make_unique_headers()` deduplicates headers; missing values filled as `"NA"`; client‑side `cleanNumeric()` extracts numeric values for KPI/graph calculations.  
- **Storage**: SQLite tables per state plus source/audit store in file system and PDFs in `STATE PDFS/`.  
- **Validation**: NULL/NA handling, DISCOM validity checks, deduplication for counts; (legacy pipeline includes range checks and scoring).  
- **Presentation**: KPI cards, cross‑state charts, data tables, document browser and PDF preview.

---

## ═══════════════════════════════════════════════  
## SLIDE 17 — INTERIM PROCESS ARCHITECTURE  
## ═══════════════════════════════════════════════  

- Inputs: manually curated CSV/Excel and downloaded PDFs.  
- Backend: FastAPI on port 1580, CORS-enabled, using `tariff_data.py` utilities and SQLite cache.  
- Frontend: Vite dev server (during development) and built SPA served via FastAPI in production.  
- Consumption: Dashboard/Monitoring/Documents pages plus CSV/PDF downloads.  
- Governance/Security: git‑ignored `Db/` and `.env`, basic auth/session handling (current), planned RBAC hardening.

---

## ═══════════════════════════════════════════════  
## SLIDE 18 — FUTURE INTEGRATION ARCHITECTURE  
## ═══════════════════════════════════════════════  

- Integrate with SAP S/4HANA and Adani trading platforms.  
- Reintroduce automated SERC portal scraping and RAG‑based PDF extraction using existing placeholder modules (`src/scraper`, `src/document_processor`, `src/rag`).  
- Migrate from SQLite to PostgreSQL or managed database in Azure.  
- Use Azure API Management, Azure AD SSO/MFA, Azure Key Vault, App Insights, Sentinel, etc., as outlined in both source documents.

---

## ═══════════════════════════════════════════════  
## SLIDE 19 — DATA FLOW DIAGRAM  
## ═══════════════════════════════════════════════  

Summarizes the current file‑based flow plus the legacy pipeline steps (where needed) — see combined description in Slides 16 and 17 and, for the older system, the 7‑step pipeline (init DB → download PDFs → scrape → extract → DB/Excel update → email).

---

## ═══════════════════════════════════════════════  
## SLIDE 20 — DEPLOYMENT ARCHITECTURE  
## ═══════════════════════════════════════════════  

- **Current**: Single Windows machine running FastAPI (port 1580) and Vite dev server (port 5173) for development. Data files and SQLite cache on local disk.  
- **Target**: Azure Container Instance (ACI) or VM with:  
  - FastAPI serving both `/api/*` and static SPA on a single port.  
  - Persistent volume containing `Db/` (CSVs, Excels, PDFs, SQLite).  
  - Protected behind Azure Application Gateway with WAF, in an Adani VNet with separate app/data subnets.

---

## ═══════════════════════════════════════════════  
## SLIDE 21 — WEB APP / SOLUTION ARCHITECTURE  
## ═══════════════════════════════════════════════  

- Data sources: CSV/Excel, PDFs, and SERC portal links.  
- Middleware: REST endpoints (`/api/health`, `/api/status`, `/api/monitoring`, `/api/tariff-data/{state}`, `/api/download/{state}`, `/api/pdfs`, `/api/db/{path}`).  
- Application: File‑driven workflow with automatic cache invalidation, KPI aggregation, DISCOM detection, and charting.  
- Client access: Modern desktop/tablet/mobile browsers via responsive SPA.  
- Authentication: Currently session/JWT‑style approach with route guards; planned Azure AD OAuth2 + RBAC.

---

## ═══════════════════════════════════════════════  
## SLIDE 22 — NETWORK ARCHITECTURE  
## ═══════════════════════════════════════════════  

- Current dev: localhost ports 1580/5173 on a flat network.  
- Target: Single VNet with application and data subnets, Azure Application Gateway + WAF, VPN/ExpressRoute‑based internal access, no public DB exposure, CORS restricted to Adani domains.

---

## ═══════════════════════════════════════════════  
## SLIDE 23 — SECURITY ARCHITECTURE  
## ═══════════════════════════════════════════════  

Combined view:

- **Network & Endpoint Security**: Adani endpoint security policies; planned VNet segmentation and WAF.  
- **Application Security**: Present RBAC in frontend, `.env`‑based config, CORS middleware; planned JWT/AD SSO and stricter CORS.  
- **Data Security**: Public source data; confidentiality low but integrity and availability medium. Data on encrypted disks; TLS for production.  
- **SDLC / DevSecOps**: Git, `.gitignore` for `Db/` and `.env`, pre‑commit hooks, ESLint/TypeScript checks; recommended Bandit/Safety/VA‑PT for backend.  
- **Governance**: To align with Adani’s ISO27001 scope and incident/change management frameworks.

---

## ═══════════════════════════════════════════════  
## SLIDES 24–31 — TECHNICAL EVALUATION (NFRs)  
## ═══════════════════════════════════════════════  

The NFR tables from both documents are compatible; in combination they state:

- **Deployment mode**: On‑prem today; Azure IaaS/ACI target with West India data residency.  
- **Licensing**: All key components are open‑source (MIT/BSD/Apache‑2.0); Azure subscription required for hosting only.  
- **Performance**:  
  - API responses < 1 second typical.  
  - Dashboard load < 3 seconds on standard corporate network.  
  - Full automation pipeline (legacy) completed 2‑state extraction in < 15 minutes.  
- **Availability / DR**: Target 99.5–99.9% uptime with daily backup of data volume; RPO ≈ 24h; RTO ≈ 4h.  
- **Security & Compliance**: CIA rating (C=L, I=M, A=M), RBAC, data localization within India, no PII processed, open‑source dependencies documented and to be scanned periodically.

---

> **BU Actions Before Final Submission (from both documents):**  
> - Fill all cover‑page fields (BU, CIO/CDO, project lead, sponsor).  
> - Confirm BRD sign‑off, NFR targets (uptime, RPO/RTO), and 3‑year TCO.  
> - Agree security posture (Azure AD SSO/MFA, WAF, VA/PT schedule).  
> - Decide whether to position PDF automation pipeline as **Phase‑2** and keep current CSV/Excel‑driven dashboard as **Phase‑1 production scope**.
