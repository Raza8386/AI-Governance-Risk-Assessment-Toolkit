import { LayoutDashboard, ClipboardList, BookOpen, Shield, Settings2 } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',            icon: LayoutDashboard },
  { id: 'register',    label: 'Risk Register',         icon: ClipboardList },
  { id: 'regulatory',  label: 'Regulatory Reference',  icon: BookOpen },
];

const SETTINGS_ITEMS = [
  { id: 'masters', label: 'Reference Data Masters', icon: Settings2 },
];

export const Sidebar = ({ currentPage, onNavigate }) => (
  <aside className="w-64 flex-shrink-0 bg-slate-900 flex flex-col h-full">
    <div className="px-5 pt-6 pb-5 border-b border-slate-700/60">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">GCC AI Risk</p>
          <p className="text-slate-400 text-xs leading-tight">Register</p>
        </div>
      </div>
    </div>

    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
        Navigation
      </p>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={`sidebar-link w-full text-left ${
            currentPage === id ? 'sidebar-link-active' : 'sidebar-link-inactive'
          }`}
        >
          <Icon size={16} className="flex-shrink-0" />
          <span>{label}</span>
        </button>
      ))}

      <div className="pt-3 mt-3 border-t border-slate-700/40">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Configuration
        </p>
        {SETTINGS_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`sidebar-link w-full text-left ${
              currentPage === id ? 'sidebar-link-active' : 'sidebar-link-inactive'
            }`}
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>

    <div className="px-4 py-5 border-t border-slate-700/60">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Frameworks
        </p>
        {['SDAIA', 'PDPL', 'NCA', 'NIST AI RMF', 'ISO 42001'].map((fw) => (
          <div key={fw} className="flex items-center gap-2 py-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">{fw}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-slate-700/60">
        <p className="text-xs text-slate-500 leading-relaxed">
          GCC AI Risk Register v1.0
          <br />
          <span className="text-slate-600">MIT License</span>
        </p>
      </div>
    </div>
  </aside>
);
