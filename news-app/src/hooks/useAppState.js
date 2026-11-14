import { useState, useCallback } from 'react';

/**
 * Centralized application UI state for the root map/news experience.
 * Encapsulates region selection, active dossier tab, and panel visibility.
 */
export function useAppState() {
  const [region, setRegion] = useState(null); // { lat, lng, ... }
  const [selectedOption, setSelectedOption] = useState('news'); // 'news' | 'macro' | 'country'
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleRegionSelect = useCallback((coords) => {
    setRegion(coords);
    setSelectedOption((prev) => prev || 'news');
    setIsOptionsOpen(true);
  }, []);

  return {
    region,
    selectedOption,
    isOptionsOpen,
    setRegion,
    setSelectedOption,
    setIsOptionsOpen,
    handleRegionSelect,
  };
}

export default useAppState;
