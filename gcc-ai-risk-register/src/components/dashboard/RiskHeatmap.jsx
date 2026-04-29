import { getHeatmapCellStyle } from '../../utils/riskUtils';

export const RiskHeatmap = ({ risks }) => {
  const counts = {};
  risks.forEach((r) => {
    const key = `${r.likelihood}-${r.impact}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  const impacts = [5, 4, 3, 2, 1];
  const likelihoods = [1, 2, 3, 4, 5];

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">Risk Heatmap</h3>
        <p className="text-xs text-gray-500 mt-0.5">Likelihood × Impact — number of risks per cell</p>
      </div>

      <div className="flex gap-3">
        <div className="flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Impact</span>
        </div>

        <div className="flex-1">
          <div className="grid" style={{ gridTemplateColumns: `auto repeat(5, 1fr)` }}>
            <div />
            {likelihoods.map((l) => (
              <div key={l} className="text-center pb-1">
                <span className="text-xs font-medium text-gray-500">{l}</span>
              </div>
            ))}

            {impacts.map((impact) => (
              <>
                <div key={`label-${impact}`} className="flex items-center justify-center pr-2">
                  <span className="text-xs font-medium text-gray-500">{impact}</span>
                </div>
                {likelihoods.map((likelihood) => {
                  const style = getHeatmapCellStyle(likelihood, impact);
                  const count = counts[`${likelihood}-${impact}`] || 0;
                  const score = likelihood * impact;
                  return (
                    <div
                      key={`${likelihood}-${impact}`}
                      className="aspect-square flex flex-col items-center justify-center rounded-md border text-center cursor-default transition-transform hover:scale-105 m-0.5"
                      style={{
                        backgroundColor: style.bg,
                        borderColor: style.border,
                      }}
                      title={`L${likelihood} × I${impact} = ${score} | ${count} risk${count !== 1 ? 's' : ''}`}
                    >
                      {count > 0 && (
                        <span
                          className="font-bold text-sm leading-none"
                          style={{ color: style.text }}
                        >
                          {count}
                        </span>
                      )}
                      <span
                        className="text-xs mt-0.5 opacity-60"
                        style={{ color: style.text, fontSize: '0.6rem' }}
                      >
                        {score}
                      </span>
                    </div>
                  );
                })}
              </>
            ))}
          </div>

          <div className="mt-2 text-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Likelihood</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {[
          { label: 'Critical (20–25)', bg: '#FCA5A5', text: '#7F1D1D' },
          { label: 'High (12–19)',     bg: '#FED7AA', text: '#7C2D12' },
          { label: 'Medium (6–11)',    bg: '#FDE68A', text: '#78350F' },
          { label: 'Low (1–5)',        bg: '#A7F3D0', text: '#064E3B' },
        ].map(({ label, bg, text }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: bg }} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
