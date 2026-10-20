import type { FarmProfile, RiskLevel, CropSuggestion, SoilType, WaterAvailability, Season } from '@/types';
import { DISEASE_DATABASE, DEMO_WEATHER, MARKET_DATA } from './data';

export interface RiskScores {
  overall: RiskLevel;
  water: RiskLevel;
  crop: RiskLevel;
  weather: RiskLevel;
  market: RiskLevel;
}

export interface Recommendation {
  type: 'water' | 'crop' | 'weather' | 'disease' | 'market';
  icon: string;
  title: string;
  text: string;
}

const waterRiskMap: Record<WaterAvailability, RiskLevel> = {
  Plenty: 'Low',
  Moderate: 'Low',
  Limited: 'Medium',
  'Rain-fed': 'High',
};

const soilCropRisk: Record<string, RiskLevel> = {
  Cotton: 'Medium', Rice: 'Medium', Wheat: 'Low', Sugarcane: 'Medium',
  Maize: 'Low', Soybean: 'Low', Groundnut: 'Low', Millet: 'Low',
  Pulses: 'Low', Tomato: 'Medium', Onion: 'Medium', Banana: 'Medium',
};

function scoreToLevel(score: number): RiskLevel {
  if (score <= 1) return 'Low';
  if (score <= 2) return 'Medium';
  return 'High';
}

export function calculateRisk(farm: FarmProfile | null): RiskScores {
  if (!farm || !farm.waterAvailability) {
    return { overall: 'Low', water: 'Low', crop: 'Low', weather: 'Low', market: 'Low' };
  }

  const water = waterRiskMap[farm.waterAvailability] ?? 'Low';
  const crop = soilCropRisk[farm.currentCrop] ?? 'Low';

  const rainChance = DEMO_WEATHER.rainChance;
  let weather: RiskLevel = 'Low';
  if (rainChance >= 70) weather = 'Medium';
  if (rainChance >= 85 || DEMO_WEATHER.temperature >= 38) weather = 'High';

  let market: RiskLevel = 'Low';
  const md = farm.currentCrop ? MARKET_DATA[farm.currentCrop] : null;
  if (md) {
    if (md.trend === 'Falling') market = 'Medium';
  }

  const score =
    (water === 'Low' ? 0 : water === 'Medium' ? 1 : 2) +
    (crop === 'Low' ? 0 : crop === 'Medium' ? 1 : 2) +
    (weather === 'Low' ? 0 : weather === 'Medium' ? 1 : 2) +
    (market === 'Low' ? 0 : market === 'Medium' ? 1 : 2);

  return { overall: scoreToLevel(Math.round(score / 4 * 2)), water, crop, weather, market };
}

