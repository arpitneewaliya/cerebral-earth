import React from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Pin from './Pin';

const Map = ({ setRegion, pins }) => {
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setRegion({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={2}
      style={{ height: '100vh', width: '100%' }}
      worldCopyJump={false}
      maxBounds={[
        [-90, -180], // South West
        [90, 180],   // North East
      ]}
      maxBoundsViscosity={1.0}
      minZoom={2}
      maxZoom={18}
    >
      <TileLayer
        url="https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=eac5448467c34bd0bfaea5536ad8c1d3"
      />
      <MapClickHandler />
      {pins.map((pin, index) => (
        <Pin
          key={index}
          position={pin.position}
          image={pin.image}
          title={pin.title}
          url={pin.url}
          category={pin.category} // Pass category information
        />
      ))}
    </MapContainer>
  );
};

export default Map;
