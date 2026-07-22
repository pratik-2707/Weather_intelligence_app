import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Moon,
  Wind,
  Droplets,
  SunMedium as SunUv,
  Gauge,
  Thermometer,
  Sunrise,
  Sunset,
  Star,
  Compass,
  Sparkles,
} from 'lucide-react';
import { WeatherData, FavoriteCity } from '../types';
import { getWeatherInfo } from '../services/weatherService';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  weather,
  isFavorite,
  onToggleFavorite,
}) => {
  const current = weather.current;
  const location = weather.location;
  const today = weather.daily?.[0];
  const unitSymbol = weather.units === 'fahrenheit' ? '°F' : '°C';
  const windUnit = weather.units === 'fahrenheit' ? 'mph' : 'km/h';

  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  // Dynamic Icon Component mapping
  const renderWeatherIcon = (name: string, className: string = 'w-16 h-16') => {
    switch (name) {
      case 'Sun':
        return <Sun className={`${className} text-amber-300 animate-spin-slow`} />;
      case 'SunMedium':
        return <SunMedium className={`${className} text-amber-300`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-amber-200`} />;
      case 'CloudMoon':
        return <CloudMoon className={`${className} text-indigo-200`} />;
      case 'Cloud':
        return <Cloud className={`${className} text-white`} />;
      case 'CloudFog':
        return <CloudFog className={`${className} text-slate-200`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${className} text-cyan-200`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-sky-200`} />;
      case 'CloudRainWind':
        return <CloudRainWind className={`${className} text-sky-200`} />;
      case 'CloudSnow':
      case 'Snowflake':
        return <Snowflake className={`${className} text-sky-100 animate-pulse`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${className} text-yellow-300`} />;
      case 'Moon':
        return <Moon className={`${className} text-indigo-100`} />;
      default:
        return <Sun className={`${className} text-amber-300`} />;
    }
  };

  // UV index level badge
  const getUvBadge = (uv: number) => {
    if (uv < 3) return { text: 'Low', color: 'bg-white/20 text-white' };
    if (uv < 6) return { text: 'Moderate', color: 'bg-white/20 text-white' };
    if (uv < 8) return { text: 'High', color: 'bg-amber-400/30 text-amber-200' };
    if (uv < 11) return { text: 'Very High', color: 'bg-rose-400/30 text-rose-200' };
    return { text: 'Extreme', color: 'bg-purple-400/30 text-purple-200' };
  };

  const uvBadge = getUvBadge(current.uvIndex);

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
      
      {/* Glass ambient light blur circle */}
      <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        
        {/* Top Location & Condition Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {location.name}
              </h2>
              <button
                onClick={onToggleFavorite}
                id="toggle-favorite-btn"
                className={`p-1.5 rounded-full transition-all ${
                  isFavorite
                    ? 'bg-white text-amber-400 shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                title={isFavorite ? 'Remove favorite' : 'Add favorite'}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            </div>
            <p className="text-sm opacity-80 mt-1 font-medium">
              {[location.admin1, location.country].filter(Boolean).join(', ')} • Updated {weather.fetchedAt}
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end space-x-3">
              {renderWeatherIcon(current.weatherIconName, 'w-12 h-12')}
              <span className="text-5xl sm:text-6xl font-black tracking-tight">
                {current.temperature}{unitSymbol}
              </span>
            </div>
            <p className="text-base font-semibold uppercase tracking-widest opacity-90 mt-1">
              {current.weatherLabel}
            </p>
          </div>
        </div>

        {/* Detailed Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 pt-6 border-t border-white/15">
          <div className="flex flex-col">
            <span className="text-xs uppercase opacity-70 mb-1 font-bold tracking-wider">Feels Like</span>
            <span className="text-xl font-semibold">{current.apparentTemperature}{unitSymbol}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase opacity-70 mb-1 font-bold tracking-wider">Humidity</span>
            <span className="text-xl font-semibold">{current.relativeHumidity}%</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase opacity-70 mb-1 font-bold tracking-wider">Wind Speed</span>
            <span className="text-xl font-semibold">{current.windSpeed} {windUnit}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase opacity-70 mb-1 font-bold tracking-wider">UV Index</span>
            <span className="text-xl font-semibold flex items-center space-x-1.5">
              <span>{current.uvIndex}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${uvBadge.color}`}>
                {uvBadge.text}
              </span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase opacity-70 mb-1 font-bold tracking-wider">High / Low</span>
            <span className="text-xl font-semibold">
              {today ? `${today.temperatureMax}${unitSymbol} / ${today.temperatureMin}${unitSymbol}` : 'N/A'}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase opacity-70 mb-1 font-bold tracking-wider">Pressure</span>
            <span className="text-xl font-semibold">{current.surfacePressure} hPa</span>
          </div>
        </div>

      </div>
    </div>
  );
};
