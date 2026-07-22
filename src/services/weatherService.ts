import { CityLocation, WeatherData, CurrentWeather, HourlyForecastItem, DailyForecastItem } from '../types';

// WMO Weather Interpretation Code (WW)
export interface WeatherInfo {
  label: string;
  icon: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'fog';
  bgGradient: string;
  cardBg: string;
}

export function getWeatherInfo(code: number, isDay: boolean = true): WeatherInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        icon: isDay ? 'Sun' : 'Moon',
        category: 'clear',
        bgGradient: isDay
          ? 'from-sky-400 via-amber-200 to-blue-500'
          : 'from-slate-900 via-indigo-950 to-slate-900',
        cardBg: 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-100',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        icon: isDay ? 'SunMedium' : 'Moon',
        category: 'clear',
        bgGradient: isDay
          ? 'from-sky-400 via-sky-200 to-blue-400'
          : 'from-slate-900 via-slate-800 to-indigo-950',
        cardBg: 'bg-sky-500/10 border-sky-500/20 text-sky-900 dark:text-sky-100',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        icon: isDay ? 'CloudSun' : 'CloudMoon',
        category: 'cloudy',
        bgGradient: 'from-blue-400 via-slate-300 to-sky-500 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950',
        cardBg: 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-100',
      };
    case 3:
      return {
        label: 'Overcast',
        icon: 'Cloud',
        category: 'cloudy',
        bgGradient: 'from-slate-400 via-slate-500 to-slate-600 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800',
        cardBg: 'bg-slate-500/10 border-slate-500/20 text-slate-900 dark:text-slate-100',
      };
    case 45:
    case 48:
      return {
        label: code === 48 ? 'Depositing Rime Fog' : 'Foggy',
        icon: 'CloudFog',
        category: 'fog',
        bgGradient: 'from-slate-300 via-slate-400 to-zinc-500 dark:from-zinc-900 dark:via-slate-900 dark:to-zinc-800',
        cardBg: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-900 dark:text-zinc-100',
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: 'CloudDrizzle',
        category: 'rain',
        bgGradient: 'from-teal-500 via-cyan-600 to-blue-700 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900',
        cardBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-900 dark:text-cyan-100',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        icon: 'CloudSnow',
        category: 'rain',
        bgGradient: 'from-cyan-400 via-teal-700 to-slate-800',
        cardBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-900 dark:text-cyan-100',
      };
    case 61:
      return {
        label: 'Slight Rain',
        icon: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-cyan-500 via-blue-600 to-slate-800',
        cardBg: 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-100',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        icon: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-blue-600 via-indigo-700 to-slate-900',
        cardBg: 'bg-blue-600/10 border-blue-600/20 text-blue-900 dark:text-blue-100',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        icon: 'CloudRainWind',
        category: 'rain',
        bgGradient: 'from-indigo-800 via-slate-900 to-blue-950',
        cardBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-900 dark:text-indigo-100',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        icon: 'CloudSnow',
        category: 'rain',
        bgGradient: 'from-sky-600 via-slate-800 to-indigo-950',
        cardBg: 'bg-sky-500/10 border-sky-500/20 text-sky-900 dark:text-sky-100',
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowfall',
        icon: 'Snowflake',
        category: 'snow',
        bgGradient: 'from-blue-200 via-slate-300 to-sky-400 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900',
        cardBg: 'bg-blue-300/20 border-blue-300/30 text-blue-900 dark:text-blue-100',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        icon: 'CloudRain',
        category: 'rain',
        bgGradient: 'from-sky-500 via-blue-700 to-slate-900',
        cardBg: 'bg-sky-500/10 border-sky-500/20 text-sky-900 dark:text-sky-100',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        icon: 'CloudSnow',
        category: 'snow',
        bgGradient: 'from-indigo-300 via-sky-600 to-slate-900',
        cardBg: 'bg-indigo-300/20 border-indigo-300/30 text-indigo-900 dark:text-indigo-100',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: 'CloudLightning',
        category: 'thunderstorm',
        bgGradient: 'from-amber-700 via-purple-900 to-slate-950',
        cardBg: 'bg-purple-500/10 border-purple-500/20 text-purple-900 dark:text-purple-100',
      };
    default:
      return {
        label: 'Fair Weather',
        icon: 'Sun',
        category: 'clear',
        bgGradient: 'from-sky-400 via-blue-500 to-indigo-600',
        cardBg: 'bg-sky-500/10 border-sky-500/20 text-sky-900 dark:text-sky-100',
      };
  }
}

