import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountryInfo = ({ region }) => {
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (region) {
            const fetchCountry = async () => {
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
                    setError('Failed to load country information.');
                }
                setLoading(false);
            };
            fetchCountry();
        }
    }, [region]);

    if (loading) return <p>Loading country info...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex justify-center m-8 font-sans">
            {country ? (
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-[600px] w-full transition-transform duration-200 hover:-translate-y-1">
                    <h2 className="text-[1.8rem] font-semibold text-slate-800 mb-2">Common Name: {country.name.common}</h2>
                    <h3 className="text-[1.2rem] text-slate-500 mb-4">Official Name: {country.name.official}</h3>
                    <img src={country.flags.svg} alt={`${country.name.common} flag`} className="w-full max-w-[300px] h-auto rounded-lg my-4 shadow-lg mx-auto" />
                    <p className="text-slate-700 my-2"><strong>Capital:</strong> {country.capital?.[0]}</p>
                    <p className="text-slate-700 my-2"><strong>Region:</strong> {country.region}</p>
                    <p className="text-slate-700 my-2"><strong>Population:</strong> {country.population.toLocaleString()}</p>
                    <p className="text-slate-700 my-2"><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
                    <p className="text-slate-700 my-2"><strong>Google Map Link:</strong> <a className="text-sky-600 hover:underline" href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>
                    <p className="text-slate-700 my-2"><strong>Currency:</strong> {
                        country.currencies
                            ? Object.values(country.currencies)
                                .map(c => `${c.name} (${c.symbol})`)
                                .join(', ')
                            : 'N/A'
                    }</p>
                </div>
            ) : (
                <p>No country information available.</p>
            )}
        </div>
    );
};

export default CountryInfo;
