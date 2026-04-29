import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend
} from 'recharts';
import riskCategories from '../../data/riskCategories.json';

const LEVEL_COLORS = {
  Critical: '#DC2626',
  High:     '#EA580C',
  Medium:   '#CA8A04',
  Low:      '#16A34A',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs max-w-xs">
      <p className="font-semibold text-gray-800 mb-2 leading-tight">{label}</p>
      {payload.map((p) =>
        p.value > 0 ? (
          <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
              <span className="text-gray-600">{p.name}</span>
            </span>
            <span className="font-semibold text-gray-800">{p.value}</span>
          </div>
        ) : null
      )}
      <div className="border-t border-gray-100 mt-1.5 pt-1.5 flex justify-between">
        <span className="text-gray-500">Total</span>
        <span className="font-bold text-gray-800">{total}</span>
      </div>
    </div>
  );
};

export const RiskChart = ({ risks }) => {
  const data = riskCategories.map((cat) => {
    const catRisks = risks.filter((r) => r.category === cat);
    return {
      name: cat.length > 28 ? cat.slice(0, 28) + '…' : cat,
      fullName: cat,
      Critical: catRisks.filter((r) => r.riskLevel === 'Critical').length,
      High:     catRisks.filter((r) => r.riskLevel === 'High').length,
      Medium:   catRisks.filter((r) => r.riskLevel === 'Medium').length,
      Low:      catRisks.filter((r) => r.riskLevel === 'Low').length,
      total:    catRisks.length,
    };
  }).filter((d) => d.total > 0);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Risks by Category</h3>
        <p className="text-xs text-gray-500 mt-0.5">Distribution of risk levels across AI risk categories</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          barSize={12}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{ fontSize: 10, fill: '#64748B' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F8FAFC' }} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="circle"
            iconSize={8}
          />
          {Object.entries(LEVEL_COLORS).map(([level, color]) => (
            <Bar key={level} dataKey={level} stackId="a" fill={color} radius={level === 'Low' ? [0, 3, 3, 0] : [0, 0, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
