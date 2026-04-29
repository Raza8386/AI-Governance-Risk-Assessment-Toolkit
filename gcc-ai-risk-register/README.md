# GCC AI Risk Register

A production-ready web application for identifying, assessing, tracking, and managing AI-related risks — built specifically for organisations operating in the **Gulf Cooperation Council (GCC) region** and aligned with Saudi Arabian and international regulatory frameworks.

## Overview

GRC consultants, internal auditors, and risk managers in the GCC region face a growing need to govern AI systems in compliance with an evolving regulatory landscape. This tool provides a structured, professional risk register aligned with:

- **SDAIA** — Saudi Data & AI Authority AI Ethics Principles
- **PDPL** — Saudi Personal Data Protection Law
- **NCA** — National Cybersecurity Authority Controls (ECC & CCC)
- **NIST AI RMF** — AI Risk Management Framework (GOVERN · MAP · MEASURE · MANAGE)
- **ISO/IEC 42001:2023** — AI Management System Standard

---

## Features

### Dashboard
- Summary cards: Total, Critical, High, Medium, Low, Open, In Progress, Closed risk counts
- 5×5 risk heatmap (Likelihood × Impact) with colour-coded cells and risk counts per cell
- Stacked bar chart showing risk level distribution by category
- Top 5 highest-scoring risks
- Risk distribution by AI system
- Recent activity feed

### Risk Register Table
- Sortable columns (click any column header)
- Full-text search across title, description, ID, and owner
- Filters: Risk Level, Status, AI System, Category, Regulatory Reference
- Columns: Risk ID · AI System · Category · Title · L · I · Score · Level · Regulatory Refs · Owner · Controls · Residual · Status · Review Date · Actions
- Per-risk actions: View details · Edit · Export PDF · Delete

### Risk Scoring
| Score | Level    | Colour |
|-------|----------|--------|
| 20–25 | Critical | Red    |
| 12–19 | High     | Orange |
| 6–11  | Medium   | Yellow |
| 1–5   | Low      | Green  |

Risk Score = Likelihood (1–5) × Impact (1–5)

### Add / Edit Risk
- Full-form modal with real-time risk score preview
- Likelihood and impact sliders with descriptive scale labels
- Multi-select regulatory reference picker
- Form validation on required fields
- Audit log entry created on every save

### Regulatory Reference Guide
Interactive reference panel for all five frameworks with:
- Jurisdiction, type, issuer, and year
- Plain-language principle summaries
- Arabic label support
- Expandable/collapsible principle accordions

### Export
| Format | Scope          | Notes                                      |
|--------|----------------|--------------------------------------------|
| Excel  | Full or filtered register | All columns, auto-column widths  |
| PDF    | Full or filtered register | Colour-coded Risk Level column, A3 landscape |
| PDF    | Individual risk | Audit-ready single-risk detail report, A4 |

### Pre-loaded Risk Library
21 sample risks across 5 AI systems:
- **HR Recruitment AI** — bias, PDPL consent, human oversight, vendor risk
- **Customer-facing Chatbot** — prompt injection, ethics violation, data retention, explainability
- **Credit Scoring Model** — demographic bias, no human appeal, black-box decisions, data sovereignty
- **Fraud Detection System** — adversarial attacks, false positives, vendor certification, reputational risk
- **Predictive Maintenance AI** — operational failure, cross-border data transfer, explainability

---

## Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Frontend    | React 18                    |
| Styling     | Tailwind CSS 3              |
| Charts      | Recharts                    |
| Icons       | Lucide React                |
| Excel Export| SheetJS (xlsx)              |
| PDF Export  | jsPDF + jsPDF-AutoTable     |
| Storage     | localStorage (no backend)   |
| Build Tool  | Vite 5                      |

---

## Project Structure

