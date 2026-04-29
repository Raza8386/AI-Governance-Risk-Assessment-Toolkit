import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Edit2, Trash2, FileText, Eye } from 'lucide-react';
import { RiskLevelBadge, StatusBadge, ControlStatusBadge, RegRefTag } from '../common/Badge';
import { sortRisks } from '../../utils/riskUtils';
import { exportSingleRiskToPDF } from '../../utils/exportUtils';
import { format } from 'date-fns';

const SortIcon = ({ col, sortKey, sortDir }) => {
  if (sortKey !== col) return <ChevronsUpDown size={12} className="text-gray-300 ml-1" />;
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-indigo-500 ml-1" />
    : <ChevronDown size={12} className="text-indigo-500 ml-1" />;
};

const COLUMNS = [
  { key: 'id',            label: 'Risk ID',         sortable: true,  width: 'w-24' },
  { key: 'aiSystem',      label: 'AI System',        sortable: true,  width: 'w-36' },
  { key: 'category',      label: 'Category',         sortable: true,  width: 'w-48' },
  { key: 'title',         label: 'Risk Title',       sortable: true,  width: 'min-w-[220px]' },
  { key: 'likelihood',    label: 'L',                sortable: true,  width: 'w-10', center: true },
  { key: 'impact',        label: 'I',                sortable: true,  width: 'w-10', center: true },
  { key: 'riskScore',     label: 'Score',            sortable: true,  width: 'w-16', center: true },
  { key: 'riskLevel',     label: 'Level',            sortable: true,  width: 'w-28' },
  { key: 'regulatoryRefs',label: 'Regulatory Refs',  sortable: false, width: 'min-w-[160px]' },
  { key: 'riskOwner',     label: 'Owner',            sortable: true,  width: 'w-32' },
  { key: 'controlStatus', label: 'Controls',         sortable: true,  width: 'w-28' },
  { key: 'residualRisk',  label: 'Residual',         sortable: true,  width: 'w-24' },
  { key: 'status',        label: 'Status',           sortable: true,  width: 'w-28' },
  { key: 'reviewDate',    label: 'Review Date',      sortable: true,  width: 'w-28' },
  { key: 'actions',       label: 'Actions',          sortable: false, width: 'w-28' },
];

export const RiskTable = ({ risks, onEdit, onDelete, onView }) => {
  const [sortKey, setSortKey]   = useState('riskScore');
  const [sortDir, setSortDir]   = useState('desc');
  const [selected, setSelected] = useState(null);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = sortRisks(risks, sortKey, sortDir);

  const scoreColor = (score) => {
    if (score >= 20) return 'text-red-700 font-bold';
    if (score >= 12) return 'text-orange-600 font-bold';
    if (score >= 6)  return 'text-yellow-700 font-semibold';
    return 'text-green-700 font-semibold';
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-left">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={`${col.width} px-3 py-3 text-xs font-semibold text-slate-300 uppercase tracking-wide whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-white select-none' : ''} ${col.center ? 'text-center' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-0.5">
                    {col.label}
                    {col.sortable && <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center py-12 text-gray-400 text-sm">
                  No risks match your current filters.
                </td>
              </tr>
            )}
            {sorted.map((risk) => (
              <tr
                key={risk.id}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${selected === risk.id ? 'bg-indigo-50' : ''}`}
                onClick={() => setSelected((s) => (s === risk.id ? null : risk.id))}
              >
                <td className="px-3 py-3 w-24">
                  <span className="font-mono text-xs font-semibold text-indigo-600">{risk.id}</span>
                </td>
                <td className="px-3 py-3 w-36">
                  <span className="text-xs text-gray-700">{risk.aiSystem}</span>
                </td>
                <td className="px-3 py-3 w-48">
                  <span className="text-xs text-gray-600">{risk.category}</span>
                </td>
                <td className="px-3 py-3 min-w-[220px]">
                  <span className="text-xs font-medium text-gray-900 line-clamp-2">{risk.title}</span>
                </td>
                <td className="px-3 py-3 w-10 text-center">
                  <span className="text-xs font-semibold text-gray-600">{risk.likelihood}</span>
                </td>
                <td className="px-3 py-3 w-10 text-center">
                  <span className="text-xs font-semibold text-gray-600">{risk.impact}</span>
                </td>
                <td className="px-3 py-3 w-16 text-center">
                  <span className={`text-sm ${scoreColor(risk.riskScore)}`}>{risk.riskScore}</span>
                </td>
                <td className="px-3 py-3 w-28">
                  <RiskLevelBadge level={risk.riskLevel} />
                </td>
                <td className="px-3 py-3 min-w-[160px]">
                  <div className="flex flex-wrap gap-1">
                    {(risk.regulatoryRefs || []).slice(0, 2).map((ref) => (
                      <RegRefTag key={ref} label={ref} />
                    ))}
                    {(risk.regulatoryRefs || []).length > 2 && (
                      <span className="text-xs text-gray-400">+{risk.regulatoryRefs.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 w-32">
                  <span className="text-xs text-gray-700">{risk.riskOwner}</span>
                </td>
                <td className="px-3 py-3 w-28">
                  <ControlStatusBadge status={risk.controlStatus} />
                </td>
                <td className="px-3 py-3 w-24">
                  <RiskLevelBadge level={risk.residualRisk} size="sm" />
                </td>
                <td className="px-3 py-3 w-28">
                  <StatusBadge status={risk.status} />
                </td>
                <td className="px-3 py-3 w-28">
                  {risk.reviewDate ? (
                    <span className="text-xs text-gray-500">
                      {format(new Date(risk.reviewDate), 'dd MMM yy')}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </td>
                <td className="px-3 py-3 w-28">
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onView(risk)}
                      title="View details"
                      className="p-1.5 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => onEdit(risk)}
                      title="Edit risk"
                      className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => exportSingleRiskToPDF(risk)}
                      title="Export to PDF"
                      className="p-1.5 rounded text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      <FileText size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(risk.id)}
                      title="Delete risk"
                      className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {sorted.length} risk{sorted.length !== 1 ? 's' : ''} displayed
        </p>
        <p className="text-xs text-gray-400">
          L = Likelihood · I = Impact · Score = L × I
        </p>
      </div>
    </div>
  );
};
