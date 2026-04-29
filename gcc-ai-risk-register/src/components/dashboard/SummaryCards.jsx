import { AlertOctagon, AlertTriangle, AlertCircle, CheckCircle2, ShieldCheck, Clock, XCircle } from 'lucide-react';

const Card = ({ label, count, icon: Icon, colorClass, bgClass, subLabel }) => (
  <div className="card p-4 flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass}`}>
      <Icon size={18} className={colorClass} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      {subLabel && <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>}
    </div>
  </div>
);

export const SummaryCards = ({ stats }) => {
  const cards = [
    {
      label: 'Total Risks',
      count: stats.total,
      icon: ShieldCheck,
      colorClass: 'text-indigo-600',
      bgClass: 'bg-indigo-50',
      subLabel: 'All AI-related risks',
    },
    {
      label: 'Critical Risks',
      count: stats.critical,
      icon: AlertOctagon,
      colorClass: 'text-red-600',
      bgClass: 'bg-red-50',
      subLabel: 'Score 20–25 — Immediate action',
    },
    {
      label: 'High Risks',
      count: stats.high,
      icon: AlertTriangle,
      colorClass: 'text-orange-500',
      bgClass: 'bg-orange-50',
      subLabel: 'Score 12–19 — Priority treatment',
    },
    {
      label: 'Medium Risks',
      count: stats.medium,
      icon: AlertCircle,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-50',
      subLabel: 'Score 6–11 — Monitor & plan',
    },
    {
      label: 'Low Risks',
      count: stats.low,
      icon: CheckCircle2,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50',
      subLabel: 'Score 1–5 — Accepted or monitored',
    },
    {
      label: 'Open Risks',
      count: stats.open,
      icon: XCircle,
      colorClass: 'text-red-500',
      bgClass: 'bg-red-50',
      subLabel: 'Awaiting treatment',
    },
    {
      label: 'In Progress',
      count: stats.inProgress,
      icon: Clock,
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-50',
      subLabel: 'Treatment underway',
    },
    {
      label: 'Closed Risks',
      count: stats.closed,
      icon: CheckCircle2,
      colorClass: 'text-green-600',
      bgClass: 'bg-green-50',
      subLabel: 'Remediated or accepted',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map((c) => (
        <Card key={c.label} {...c} />
      ))}
    </div>
  );
};
