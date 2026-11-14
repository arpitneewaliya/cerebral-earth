import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext.jsx';

const formatYAxis = (value, unit) => {
  if (unit === '%') {
    return `${value}%`;
  }
  if (Math.abs(value) >= 1.0e12) return (value / 1.0e12).toFixed(1) + 'T';
  if (Math.abs(value) >= 1.0e9) return (value / 1.0e9).toFixed(1) + 'B';
  if (Math.abs(value) >= 1.0e6) return (value / 1.0e6).toFixed(1) + 'M';
  if (Math.abs(value) >= 1.0e3) return (value / 1.0e3).toFixed(1) + 'k';
  return value;
};

const CustomTooltip = ({ active, payload, label, unit, isDarkMode }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    let formattedVal = Number(val).toLocaleString();
    if (unit === '%') {
      formattedVal = `${Number(val).toFixed(2)}%`;
    } else if (unit === 'USD') {
      formattedVal = `$${formattedVal}`;
    }

    return (
      <div
        className={`p-3 rounded-xl border shadow-xl text-left backdrop-blur-md ${
          isDarkMode
            ? 'bg-zinc-950/95 border-cyan-500/30 text-zinc-100'
            : 'bg-white/95 border-zinc-200 text-zinc-950'
        }`}
      >
        <p className="text-[11px] font-mono font-bold mb-1 text-cyan-400">YEAR {label}</p>
        <p className="text-xs font-semibold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          <span className="font-mono font-bold">{formattedVal}</span>
        </p>
      </div>
    );
  }
  return null;
};

const InteractiveChart = ({ data, type = 'line', name = 'Value', unit = '' }) => {
  const { isDarkMode } = useTheme();

  if (!data || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-64 border border-dashed rounded-xl ${
          isDarkMode ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-400'
        }`}
      >
        <p className="text-xs font-mono uppercase">No historical telemetry available</p>
      </div>
    );
  }

  const gridColor = isDarkMode ? '#27272a' : '#f4f4f5';
  const axisColor = isDarkMode ? '#71717a' : '#a1a1aa';
  const strokeColor = isDarkMode ? '#06b6d4' : '#2563eb';
  const fillColor = 'url(#chartGradient)';

  const renderChartContent = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.45} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="year"
              stroke={axisColor}
              tick={{ fontSize: 10 }}
              dy={8}
              tickLine={false}
            />
            <YAxis
              stroke={axisColor}
              tickFormatter={(v) => formatYAxis(v, unit)}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            <Area
              type="monotone"
              dataKey="value"
              name={name}
              stroke={strokeColor}
              strokeWidth={2}
              fill={fillColor}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="year"
              stroke={axisColor}
              tick={{ fontSize: 10 }}
              dy={8}
              tickLine={false}
            />
            <YAxis
              stroke={axisColor}
              tickFormatter={(v) => formatYAxis(v, unit)}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />}
              cursor={{ fill: isDarkMode ? 'rgba(6, 182, 212, 0.08)' : 'rgba(59, 130, 246, 0.05)' }}
            />
            <Bar dataKey="value" name={name} fill={strokeColor} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'line':
      default:
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="year"
              stroke={axisColor}
              tick={{ fontSize: 10 }}
              dy={8}
              tickLine={false}
            />
            <YAxis
              stroke={axisColor}
              tickFormatter={(v) => formatYAxis(v, unit)}
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            <Line
              type="monotone"
              dataKey="value"
              name={name}
              stroke={strokeColor}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: strokeColor, strokeWidth: 0 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full h-72 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        {renderChartContent()}
      </ResponsiveContainer>
    </div>
  );
};

export default InteractiveChart;
