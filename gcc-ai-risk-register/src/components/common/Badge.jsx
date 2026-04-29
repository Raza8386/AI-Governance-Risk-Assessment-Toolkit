import { RISK_COLORS } from '../../utils/riskUtils';

export const RiskLevelBadge = ({ level, size = 'md' }) => {
  const colors = RISK_COLORS[level] || RISK_COLORS.Low;
  const sizeClass = size === 'sm'
    ? 'px-1.5 py-0.5 text-xs'
    : size === 'lg'
    ? 'px-3 py-1 text-sm font-semibold'
    : 'px-2 py-0.5 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass} whitespace-nowrap`}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: colors.hex }}
      />
      {level}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const map = {
    'Open':        'bg-red-50 text-red-700 border-red-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'Closed':      'bg-green-50 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
};

export const ControlStatusBadge = ({ status }) => {
  const map = {
    'Implemented': 'bg-green-50 text-green-700 border-green-200',
    'Partial':     'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Planned':     'bg-blue-50 text-blue-700 border-blue-200',
    'None':        'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
};

export const RegRefTag = ({ label }) => (
  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">
    {label}
  </span>
);
