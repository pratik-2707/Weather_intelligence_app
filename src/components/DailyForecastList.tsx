import React, { useState } from 'react';
import {
  Calendar,
  Sun,
  SunMedium,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  Snowflake,
  CloudLightning,
  Moon,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DailyForecastItem } from '../types';

interface DailyForecastListProps {
  daily: DailyForecastItem[];
  units: 'celsius' | 'fahrenheit';
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ daily, units }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (!daily || daily.length === 0) return null;

  const unitSymbol = units === 'fahrenheit' ? '°F' : '°C';

  // Calculate overall min and max across 7 days for temperature bar scale
  const globalMin = Math.min(...daily.map((d) => d.temperatureMin));
  const globalMax = Math.max(...daily.map((d) => d.temperatureMax));
  const tempRange = Math.max(1, globalMax - globalMin);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-6 h-6 text-amber-400" />;
      case 'SunMedium':
        return <SunMedium className="w-6 h-6 text-amber-400" />;
      case 'CloudSun':
        return <CloudSun className="w-6 h-6 text-amber-300" />;
      case 'CloudMoon':
        return <CloudMoon className="w-6 h-6 text-indigo-300" />;
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-slate-300" />;
      case 'CloudFog':
        return <CloudFog className="w-6 h-6 text-slate-400" />;
      case 'CloudDrizzle':
        return <CloudDrizzle className="w-6 h-6 text-cyan-300" />;
      case 'CloudRain':
        return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'CloudRainWind':
        return <CloudRainWind className="w-6 h-6 text-blue-500" />;
      case 'Snowflake':
        return <Snowflake className="w-6 h-6 text-sky-200" />;
      case 'CloudLightning':
        return <CloudLightning className="w-6 h-6 text-yellow-400" />;
      case 'Moon':
        return <Moon className="w-6 h-6 text-indigo-200" />;
      default:
        return <Sun className="w-6 h-6 text-amber-400" />;
    }
  };

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-800 space-y-4">
      
      {/* Title */}
      <div className="flex items-center space-x-2">
        <Calendar className="w-5 h-5 text-indigo-600" />
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">7-Day Intelligence Forecast</h3>
      </div>

      {/* Daily Items List */}
      <div className="space-y-2.5">
        {daily.map((item, idx) => {
          const isExpanded = expandedDate === item.date;

          // Bar calculations
          const leftPercent = Math.max(0, Math.min(100, ((item.temperatureMin - globalMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((item.temperatureMax - globalMin) / tempRange) * 100));
          const widthPercent = Math.max(5, rightPercent - leftPercent);

          const isHighlighted = idx === 0;

          return (
            <div
              key={item.date}
              className={`rounded-2xl border transition-all overflow-hidden shadow-sm ${
                isHighlighted
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
              }`}
            >
              <button
                onClick={() => toggleExpand(item.date)}
                className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
              >
                {/* Day & Date */}
                <div className="w-20 shrink-0">
                  <p className={`text-xs font-bold ${isHighlighted ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {item.dayName.substring(0, 3).toUpperCase()}
                  </p>
                  <p className={`text-[10px] ${isHighlighted ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.formattedDate.split(',')[0]}
                  </p>
                </div>

                {/* Weather Icon & Label */}
                <div className="flex items-center space-x-2 w-28 shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    isHighlighted ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {renderIcon(item.weatherIconName)}
                  </div>
                  <span className={`text-xs font-semibold truncate hidden sm:inline ${
                    isHighlighted ? 'text-white' : 'text-slate-700'
                  }`}>
                    {item.weatherLabel}
                  </span>
                </div>

                {/* Temperature High */}
                <div className="text-right">
                  <span className={`text-lg font-bold ${isHighlighted ? 'text-white' : 'text-slate-800'}`}>
                    {item.temperatureMax}°
                  </span>
                  <span className={`text-[10px] block ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                    Low: {item.temperatureMin}°
                  </span>
                </div>

                {/* Expand Toggle */}
                <div className={`pl-2 ${isHighlighted ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className={`px-4 pb-4 pt-2 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${
                  isHighlighted ? 'border-indigo-500 bg-indigo-700/50 text-white' : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}>
                  <div>
                    <span className="opacity-75 flex items-center">
                      <Sunrise className="w-3.5 h-3.5 mr-1" />
                      Sunrise
                    </span>
                    <p className="font-bold mt-0.5">{item.sunrise}</p>
                  </div>

                  <div>
                    <span className="opacity-75 flex items-center">
                      <Sunset className="w-3.5 h-3.5 mr-1" />
                      Sunset
                    </span>
                    <p className="font-bold mt-0.5">{item.sunset}</p>
                  </div>

                  <div>
                    <span className="opacity-75 flex items-center">
                      <Wind className="w-3.5 h-3.5 mr-1" />
                      Max Wind
                    </span>
                    <p className="font-bold mt-0.5">
                      {item.maxWindSpeed} {units === 'fahrenheit' ? 'mph' : 'km/h'}
                    </p>
                  </div>

                  <div>
                    <span className="opacity-75 flex items-center">
                      <Sun className="w-3.5 h-3.5 mr-1" />
                      UV Index
                    </span>
                    <p className="font-bold mt-0.5">{item.uvIndexMax}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