export function generateRecommendations(farm: FarmProfile | null): Recommendation[] {
  if (!farm || !farm.farmerName) {
    return [
      { type: 'crop', icon: 'Sprout', title: 'Set up your farm',
        text: 'Save your farm details in My Farm to get personalized advice.' },
    ];
  }

  const recs: Recommendation[] = [];
  const risk = calculateRisk(farm);

  // Water recommendation
  if (farm.waterAvailability === 'Limited' || farm.waterAvailability === 'Rain-fed') {
    if (DEMO_WEATHER.rainChance >= 60) {
      recs.push({
        type: 'water', icon: 'CloudRain', title: 'Water Recommendation',
        text: 'Your water availability is low and rainfall is expected soon. Avoid unnecessary irrigation today.',
      });
    } else {
      recs.push({
        type: 'water', icon: 'Droplets', title: 'Water Recommendation',
        text: 'Water availability is limited. Use drip irrigation and mulching to save water.',
      });
    }
  } else {
    recs.push({
      type: 'water', icon: 'Droplets', title: 'Water Recommendation',
      text: 'Water availability is good. Maintain regular irrigation but avoid overwatering.',
    });
  }

  // Crop recommendation
  if (farm.currentCrop) {
    recs.push({
      type: 'crop', icon: 'Sprout', title: 'Crop Recommendation',
      text: `Based on your ${farm.soilType || 'soil'}, ${farm.season || 'season'} and ${farm.waterAvailability || 'water'} availability, ${farm.currentCrop} is being monitored. Check Crop Advisor for alternatives.`,
    });
  }

  // Weather warning
  if (DEMO_WEATHER.rainChance >= 70) {
    recs.push({
      type: 'weather', icon: 'CloudRain', title: 'Weather Warning',
      text: 'Rain is expected in the next 1-2 days. Delay fertilizer and pesticide spraying. Check drainage in low areas.',
    });
  } else if (DEMO_WEATHER.temperature >= 35) {
    recs.push({
      type: 'weather', icon: 'Sun', title: 'Weather Warning',
      text: 'High temperature detected. Monitor soil moisture and water early morning or late evening.',
    });
  } else {
    recs.push({
      type: 'weather', icon: 'CloudSun', title: 'Weather Update',
      text: 'Weather is stable. Good time for regular farm activities.',
    });
  }

  // Disease warning
  const disease = DISEASE_DATABASE.find((d) => d.crop === farm.currentCrop && d.riskLevel === 'High');
  if (disease) {
    recs.push({
      type: 'disease', icon: 'AlertTriangle', title: 'Disease Warning',
      text: `High risk of ${disease.disease} in ${farm.currentCrop}. Watch for: ${disease.symptoms.slice(0, 60)}...`,
    });
  }

  // Market suggestion
  const md = farm.currentCrop ? MARKET_DATA[farm.currentCrop] : null;
  if (md) {
    let marketText = '';
    if (md.recommendation === 'Sell Now') {
      marketText = `${farm.currentCrop} price is ${md.trend.toLowerCase()}. Consider selling now at ${md.currentPrice} ${md.unit}.`;
    } else if (md.recommendation === 'Wait') {
      marketText = `${farm.currentCrop} price trend is ${md.trend.toLowerCase()}. Waiting a bit may give a better price (now ${md.currentPrice} ${md.unit}).`;
    } else {
      marketText = `${farm.currentCrop} prices vary by market. Compare nearby markets before selling.`;
    }
    recs.push({
      type: 'market', icon: 'TrendingUp', title: 'Market Suggestion',
      text: marketText,
    });
  }

  return recs.slice(0, 5);
}

// Crop suggestion logic
const cropMatrix: Record<string, { water: number; soils: SoilType[]; seasons: Season[]; difficulty: 'Easy' | 'Medium' | 'High' }> = {
  Cotton: { water: 2, soils: ['Black Soil', 'Loamy Soil'], seasons: ['Kharif'], difficulty: 'Medium' },
  Rice: { water: 3, soils: ['Clay Soil', 'Loamy Soil'], seasons: ['Kharif', 'Zaid'], difficulty: 'High' },
  Wheat: { water: 2, soils: ['Loamy Soil', 'Clay Soil', 'Black Soil'], seasons: ['Rabi', 'Winter'], difficulty: 'Easy' },
  Millet: { water: 1, soils: ['Sandy Soil', 'Red Soil', 'Black Soil'], seasons: ['Kharif', 'Summer'], difficulty: 'Easy' },
  Maize: { water: 2, soils: ['Loamy Soil', 'Black Soil', 'Red Soil'], seasons: ['Kharif', 'Rabi'], difficulty: 'Medium' },
  Soybean: { water: 2, soils: ['Black Soil', 'Loamy Soil', 'Clay Soil'], seasons: ['Kharif'], difficulty: 'Medium' },
  Groundnut: { water: 1, soils: ['Sandy Soil', 'Red Soil', 'Loamy Soil'], seasons: ['Kharif', 'Summer'], difficulty: 'Easy' },
  Pulses: { water: 1, soils: ['Black Soil', 'Red Soil', 'Loamy Soil'], seasons: ['Kharif', 'Rabi'], difficulty: 'Easy' },
  Sugarcane: { water: 3, soils: ['Loamy Soil', 'Clay Soil', 'Black Soil'], seasons: ['Kharif', 'Zaid'], difficulty: 'High' },
  Tomato: { water: 2, soils: ['Loamy Soil', 'Red Soil'], seasons: ['Kharif', 'Rabi', 'Zaid'], difficulty: 'Medium' },
  Onion: { water: 2, soils: ['Sandy Soil', 'Loamy Soil', 'Black Soil'], seasons: ['Rabi', 'Kharif'], difficulty: 'Medium' },
  Banana: { water: 3, soils: ['Loamy Soil', 'Clay Soil'], seasons: ['Kharif', 'Rabi', 'Zaid'], difficulty: 'High' },
};

