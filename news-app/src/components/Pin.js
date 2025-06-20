import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import technologyIcon from '../media/technology-icon.svg';
import flame from '../media/flame.svg';
import newsDefaultIcon from '../media/news-default.svg'

const icons = {
  Technology: new L.Icon({
    iconUrl: technologyIcon,
    iconSize: [25, 25],
  }),
  Business: new L.Icon({
    iconUrl: 'path/to/business-icon.png',
    iconSize: [25, 25],
  }),
  Health: new L.Icon({
    iconUrl: 'path/to/health-icon.png',
    iconSize: [25, 25],
  }),
  Science: new L.Icon({
    iconUrl: 'path/to/science-icon.png',
    iconSize: [25, 25],
  }),
  Sports: new L.Icon({
    iconUrl: 'path/to/sports-icon.png',
    iconSize: [25, 25],
  }),
  Entertainment: new L.Icon({
    iconUrl: 'path/to/entertainment-icon.png',
    iconSize: [25, 25],
  }),
  WildFire: new L.Icon({
    iconUrl: flame,
    iconSize: [25, 25],
  }),
  Default: new L.Icon({
    iconUrl: newsDefaultIcon,
    iconSize: [25, 25],
  }),
};

const Pin = ({ position, image, title, url, category }) => {
  const handleClick = () => {
    console.log(url);
    window.open(url, '_blank');
  };

  return (
    <Marker position={position} icon={icons[category] || icons.Default}>
      <Popup>
        <div style={{ cursor: 'pointer' }} onClick={handleClick}>
          <h3>{title}</h3>
          {image && <img src={image} alt={title} style={{ width: '100%' }} />}
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
