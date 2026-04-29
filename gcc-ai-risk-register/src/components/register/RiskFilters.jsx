import { Search, X } from 'lucide-react';
import { REGULATORY_REFS } from '../../utils/riskUtils';

const LEVELS    = ['Critical', 'High', 'Medium', 'Low'];
const STATUSES  = ['Open', 'In Progress', 'Closed'];

const Select = ({ value, onChange, label, options, placeholder }) => (
  <div className="flex-1 min-w-[160px]">
    <label className="form-label">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="form-input pr-8 bg-white">
      <option value="">{placeholder || `All ${label}`}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export const RiskFilters = ({ filters, onChange, resultCount, totalCount, masters }) => {
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const clearAll = () =>
    onChange({
      search: '',
      category: '',
      riskLevel: '',
      status: '',
      aiSystem: '',
      regulatoryRef: '',
    });

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <label className="form-label">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Search by title, description, ID, owner…"
              className="form-input pl-9"
            />
            {filters.search && (
              <button
                onClick={() => onChange({ ...filters, search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <Select
          label="Risk Level"
          value={filters.riskLevel}
          onChange={(v) => onChange({ ...filters, riskLevel: v })}
          options={LEVELS}
          placeholder="All Levels"
        />

        <Select
          label="Status"
          value={filters.status}
          onChange={(v) => onChange({ ...filters, status: v })}
          options={STATUSES}
          placeholder="All Statuses"
        />
      </div>

      <div className="flex items-end gap-3 flex-wrap">
        <Select
          label="AI System"
          value={filters.aiSystem}
          onChange={(v) => onChange({ ...filters, aiSystem: v })}
          options={masters?.aiSystems || []}
          placeholder="All Systems"
        />

        <Select
          label="Risk Category"
          value={filters.category}
          onChange={(v) => onChange({ ...filters, category: v })}
          options={masters?.riskCategories || []}
          placeholder="All Categories"
        />

        <Select
          label="Regulatory Reference"
          value={filters.regulatoryRef}
          onChange={(v) => onChange({ ...filters, regulatoryRef: v })}
          options={REGULATORY_REFS}
          placeholder="All Frameworks"
        />

        <div className="flex items-end gap-2 pb-0.5">
          {hasActiveFilters && (
            <button onClick={clearAll} className="btn-secondary text-xs py-1.5">
              <X size={12} /> Clear filters
            </button>
          )}
          <p className="text-xs text-gray-500 whitespace-nowrap pb-1">
            {resultCount} of {totalCount} risks
          </p>
        </div>
      </div>
    </div>
  );
};
