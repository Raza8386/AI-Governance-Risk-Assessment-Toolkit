# KSA AI Risk Register

A web application for organizations in Saudi Arabia to identify, assess, track, and manage AI-related risks — aligned with SDAIA, PDPL, NCA, NIST AI RMF, and ISO 42001.

**Live Demo:** [https://gcc-ai-risk-register.vercel.app](https://gcc-ai-risk-register.vercel.app)

---

## Features

- **Risk Register** — log and track AI risks with Likelihood × Impact scoring (1–25 matrix)
- **Dashboard** — visual analytics with risk heatmap, category breakdown chart, and activity feed
- **Regulatory Mapping** — map each risk to SDAIA, PDPL, NCA, NIST AI RMF, or ISO 42001
- **Export** — download the risk register as Excel or PDF (audit-ready single-risk reports included)
- **Reference Data Masters** — dynamically manage AI Systems, Risk Categories, and Risk Owners
- **21 Sample Risks** — pre-loaded across 11 categories to get you started immediately
- **Privacy-first** — fully browser-based, no backend, all data stored in localStorage

---

## Regulatory Frameworks Covered

| Framework | Issuer | Scope |
|---|---|---|
| SDAIA National AI Ethics Principles | Saudi Data & AI Authority | KSA |
| Personal Data Protection Law (PDPL) | Saudi Authority for Data and AI | KSA |
| National Cybersecurity Authority (NCA) | NCA | KSA |
| NIST AI Risk Management Framework | NIST | International |
| ISO/IEC 42001 | ISO | International |

---

## Risk Categories

- Data Privacy & PDPL Compliance
- Algorithmic Bias & Fairness
- Cybersecurity of AI Systems (NCA alignment)
- Model Performance & Reliability
- Explainability & Transparency
- Third-Party & Vendor Risk
- Regulatory & Legal Compliance
- Operational Risk
- Reputational Risk
- Ethical Risk
- Data Quality & Integrity

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) LTS (v18 or v20)
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Raza8386/AI-Governance-Risk-Assessment-Toolkit.git
cd AI-Governance-Risk-Assessment-Toolkit
```

**2. Navigate to the app folder**
```bash
cd gcc-ai-risk-register
```

**3. Install dependencies**
```bash
npm install
```

**4. Start the development server**
```bash
npm run dev
```

**5. Open in your browser**
```
http://localhost:5173
```

The app loads with 21 sample AI risks pre-populated. No API keys, no database, no backend setup required.

---

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder — deploy to any static hosting provider (Vercel, Netlify, GitHub Pages, etc.).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Excel Export | SheetJS (xlsx) |
| PDF Export | jsPDF + jspdf-autotable |
| Icons | Lucide React |
| Persistence | Browser localStorage |

---

## Project Structure

```
gcc-ai-risk-register/
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard, heatmap, charts, activity feed
│   │   ├── form/            # Add/Edit/View risk modals
│   │   ├── layout/          # Sidebar and Header
│   │   ├── masters/         # Reference Data Masters admin page
│   │   ├── register/        # Risk Register table and filters
│   │   └── regulatory/      # Regulatory frameworks panel
│   ├── data/
│   │   ├── riskCategories.json
│   │   ├── regulatoryFrameworks.json
│   │   └── sampleRisks.json
│   ├── hooks/
│   │   ├── useRisks.js      # Risk CRUD + localStorage
│   │   └── useMasters.js    # Reference data CRUD + localStorage
│   └── utils/
│       ├── riskUtils.js     # Scoring, filtering, sorting
│       └── exportUtils.js   # Excel and PDF export logic
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Risk Scoring

| Score | Level | Range |
|---|---|---|
| Critical | 🔴 | 20 – 25 |
| High | 🟠 | 12 – 19 |
| Medium | 🟡 | 6 – 11 |
| Low | 🟢 | 1 – 5 |

Score = **Likelihood (1–5) × Impact (1–5)**

---

## License

MIT — free to use, fork, and adapt for your organization.

---

## Feedback & Contributions

Issues and pull requests are welcome. If you are working in AI governance or GRC in Saudi Arabia, feedback on regulatory alignment is especially appreciated.
