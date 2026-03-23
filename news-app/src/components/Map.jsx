import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Pin from './Pin';

const Map = ({ setRegion, pins, isDarkMode }) => {
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  // We consistently use the 'light_all' tiles here. 
  // In Dark Mode, we use CSS filters in index.css (.dark-theme-map .leaflet-tile-pane) 
  // to invert the light tiles. This generates a dark map with perfectly white, clear text labels!
  const tileUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer
      center={[28.7, 77.1]}
      zoom={2.5}
      // Full-screen styles
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
  );
};

export default Map;
