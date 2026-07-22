export interface CityLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // State or province
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  weatherLabel: string;
  weatherIconName: string;
  isDay: boolean;
  uvIndex: number;
  surfacePressure: number;
  precipitation: number;
  dewPoint: number;
}

export interface HourlyForecastItem {
  time: string;
  formattedTime: string;
  temperature: number;
  relativeHumidity: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherLabel: string;
  weatherIconName: string;
  windSpeed: number;
  uvIndex: number;
}

export interface DailyForecastItem {
  date: string;
  formattedDate: string;
  dayName: string;
  weatherCode: number;
  weatherLabel: string;
  weatherIconName: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbabilityMax: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  maxWindSpeed: number;
}

export interface WeatherData {
  location: CityLocation;
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  units: 'celsius' | 'fahrenheit';
  fetchedAt: string;
}

export interface ActivityRecommendation {
  activity: string;
  suitability: 'Optimal' | 'Caution' | 'Unfavorable';
  rationale: string;
  bestTimeWindow: string;
  iconName: string;
}

export interface ClothingPlanner {
  summary: string;
  itemsToBring: string[];
  layeringAdvice: string;
}

export interface HealthAndSafety {
  uvPrecaution: string;
  airQualityOrComfort: string;
}

export interface AIRecommendationData {
  summary: string;
  activityRecommendations: ActivityRecommendation[];
  clothingPlanner: ClothingPlanner;
  commuteTravelAdvice: string;
  healthSafety: HealthAndSafety;
  proTips: string[];
  isAiGenerated?: boolean;
}

export interface FavoriteCity {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  savedAt: number;
}
