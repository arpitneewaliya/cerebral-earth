import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Camera, X, ChevronLeft, ChevronRight, ExternalLink, Info, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');

const ImageGallery = ({ region, countryName, isDarkMode }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!countryName && (!region || !region.lat || !region.lng)) return;

      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE}/api/images`;
        const params = {};

        if (countryName) {
          params.q = countryName;
        } else if (region.display_name) {
          params.q = region.display_name;
        } else {
          params.lat = region.lat;
          params.lon = region.lng;
        }

        const response = await axios.get(url, { params });
        setImages(response.data);
      } catch (err) {
        console.error('Error fetching images for gallery:', err);
        setError('Unable to load images for this place.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [region, countryName]);

  // Lightbox navigation helpers
  const handlePrev = useCallback((e) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  }, [activeImageIndex, images.length]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    if (activeImageIndex !== null) {
      setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  }, [activeImageIndex, images.length]);

  const handleClose = useCallback(() => {
    setActiveImageIndex(null);
  }, []);

  // Keyboard controls for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, handleClose, handlePrev, handleNext]);

  // Render loading skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <Camera className={`w-5 h-5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`} />
          <div className={`h-4 w-32 rounded ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        </div>
        {/* Large Image Skeleton */}
        <div className={`w-full h-48 md:h-52 rounded-2xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        {/* 2x2 Grid Skeletons */}
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-28 md:h-32 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6 text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-red-500/10 text-red-500">
          <Camera className="w-6 h-6" />
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {error}
        </p>
      </div>
    );
  }

  // Render empty state
  if (!loading && images.length === 0) {
    return (
      <div className="p-6 text-center space-y-3">
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'} ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <Camera className="w-6 h-6" />
        </div>
        <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
          No landscape photos found for {countryName || 'this region'}.
        </p>
      </div>
    );
  }

  const featuredImage = images[0];
  const gridImages = images.slice(1, 5);

  return (
    <div className="p-6 flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-1">
        <Camera className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        <h4 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Country Photos
        </h4>
      </div>

      {/* Gallery Layout */}
      <div className="flex flex-col gap-3">
        
        {/* Featured Image (Large) */}
        {featuredImage && (
          <div 
            onClick={() => setActiveImageIndex(0)}
            className={`group relative w-full h-48 md:h-52 rounded-2xl overflow-hidden border shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
              isDarkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-100'
            }`}
          >
            <img 
              src={featuredImage.imageUrl} 
              alt={featuredImage.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Title / Info Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 pt-8 flex items-end justify-between">
              <span className="text-white text-xs font-semibold truncate pr-4 drop-shadow">
                {featuredImage.title}
              </span>
              <span className="text-zinc-300 hover:text-white transition-colors flex items-center gap-0.5 text-[10px] font-medium bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                <Info className="w-3 h-3" /> View
              </span>
            </div>
          </div>
        )}

        {/* 2x2 Grid for Remaining Images */}
        {gridImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {gridImages.map((img, idx) => (
              <div 
                key={img.id}
                onClick={() => setActiveImageIndex(idx + 1)}
                className={`group relative h-28 md:h-32 rounded-xl overflow-hidden border shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                  isDarkMode ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-100'
                }`}
              >
                <img 
                  src={img.imageUrl} 
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-2 pt-6 flex items-end justify-between">
                  <span className="text-white text-[10px] font-medium truncate pr-2 drop-shadow">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && images[activeImageIndex] && (
        <div 
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300"
          onClick={handleClose}
        >
          {/* Top Panel Actions */}
          <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
            <div className="text-white/80 text-xs font-semibold px-3 py-1 bg-white/10 backdrop-blur-md rounded-full">
              Photo {activeImageIndex + 1} of {images.length}
            </div>
            <button 
              onClick={handleClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image Container with Prev/Next buttons */}
          <div className="relative w-full flex-1 flex items-center justify-center px-4 md:px-12 max-h-[70vh]">
            {/* Prev Button */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-6 z-25 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-105 active:scale-95 focus:outline-none"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <img 
              src={images[activeImageIndex].fullUrl} 
              alt={images[activeImageIndex].title}
              className="max-w-full max-h-full object-contain rounded shadow-2xl transition-all duration-300 select-none animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            />

            {/* Next Button */}
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-6 z-25 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all transform hover:scale-105 active:scale-95 focus:outline-none"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Details Overlay Card */}
          <div 
            className="w-full max-w-2xl px-6 pb-6 pt-4 text-left z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-zinc-900/80 border border-zinc-800 text-white p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-3.5 select-text">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-bold text-lg leading-snug tracking-tight text-white/95">
                  {images[activeImageIndex].title}
                </h3>
                <a 
                  href={images[activeImageIndex].descriptionUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 transition-all hover:bg-blue-500/20"
                >
                  Wikimedia Commons <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {images[activeImageIndex].description && (
                <p className="text-zinc-300 text-sm leading-relaxed max-h-24 overflow-y-auto pr-1">
                  {images[activeImageIndex].description}
                </p>
              )}

              <div className="border-t border-zinc-800/80 pt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400 font-medium">
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Author:</span>{' '}
                  <span className="text-zinc-300">{images[activeImageIndex].artist || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">License:</span>{' '}
                  <span className="text-zinc-300 uppercase">{images[activeImageIndex].license}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