// Open-Meteo Geocoding Search
export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=10&language=en&format=json`
    );
    if (!response.ok) throw new Error('Failed to fetch cities');
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

// Open-Meteo Weather Fetcher
export async function fetchWeatherData(
  location: CityLocation,
  units: 'celsius' | 'fahrenheit' = 'celsius'
): Promise<WeatherData> {
  const tempUnit = units === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';
  const windUnit = units === 'fahrenheit' ? '&wind_speed_unit=mph' : '';

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,dew_point_2m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,uv_index_max,wind_speed_10m_max&timezone=auto${tempUnit}${windUnit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open-Meteo weather request failed with status ${response.status}`);
  }

  const raw = await response.json();

  const currentInfo = getWeatherInfo(raw.current.weather_code, raw.current.is_day === 1);

  const current: CurrentWeather = {
    temperature: Math.round(raw.current.temperature_2m),
    apparentTemperature: Math.round(raw.current.apparent_temperature),
    relativeHumidity: Math.round(raw.current.relative_humidity_2m),
    windSpeed: Math.round(raw.current.wind_speed_10m),
    windDirection: Math.round(raw.current.wind_direction_10m),
    weatherCode: raw.current.weather_code,
    weatherLabel: currentInfo.label,
    weatherIconName: currentInfo.icon,
    isDay: raw.current.is_day === 1,
    uvIndex: Math.round((raw.current.uv_index || 0) * 10) / 10,
    surfacePressure: Math.round(raw.current.surface_pressure),
    precipitation: raw.current.precipitation || 0,
    dewPoint: Math.round(raw.current.dew_point_2m || 0),
  };

  // Next 24 hours of hourly forecast
  const hourly: HourlyForecastItem[] = [];
  if (raw.hourly && raw.hourly.time) {
    const now = new Date();
    // Find closest index
    const currentHourString = now.toISOString().slice(0, 13);
    let startIndex = raw.hourly.time.findIndex((t: string) => t.startsWith(currentHourString));
    if (startIndex < 0) startIndex = 0;

    for (let i = startIndex; i < Math.min(startIndex + 24, raw.hourly.time.length); i++) {
      const timeStr = raw.hourly.time[i];
      const dateObj = new Date(timeStr);
      const hourFormatted = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const info = getWeatherInfo(raw.hourly.weather_code[i], true);

      hourly.push({
        time: timeStr,
        formattedTime: hourFormatted,
        temperature: Math.round(raw.hourly.temperature_2m[i]),
        relativeHumidity: Math.round(raw.hourly.relative_humidity_2m[i]),
        precipitationProbability: Math.round(raw.hourly.precipitation_probability[i] || 0),
        weatherCode: raw.hourly.weather_code[i],
        weatherLabel: info.label,
        weatherIconName: info.icon,
        windSpeed: Math.round(raw.hourly.wind_speed_10m[i]),
        uvIndex: Math.round((raw.hourly.uv_index?.[i] || 0) * 10) / 10,
      });
    }
  }

  // Daily 7-day forecast
  const daily: DailyForecastItem[] = [];
  if (raw.daily && raw.daily.time) {
    for (let i = 0; i < Math.min(7, raw.daily.time.length); i++) {
      const dateStr = raw.daily.time[i];
      const dateObj = new Date(dateStr + 'T00:00:00');
      const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const info = getWeatherInfo(raw.daily.weather_code[i], true);

      const sunriseStr = raw.daily.sunrise?.[i] ? new Date(raw.daily.sunrise[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
      const sunsetStr = raw.daily.sunset?.[i] ? new Date(raw.daily.sunset[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

      daily.push({
        date: dateStr,
        formattedDate,
        dayName,
        weatherCode: raw.daily.weather_code[i],
        weatherLabel: info.label,
        weatherIconName: info.icon,
        temperatureMax: Math.round(raw.daily.temperature_2m_max[i]),
        temperatureMin: Math.round(raw.daily.temperature_2m_min[i]),
        precipitationProbabilityMax: Math.round(raw.daily.precipitation_probability_max?.[i] || 0),
        sunrise: sunriseStr,
        sunset: sunsetStr,
        uvIndexMax: Math.round((raw.daily.uv_index_max?.[i] || 0) * 10) / 10,
        maxWindSpeed: Math.round(raw.daily.wind_speed_10m_max?.[i] || 0),
      });
    }
  }

  return {
    location,
    current,
    hourly,
    daily,
    units,
    fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

// Reverse Geocoding helper using Open-Meteo BigDataCloud or fallback search
export async function getLocationFromCoords(latitude: number, longitude: number): Promise<CityLocation> {
  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      return {
        id: Math.round(latitude * 1000 + longitude * 1000),
        name: data.city || data.locality || data.principalSubdivision || 'My Location',
        latitude,
        longitude,
        country: data.countryName || '',
        admin1: data.principalSubdivision || '',
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback:', e);
  }

  return {
    id: 10001,
    name: 'Current Location',
    latitude,
    longitude,
    country: '',
  };
}

// Popular tech & global cities for quick pick
export const POPULAR_CITIES: CityLocation[] = [
  { id: 5391959, name: 'San Francisco', admin1: 'California', country: 'United States', latitude: 37.7749, longitude: -122.4194 },
  { id: 1850147, name: 'Tokyo', admin1: 'Tokyo', country: 'Japan', latitude: 35.6895, longitude: 139.6917 },
  { id: 2643743, name: 'London', admin1: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: 5128581, name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { id: 2988507, name: 'Paris', admin1: 'Île-de-France', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { id: 1880252, name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198 },
  { id: 2147714, name: 'Sydney', admin1: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
];
