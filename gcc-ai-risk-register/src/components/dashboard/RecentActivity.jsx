import { formatDistanceToNow } from 'date-fns';
import { Plus, Edit2, Trash2, RefreshCw, Clock } from 'lucide-react';
import { RiskLevelBadge, StatusBadge } from '../common/Badge';

const ACTION_META = {
  created: { icon: Plus,      color: 'text-green-600 bg-green-50', label: 'Created' },
  updated: { icon: Edit2,     color: 'text-blue-600 bg-blue-50',   label: 'Updated' },
  deleted: { icon: Trash2,    color: 'text-red-600 bg-red-50',     label: 'Deleted' },
  reset:   { icon: RefreshCw, color: 'text-gray-600 bg-gray-50',   label: 'Reset'   },
};

export const RecentActivity = ({ risks, activityFeed }) => {
  const recentRisks = [...risks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Recent Activity</h3>
          <p className="text-xs text-gray-500 mt-0.5">Last modified risks</p>
        </div>
        <Clock size={15} className="text-gray-400" />
      </div>

      {recentRisks.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No risks recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {recentRisks.map((risk) => (
            <div
              key={risk.id}
              className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-semibold text-indigo-600">{risk.id}</span>
                  <RiskLevelBadge level={risk.riskLevel} size="sm" />
                  <StatusBadge status={risk.status} />
                </div>
                <p className="text-xs font-medium text-gray-800 mt-1 leading-snug truncate">
                  {risk.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{risk.aiSystem}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {formatDistanceToNow(new Date(risk.updatedAt), { addSuffix: true })}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{risk.riskOwner}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
