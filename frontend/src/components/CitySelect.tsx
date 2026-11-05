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
    case 'Good':
      return 'bg-emerald-500';
    case 'Moderate':
      return 'bg-yellow-500';
    case 'Unhealthy (Sensitive)':
      return 'bg-orange-400';
    case 'Unhealthy':
      return 'bg-red-500';
    case 'Hazardous':
      return 'bg-purple-600';
    default:
      return 'bg-muted-foreground';
  }
};

const getClassificationLabel = (classification: string) => {
  switch (classification) {
    case 'Good':
      return 'Good';
    case 'Moderate':
      return 'Moderate';
    case 'Unhealthy (Sensitive)':
      return 'Sensitive';
    case 'Unhealthy':
      return 'Unhealthy';
    case 'Hazardous':
      return 'Hazardous';
    default:
      return '';
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
    return city.name.toLowerCase().includes(q) || city.country.toLowerCase().includes(q);
  });

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search, isOpen]);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-city-item]');
      const item = items[highlightedIndex] as HTMLElement;
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

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

  const handleSelect = useCallback(
    (cityName: string) => {
      onChange(cityName);
      setIsOpen(false);
      setSearch('');
    },
    [onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredCities.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredCities.length - 1));
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
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) setTimeout(() => inputRef.current?.focus(), 50);
        }}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border bg-card hover:border-primary/35 text-left transition"
        style={isOpen ? { borderColor: `hsl(var(--${accentColor}) / 0.6)`, boxShadow: `0 0 0 2px hsl(var(--${accentColor}) / 0.18)` } : undefined}
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
          <span className="text-muted-foreground text-sm font-medium">{placeholder}</span>
        )}
        <ChevronDown className={`w-4 h-4 ml-2 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
          >
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
                  className="w-full pl-9 pr-8 py-2.5 bg-muted/40 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/65"
                />
                {search ? (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear city search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>

            <div ref={listRef} className="max-h-64 overflow-y-auto overscroll-contain" role="listbox">
              {filteredCities.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <MapPin className="w-8 h-8 mx-auto text-muted-foreground/35 mb-2" />
                  <p className="text-sm text-muted-foreground font-medium">No cities found</p>
                </div>
              ) : (
                filteredCities.map((city, index) => (
                  <button
                    key={city.name}
                    data-city-item
                    role="option"
                    aria-selected={city.name === value}
                    onClick={() => handleSelect(city.name)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full flex items-center px-4 py-3 text-left transition-colors border-b border-border/30 last:border-b-0 ${
                      index === highlightedIndex ? 'bg-muted/65' : 'hover:bg-muted/45'
                    } ${city.name === value ? 'bg-primary/8' : ''}`}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${getClassificationColor(city.classification)} shrink-0 mr-3`} />
                      <div className="min-w-0 flex-1">
                        <span className={`font-semibold text-sm truncate ${city.name === value ? 'text-primary' : 'text-foreground'}`}>
                          {city.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">{city.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center shrink-0 ml-3 gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-border/70 bg-muted/60 text-muted-foreground">
                        {getClassificationLabel(city.classification)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono w-8 text-right">{city.aqi}</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground/75 text-center">
                {filteredCities.length} of {cities.length} cities · ↑↓ navigate · Enter select · Esc close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
