import { WeatherData, AIRecommendationData, ActivityRecommendation } from '../types';

// Rule-based fallback recommendation generator
export function generateRuleBasedRecommendations(weatherData: WeatherData): AIRecommendationData {
  const current = weatherData.current;
  const temp = current.temperature;
  const isFahrenheit = weatherData.units === 'fahrenheit';
  // Convert temp to Celsius for internal rule threshold calculations if needed
  const tempC = isFahrenheit ? (temp - 32) * (5 / 9) : temp;
  const rainProb = weatherData.daily?.[0]?.precipitationProbabilityMax || 0;
  const wind = current.windSpeed;
  const uv = current.uvIndex;
  const code = current.weatherCode;
  const isDay = current.isDay;

  // Activities logic
  const activities: ActivityRecommendation[] = [];

  // Running / Outdoor Workout
  if (code >= 61 || rainProb > 60 || tempC > 35 || tempC < -5) {
    activities.push({
      activity: 'Outdoor Running / Cycling',
      suitability: 'Caution',
      rationale: rainProb > 60 ? 'High probability of rain showers. Opt for indoor treadmill or covered track.' : 'Extreme temperatures or precipitation ahead.',
      bestTimeWindow: 'Early Morning or Indoor Gym',
      iconName: 'Activity',
    });
  } else if (tempC >= 10 && tempC <= 24 && wind < 25) {
    activities.push({
      activity: 'Outdoor Running & Cycling',
      suitability: 'Optimal',
      rationale: 'Ideal crisp temperature and light winds for cardio activities.',
      bestTimeWindow: isDay ? 'Morning (7-10 AM) or Late Afternoon' : 'Early Evening',
      iconName: 'Activity',
    });
  } else {
    activities.push({
      activity: 'Outdoor Jogging',
      suitability: 'Caution',
      rationale: 'Wear appropriate thermal layers or breathable hydration gear.',
      bestTimeWindow: 'Morning hours',
      iconName: 'Activity',
    });
  }

  // Outdoor Dining / Picnic
  if (code === 0 || code === 1 || code === 2) {
    if (tempC >= 18 && tempC <= 28 && rainProb < 20) {
      activities.push({
        activity: 'Al Fresco Dining & Picnics',
        suitability: 'Optimal',
        rationale: 'Pleasant skies and mild breezes make patio dining delightful.',
        bestTimeWindow: 'Lunch (12-2 PM) or Evening',
        iconName: 'Utensils',
      });
    } else {
      activities.push({
        activity: 'Outdoor Patio Dining',
        suitability: 'Caution',
        rationale: 'Temperatures may be cool/warm; look for shaded or heated seating.',
        bestTimeWindow: 'Midday',
        iconName: 'Utensils',
      });
    }
  } else {
    activities.push({
      activity: 'Outdoor Dining',
      suitability: 'Unfavorable',
      rationale: 'Clouds, drizzle, or rain expected. Indoor dining recommended.',
      bestTimeWindow: 'N/A',
      iconName: 'Utensils',
    });
  }

  // Stargazing & Photography
  if (!isDay && (code === 0 || code === 1)) {
    activities.push({
      activity: 'Night Stargazing & Astronomy',
      suitability: 'Optimal',
      rationale: 'Clear night sky offers crystal clarity for observing constellations.',
      bestTimeWindow: '9 PM - Midnight',
      iconName: 'Sparkles',
    });
  } else {
    activities.push({
      activity: 'Landscape Photography',
      suitability: code <= 2 ? 'Optimal' : 'Caution',
      rationale: code <= 2 ? 'Great natural lighting and atmospheric clouds for dramatic compositions.' : 'Overcast skies reduce contrast.',
      bestTimeWindow: 'Golden Hour (Sunset)',
      iconName: 'Camera',
    });
  }

  // Beach / Water Sports
  if (tempC > 24 && rainProb < 20 && code <= 2) {
    activities.push({
      activity: 'Beach & Swimming',
      suitability: 'Optimal',
      rationale: 'Warm sunny weather perfect for water recreation and beach visits.',
      bestTimeWindow: '11 AM - 3 PM',
      iconName: 'Sun',
    });
  } else {
    activities.push({
      activity: 'Park Walks & Recreation',
      suitability: rainProb > 40 ? 'Caution' : 'Optimal',
      rationale: rainProb > 40 ? 'Keep a compact umbrella handy during park strolls.' : 'Enjoyable park weather for light walks.',
      bestTimeWindow: 'Afternoon',
      iconName: 'Trees',
    });
  }

  // Clothing Planner
  let clothingSummary = '';
  const itemsToBring: string[] = [];
  let layeringAdvice = '';

  if (tempC < 5) {
    clothingSummary = 'Heavy cold-weather insulation required.';
    itemsToBring.push('Heavy Winter Coat', 'Thermal Gloves', 'Wool Beanie', 'Insulated Boots');
    layeringAdvice = 'Base layer: Moisture-wicking thermal. Middle: Fleece or down jacket. Outer: Windproof parka.';
  } else if (tempC < 15) {
    clothingSummary = 'Cool and breezy. Moderate layering recommended.';
    itemsToBring.push('Fleece/Light Jacket', 'Long Trousers', 'Scarf');
    layeringAdvice = 'Breathable shirt under a stylish cardigan or windbreaker.';
  } else if (tempC < 25) {
    clothingSummary = 'Mild and comfortable spring/autumn attire.';
    itemsToBring.push('Light Denim Jacket or Hoodie', 'Cotton T-Shirt', 'Sunglasses');
    layeringAdvice = 'Single comfortable layer with a light jacket for cooler evening hours.';
  } else {
    clothingSummary = 'Warm and sunny! Light, breathable summer fabrics.';
    itemsToBring.push('Sunglasses', 'Sunscreen SPF 30+', 'Wide-brim Hat', 'Breathable Cotton/Linen T-Shirt');
    layeringAdvice = 'Short sleeves, shorts/linen trousers, and UV-protective sunglasses.';
  }

  if (rainProb > 40 || code >= 51) {
    itemsToBring.push('Compact Waterproof Umbrella', 'Water-resistant Outerwear');
  }

  // Commute Travel Advice
  let commuteTravelAdvice = 'Standard road conditions expected. Safe for driving and public transit.';
  if (rainProb > 70 || code >= 61) {
    commuteTravelAdvice = 'Heavy rain and wet asphalt expected. Allow 10-15 extra minutes for transit and maintain safe braking distances.';
  } else if (wind > 35) {
    commuteTravelAdvice = 'Gusty winds detected. High-profile vehicles and cyclists should exercise extra steering caution.';
  } else if (code === 45 || code === 48) {
    commuteTravelAdvice = 'Dense fog alert. Use low-beam headlights and reduce speeds on highway interchanges.';
  }

  // Health Safety
  let uvPrecaution = 'Low UV exposure. No special sun protection required.';
  if (uv >= 8) {
    uvPrecaution = 'VERY HIGH UV INDEX! Avoid direct sun exposure between 10 AM - 4 PM. Apply SPF 50+ sunscreen every 2 hours.';
  } else if (uv >= 6) {
    uvPrecaution = 'High UV Index. Wear SPF 30+ sunscreen, UV-blocking sunglasses, and seek shade during midday hours.';
  } else if (uv >= 3) {
    uvPrecaution = 'Moderate UV Index. Sunscreen advised if spending more than 30 minutes outdoors.';
  }

  const airQualityOrComfort = tempC > 30
    ? 'High thermal index. Drink at least 2.5L of water throughout the day to stay hydrated.'
    : 'Comfortable relative humidity levels. Great outdoor air freshness.';

  // Summary
  const weatherCityName = weatherData.location.name;
  const summary = `Today in ${weatherCityName}, conditions feature ${current.weatherLabel.toLowerCase()} with temperatures around ${temp}°${weatherData.units === 'fahrenheit' ? 'F' : 'C'}. Precipitation risk is around ${rainProb}%.`;

  return {
    summary,
    activityRecommendations: activities,
    clothingPlanner: {
      summary: clothingSummary,
      itemsToBring,
      layeringAdvice,
    },
    commuteTravelAdvice,
    healthSafety: {
      uvPrecaution,
      airQualityOrComfort,
    },
    proTips: [
      `Check hourly precipitation charts before scheduling outdoor meetings.`,
      `UV rays peak between 11:30 AM and 2:30 PM local time.`,
      `Save ${weatherCityName} to your Favorites for quick 1-click access anytime!`,
    ],
    isAiGenerated: false,
  };
}

