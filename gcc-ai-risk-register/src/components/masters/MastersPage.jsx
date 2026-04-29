import { useState, useRef } from 'react';
import {
  Cpu, Tag, Users, Plus, Pencil, Trash2, Check, X,
  ChevronUp, ChevronDown, RotateCcw, AlertTriangle, Info,
} from 'lucide-react';

const TABS = [
  {
    key:         'aiSystems',
    label:       'AI Systems',
    icon:        Cpu,
    description: 'AI systems available in the risk register dropdown. Each risk is linked to one AI system.',
    placeholder: 'e.g. Customer Churn Prediction Model',
    singular:    'AI System',
  },
  {
    key:         'riskCategories',
    label:       'Risk Categories',
    icon:        Tag,
    description: 'Risk classification categories. Aligned with GCC AI risk taxonomy (SDAIA, NCA, PDPL).',
    placeholder: 'e.g. AI Supply Chain Risk',
    singular:    'Category',
  },
  {
    key:         'riskOwners',
    label:       'Risk Owners',
    icon:        Users,
    description: 'Predefined risk owners used in the risk register. Free text is also allowed when adding risks.',
    placeholder: 'e.g. Head of Data Science',
    singular:    'Owner',
  },
];

const ItemRow = ({ item, index, total, usageCount, onEdit, onDelete, onMove }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 group rounded-lg transition-colors">
      <span className="w-6 text-xs text-gray-400 text-right flex-shrink-0 font-mono">{index + 1}</span>

      <span className="flex-1 text-sm text-gray-800 min-w-0 truncate">{item}</span>

      {usageCount > 0 && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex-shrink-0">
          {usageCount} risk{usageCount !== 1 ? 's' : ''}
        </span>
      )}

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onMove(index, 'up')}
          disabled={index === 0}
          className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Move up"
        >
          <ChevronUp size={13} />
        </button>
        <button
          onClick={() => onMove(index, 'down')}
          disabled={index === total - 1}
          className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Move down"
        >
          <ChevronDown size={13} />
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <Pencil size={13} />
        </button>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        ) : (
          <div className="flex items-center gap-1 ml-1">
            {usageCount > 0 && (
              <span className="text-xs text-orange-600 font-medium">
                Used by {usageCount} risk{usageCount !== 1 ? 's' : ''}!
              </span>
            )}
            <button
              onClick={() => { onDelete(item); setConfirmDelete(false); }}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const EditRow = ({ item, onSave, onCancel }) => {
  const [value, setValue] = useState(item);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleSave = () => {
    const result = onSave(item, value);
    if (!result.ok) { setError(result.error); }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
      <span className="w-6 flex-shrink-0" />
      <input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(''); }}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onCancel(); }}
        className="flex-1 text-sm px-2 py-1 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button onClick={handleSave} className="p-1.5 rounded text-green-600 hover:bg-green-100 transition-colors" title="Save">
        <Check size={14} />
      </button>
      <button onClick={onCancel} className="p-1.5 rounded text-gray-500 hover:bg-gray-100 transition-colors" title="Cancel">
        <X size={14} />
      </button>
    </div>
  );
};

const AddForm = ({ placeholder, singular, onAdd }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAdd = () => {
    if (!value.trim()) { setError('Please enter a value.'); return; }
    const result = onAdd(value);
    if (result.ok) {
      setValue('');
      setError('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          placeholder={placeholder}
          className={`flex-1 form-input ${error ? 'border-red-400' : ''}`}
        />
        <button
          onClick={handleAdd}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={14} />
          Add {singular}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertTriangle size={11} /> {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <Check size={11} /> {singular} added successfully.
        </p>
      )}
    </div>
  );
};

const MasterList = ({ tab, items, risks, masters, onAdd, onUpdate, onDelete, onMove, onReset }) => {
  const [editingItem, setEditingItem] = useState(null);

  const getUsageCount = (item) => {
    if (tab.key === 'aiSystems')      return risks.filter((r) => r.aiSystem === item).length;
    if (tab.key === 'riskCategories') return risks.filter((r) => r.category === item).length;
    if (tab.key === 'riskOwners')     return risks.filter((r) => r.riskOwner === item).length;
    return 0;
  };

  const handleSaveEdit = (oldValue, newValue) => {
    const result = onUpdate(tab.key, oldValue, newValue);
    if (result.ok) setEditingItem(null);
    return result;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <Info size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-600 leading-relaxed">{tab.description}</p>
      </div>

      <AddForm
        placeholder={tab.placeholder}
        singular={tab.singular}
        onAdd={(value) => onAdd(tab.key, value)}
      />

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            {items.length} {tab.label}
          </span>
          <button
            onClick={() => { if (window.confirm(`Reset ${tab.label} to default values?`)) onReset(tab.key); }}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-100"
            title={`Reset ${tab.label} to defaults`}
          >
            <RotateCcw size={12} /> Reset to defaults
          </button>
        </div>

        {items.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">No {tab.label.toLowerCase()} defined.</p>
            <p className="text-xs text-gray-300 mt-1">Add one above or reset to defaults.</p>
          </div>
        ) : (
          <div className="py-1.5 space-y-0.5 max-h-96 overflow-y-auto scrollbar-thin">
            {items.map((item, index) =>
              editingItem === item ? (
                <div className="px-2" key={item}>
                  <EditRow
                    item={item}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingItem(null)}
                  />
                </div>
              ) : (
                <div key={item} className="px-2">
                  <ItemRow
                    item={item}
                    index={index}
                    total={items.length}
                    usageCount={getUsageCount(item)}
                    onEdit={() => setEditingItem(item)}
                    onDelete={(v) => onDelete(tab.key, v)}
                    onMove={(i, dir) => onMove(tab.key, i, dir)}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const MastersPage = ({ masters, risks, onAdd, onUpdate, onDelete, onMove, onReset }) => {
  const [activeTab, setActiveTab] = useState('aiSystems');
  const tab = TABS.find((t) => t.key === activeTab);

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Reference Data Masters</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage the dropdown lists used across the risk register. Changes apply immediately to all forms and filters.
        </p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ')[0]}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              activeTab === key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
            }`}>
              {masters[key].length}
            </span>
          </button>
        ))}
      </div>

      {tab && (
        <MasterList
          key={activeTab}
          tab={tab}
          items={masters[activeTab]}
          risks={risks}
          masters={masters}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onMove={onMove}
          onReset={onReset}
        />
      )}
    </div>
  );
};
