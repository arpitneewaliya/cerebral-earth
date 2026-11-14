import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  CircleDollarSign,
  Flame,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import NewsContainer from './NewsContainer.jsx';
import CountryInfo from './CountryInfo.jsx';
import IndicatorChart from './IndicatorChart.jsx';
import { LoadingSpinner } from './LoadingComponents.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const MACRO_INDICATORS = [
  {
    id: 'gdp',
    label: 'GDP',
    title: 'Gross Domestic Product (GDP)',
    chartType: 'area',
    start: 1960,
    unit: 'USD',
    icon: TrendingUp,
  },
  {
    id: 'population',
    label: 'Population',
    title: 'Population Growth',
    chartType: 'area',
    start: 1960,
    unit: '',
    icon: Users,
  },
  {
    id: 'fdi',
    label: 'FDI Inflows',
    title: 'Foreign Direct Investment (FDI)',
    chartType: 'bar',
    start: 2000,
    unit: 'USD',
    icon: CircleDollarSign,
  },
  {
    id: 'inflation',
    label: 'Inflation',
    title: 'Consumer Price Inflation Rate',
    chartType: 'line',
    start: 2000,
    unit: '%',
    icon: Flame,
  },
  {
    id: 'unemployment',
    label: 'Unemployment',
    title: 'Unemployment Rate (% of Labor Force)',
    chartType: 'line',
    start: 2000,
    unit: '%',
    icon: Briefcase,
  },
  {
    id: 'literacy',
    label: 'Literacy',
    title: 'Adult Literacy Rate',
    chartType: 'line',
    start: 1980,
    unit: '%',
    icon: BookOpen,
  },
];

const ContentRenderer = ({ selectedOption, region, countryCode, countryName }) => {
  const { isDarkMode } = useTheme();
  const [activeMacro, setActiveMacro] = useState('gdp');

  useEffect(() => {
    if (selectedOption === 'chart' || selectedOption === 'gdp') setActiveMacro('gdp');
    else if (
      ['population', 'fdi', 'inflation', 'unemployment', 'literacy'].includes(selectedOption)
    ) {
      setActiveMacro(selectedOption);
    }
  }, [selectedOption]);

  if (!selectedOption || selectedOption === 'news') {
    return <NewsContainer region={region} category="All" />;
  }

  if (selectedOption === 'country') {
    return <CountryInfo region={region} />;
  }

  const currentIndicator =
    MACRO_INDICATORS.find((item) => item.id === activeMacro) || MACRO_INDICATORS[0];

  return (
    <div className="p-4 space-y-4">
      {/* 6-Pill Indicator Switcher */}
      <div className="text-left">
        <p
          className={`text-[10px] font-mono font-bold uppercase tracking-wider mb-2 ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          Select World Bank Telemetry Series
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {MACRO_INDICATORS.map((ind) => {
            const Icon = ind.icon;
            const isSelected = activeMacro === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveMacro(ind.id)}
                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-xs'
                      : 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{ind.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Display */}
      {countryCode ? (
        <IndicatorChart
          countryName={countryName}
          countryCode={countryCode}
          indicator={currentIndicator.id}
          title={currentIndicator.title}
          chartType={currentIndicator.chartType}
          start={currentIndicator.start}
          end={2023}
          unit={currentIndicator.unit}
        />
      ) : (
        <div className="flex items-center justify-center p-10">
          <LoadingSpinner size="md" />
          <span
            className={`ml-3 text-xs font-mono ${
              isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            RESOLVING SECTOR ISO CODE...
          </span>
        </div>
      )}
    </div>
  );
};

export default ContentRenderer;
