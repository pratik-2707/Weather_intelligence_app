import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Globe, Sparkles } from 'lucide-react';
import { CityLocation } from '../types';
import { searchCities, getLocationFromCoords, POPULAR_CITIES } from '../services/weatherService';

interface SearchBarProps {
  onSelectCity: (city: CityLocation) => void;
  currentCity?: CityLocation;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity, currentCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const cities = await searchCities(query);
      setResults(cities);
      setIsLoading(false);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CityLocation) => {
    onSelectCity(city);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const loc = await getLocationFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          onSelectCity(loc);
        } catch (e) {
          setGeoError('Failed to resolve coordinates to location.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Please search for a city manually.');
        } else {
          setGeoError('Unable to retrieve current location.');
        }
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3" ref={containerRef}>
      
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              <Search className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <input
            type="text"
            id="city-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search City (e.g. San Francisco, Tokyo, London)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          id="locate-me-btn"
          className="ml-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-indigo-600 border border-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm shrink-0 disabled:opacity-50"
          title="Use Current Device Location"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          ) : (
            <MapPin className="w-4 h-4 text-indigo-600" />
          )}
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>

      {/* Geolocation error toast */}
      {geoError && (
        <div className="px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
          <span>{geoError}</span>
          <button onClick={() => setGeoError(null)} className="text-red-500 hover:text-red-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100">
          <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>Matching Open-Meteo Locations</span>
            <span>{results.length} found</span>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {results.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                onClick={() => handleSelect(city)}
                className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center space-x-2.5">
                  <MapPin className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-sm font-medium text-slate-800 group-hover:text-indigo-600">
                      {city.name}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Quick Select Pills */}
      <div className="flex items-center flex-wrap gap-1.5 text-xs">
        <span className="text-slate-400 flex items-center text-[11px] font-bold uppercase tracking-wider mr-1">
          <Globe className="w-3 h-3 mr-1 text-indigo-500" />
          Quick Pick:
        </span>
        {POPULAR_CITIES.map((city) => {
          const isSelected = currentCity?.name === city.name;
          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {city.name}
            </button>
          );
        })}
      </div>

    </div>
  );
};
