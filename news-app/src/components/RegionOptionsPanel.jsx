import React from 'react';
import { MapPin, Newspaper, Globe, TrendingUp, Users, CircleDollarSign, BarChart3, TrendingDown, BookOpen, ChevronRight, Activity } from 'lucide-react';
import { IoNewspaperOutline } from "react-icons/io5";
import { FaGlobeAmericas } from "react-icons/fa";

const RegionOptionsPanel = ({ 
  region, 
  selectedOption, 
  setSelectedOption, 
  countryName
}) => {
  if (!region) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-6 text-center space-y-4">
        <MapPin className="w-12 h-12 opacity-50 text-zinc-400" />
        <p className="text-lg font-medium text-zinc-500">
          Select a region on the map to explore.
        </p>
      </div>
    );
  }

  if (selectedOption) {
    return null; // Content will be handled by ContentRenderer
  }

  return (
    <div className="flex flex-col space-y-8 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Insights Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-red-500" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Insights & News
          </h4>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <OptionCard
            icon={<IoNewspaperOutline className="w-6 h-6" />}
            title="Latest News"
            description="Recent headlines and articles from this region."
            gradient="from-red-500 to-rose-600"
            onClick={() => setSelectedOption('news')}
          />
          <OptionCard
            icon={<FaGlobeAmericas className="w-5 h-5" />}
            title="Country Overview"
            description="Key facts, geography, and statistics."
            gradient="from-emerald-500 to-teal-600"
            onClick={() => setSelectedOption('country')}
          />
        </div>
      </section>

      {/* Data Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Economic & Social Data
          </h4>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          <DataCard
            icon={<TrendingUp className="w-5 h-5" />}
            title="GDP Trends"
            description="Economic growth over time"
            color="blue"
            onClick={() => setSelectedOption('chart')}
          />
          <DataCard
            icon={<Users className="w-5 h-5" />}
            title="Population"
            description="Demographic trends"
            color="purple"
            onClick={() => setSelectedOption('population')}
          />
          <DataCard
            icon={<CircleDollarSign className="w-5 h-5" />}
            title="Foreign Investment"
            description="FDI trends"
            color="orange"
            onClick={() => setSelectedOption('fdi')}
          />
          <DataCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="Inflation Rate"
            description="Price stability trends"
            color="red"
            onClick={() => setSelectedOption('inflation')}
          />
          <DataCard
            icon={<TrendingDown className="w-5 h-5" />}
            title="Unemployment"
            description="Labor market trends"
            color="yellow"
            onClick={() => setSelectedOption('unemployment')}
          />
          <DataCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Literacy Rate"
            description="Education indicators"
            color="indigo"
            onClick={() => setSelectedOption('literacy')}
          />
        </div>
      </section>
    </div>
  );
};

const OptionCard = ({ icon, title, description, gradient, onClick }) => (
  <button 
    className="w-full relative overflow-hidden p-5 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl bg-white border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md"
    onClick={onClick}
  >
    {/* Subtle gradient background effect on hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${gradient}`} />
    
    <div className="relative flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg text-white bg-gradient-to-br ${gradient}`}>
          {icon}
        </div>
        <div>
          <h5 className="text-lg font-semibold tracking-tight text-zinc-900">
            {title}
          </h5>
          <p className="text-sm mt-0.5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 text-zinc-400 group-hover:text-zinc-600" />
    </div>
  </button>
);

const DataCard = ({ icon, title, description, color, onClick }) => {
  const colorConfig = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 border-blue-100 hover:border-blue-300',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100 border-purple-100 hover:border-purple-300',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100 border-orange-100 hover:border-orange-300',
    red: 'bg-red-50 text-red-600 group-hover:bg-red-100 border-red-100 hover:border-red-300',
    yellow: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 border-yellow-100 hover:border-yellow-300',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 border-indigo-100 hover:border-indigo-300',
  };

  const themeConfig = colorConfig[color];

  return (
    <button 
      className="w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 text-left group hover:shadow-md bg-white border-zinc-200 hover:border-zinc-300 shadow-sm"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-lg transition-colors duration-200 ${themeConfig.split(' ').slice(0, 3).join(' ')}`}>
          {icon}
        </div>
        <div>
          <h6 className="font-semibold text-zinc-800">
            {title}
          </h6>
          <p className="text-xs mt-0.5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 text-zinc-400 group-hover:text-zinc-600" />
    </button>
  );
};

export default RegionOptionsPanel;