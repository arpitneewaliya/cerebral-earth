import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Building, Globe2, Users, Maximize, Coins, SearchX, ExternalLink } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from './LoadingComponents.jsx';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const CountryInfo = ({ region, isDarkMode }) => {
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
            setCountry(response.data[0]);
        } catch (err) {
            setError('Failed to load country information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountry();
    }, [region]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="lg" />
                <span className={`ml-3 text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    Loading country information...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <ErrorMessage message={error} onRetry={fetchCountry} isDarkMode={isDarkMode} />
            </div>
        );
    }

    return (
        <div className="p-6">
            {country ? (
                <div className={`rounded-xl shadow-sm p-4 sm:p-8 border ${
                    isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-50' : 'bg-white border-zinc-200 text-zinc-950'
                }`}>
                    {/* Header */}
                    <div className="text-center mb-8 flex flex-col gap-1.5">
                        <h2 className={`text-3xl font-bold tracking-tight ${
                            isDarkMode ? 'text-zinc-50' : 'text-zinc-950'
                        }`}>
                            {country.name.common}
                        </h2>
                        <p className={`text-base font-medium ${
                            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>
                            {country.name.official}
                        </p>
                    </div>

                    {/* Flag */}
                    <div className="flex justify-center mb-10">
                        <img 
                            src={country.flags.svg} 
                            alt={`${country.name.common} flag`} 
                            className={`w-48 h-auto rounded-md shadow-sm border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`} 
                        />
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-5 rounded-lg border ${
                            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                        }`}>
                            <h4 className={`text-sm font-medium mb-1.5 flex items-center gap-2 ${
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>
                                <Building className="w-4 h-4" /> Capital
                            </h4>
                            <p className="text-xl font-semibold tracking-tight">{country.capital?.[0] || 'N/A'}</p>
                        </div>

                        <div className={`p-5 rounded-lg border ${
                            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                        }`}>
                            <h4 className={`text-sm font-medium mb-1.5 flex items-center gap-2 ${
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>
                                <Globe2 className="w-4 h-4" /> Region
                            </h4>
                            <p className="text-xl font-semibold tracking-tight">{country.region}</p>
                            {country.subregion && (
                                <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    {country.subregion}
                                </p>
                            )}
                        </div>

                        <div className={`p-5 rounded-lg border ${
                            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                        }`}>
                            <h4 className={`text-sm font-medium mb-1.5 flex items-center gap-2 ${
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>
                                <Users className="w-4 h-4" /> Population
                            </h4>
                            <p className="text-xl font-semibold tracking-tight">{country.population.toLocaleString()}</p>
                        </div>

                        <div className={`p-5 rounded-lg border ${
                            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                        }`}>
                            <h4 className={`text-sm font-medium mb-1.5 flex items-center gap-2 ${
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>
                                <Maximize className="w-4 h-4" /> Area
                            </h4>
                            <p className="text-xl font-semibold tracking-tight">{country.area.toLocaleString()} km²</p>
                        </div>

                        <div className={`p-5 rounded-lg border md:col-span-2 ${
                            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                        }`}>
                            <h4 className={`text-sm font-medium mb-1.5 flex items-center gap-2 ${
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            }`}>
                                <Coins className="w-4 h-4" /> Currency
                            </h4>
                            <p className="text-xl font-semibold tracking-tight">
                                {country.currencies
                                    ? Object.values(country.currencies)
                                        .map(c => `${c.name} (${c.symbol})`)
                                        .join(', ')
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 text-center flex justify-center">
                        <a 
                            href={country.maps.googleMaps} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center whitespace-nowrap gap-2 px-6 py-2.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 ${
                                isDarkMode 
                                    ? 'bg-zinc-50 text-zinc-900 hover:bg-zinc-200' 
                                    : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90'
                            }`}
                        >
                            View on Google Maps
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 flex flex-col items-center">
                    <SearchX className={`w-12 h-12 mb-4 stroke-1 ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`} />
                    <h3 className={`text-base font-semibold tracking-tight mb-1 ${isDarkMode ? 'text-zinc-50' : 'text-zinc-900'}`}>
                        No country information available
                    </h3>
                    <p className={`text-sm flex flex-col gap-1.5 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Unable to find information for this location.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CountryInfo;