// Fetch AI recommendations with rule fallback
export async function fetchAIRecommendations(
  weatherData: WeatherData,
  userPrompt?: string
): Promise<AIRecommendationData> {
  try {
    const response = await fetch('/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        weatherData,
        city: weatherData.location.name,
        userPrompt,
      }),
    });

    if (!response.ok) {
      console.warn('API route failed, using rule-based generator');
      return generateRuleBasedRecommendations(weatherData);
    }

    const result = await response.json();

    if (result.success && result.data && !result.fallback) {
      const data = result.data;
      return {
        summary: data.summary || `Weather report for ${weatherData.location.name}`,
        activityRecommendations: data.activityRecommendations || [],
        clothingPlanner: data.clothingPlanner || {
          summary: 'Dress comfortably for the day.',
          itemsToBring: ['Sunglasses', 'Umbrella'],
          layeringAdvice: 'Wear versatile layers.',
        },
        commuteTravelAdvice: data.commuteTravelAdvice || 'Standard commute conditions.',
        healthSafety: data.healthSafety || {
          uvPrecaution: 'Take standard sun safety precautions.',
          airQualityOrComfort: 'Stay hydrated.',
        },
        proTips: data.proTips || ['Stay weather-aware throughout the day.'],
        isAiGenerated: true,
      };
    }

    // If API key was missing or fallback was returned
    return generateRuleBasedRecommendations(weatherData);
  } catch (error) {
    console.error('Error fetching AI weather insights:', error);
    return generateRuleBasedRecommendations(weatherData);
  }
}
