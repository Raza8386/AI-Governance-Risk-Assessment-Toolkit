import { SummaryCards } from './SummaryCards';
import { RiskHeatmap } from './RiskHeatmap';
import { RiskChart } from './RiskChart';
import { RecentActivity } from './RecentActivity';
import { BarChart2, TrendingUp } from 'lucide-react';
import { AI_SYSTEMS } from '../../utils/riskUtils';
import { RiskLevelBadge } from '../common/Badge';

const AiSystemSummary = ({ risks }) => {
  const data = AI_SYSTEMS.map((sys) => {
    const sysRisks = risks.filter((r) => r.aiSystem === sys);
    const critHigh = sysRisks.filter((r) => r.riskLevel === 'Critical' || r.riskLevel === 'High').length;
    return { sys, total: sysRisks.length, critHigh };
  }).filter((d) => d.total > 0);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Risk by AI System</h3>
          <p className="text-xs text-gray-500 mt-0.5">Total risks per system</p>
        </div>
        <BarChart2 size={15} className="text-gray-400" />
      </div>
      <div className="space-y-3">
        {data.map(({ sys, total, critHigh }) => {
          const pct = Math.round((critHigh / total) * 100);
          return (
            <div key={sys}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 truncate max-w-[60%]">{sys}</span>
                <span className="text-xs text-gray-500">{total} risk{total !== 1 ? 's' : ''}</span>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pct > 70 ? '#DC2626' : pct > 40 ? '#EA580C' : '#CA8A04',
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{critHigh} critical/high</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TopRisks = ({ risks, onNavigate }) => {
  const top = [...risks]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Top 5 Risks</h3>
          <p className="text-xs text-gray-500 mt-0.5">Highest scoring open risks</p>
        </div>
        <TrendingUp size={15} className="text-gray-400" />
      </div>
      <div className="space-y-3">
        {top.map((risk, idx) => (
          <div key={risk.id} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-gray-500">{idx + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-indigo-600 font-semibold">{risk.id}</span>
                <RiskLevelBadge level={risk.riskLevel} size="sm" />
                <span className="text-xs font-bold text-gray-700 ml-auto">{risk.riskScore}</span>
              </div>
              <p className="text-xs text-gray-700 mt-0.5 leading-snug line-clamp-2">{risk.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{risk.aiSystem}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onNavigate('register')}
        className="mt-4 w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium py-2 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        View full register →
      </button>
    </div>
  );
};

export const Dashboard = ({ risks, stats, activityFeed, onNavigate }) => (
  <div className="p-6 space-y-5 max-w-screen-2xl">
    <SummaryCards stats={stats} />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-1">
        <RiskHeatmap risks={risks} />
      </div>
      <div className="lg:col-span-2">
        <RiskChart risks={risks} />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2">
        <RecentActivity risks={risks} activityFeed={activityFeed} />
      </div>
      <div className="space-y-5">
        <AiSystemSummary risks={risks} />
      </div>
    </div>

    <div>
      <TopRisks risks={risks} onNavigate={onNavigate} />
    </div>
  </div>
);
