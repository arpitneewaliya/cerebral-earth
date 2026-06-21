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
  Tooltip
} from 'recharts';

// Formats huge numbers into clean, readable strings (e.g., Trillions, Billions, Millions)
const formatYAxis = (value, unit) => {
  if (unit === '%') {
    return `${value}%`;
  }
  if (value >= 1.0e12) return (value / 1.0e12).toFixed(1) + 'T';
  if (value >= 1.0e9) return (value / 1.0e9).toFixed(1) + 'B';
  if (value >= 1.0e6) return (value / 1.0e6).toFixed(1) + 'M';
  if (value >= 1.0e3) return (value / 1.0e3).toFixed(1) + 'k';
  return value;
};

const CustomTooltip = ({ active, payload, label, unit, isDarkMode }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    let formattedVal = val.toLocaleString();
    if (unit === '%') {
      formattedVal = `${val.toFixed(2)}%`;
    } else if (unit === 'USD') {
      formattedVal = `$${formattedVal}`;
    }
    
    return (
      <div className={`p-3 rounded-lg border shadow-lg text-left ${
        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-50' : 'bg-white border-zinc-200 text-zinc-950'
      }`}>
        <p className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{label}</p>
        <p className="text-sm font-semibold flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
          {payload[0].name}: <span className={isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}>{formattedVal}</span>
        </p>
      </div>
    );
  }
  return null;
};

const InteractiveChart = ({ data, type = 'line', name = 'Value', unit = '', isDarkMode }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed rounded-lg">
        <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>No historical data available.</p>
      </div>
    );
  }

  // Base styling variables depending on color theme
  const gridColor = isDarkMode ? '#27272a' : '#f4f4f5'; // zinc-800 / zinc-100
  const axisColor = isDarkMode ? '#71717a' : '#a1a1aa'; // zinc-500 / zinc-400
  const strokeColor = '#3b82f6'; // blue-500
  const fillColor = 'url(#chartGradient)';

  const renderChartContent = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="year" 
              stroke={axisColor} 
              tick={{ fontSize: 11 }} 
              dy={10}
              tickLine={false}
            />
            <YAxis 
              stroke={axisColor} 
              tickFormatter={(v) => formatYAxis(v, unit)} 
              tick={{ fontSize: 11 }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            <Area type="monotone" dataKey="value" name={name} stroke={strokeColor} strokeWidth={2} fill={fillColor} />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis 
              dataKey="year" 
              stroke={axisColor} 
              tick={{ fontSize: 11 }} 
              dy={10}
              tickLine={false}
            />
            <YAxis 
              stroke={axisColor} 
              tickFormatter={(v) => formatYAxis(v, unit)} 
              tick={{ fontSize: 11 }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
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
              tick={{ fontSize: 11 }} 
              dy={10}
              tickLine={false}
            />
            <YAxis 
              stroke={axisColor} 
              tickFormatter={(v) => formatYAxis(v, unit)} 
              tick={{ fontSize: 11 }} 
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip unit={unit} isDarkMode={isDarkMode} />} />
            <Line type="monotone" dataKey="value" name={name} stroke={strokeColor} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        {renderChartContent()}
      </ResponsiveContainer>
    </div>
  );
};

export default InteractiveChart;
