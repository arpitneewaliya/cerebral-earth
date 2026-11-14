import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, Radio } from 'lucide-react';
import newsDefault from '../media/news-default.svg';

const createNewsBeaconIcon = () =>
  L.divIcon({
    className: 'custom-news-beacon',
    html: `
      <div class="news-marker-container">
        <div class="news-marker-ring"></div>
        <div class="news-marker-core"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -12],
  });

const newsBeaconIcon = createNewsBeaconIcon();

const Pin = ({ position, image, title, url, category = 'Headline', source }) => {
  return (
    <Marker position={position} icon={newsBeaconIcon}>
      <Popup className="news-popup" maxWidth={280} minWidth={240}>
        <div className="text-left select-none space-y-2">
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-zinc-500/20">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              <Radio className="w-3 h-3" />
              {source || category || 'GLOBAL INTEL'}
            </span>
            <span className="text-[9px] font-mono opacity-60">
              {position[0]?.toFixed(1)}°, {position[1]?.toFixed(1)}°
            </span>
          </div>

          {image && (
            <div className="rounded-lg overflow-hidden h-28 w-full bg-zinc-900 border border-zinc-500/20">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = newsDefault;
                }}
              />
            </div>
          )}

          <h3 className="font-bold text-xs leading-snug line-clamp-3">{title}</h3>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors pt-0.5"
            >
              <span>Open Intel Report</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default Pin;
