import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, Globe, FileText } from 'lucide-react';
import regulatoryFrameworks from '../../data/regulatoryFrameworks.json';

const PrincipleAccordion = ({ principle, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div>
          <p className="text-xs font-semibold text-gray-800">{principle.name}</p>
          {principle.arabic && (
            <p className="text-xs text-gray-400 mt-0.5" dir="rtl" lang="ar">{principle.arabic}</p>
          )}
        </div>
        {open
          ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
          : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 py-3 bg-white">
          <p className="text-xs text-gray-600 leading-relaxed">{principle.description}</p>
        </div>
      )}
    </div>
  );
};

const FrameworkCard = ({ fw, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all ${
      isSelected
        ? 'border-indigo-300 bg-indigo-50 shadow-sm'
        : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30'
    }`}
  >
    <div className="flex items-start gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
        style={{ backgroundColor: fw.iconColor || '#4F46E5' }}
      >
        {fw.shortName.slice(0, 2)}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900 leading-tight">{fw.shortName}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-tight">{fw.name}</p>
        <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs border ${fw.badgeColor}`}>
          {fw.type}
        </span>
      </div>
    </div>
  </button>
);

const FrameworkDetail = ({ fw }) => (
  <div className="space-y-5">
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: fw.iconColor || '#4F46E5' }}
            >
              {fw.shortName.slice(0, 3)}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{fw.name}</h2>
              <p className="text-xs text-gray-500">{fw.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {[
          { label: 'Jurisdiction', value: fw.jurisdiction, icon: Globe },
          { label: 'Type', value: fw.type, icon: FileText },
          { label: 'Published', value: fw.year, icon: FileText },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xs font-semibold text-gray-800 mt-0.5 leading-tight">{value}</p>
          </div>
        ))}
      </div>
    </div>

    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Overview</p>
      <p className="text-sm text-gray-700 leading-relaxed">{fw.summary}</p>
    </div>

    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Requirements & Principles</p>
      <div className="space-y-2">
        {fw.principles.map((p, i) => (
          <PrincipleAccordion key={p.name} principle={p} defaultOpen={i === 0} />
        ))}
      </div>
    </div>

    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Common Risk Register References</p>
      <div className="flex flex-wrap gap-1.5">
        {fw.keyRefs.map((ref) => (
          <span
            key={ref}
            className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-medium"
          >
            {ref}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export const RegulatoryPanel = () => {
  const [selected, setSelected] = useState(regulatoryFrameworks[0].id);
  const fw = regulatoryFrameworks.find((f) => f.id === selected);

  return (
    <div className="p-6 max-w-screen-2xl">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Regulatory Reference Guide</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          GCC and international AI governance frameworks aligned with this risk register
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-3">
            Select Framework
          </p>
          {regulatoryFrameworks.map((f) => (
            <FrameworkCard
              key={f.id}
              fw={f}
              isSelected={selected === f.id}
              onClick={() => setSelected(f.id)}
            />
          ))}

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-800 mb-1">Important Note</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              This reference guide is for informational purposes. Always consult official regulatory
              publications and qualified legal counsel for compliance decisions.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 card p-6">
          {fw ? <FrameworkDetail fw={fw} /> : (
            <p className="text-sm text-gray-400 text-center py-12">
              Select a framework from the left panel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
