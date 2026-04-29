import { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { RiskLevelBadge } from '../common/Badge';
import {
  calculateRiskScore, getRiskLevel, generateRiskId,
  CONTROL_STATUSES, RISK_STATUSES, RESIDUAL_LEVELS,
  REGULATORY_REFS,
} from '../../utils/riskUtils';
import { ChevronDown, ChevronUp, Check, AlertTriangle, Info } from 'lucide-react';

const EMPTY_FORM = {
  aiSystem:      '',
  category:      '',
  title:         '',
  description:   '',
  likelihood:    3,
  impact:        3,
  regulatoryRefs: [],
  riskOwner:     '',
  controlStatus: 'None',
  residualRisk:  'Medium',
  status:        'Open',
  reviewDate:    '',
  comments:      '',
};

const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="form-label">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const ScoreIndicator = ({ score, level }) => {
  const colors = {
    Critical: 'bg-red-500',
    High:     'bg-orange-400',
    Medium:   'bg-yellow-400',
    Low:      'bg-green-500',
  };
  const widths = { Critical: '100%', High: '76%', Medium: '44%', Low: '20%' };

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Risk Score</p>
          <p className="text-3xl font-bold text-gray-900 mt-0.5">{score}<span className="text-base text-gray-400 font-normal"> / 25</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Risk Level</p>
          <RiskLevelBadge level={level} size="lg" />
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colors[level]}`}
          style={{ width: widths[level] }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">1</span>
        <span className="text-xs text-gray-400">25</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
        {[
          { label: 'Critical', range: '20–25', bg: 'bg-red-50',    text: 'text-red-700' },
          { label: 'High',     range: '12–19', bg: 'bg-orange-50', text: 'text-orange-700' },
          { label: 'Medium',   range: '6–11',  bg: 'bg-yellow-50', text: 'text-yellow-700' },
          { label: 'Low',      range: '1–5',   bg: 'bg-green-50',  text: 'text-green-700' },
        ].map((b) => (
          <div key={b.label} className={`rounded-lg px-1 py-1.5 ${level === b.label ? `${b.bg} ring-2 ring-offset-1 ring-current` : 'bg-gray-100'}`}>
            <p className={`text-xs font-semibold ${level === b.label ? b.text : 'text-gray-400'}`}>{b.label}</p>
            <p className={`text-xs ${level === b.label ? b.text : 'text-gray-300'}`}>{b.range}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LikelihoodImpactSlider = ({ label, value, onChange }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="form-label mb-0">{label}</label>
      <span className="text-lg font-bold text-gray-800">{value}</span>
    </div>
    <input
      type="range"
      min="1"
      max="5"
      step="1"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
    <div className="flex justify-between mt-1">
      {[1,2,3,4,5].map((v) => (
        <span key={v} className={`text-xs ${value === v ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{v}</span>
      ))}
    </div>
  </div>
);

const RegRefMultiSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (ref_) => {
    onChange(
      value.includes(ref_)
        ? value.filter((v) => v !== ref_)
        : [...value, ref_]
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="form-input text-left flex items-center justify-between gap-2"
      >
        <span className="text-sm text-gray-700 truncate">
          {value.length === 0
            ? 'Select regulatory references…'
            : `${value.length} selected`}
        </span>
        {open ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
      </button>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((ref_) => (
            <span
              key={ref_}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-xs cursor-pointer hover:bg-indigo-100 transition-colors"
              onClick={() => toggle(ref_)}
            >
              {ref_} <span className="opacity-60">×</span>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-30 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto scrollbar-thin">
          {REGULATORY_REFS.map((ref_) => (
            <button
              key={ref_}
              type="button"
              onClick={() => toggle(ref_)}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 text-left transition-colors"
            >
              <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${value.includes(ref_) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                {value.includes(ref_) && <Check size={10} className="text-white" />}
              </div>
              <span className="text-xs text-gray-700">{ref_}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const RiskModal = ({ isOpen, onClose, onSave, editRisk, existingRisks, masters }) => {
  const isEditing = Boolean(editRisk);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (editRisk) {
        setForm({
          aiSystem:       editRisk.aiSystem       || '',
          category:       editRisk.category       || '',
          title:          editRisk.title          || '',
          description:    editRisk.description    || '',
          likelihood:     editRisk.likelihood     || 3,
          impact:         editRisk.impact         || 3,
          regulatoryRefs: editRisk.regulatoryRefs || [],
          riskOwner:      editRisk.riskOwner      || '',
          controlStatus:  editRisk.controlStatus  || 'None',
          residualRisk:   editRisk.residualRisk   || 'Medium',
          status:         editRisk.status         || 'Open',
          reviewDate:     editRisk.reviewDate     || '',
          comments:       editRisk.comments       || '',
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [isOpen, editRisk]);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const score = calculateRiskScore(form.likelihood, form.impact);
  const level = getRiskLevel(score);

  const validate = () => {
    const e = {};
    if (!form.aiSystem)    e.aiSystem    = 'AI System is required';
    if (!form.category)    e.category    = 'Category is required';
    if (!form.title.trim()) e.title      = 'Risk Title is required';
    if (!form.description.trim()) e.description = 'Risk Description is required';
    if (!form.riskOwner.trim()) e.riskOwner = 'Risk Owner is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);

    const riskData = {
      ...form,
      id: isEditing ? editRisk.id : generateRiskId(existingRisks),
      riskScore: score,
      riskLevel: level,
    };

    setTimeout(() => {
      onSave(riskData);
      setSaving(false);
      onClose();
    }, 150);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Risk — ${editRisk?.id}` : 'Add New Risk'}
      subtitle={isEditing ? 'Update risk assessment details' : 'Record a new AI-related risk'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
              <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                All risks are scored using the formula: <strong>Risk Score = Likelihood × Impact</strong> (1–5 each).
                Score 20–25 = Critical · 12–19 = High · 6–11 = Medium · 1–5 = Low.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="AI System" required hint="Select from the list or type a custom system name.">
                <input
                  list="modal-ai-systems"
                  value={form.aiSystem}
                  onChange={(e) => set('aiSystem', e.target.value)}
                  placeholder="Select or type an AI system…"
                  className={`form-input ${errors.aiSystem ? 'border-red-400' : ''}`}
                  autoComplete="off"
                />
                <datalist id="modal-ai-systems">
                  {(masters?.aiSystems || []).map((s) => <option key={s} value={s} />)}
                </datalist>
                {errors.aiSystem && <p className="text-xs text-red-500 mt-1">{errors.aiSystem}</p>}
              </Field>

              <Field label="Risk Category" required>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className={`form-input ${errors.category ? 'border-red-400' : ''}`}
                >
                  <option value="">Select category…</option>
                  {(masters?.riskCategories || []).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </Field>
            </div>

            <Field label="Risk Title" required>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Concise risk statement (e.g. 'Model produces biased shortlisting decisions')"
                className={`form-input ${errors.title ? 'border-red-400' : ''}`}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </Field>

            <Field label="Risk Description" required hint="Describe the nature of the risk, how it arises, and its potential consequences.">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                placeholder="Detailed description of the risk, its root causes, and potential business impact…"
                className={`form-input resize-none ${errors.description ? 'border-red-400' : ''}`}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </Field>

            <div className="space-y-4">
              <LikelihoodImpactSlider
                label="Likelihood (1 = Rare, 5 = Almost Certain)"
                value={form.likelihood}
                onChange={(v) => set('likelihood', v)}
              />
              <LikelihoodImpactSlider
                label="Impact (1 = Negligible, 5 = Catastrophic)"
                value={form.impact}
                onChange={(v) => set('impact', v)}
              />
            </div>

            <Field label="Regulatory References" hint="Select all applicable regulatory frameworks and specific articles.">
              <RegRefMultiSelect
                value={form.regulatoryRefs}
                onChange={(v) => set('regulatoryRefs', v)}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Risk Owner" required hint="Select from the list or type a custom owner name.">
                <input
                  list="modal-risk-owners"
                  value={form.riskOwner}
                  onChange={(e) => set('riskOwner', e.target.value)}
                  placeholder="Select or type a risk owner…"
                  className={`form-input ${errors.riskOwner ? 'border-red-400' : ''}`}
                  autoComplete="off"
                />
                <datalist id="modal-risk-owners">
                  {(masters?.riskOwners || []).map((o) => <option key={o} value={o} />)}
                </datalist>
                {errors.riskOwner && <p className="text-xs text-red-500 mt-1">{errors.riskOwner}</p>}
              </Field>

              <Field label="Review Date">
                <input
                  type="date"
                  value={form.reviewDate}
                  onChange={(e) => set('reviewDate', e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Control Status">
                <select
                  value={form.controlStatus}
                  onChange={(e) => set('controlStatus', e.target.value)}
                  className="form-input"
                >
                  {CONTROL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Residual Risk">
                <select
                  value={form.residualRisk}
                  onChange={(e) => set('residualRisk', e.target.value)}
                  className="form-input"
                >
                  {RESIDUAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                  className="form-input"
                >
                  {RISK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Comments / Risk Treatment Notes" hint="Document treatment plans, interim controls, or review notes.">
              <textarea
                value={form.comments}
                onChange={(e) => set('comments', e.target.value)}
                rows={3}
                placeholder="Treatment actions, interim controls, review notes, escalation history…"
                className="form-input resize-none"
              />
            </Field>
          </div>

          <div className="space-y-4">
            <ScoreIndicator score={score} level={level} />

            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={13} className="text-red-500" />
                  <p className="text-xs font-semibold text-red-700">Please fix the following:</p>
                </div>
                <ul className="space-y-0.5">
                  {Object.values(errors).map((e, i) => (
                    <li key={i} className="text-xs text-red-600">• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Likelihood Scale</p>
              {[
                [1, 'Rare — Very unlikely to occur'],
                [2, 'Unlikely — Low probability'],
                [3, 'Possible — Moderate probability'],
                [4, 'Likely — Will probably occur'],
                [5, 'Almost Certain — Expected to occur'],
              ].map(([n, desc]) => (
                <div key={n} className={`flex gap-2 ${form.likelihood === n ? 'opacity-100' : 'opacity-40'}`}>
                  <span className="text-xs font-bold text-indigo-600 w-4 flex-shrink-0">{n}</span>
                  <span className="text-xs text-gray-600">{desc}</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Impact Scale</p>
              {[
                [1, 'Negligible — Minimal consequences'],
                [2, 'Minor — Limited impact, easily managed'],
                [3, 'Moderate — Significant but recoverable'],
                [4, 'Major — Severe impact on operations or compliance'],
                [5, 'Catastrophic — Existential or regulatory crisis'],
              ].map(([n, desc]) => (
                <div key={n} className={`flex gap-2 ${form.impact === n ? 'opacity-100' : 'opacity-40'}`}>
                  <span className="text-xs font-bold text-indigo-600 w-4 flex-shrink-0">{n}</span>
                  <span className="text-xs text-gray-600">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Risk'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const ViewRiskModal = ({ isOpen, onClose, risk, onEdit }) => {
  if (!risk) return null;
  const { format } = { format: (d, f) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={risk.id} subtitle={risk.title} size="xl">
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Risk Score',     value: `${risk.riskScore} / 25` },
            { label: 'Risk Level',     value: <RiskLevelBadge level={risk.riskLevel} size="lg" /> },
            { label: 'Status',         value: risk.status },
            { label: 'Control Status', value: risk.controlStatus },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <div className="font-semibold text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {[
            { label: 'AI System',   value: risk.aiSystem },
            { label: 'Category',    value: risk.category },
            { label: 'Risk Owner',  value: risk.riskOwner },
            { label: 'Review Date', value: risk.reviewDate || '—' },
            { label: 'Likelihood',  value: `${risk.likelihood} / 5` },
            { label: 'Impact',      value: `${risk.impact} / 5` },
            { label: 'Residual Risk', value: risk.residualRisk },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm text-gray-900 mt-0.5 font-medium">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
          <p className="text-sm text-gray-700 leading-relaxed">{risk.description}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Regulatory References</p>
          <div className="flex flex-wrap gap-1.5">
            {(risk.regulatoryRefs || []).map((ref) => (
              <span key={ref} className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded text-xs">
                {ref}
              </span>
            ))}
          </div>
        </div>

        {risk.comments && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Comments / Treatment Notes</p>
            <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">{risk.comments}</p>
          </div>
        )}

        {risk.auditLog?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Audit Log</p>
            <div className="space-y-2">
              {risk.auditLog.map((entry, i) => (
                <div key={i} className="flex gap-3 text-xs py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-indigo-600 font-semibold flex-shrink-0">{entry.action}</span>
                  <span className="text-gray-500">{entry.user}</span>
                  {entry.note && <span className="text-gray-600 italic">— {entry.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary">Close</button>
          <button onClick={() => { onClose(); onEdit(risk); }} className="btn-primary">Edit Risk</button>
        </div>
      </div>
    </Modal>
  );
};
