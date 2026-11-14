import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building, Globe2, Users, Maximize, Coins, SearchX, ExternalLink } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from './LoadingComponents.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const CountryInfo = ({ region }) => {
  const { isDarkMode } = useTheme();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountry = async () => {
    if (!region) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE}/api/country-info`, {
        params: {
          lat: region.lat,
          lng: region.lng,
        },
      });
      setCountry(response.data?.[0] || null);
    } catch (err) {
      setError('Failed to load country intelligence profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, [region]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <LoadingSpinner size="md" />
        <span
          className={`ml-3 text-xs font-mono ${
            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
          }`}
        >
          COMPILING NATION DOSSIER...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} onRetry={fetchCountry} />
      </div>
    );
  }

  const cardClass = isDarkMode
    ? 'bg-zinc-900/75 border-zinc-800 text-zinc-100'
    : 'bg-zinc-50 border-zinc-200 text-zinc-900';

  const labelClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-500';

  return (
    <div className="p-4">
      {country ? (
        <div
          className={`rounded-2xl p-5 border space-y-5 text-left ${
            isDarkMode ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-zinc-200 shadow-xs'
          }`}
        >
          {/* Flag & Identity Banner */}
          <div className="flex items-center gap-4 pb-4 border-b border-zinc-500/20">
            <img
              src={country.flags.svg}
              alt={`${country.name.common} flag`}
              className="w-20 h-14 object-cover rounded-lg shadow-md border border-zinc-500/30 flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                SOVEREIGN PROFILE
              </span>
              <h2 className="text-xl font-extrabold tracking-tight truncate">
                {country.name.common}
              </h2>
              <p className={`text-xs truncate ${labelClass}`}>{country.name.official}</p>
            </div>
          </div>

          {/* Telemetry Fact Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3.5 rounded-xl border ${cardClass}`}>
              <h4 className={`text-[11px] font-mono uppercase mb-1 flex items-center gap-1.5 ${labelClass}`}>
                <Building className="w-3.5 h-3.5 text-cyan-400" /> Capital
              </h4>
              <p className="text-sm font-bold tracking-tight">
                {country.capital?.[0] || 'N/A'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${cardClass}`}>
              <h4 className={`text-[11px] font-mono uppercase mb-1 flex items-center gap-1.5 ${labelClass}`}>
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" /> Theater
              </h4>
              <p className="text-sm font-bold tracking-tight">{country.region}</p>
              {country.subregion && (
                <p className={`text-[11px] truncate mt-0.5 ${labelClass}`}>
                  {country.subregion}
                </p>
              )}
            </div>

            <div className={`p-3.5 rounded-xl border ${cardClass}`}>
              <h4 className={`text-[11px] font-mono uppercase mb-1 flex items-center gap-1.5 ${labelClass}`}>
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Population
              </h4>
              <p className="text-sm font-mono font-bold tracking-tight">
                {country.population ? country.population.toLocaleString() : 'N/A'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${cardClass}`}>
              <h4 className={`text-[11px] font-mono uppercase mb-1 flex items-center gap-1.5 ${labelClass}`}>
                <Maximize className="w-3.5 h-3.5 text-cyan-400" /> Landmass
              </h4>
              <p className="text-sm font-mono font-bold tracking-tight">
                {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border col-span-2 ${cardClass}`}>
              <h4 className={`text-[11px] font-mono uppercase mb-1 flex items-center gap-1.5 ${labelClass}`}>
                <Coins className="w-3.5 h-3.5 text-cyan-400" /> Monetary Unit
              </h4>
              <p className="text-sm font-bold tracking-tight">
                {country.currencies
                  ? Object.values(country.currencies)
                      .map((c) => `${c.name} (${c.symbol})`)
                      .join(', ')
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          {country.maps?.googleMaps && (
            <div className="pt-1">
              <a
                href={country.maps.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-colors ${
                  isDarkMode
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25'
                    : 'bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <span>Open Satellite Reconnaissance</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-14 flex flex-col items-center">
          <SearchX className="w-10 h-10 mb-3 opacity-40 text-cyan-400" />
          <h3 className="text-sm font-bold tracking-tight mb-1">
            No Sovereign Dossier Available
          </h3>
          <p className={`text-xs ${labelClass}`}>
            Unable to resolve country profile for these coordinates.
          </p>
        </div>
      )}
    </div>
  );
};

export default CountryInfo;
