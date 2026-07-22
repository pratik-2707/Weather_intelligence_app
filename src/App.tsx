import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { HourlyForecastChart } from './components/HourlyForecastChart';
import { DailyForecastList } from './components/DailyForecastList';
import { PlanningRecommendationsView } from './components/PlanningRecommendationsView';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { CloudflareDeploymentModal } from './components/CloudflareDeploymentModal';

import { CityLocation, WeatherData, FavoriteCity } from './types';
import { fetchWeatherData, POPULAR_CITIES } from './services/weatherService';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Unit state
  const [units, setUnits] = useState<'celsius' | 'fahrenheit'>(() => {
    const saved = localStorage.getItem('weather_units');
    return saved === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  });

  // Selected City state (default to San Francisco)
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0]);

  // Weather Data state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    try {
      const saved = localStorage.getItem('weather_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals / Drawers
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Save units
  const handleToggleUnits = () => {
    const newUnits = units === 'celsius' ? 'fahrenheit' : 'celsius';
    setUnits(newUnits);
    localStorage.setItem('weather_units', newUnits);
  };

  // Fetch weather data when city or units change
  const loadWeather = async (city: CityLocation) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(city, units);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Failed to load weather:', err);
      setError(err.message || 'Failed to fetch weather data from Open-Meteo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity.latitude, selectedCity.longitude, units]);

  // Toggle favorite
  const isCurrentFavorite = favorites.some((f) => f.id === selectedCity.id || (Math.abs(f.latitude - selectedCity.latitude) < 0.01 && Math.abs(f.longitude - selectedCity.longitude) < 0.01));

  const handleToggleFavorite = () => {
    let updated: FavoriteCity[];
    if (isCurrentFavorite) {
      updated = favorites.filter((f) => f.id !== selectedCity.id && !(Math.abs(f.latitude - selectedCity.latitude) < 0.01 && Math.abs(f.longitude - selectedCity.longitude) < 0.01));
    } else {
      const newFav: FavoriteCity = {
        id: selectedCity.id || Date.now(),
        name: selectedCity.name,
        country: selectedCity.country,
        admin1: selectedCity.admin1,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        savedAt: Date.now(),
      };
      updated = [newFav, ...favorites];
    }
    setFavorites(updated);
    localStorage.setItem('weather_favorites', JSON.stringify(updated));
  };

  const handleRemoveFavorite = (id: number) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('weather_favorites', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Header Navigation */}
      <Header
        units={units}
        onToggleUnits={handleToggleUnits}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search & Location Selection */}
        <SearchBar
          currentCity={selectedCity}
          onSelectCity={(city) => setSelectedCity(city)}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="p-16 text-center space-y-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mx-auto" />
            <div>
              <p className="text-base font-bold text-slate-800">Fetching Open-Meteo Meteorological Data...</p>
              <p className="text-xs text-slate-500 mt-1">
                Retrieving hourly temperature, wind, UV index, and 7-day outlook for {selectedCity.name}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-rose-900">Weather Retrieval Error</h4>
                <p className="text-xs text-rose-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button
              onClick={() => loadWeather(selectedCity)}
              className="px-4 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold border border-rose-300 flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        {!isLoading && weatherData && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Current Weather Hero Card */}
            <CurrentWeatherCard
              weather={weatherData}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* 2-Column Grid for Timeline & 7-Day Outlook */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-7 space-y-8">
                {/* 24h Timeline Chart */}
                <HourlyForecastChart hourly={weatherData.hourly} units={units} />

                {/* AI Planning Recommendations */}
                <PlanningRecommendationsView weather={weatherData} />
              </div>

              <div className="lg:col-span-5">
                {/* 7-Day Daily Forecast List */}
                <DailyForecastList daily={weatherData.daily} units={units} />
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Sleek Status Footer */}
      <footer className="h-12 px-8 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
        <div className="flex items-center gap-6">
          <span>Source: Open-Meteo API</span>
          <span>Refresh: Live Sync</span>
          <span className="hidden md:inline">Engine: Google Gemini 3.6</span>
        </div>
        <div className="flex items-center gap-2 text-indigo-600">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Cloudflare Pages Instance Active</span>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={(city) => setSelectedCity(city)}
        onRemoveFavorite={handleRemoveFavorite}
      />

      <CloudflareDeploymentModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

    </div>
  );
}
