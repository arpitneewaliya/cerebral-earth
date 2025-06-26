import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CountryInfo.css';

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
        <div className="country-info">
            {country ? (
                <div className="country-card">
                    <h2 className="country-name">Common Name: {country.name.common}</h2>
                    <h3 className="official-name">Official Name: {country.name.official}</h3>
                    <img src={country.flags.svg} alt={`${country.name.common} flag`} className="country-flag" />
                    <p><strong>Capital:</strong> {country.capital?.[0]}</p>
                    <p><strong>Region:</strong> {country.region}</p>
                    <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                    <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
                    <p><strong>Google Map Link:</strong> <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>
                    <p><strong>Currency:</strong> {
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
