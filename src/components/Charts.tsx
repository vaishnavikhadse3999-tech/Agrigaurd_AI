interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  max?: number;
  height?: number;
  unit?: string;
}

export function BarChart({ data, max, height = 160, unit = '' }: BarChartProps) {
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-around gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / maxVal) * (height - 30);
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
            <span className="text-xs font-semibold text-primary-700">
              {d.value}{unit}
            </span>
            <div
              className="w-full max-w-[40px] rounded-t-lg transition-all duration-500"
              style={{
                height: Math.max(h, 4),
                backgroundColor: d.color || '#22c55e',
              }}
            />
            <span className="text-[10px] text-center text-primary-600 leading-tight">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

interface LineChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  unit?: string;
}

export function LineChart({ data, labels, height = 160, color = '#16a34a', unit = '' }: LineChartProps) {
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;
  const width = 100;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - 25 - ((v - minVal) / range) * (height - 40);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height - 25} ${points} ${width},${height - 25}`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#grad-${color.replace('#', '')})`} />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((v, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - 25 - ((v - minVal) / range) * (height - 40);
          return <circle key={i} cx={x} cy={y} r="2.5" fill={color} vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1 px-1">
          {labels.map((l, i) => (
            <span key={i} className="text-[10px] text-primary-600">{l}</span>
          ))}
        </div>
      )}
      {unit && <p className="text-xs text-primary-500 mt-1 text-center">Values in {unit}</p>}
    </div>
  );
}

interface DonutChartProps {
  value: number;
  max?: number;
  size?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function DonutChart({ value, max = 100, size = 120, color = '#16a34a', label, sublabel }: DonutChartProps) {
  const pct = Math.min(value / max, 1);
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - pct);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="-rotate-90" style={{ width: size, height: size }}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#dcfce7" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primary-900">{label ?? value}</span>
        {sublabel && <span className="text-[10px] text-primary-500">{sublabel}</span>}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({ value, max = 100, color = '#22c55e', label, showValue = true }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-primary-700">{label}</span>
          {showValue && <span className="text-sm font-semibold text-primary-800">{value}%</span>}
        </div>
      )}
      <div className="w-full h-3 rounded-full bg-primary-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
