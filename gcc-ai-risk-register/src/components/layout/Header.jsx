import { Bell, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const PAGE_META = {
  dashboard:  { title: 'Dashboard',                 subtitle: 'AI risk posture overview and key metrics' },
  register:   { title: 'Risk Register',              subtitle: 'Manage and track all AI-related risks' },
  regulatory: { title: 'Regulatory Reference',       subtitle: 'GCC and international AI regulatory frameworks' },
  masters:    { title: 'Reference Data Masters',     subtitle: 'Manage AI systems, risk categories, and owners' },
};

export const Header = ({ currentPage, stats, onReset }) => {
  const meta = PAGE_META[currentPage] || PAGE_META.dashboard;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-base font-semibold text-gray-900">{meta.title}</h1>
          <p className="text-xs text-gray-500">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-4 mr-2">
          {[
            { label: 'Critical', count: stats.critical, color: 'text-red-600' },
            { label: 'High',     count: stats.high,     color: 'text-orange-500' },
            { label: 'Open',     count: stats.open,     color: 'text-blue-600' },
          ].map(({ label, count, color }) => (
            <div key={label} className="text-center">
              <p className={`text-sm font-bold ${color}`}>{count}</p>
              <p className="text-xs text-gray-400 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="text-right hidden md:block">
          <p className="text-xs font-medium text-gray-700">
            {format(new Date(), 'dd MMM yyyy')}
          </p>
          <p className="text-xs text-gray-400">{format(new Date(), 'EEEE')}</p>
        </div>

        <button
          onClick={onReset}
          title="Reset to sample data"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw size={15} />
        </button>

        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
          RM
        </div>
      </div>
    </header>
  );
};
