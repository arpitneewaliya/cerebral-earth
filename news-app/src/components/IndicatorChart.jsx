import React, { useEffect, useState, useMemo } from 'react';
import { ChartSkeleton, ErrorMessage } from './LoadingComponents.jsx';
import InteractiveChart from './InteractiveChart.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const formatMetric = (val, unit) => {
  if (val === undefined || val === null || isNaN(val)) return 'N/A';
  if (unit === '%') return `${Number(val).toFixed(2)}%`;
  const prefix = unit === 'USD' ? '$' : '';
  if (Math.abs(val) >= 1e12) return `${prefix}${(val / 1e12).toFixed(2)}T`;
  if (Math.abs(val) >= 1e9) return `${prefix}${(val / 1e9).toFixed(2)}B`;
  if (Math.abs(val) >= 1e6) return `${prefix}${(val / 1e6).toFixed(2)}M`;
  if (Math.abs(val) >= 1e3) return `${prefix}${Math.round(val).toLocaleString()}`;
  return `${prefix}${Number(val).toFixed(1)}`;
};

const IndicatorChart = ({
  indicator,
  title,
  unit = '',
  chartType = 'line',
  countryName,
  countryCode,
  start = 1960,
  end = 2023,
}) => {
  const { isDarkMode } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChart = async () => {
    if (!countryCode) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/api/charts/${indicator}/${countryCode}?start=${start}&end=${end}`
      );
      const data = await response.json();

      if (response.ok) {
        setChartData(Array.isArray(data) ? data : []);
      } else {
        setError(`${title} data retrieval failed. Please try again.`);
      }
    } catch (err) {
      setError('Failed to connect to telemetry server. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChart();
  }, [countryName, countryCode, start, end, indicator]);

  const stats = useMemo(() => {
    const valid = chartData.filter((d) => d && typeof d.value === 'number' && !isNaN(d.value));
    if (valid.length === 0) return null;
    const first = valid[0];
    const latest = valid[valid.length - 1];
    const peak = valid.reduce((max, item) => (item.value > max.value ? item : max), valid[0]);
    let deltaPct = null;
    if (first.value !== 0) {
      deltaPct = ((latest.value - first.value) / Math.abs(first.value)) * 100;
    }
    return { first, latest, peak, deltaPct };
  }, [chartData]);

  if (loading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchChart} />;
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-base font-bold tracking-tight">{title}</h3>
          <p
            className={`text-xs font-mono mt-0.5 ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            {countryName} // {start}–{end}
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-2">
          <div
            className={`p-3 rounded-xl border ${
              isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <p
              className={`text-[10px] font-mono uppercase ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Latest ({stats.latest.year})
            </p>
            <p className="text-sm font-mono font-bold mt-1 text-cyan-400">
              {formatMetric(stats.latest.value, unit)}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <p
              className={`text-[10px] font-mono uppercase ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Peak ({stats.peak.year})
            </p>
            <p className="text-sm font-mono font-bold mt-1">
              {formatMetric(stats.peak.value, unit)}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border ${
              isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <p
              className={`text-[10px] font-mono uppercase ${
                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              Period Shift
            </p>
            <p
              className={`text-sm font-mono font-bold mt-1 ${
                stats.deltaPct === null
                  ? ''
                  : stats.deltaPct >= 0
                  ? 'text-emerald-400'
                  : 'text-red-400'
              }`}
            >
              {stats.deltaPct !== null
                ? `${stats.deltaPct >= 0 ? '+' : ''}${stats.deltaPct.toFixed(1)}%`
                : 'N/A'}
            </p>
          </div>
        </div>
      )}

      <div
        className={`p-4 rounded-2xl border ${
          isDarkMode ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
        }`}
      >
        <InteractiveChart data={chartData} type={chartType} name={title} unit={unit} />
      </div>
    </div>
  );
};

export default IndicatorChart;
