'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CitySummary } from '@/lib/useCities';

interface CitySelectProps {
  cities: CitySummary[];
  loading: boolean;
  value: string;
  onChange: (cityName: string) => void;
  placeholder?: string;
  excludeCity?: string;
  accentColor?: string;
}

const getClassificationColor = (classification: string) => {
  switch (classification) {
    case 'Good': return 'bg-emerald-500';
    case 'Moderate': return 'bg-yellow-500';
    case 'Unhealthy (Sensitive)': return 'bg-orange-400';
    case 'Unhealthy': return 'bg-red-500';
    case 'Hazardous': return 'bg-purple-600';
    default: return 'bg-muted-foreground';
  }
};

const getClassificationLabel = (classification: string) => {
  switch (classification) {
    case 'Good': return 'Good';
    case 'Moderate': return 'Moderate';
    case 'Unhealthy (Sensitive)': return 'Sensitive';
    case 'Unhealthy': return 'Unhealthy';
    case 'Hazardous': return 'Hazardous';
    default: return '';
  }
};

export default function CitySelect({
  cities,
  loading,
  value,
  onChange,
  placeholder = 'Search for a city...',
  excludeCity,
  accentColor = 'primary',
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredCities = cities.filter((city) => {
    if (excludeCity && city.name === excludeCity) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      city.name.toLowerCase().includes(q) ||
      city.country.toLowerCase().includes(q)
    );
  });

  // Reset highlighted index when filter changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search, isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-city-item]');
      const item = items[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((cityName: string) => {
    onChange(cityName);
    setIsOpen(false);
    setSearch('');
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCities[highlightedIndex]) {
          handleSelect(filteredCities[highlightedIndex].name);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        break;
    }
  };

  const selectedCity = cities.find((c) => c.name === value);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selected City / Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        onKeyDown={handleKeyDown}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-300 text-left
          ${isOpen
            ? `border-${accentColor}/50 ring-2 ring-${accentColor}/20 bg-muted/30`
            : 'border-border bg-muted/50 hover:border-muted-foreground/30 hover:bg-muted/70'
          }`}
        style={isOpen ? {
          borderColor: `hsl(var(--${accentColor}) / 0.5)`,
          boxShadow: `0 0 0 3px hsl(var(--${accentColor}) / 0.1)`,
        } : {}}
      >
        {loading ? (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-sm font-medium">Loading cities...</span>
          </div>
        ) : selectedCity ? (
          <div className="flex items-center flex-1 min-w-0">
            <MapPin className="w-4 h-4 mr-2.5 text-muted-foreground shrink-0" />
            <span className="font-semibold text-foreground truncate">{selectedCity.name}</span>
            <span className="text-muted-foreground mx-1.5">·</span>
            <span className="text-sm text-muted-foreground truncate">{selectedCity.country}</span>
            <div className="ml-auto flex items-center shrink-0 pl-3">
              <span className={`w-2 h-2 rounded-full ${getClassificationColor(selectedCity.classification)} mr-1.5`} />
              <span className="text-xs text-muted-foreground font-medium">AQI {selectedCity.aqi}</span>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground/60 text-sm font-medium">{placeholder}</span>
        )}
        <ChevronDown
          className={`w-4 h-4 ml-2 text-muted-foreground shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border overflow-hidden"
            style={{
              backgroundColor: 'var(--card-glass)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Search Input */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type to filter cities..."
                  className="w-full pl-9 pr-8 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  style={{ ['--tw-ring-color' as any]: `hsl(var(--${accentColor}) / 0.3)` }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* City List */}
            <div ref={listRef} className="max-h-64 overflow-y-auto overscroll-contain">
              {filteredCities.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <MapPin className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">No cities found</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
                </div>
              ) : (
                filteredCities.map((city, index) => (
                  <button
                    key={city.name}
                    data-city-item
                    onClick={() => handleSelect(city.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-150 border-b border-border/30 last:border-b-0
                      ${index === highlightedIndex
                        ? 'bg-muted/80'
                        : 'hover:bg-muted/40'
                      }
                      ${city.name === value ? 'bg-primary/5' : ''}
                    `}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${getClassificationColor(city.classification)} shrink-0 mr-3`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <span className={`font-semibold text-sm truncate ${city.name === value ? 'text-primary' : 'text-foreground'}`}>
                            {city.name}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{city.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center shrink-0 ml-3 gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border
                        ${city.classification === 'Good' ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400' :
                          city.classification === 'Moderate' ? 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400' :
                          city.classification === 'Hazardous' ? 'text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400' :
                          'text-orange-600 bg-orange-500/10 border-orange-500/20 dark:text-orange-400'
                        }`}
                      >
                        {getClassificationLabel(city.classification)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono w-8 text-right">{city.aqi}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground/60 text-center">
                {filteredCities.length} of {cities.length} cities · ↑↓ navigate · Enter select · Esc close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
