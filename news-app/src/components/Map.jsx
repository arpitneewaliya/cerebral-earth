import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Pin from './Pin';
import SearchBox from './SearchBox.jsx';

const MapAutofocus = ({ region }) => {
  const map = useMap();
  useEffect(() => {
    if (region && region.lat && region.lng) {
      if (region.boundingbox && region.boundingbox.length === 4) {
        const [minLat, maxLat, minLng, maxLng] = region.boundingbox;
        map.fitBounds([
          [minLat, minLng],
          [maxLat, maxLng]
        ], { animate: true, duration: 1.5, maxZoom: 8 });
      } else {
        map.flyTo([region.lat, region.lng], 6, { animate: true, duration: 1.5 });
      }
    }
  }, [region, map]);
  return null;
};

const Map = ({ region, setRegion, pins, isDarkMode }) => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    fetch('/countries.geojson')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error('Error loading country borders:', err));
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const targetLayer = e.target;
        targetLayer.setStyle({
          color: isDarkMode ? '#60a5fa' : '#2563eb', // soft blue in dark mode, clear blue in light mode
          weight: 2.0, // clean, high-precision border line
          fillColor: isDarkMode ? '#60a5fa' : '#2563eb',
          fillOpacity: 0.06, // subtle, premium backdrop glow
        });
        targetLayer.bringToFront();
      },
      mouseout: (e) => {
        const targetLayer = e.target;
        targetLayer.setStyle({
          color: 'transparent',
          weight: 0,
          fillColor: 'transparent',
          fillOpacity: 0,
        });
      },
      click: (e) => {
        setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
  };

  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <>
      <SearchBox onSelectLocation={setRegion} isDarkMode={isDarkMode} />
      <MapContainer
        center={[28.7, 77.1]}
        zoom={2.5}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
        worldCopyJump={false}
        maxBounds={[
          [-90, -180],
          [90, 180],
        ]}
        maxBoundsViscosity={1.0}
        minZoom={1}
        maxZoom={18}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        <MapClickHandler />
        <MapAutofocus region={region} />
        
        {geoJsonData && (
          <GeoJSON
            key={isDarkMode ? 'geojson-dark' : 'geojson-light'}
            data={geoJsonData}
            style={{
              color: 'transparent', // invisible by default to avoid overlapping map tile borders
              weight: 0,
              fillColor: 'transparent',
              fillOpacity: 0,
            }}
            onEachFeature={onEachFeature}
          />
        )}

        {pins.map((pin, index) => (
          <Pin
            key={index}
            position={pin.position}
            image={pin.image}
            title={pin.title}
            url={pin.url}
            category={pin.category}
          />
        ))}
      </MapContainer>
    </>
  );
};

export default Map;

