import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LoadingSpinner, ErrorMessage } from './LoadingComponents.jsx';

const CountryInfo = ({ region, isDarkMode }) => {
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCountry = async () => {
        if (!region) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('http://localhost:5000/api/country-info', {
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
                <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                <div className={`rounded-2xl shadow-xl p-8 transition-all duration-200 hover:shadow-2xl ${
                    isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                }`}>
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className={`text-2xl font-bold mb-2 ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                            {country.name.common}
                        </h2>
                        <p className={`text-lg ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                            {country.name.official}
                        </p>
                    </div>

                    {/* Flag */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src={country.flags.svg} 
                            alt={`${country.name.common} flag`} 
                            className="w-48 h-auto rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700" 
                        />
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}>
                                🏛️ Capital
                            </h4>
                            <p>{country.capital?.[0] || 'N/A'}</p>
                        </div>

                        <div className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                                isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`}>
                                🌍 Region
                            </h4>
                            <p>{country.region}</p>
                            {country.subregion && (
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {country.subregion}
                                </p>
                            )}
                        </div>

                        <div className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                                isDarkMode ? 'text-purple-400' : 'text-purple-600'
                            }`}>
                                👥 Population
                            </h4>
                            <p>{country.population.toLocaleString()}</p>
                        </div>

                        <div className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                                isDarkMode ? 'text-orange-400' : 'text-orange-600'
                            }`}>
                                📏 Area
                            </h4>
                            <p>{country.area.toLocaleString()} km²</p>
                        </div>

                        <div className={`p-4 rounded-lg md:col-span-2 ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                            }`}>
                                💰 Currency
                            </h4>
                            <p>
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
                    <div className="mt-6 text-center">
                        <a 
                            href={country.maps.googleMaps} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                                isDarkMode 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            🗺️ View on Google Maps
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🌍</div>
                    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        No country information available
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Unable to find information for this location.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CountryInfo;