```
gcc-ai-risk-register/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   ├── riskCategories.json      ← 11 GCC-specific AI risk categories
    │   ├── regulatoryFrameworks.json ← 5 framework definitions (SDAIA/PDPL/NCA/NIST/ISO)
    │   └── sampleRisks.json         ← 21 pre-loaded risk entries
    ├── hooks/
    │   └── useRisks.js              ← Risk CRUD + localStorage persistence + activity feed
    ├── utils/
    │   ├── riskUtils.js             ← Score calculation, level assignment, sorting, filtering
    │   └── exportUtils.js           ← Excel and PDF export logic
    └── components/
        ├── common/
        │   ├── Badge.jsx            ← RiskLevelBadge, StatusBadge, ControlStatusBadge
        │   └── Modal.jsx            ← Accessible modal wrapper
        ├── layout/
        │   ├── Sidebar.jsx          ← Navigation sidebar
        │   └── Header.jsx           ← Top header with KPI counters
        ├── dashboard/
        │   ├── Dashboard.jsx        ← Dashboard page container
        │   ├── SummaryCards.jsx     ← KPI summary cards
        │   ├── RiskHeatmap.jsx      ← 5×5 likelihood/impact heatmap
        │   ├── RiskChart.jsx        ← Category bar chart (Recharts)
        │   └── RecentActivity.jsx   ← Activity feed
        ├── register/
        │   ├── RiskRegister.jsx     ← Register page container
        │   ├── RiskTable.jsx        ← Sortable data table
        │   └── RiskFilters.jsx      ← Filter and search controls
        ├── form/
        │   └── RiskModal.jsx        ← Add/Edit modal + View detail modal
        └── regulatory/
            └── RegulatoryPanel.jsx  ← Regulatory reference guide
```

---

## Setup & Installation

### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Installation

```bash
# Navigate to the project directory
cd gcc-ai-risk-register

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will open at **http://localhost:5173**

### Production Build

```bash
npm run build
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service (Vercel, Netlify, Azure Static Web Apps, AWS S3+CloudFront).

---

## Customisation

### Adding / Updating Risk Categories
Edit `src/data/riskCategories.json` — the array is used to populate the category dropdown throughout the application.

### Adding / Updating Regulatory Frameworks
Edit `src/data/regulatoryFrameworks.json` — each framework object contains name, description, principles, and reference tags. The Regulatory Reference panel renders directly from this file.

### Adding / Updating AI Systems
Edit the `AI_SYSTEMS` array in `src/utils/riskUtils.js`.

### Updating Pre-loaded Risks
Edit `src/data/sampleRisks.json`. The risk store seeds from this file on first load (or after a reset). Each risk requires the full schema including `auditLog`, `createdAt`, and `updatedAt` fields.

### Resetting to Sample Data
Click the refresh icon (↺) in the top-right header and confirm the prompt. This resets localStorage to the sample risk dataset.

---

## Regulatory Frameworks Referenced

| Framework    | Full Name                                    | Jurisdiction       |
|--------------|----------------------------------------------|--------------------|
| SDAIA        | Saudi Data & AI Authority AI Ethics Principles | Saudi Arabia      |
| PDPL         | Personal Data Protection Law (Royal Decree M/19) | Saudi Arabia    |
| NCA ECC      | Essential Cybersecurity Controls             | Saudi Arabia       |
| NCA CCC      | Cloud Cybersecurity Controls                 | Saudi Arabia       |
| NIST AI RMF  | AI Risk Management Framework 1.0             | International (US) |
| ISO 42001    | AI Management System Standard                | International      |

---

## Risk Categories

1. Data Privacy & PDPL Compliance
2. Algorithmic Bias & Fairness
3. Model Explainability & Transparency
4. AI Vendor & Third-Party Risk
5. Cybersecurity of AI Systems (NCA alignment)
6. Regulatory Non-Compliance (SDAIA)
7. Operational AI Failure
8. Reputational Risk
9. Data Sovereignty & Cross-Border Transfer
10. Human Oversight & Control Failure
11. AI Ethics Violation

---

## Data Persistence

All risk data is stored in browser **localStorage** under the key `gcc-ai-risk-register-v1`. No backend server or database is required. Data persists across browser sessions on the same device.

**Note:** Clearing browser data or using private/incognito mode will reset the register. For production use in an organisation, consider replacing the localStorage hook with an API backend.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add: your feature description'`
4. Push and open a pull request

Please follow existing code conventions. New risk categories or regulatory frameworks should be added as JSON configuration updates rather than hardcoded changes.

---

## Roadmap (Future Enhancements)

- [ ] Risk treatment plan section per risk
- [ ] Role-based access toggle (Risk Owner / Auditor / Read-only)
- [ ] Arabic RTL layout toggle
- [ ] Date range filter for review dates
- [ ] Risk trend tracking over time
- [ ] Email notification for overdue risk reviews
- [ ] Backend API + database persistence

---

## License

MIT License — see [LICENSE](../LICENSE) for details.

---

## Disclaimer

This tool is intended to support GRC professionals in their risk management activities. It does not constitute legal or regulatory advice. Always consult official regulatory publications and qualified legal counsel for compliance decisions in your specific jurisdiction.
