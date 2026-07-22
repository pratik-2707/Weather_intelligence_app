import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
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
  Snowflake,
  CloudLightning,
  Moon,
  Clock,
  Droplets,
  Wind,
} from 'lucide-react';
import { HourlyForecastItem } from '../types';

interface HourlyForecastChartProps {
  hourly: HourlyForecastItem[];
  units: 'celsius' | 'fahrenheit';
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hourly, units }) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'precip'>('temp');

  if (!hourly || hourly.length === 0) return null;

  const unitSymbol = units === 'fahrenheit' ? '°F' : '°C';

  // Chart data formatting
  const chartData = hourly.map((item) => ({
    time: item.formattedTime,
    Temperature: item.temperature,
    Precipitation: item.precipitationProbability,
    Wind: item.windSpeed,
    label: item.weatherLabel,
  }));

  const renderIcon = (iconName: string) => {
    const cls = "w-5 h-5 text-sky-300";
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'SunMedium':
        return <SunMedium className="w-5 h-5 text-amber-400" />;
      case 'CloudSun':
        return <CloudSun className="w-5 h-5 text-amber-300" />;
      case 'CloudMoon':
        return <CloudMoon className="w-5 h-5 text-indigo-300" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-slate-300" />;
      case 'CloudFog':
        return <CloudFog className="w-5 h-5 text-slate-400" />;
      case 'CloudDrizzle':
        return <CloudDrizzle className="w-5 h-5 text-cyan-300" />;
      case 'CloudRain':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'CloudRainWind':
        return <CloudRainWind className="w-5 h-5 text-blue-500" />;
      case 'Snowflake':
        return <Snowflake className="w-5 h-5 text-sky-200" />;
      case 'CloudLightning':
        return <CloudLightning className="w-5 h-5 text-yellow-400" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-200" />;
      default:
        return <Sun className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-800 space-y-6">
      
      {/* Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">24-Hour Timeline & Trend</h3>
        </div>

        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-full text-xs font-semibold border border-slate-200">
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              activeTab === 'temp'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Temperature ({unitSymbol})
          </button>
          <button
            onClick={() => setActiveTab('precip')}
            className={`px-3.5 py-1.5 rounded-full transition-all ${
              activeTab === 'precip'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Rain Risk (%)
          </button>
        </div>
      </div>

      {/* Recharts Area / Bar Chart */}
      <div className="h-48 sm:h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  color: '#0f172a',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)',
                }}
                formatter={(value: any) => [`${value}${unitSymbol}`, 'Temperature']}
              />
              <Area
                type="monotone"
                dataKey="Temperature"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '12px',
                  color: '#0f172a',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value}%`, 'Precipitation Risk']}
              />
              <Bar dataKey="Precipitation" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Horizontal Scroll Hourly Cards */}
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
        {hourly.map((item, idx) => (
          <div
            key={`${item.time}-${idx}`}
            className="flex-shrink-0 w-24 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 text-center space-y-2 transition-all hover:scale-105"
          >
            <p className="text-xs text-slate-400 font-bold">{item.formattedTime}</p>

            <div className="flex justify-center my-1">
              {renderIcon(item.weatherIconName)}
            </div>

            <p className="text-base font-bold text-slate-800">
              {item.temperature}{unitSymbol}
            </p>

            <div className="flex items-center justify-center text-[10px] text-indigo-600 font-bold space-x-0.5">
              <Droplets className="w-2.5 h-2.5" />
              <span>{item.precipitationProbability}%</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
