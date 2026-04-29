export const calculateRiskScore = (likelihood, impact) =>
  Number(likelihood) * Number(impact);

export const getRiskLevel = (score) => {
  const s = Number(score);
  if (s >= 20) return 'Critical';
  if (s >= 12) return 'High';
  if (s >= 6)  return 'Medium';
  return 'Low';
};

export const RISK_COLORS = {
  Critical: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    solid: 'bg-red-600',
    hex: '#DC2626',
    light: '#FEE2E2',
    dark: '#991B1B',
    pdf: [254, 202, 202],
  },
  High: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    solid: 'bg-orange-500',
    hex: '#EA580C',
    light: '#FFEDD5',
    dark: '#9A3412',
    pdf: [254, 215, 170],
  },
  Medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    solid: 'bg-yellow-400',
    hex: '#CA8A04',
    light: '#FEF9C3',
    dark: '#78350F',
    pdf: [254, 249, 195],
  },
  Low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    solid: 'bg-green-600',
    hex: '#16A34A',
    light: '#DCFCE7',
    dark: '#166534',
    pdf: [187, 247, 208],
  },
};

export const getHeatmapCellStyle = (likelihood, impact) => {
  const score = likelihood * impact;
  if (score >= 20) return { bg: '#FCA5A5', text: '#7F1D1D', border: '#F87171' };
  if (score >= 12) return { bg: '#FED7AA', text: '#7C2D12', border: '#FB923C' };
  if (score >= 6)  return { bg: '#FDE68A', text: '#78350F', border: '#FBBF24' };
  return { bg: '#A7F3D0', text: '#064E3B', border: '#6EE7B7' };
};

export const generateRiskId = (risks) => {
  if (!risks || risks.length === 0) return 'AIR-001';
  const nums = risks.map((r) => {
    const n = parseInt((r.id || '').replace('AIR-', ''), 10);
    return isNaN(n) ? 0 : n;
  });
  return `AIR-${String(Math.max(...nums) + 1).padStart(3, '0')}`;
};

export const CONTROL_STATUSES = ['Implemented', 'Partial', 'Planned', 'None'];
export const RISK_STATUSES    = ['Open', 'In Progress', 'Closed'];
export const RESIDUAL_LEVELS  = ['Critical', 'High', 'Medium', 'Low'];

export const AI_SYSTEMS = [
  'HR Recruitment AI',
  'Customer-facing Chatbot',
  'Credit Scoring Model',
  'Fraud Detection System',
  'Predictive Maintenance AI',
];

export const REGULATORY_REFS = [
  'SDAIA AI Ethics Principles',
  'PDPL Article 5 (Consent)',
  'PDPL Article 18 (Retention)',
  'PDPL Article 25 (Cross-Border Transfer)',
  'PDPL Article 32 (Automated Decisions)',
  'PDPL (General)',
  'NCA ECC (Essential Cybersecurity Controls)',
  'NCA Cloud Cybersecurity Controls',
  'NIST AI RMF - GOVERN-1',
  'NIST AI RMF - GOVERN-2',
  'NIST AI RMF - MAP-1',
  'NIST AI RMF - MAP-5',
  'NIST AI RMF - MEASURE-2',
  'NIST AI RMF - MANAGE-4',
  'ISO 42001 Clause 6.1',
  'ISO 42001 Clause 6.2',
  'ISO 42001 Clause 8',
  'ISO 42001 (General)',
];

export const getRiskLevelOrder = (level) =>
  ({ Critical: 0, High: 1, Medium: 2, Low: 3 }[level] ?? 4);

export const sortRisks = (risks, sortKey, sortDir) => {
  if (!sortKey) return risks;
  return [...risks].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (sortKey === 'riskLevel') {
      aVal = getRiskLevelOrder(aVal);
      bVal = getRiskLevelOrder(bVal);
    } else if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterRisks = (risks, filters) => {
  const { search, category, riskLevel, status, aiSystem, regulatoryRef } = filters;
  return risks.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.title?.toLowerCase().includes(q) &&
        !r.description?.toLowerCase().includes(q) &&
        !r.id?.toLowerCase().includes(q) &&
        !r.riskOwner?.toLowerCase().includes(q)
      )
        return false;
    }
    if (category && r.category !== category) return false;
    if (riskLevel && r.riskLevel !== riskLevel) return false;
    if (status && r.status !== status) return false;
    if (aiSystem && r.aiSystem !== aiSystem) return false;
    if (regulatoryRef && !r.regulatoryRefs?.includes(regulatoryRef)) return false;
    return true;
  });
};
