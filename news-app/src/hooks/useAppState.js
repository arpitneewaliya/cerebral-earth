import { useState, useCallback } from 'react';

/**
 * Centralized application UI state for the root map/news experience.
 * Encapsulates region selection, option selection, and panel visibility.
 */
export function useAppState() {
  const [region, setRegion] = useState(null); // { lat, lng } or provider-specific structure
  const [selectedOption, setSelectedOption] = useState(null); // e.g., 'news' | 'charts' | ...
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // Wrap higher-level action when a region is selected to keep related logic together
  const handleRegionSelect = useCallback((coords) => {
    setRegion(coords);
    setSelectedOption(null);     // reset to show options again
    setIsOptionsOpen(true);      // open panel when region is selected
  }, []);

  return {
    // raw state
    region,
    selectedOption,
    isOptionsOpen,
    // setters
    setRegion,
    setSelectedOption,
    setIsOptionsOpen,
    // composed actions
    handleRegionSelect
  };
}

export default useAppState;
