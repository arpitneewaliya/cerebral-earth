import React, { useState, useEffect } from 'react';
import { Globe, Map, TrendingUp, ShieldAlert, X } from 'lucide-react';

const WelcomeOverlay = ({ isVisible }) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!isVisible || dismissed) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, dismissed]);

  if (!isVisible || dismissed) return null;

  const handleClose = () => {
    setDismissed(true);
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 welcome-animate border transform transition-all duration-300 bg-white/95 text-zinc-800 border-zinc-200/80 shadow-[0_0_50px_rgba(0,0,0,0.05)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-full border transition-all duration-200 cursor-pointer border-zinc-200 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700"
          aria-label="Close welcome message"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="relative p-3.5 rounded-2xl border bg-zinc-50 border-zinc-200 text-zinc-850">
              <Globe className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-zinc-900">
            Welcome to Cerebral Earth
          </h2>
          <p className="mt-1.5 text-xs max-w-sm text-zinc-500">
            Your interactive visualization platform for global events, indicators, and insights.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg border mt-0.5 shrink-0 bg-zinc-50 border-zinc-200 text-zinc-700">
              <Map className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-left">Interactive Globe Map</h3>
              <p className="text-[11px] text-left mt-0.5 leading-relaxed text-zinc-500">
                Explore visual overlays, borders, and customize layers to your preferences.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg border mt-0.5 shrink-0 bg-zinc-50 border-zinc-200 text-zinc-700">
              <Globe className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-left">Real-time Localized News</h3>
              <p className="text-[11px] text-left mt-0.5 leading-relaxed text-zinc-500">
                Read real-time top headlines based on region geolocation and map pinning.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg border mt-0.5 shrink-0 bg-zinc-50 border-zinc-200 text-zinc-700">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-left">Global Indicator Charts</h3>
              <p className="text-[11px] text-left mt-0.5 leading-relaxed text-zinc-500">
                Analyze and compare development, demographics, and GDP indicators worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg border mt-0.5 shrink-0 bg-zinc-50 border-zinc-200 text-zinc-700">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-left">Conflict Tracker</h3>
              <p className="text-[11px] text-left mt-0.5 leading-relaxed text-zinc-500">
                Monitor live armed conflicts, civil unrest, and tension indicators around the world.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Action */}
        <div className="text-center">
          <button
            onClick={handleClose}
            className="w-full font-bold py-2.5 px-6 rounded-xl transition-all duration-200 cursor-pointer text-xs border bg-zinc-950 hover:bg-zinc-850 text-white border-zinc-950"
          >
            Start Exploring
          </button>
          <p className="mt-3 text-[10px] text-zinc-400">
            Click anywhere outside, press Esc, or click the close button to dismiss.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;