const waterScoreMap: Record<WaterAvailability, number> = { Plenty: 3, Moderate: 2, Limited: 1, 'Rain-fed': 1 };

export function suggestCrops(
  soil: SoilType | '',
  season: Season | '',
  water: WaterAvailability | ''
): CropSuggestion[] {
  const waterLevel = water ? waterScoreMap[water] : 2;
  const results: CropSuggestion[] = [];

  for (const [name, info] of Object.entries(cropMatrix)) {
    let suitability = 50;
    if (soil && info.soils.includes(soil)) suitability += 25;
    if (season && info.seasons.includes(season)) suitability += 20;
    // water match
    if (waterLevel >= info.water) suitability += 15;
    else suitability -= (info.water - waterLevel) * 10;

    suitability = Math.max(20, Math.min(98, suitability));

    const waterReqText =
      info.water === 1 ? 'Low water need' : info.water === 2 ? 'Moderate water need' : 'High water need';

    let why = '';
    if (soil && info.soils.includes(soil)) why += `Grows well in ${soil}. `;
    if (season && info.seasons.includes(season)) why += `Suitable for ${season} season. `;
    if (waterLevel >= info.water) why += `Matches your water availability. `;
    if (!why) why = `Can grow in your area with proper care. `;

    const careTips =
      info.difficulty === 'Easy'
        ? 'Regular watering and basic weeding is enough.'
        : info.difficulty === 'Medium'
        ? 'Needs timely watering, pest checks, and balanced fertilizer.'
        : 'Needs careful water management, pest control, and regular monitoring.';

    results.push({
      name,
      why: why.trim(),
      waterRequirement: waterReqText,
      careTips,
      difficulty: info.difficulty,
      waterScore: info.water,
      suitabilityScore: suitability,
      careScore: info.difficulty === 'Easy' ? 1 : info.difficulty === 'Medium' ? 2 : 3,
    });
  }

  return results.sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, 3);
}

export function checkIrrigation(
  crop: string,
  soil: string,
  rainfall: 'None' | 'Light' | 'Moderate' | 'Heavy',
  waterAvailable: WaterAvailability | ''
) {
  const rainChance = DEMO_WEATHER.rainChance;
  let needed = true;
  let timing = 'Early morning (6-8 AM) or late evening (5-7 PM)';
  let risk: RiskLevel = 'Low';
  let tip = '';

  if (rainfall === 'Heavy' || rainfall === 'Moderate') {
    needed = false;
    tip = 'Recent rainfall is enough. Delay irrigation for a few days.';
  } else if (rainfall === 'Light') {
    needed = true;
    tip = 'Light rainfall is not enough. Water lightly if soil feels dry.';
  } else if (rainChance >= 60) {
    needed = false;
    tip = 'Rain is expected soon. Consider delaying irrigation to save water.';
  } else if (waterAvailable === 'Limited' || waterAvailable === 'Rain-fed') {
    needed = true;
    risk = 'High';
    tip = 'Water is limited. Use drip irrigation and mulching to save water.';
  } else {
    needed = true;
    tip = 'Water as needed. Check soil moisture before watering.';
  }

  if (soil === 'Sandy Soil') {
    timing = 'Water in short cycles, 2 times a day (morning and evening)';
  } else if (soil === 'Clay Soil') {
    timing = 'Water once every 2-3 days, avoid overwatering';
  }

  if (crop && cropMatrix[crop]?.water === 3 && waterAvailable !== 'Plenty') {
    risk = 'High';
  } else if (crop && cropMatrix[crop]?.water === 1) {
    risk = risk === 'High' ? 'Medium' : 'Low';
  }

  return { needed, timing, risk, tip };
}
