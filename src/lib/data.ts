import type { DiseaseInfo, MarketData, WeatherData, CropSuggestion, SoilType, WaterAvailability, Season } from '@/types';

export const SOIL_TYPES: SoilType[] = ['Black Soil', 'Red Soil', 'Sandy Soil', 'Loamy Soil', 'Clay Soil'];
export const WATER_LEVELS: WaterAvailability[] = ['Plenty', 'Moderate', 'Limited', 'Rain-fed'];
export const SEASONS: Season[] = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter'];

export const DEMO_FARM = {
  farmerName: 'Demo Farmer',
  location: 'Amravati',
  farmSize: '5 acres',
  soilType: 'Black Soil' as SoilType,
  currentCrop: 'Cotton',
  waterAvailability: 'Limited' as WaterAvailability,
  season: 'Kharif' as Season,
};

export const CROPS = [
  'Cotton', 'Rice', 'Wheat', 'Sugarcane', 'Maize', 'Soybean',
  'Groundnut', 'Millet', 'Pulses', 'Tomato', 'Onion', 'Banana',
];

export const CROP_PROBLEMS: Record<string, string[]> = {
  Cotton: ['Boll Weevil', 'Leaf Curl', 'Root Rot', 'Boll Rot'],
  Rice: ['Blast Disease', 'Brown Spot', 'Stem Borer', 'Bacterial Blight'],
  Wheat: ['Rust Disease', 'Smut', 'Aphids', 'Loose Smut'],
  Sugarcane: ['Red Rot', 'Borer', 'Wilt', 'Rust'],
  Maize: ['Leaf Blight', 'Stem Borer', 'Downy Mildew', 'Armyworm'],
  Soybean: ['Yellow Mosaic', 'Root Rot', 'Leaf Spot', 'Aphids'],
  Groundnut: ['Tikka Disease', 'Rust', 'Aflatoxin', 'Stem Rot'],
  Millet: ['Downy Mildew', 'Smut', 'Ergot', 'Head Caterpillar'],
  Pulses: ['Wilt', 'Powdery Mildew', 'Pod Borer', 'Root Rot'],
  Tomato: ['Early Blight', 'Late Blight', 'Leaf Curl', 'Fruit Borer'],
  Onion: ['Purple Blotch', 'Thrips', 'Basal Rot', 'Downy Mildew'],
  Banana: ['Panama Wilt', 'Sigatoka', 'Bunchy Top', 'Anthracnose'],
};

export const DISEASE_DATABASE: DiseaseInfo[] = [
  {
    crop: 'Cotton', disease: 'Boll Weevil', riskLevel: 'High',
    symptoms: 'Small holes in cotton bolls, fallen squares and young bolls on the ground.',
    prevention: 'Use clean seeds, monitor fields weekly, and remove fallen bolls.',
    treatment: 'Use a recommended insecticide (pyrethroid or organophosphate class) at early stage. Neem-based spray can also help at low pest pressure.',
    explanation: 'Boll weevils attack the cotton bolls and can badly reduce yield if not caught early.',
    controlMethod: 'Remove and destroy fallen bolls. Use pheromone traps to monitor adult weevils. Apply a recommended insecticide only when pest count crosses the threshold.',
    isViral: false,
  },
  {
    crop: 'Cotton', disease: 'Leaf Curl', riskLevel: 'Medium',
    symptoms: 'Leaves curl upward, thicken, and turn yellow.',
    prevention: 'Control whiteflies and use resistant cotton varieties.',
    treatment: 'There is no direct cure for the virus after infection. Remove affected plants and spray for whiteflies.',
    explanation: 'Leaf curl is a viral disease spread by whiteflies and weakens the plant.',
    controlMethod: 'There is no direct cure for the virus after infection. Management focuses on controlling the whitefly vector and removing infected plants to reduce spread.',
    isViral: true,
    vectorNote: 'Use a locally approved whitefly-control product suitable for cotton, according to the product label and local agriculture guidance. Plant resistant varieties.',
  },
  {
    crop: 'Cotton', disease: 'Root Rot', riskLevel: 'High',
    symptoms: 'Sudden wilting, roots turn brown and soft.',
    prevention: 'Avoid waterlogging, improve drainage, use treated seeds.',
    treatment: 'Use a recommended fungicide (carbendazim or copper-based class) and reduce watering.',
    explanation: 'Root rot happens when soil stays too wet and fungus attacks the roots.',
    controlMethod: 'Improve field drainage and avoid overwatering. Uproot and burn affected plants. Treat seeds with a recommended fungicide before sowing.',
    isViral: false,
  },
  {
    crop: 'Rice', disease: 'Blast Disease', riskLevel: 'High',
    symptoms: 'Diamond-shaped spots on leaves, panicles turn white and empty.',
    prevention: 'Use resistant varieties, avoid too much nitrogen.',
    treatment: 'Use a recommended fungicide (triazole or strobilurin class) when spots first appear.',
    explanation: 'Rice blast is a fungal disease that spreads fast in humid weather.',
    controlMethod: 'Apply a recommended fungicide at the first sign of spots. Avoid excess nitrogen fertilizer. Keep field spacing for air flow. Use resistant rice varieties.',
    isViral: false,
  },
  {
    crop: 'Rice', disease: 'Stem Borer', riskLevel: 'Medium',
    symptoms: 'Dead central shoot (deadheart), white empty panicles.',
    prevention: 'Remove stubbles after harvest, use light traps.',
    treatment: 'Use a recommended insecticide (carbamate or pyrethroid class) at early stage.',
    explanation: 'Stem borer larvae feed inside the stem and damage the plant.',
    controlMethod: 'Remove and burn stubbles after harvest. Use light traps to catch adult moths. Apply recommended insecticide when deadheart symptoms are first seen.',
    isViral: false,
  },
  {
    crop: 'Wheat', disease: 'Rust Disease', riskLevel: 'Medium',
    symptoms: 'Orange or brown rust pustules on leaves.',
    prevention: 'Use resistant varieties and remove weeds.',
    treatment: 'Apply recommended fungicide if seen early.',
    explanation: 'Wheat rust is a fungal disease that reduces grain filling.',
    controlMethod: 'Remove weed hosts around the field. Apply a recommended fungicide when pustules first appear. Grow resistant wheat varieties.',
    isViral: false,
  },
  {
    crop: 'Wheat', disease: 'Aphids', riskLevel: 'Low',
    symptoms: 'Small sap-sucking insects on leaves and stems, sticky honeydew.',
    prevention: 'Encourage beneficial insects, avoid excess nitrogen.',
    treatment: 'Spray neem oil solution or a recommended insecticide (neonicotinoid class).',
    explanation: 'Aphids suck plant sap and weaken the wheat crop.',
    controlMethod: 'Spray neem oil solution or a recommended insecticide. Encourage ladybirds and other beneficial insects that eat aphids. Avoid excess nitrogen.',
    isViral: false,
  },
  {
    crop: 'Sugarcane', disease: 'Red Rot', riskLevel: 'High',
    symptoms: 'Reddening of internal stalk tissue, sour smell, wilted leaves.',
    prevention: 'Use resistant varieties, rotate crops, improve drainage.',
    treatment: 'Remove affected canes and apply a recommended fungicide (benzimidazole class).',
    explanation: 'Red rot is a serious fungal disease of sugarcane.',
    controlMethod: 'Remove and destroy affected canes. Improve drainage and avoid waterlogging. Rotate with non-host crops. Plant resistant varieties.',
    isViral: false,
  },
  {
    crop: 'Maize', disease: 'Stem Borer', riskLevel: 'Medium',
    symptoms: 'Shot holes in leaves, deadheart, broken stems.',
    prevention: 'Clear crop residue, plant early, use trap crops.',
    treatment: 'Use a recommended insecticide (pyrethroid class) at early stage.',
    explanation: 'Stem borer larvae tunnel into the stem and damage maize.',
    controlMethod: 'Clear crop residue after harvest. Plant early to avoid peak pest period. Apply recommended insecticide when shot holes are first seen on leaves.',
    isViral: false,
  },
  {
    crop: 'Tomato', disease: 'Late Blight', riskLevel: 'High',
    symptoms: 'Water-soaked spots on leaves and fruits, white mold underneath.',
    prevention: 'Use resistant varieties, avoid overhead watering, space plants.',
    treatment: 'Use a copper-based or mancozeb fungicide at first sign.',
    explanation: 'Late blight spreads fast in cool wet weather and can destroy a tomato crop.',
    controlMethod: 'Apply a copper-based fungicide at the first sign. Remove and destroy affected leaves. Avoid overhead watering and improve air spacing between plants.',
    isViral: false,
  },
  {
    crop: 'Tomato', disease: 'Leaf Curl', riskLevel: 'Medium',
    symptoms: 'Leaves curl upward, yellowing, stunted growth.',
    prevention: 'Control whiteflies, use resistant varieties.',
    treatment: 'There is no direct cure for the virus after infection. Remove affected plants and control whiteflies.',
    explanation: 'Leaf curl virus is spread by whiteflies.',
    controlMethod: 'There is no direct cure for the virus after infection. Management focuses on reducing disease spread and controlling the insect vector.',
    isViral: true,
    vectorNote: 'Use a locally approved whitefly-control product suitable for tomato, according to the product label and local agriculture guidance. Remove infected plants and use resistant varieties.',
  },
  {
    crop: 'Onion', disease: 'Thrips', riskLevel: 'Medium',
    symptoms: 'Silvery patches on leaves, distorted growth.',
    prevention: 'Keep field clean, use balanced fertilizer.',
    treatment: 'Spray neem oil solution or a recommended insecticide (spinosad class).',
    explanation: 'Thrips are tiny insects that scrape and feed on onion leaves.',
    controlMethod: 'Spray neem oil solution or a recommended insecticide. Keep the field weed-free. Use balanced fertilizer to keep plants healthy.',
    isViral: false,
  },
  {
    crop: 'Banana', disease: 'Sigatoka', riskLevel: 'Medium',
    symptoms: 'Yellow streaks on leaves that turn brown and dry.',
    prevention: 'Remove affected leaves, improve air flow, avoid overcrowding.',
    treatment: 'Use a recommended fungicide (triazole or mancozeb class) on schedule.',
    explanation: 'Sigatoka is a fungal leaf disease that reduces banana yield.',
    controlMethod: 'Remove and destroy affected leaves. Improve air flow by proper spacing. Apply a recommended fungicide on a regular schedule.',
    isViral: false,
  },
  {
    crop: 'Soybean', disease: 'Yellow Mosaic', riskLevel: 'Medium',
    symptoms: 'Yellow mosaic pattern on leaves, stunted plants.',
    prevention: 'Control whiteflies, use resistant varieties.',
    treatment: 'There is no direct cure for the virus after infection. Remove severely infected plants where practical. Focus on controlling whiteflies because they spread the virus.',
    explanation: 'Yellow mosaic is a viral disease spread by whiteflies.',
    controlMethod: 'There is no direct cure for the virus after infection. Management focuses on reducing disease spread and controlling the insect vector.',
    isViral: true,
    vectorNote: 'Use a locally approved whitefly-control product suitable for soybean, according to the product label and local agriculture guidance. Remove infected plants and use resistant varieties.',
  },
  {
    crop: 'Millet', disease: 'Downy Mildew', riskLevel: 'Low',
    symptoms: 'Yellowing of leaves, white fungal growth on underside.',
    prevention: 'Use treated seeds, rotate crops, avoid waterlogging.',
    treatment: 'Use a recommended fungicide (metalaxyl or mancozeb class) if needed.',
    explanation: 'Downy mildew is a fungal disease that affects millet in wet conditions.',
    controlMethod: 'Use treated seeds before sowing. Rotate crops and avoid waterlogging. Apply a recommended fungicide if symptoms appear.',
    isViral: false,
  },
];

export const MARKET_DATA: Record<string, MarketData> = {
  Cotton: { crop: 'Cotton', currentPrice: 7200, unit: 'per quintal', trend: 'Rising', trendHistory: [6800, 6900, 7000, 7100, 7200], nearbyMarket: 'Amravati APMC', recommendation: 'Wait' },
  Rice: { crop: 'Rice', currentPrice: 2400, unit: 'per quintal', trend: 'Stable', trendHistory: [2350, 2380, 2400, 2400, 2400], nearbyMarket: 'Amravati APMC', recommendation: 'Sell Now' },
  Wheat: { crop: 'Wheat', currentPrice: 2200, unit: 'per quintal', trend: 'Falling', trendHistory: [2300, 2250, 2240, 2220, 2200], nearbyMarket: 'Amravati APMC', recommendation: 'Compare Markets' },
  Sugarcane: { crop: 'Sugarcane', currentPrice: 3200, unit: 'per ton', trend: 'Stable', trendHistory: [3150, 3180, 3200, 3200, 3200], nearbyMarket: 'Amravati APMC', recommendation: 'Sell Now' },
  Maize: { crop: 'Maize', currentPrice: 1960, unit: 'per quintal', trend: 'Rising', trendHistory: [1850, 1880, 1900, 1940, 1960], nearbyMarket: 'Amravati APMC', recommendation: 'Wait' },
  Soybean: { crop: 'Soybean', currentPrice: 4800, unit: 'per quintal', trend: 'Rising', trendHistory: [4400, 4500, 4600, 4700, 4800], nearbyMarket: 'Amravati APMC', recommendation: 'Wait' },
  Groundnut: { crop: 'Groundnut', currentPrice: 6200, unit: 'per quintal', trend: 'Stable', trendHistory: [6100, 6150, 6200, 6200, 6200], nearbyMarket: 'Amravati APMC', recommendation: 'Sell Now' },
  Millet: { crop: 'Millet', currentPrice: 2400, unit: 'per quintal', trend: 'Rising', trendHistory: [2200, 2250, 2300, 2350, 2400], nearbyMarket: 'Amravati APMC', recommendation: 'Wait' },
  Pulses: { crop: 'Pulses', currentPrice: 6800, unit: 'per quintal', trend: 'Rising', trendHistory: [6200, 6400, 6500, 6700, 6800], nearbyMarket: 'Amravati APMC', recommendation: 'Wait' },
  Tomato: { crop: 'Tomato', currentPrice: 1800, unit: 'per quintal', trend: 'Falling', trendHistory: [2400, 2200, 2000, 1900, 1800], nearbyMarket: 'Amravati APMC', recommendation: 'Sell Now' },
  Onion: { crop: 'Onion', currentPrice: 2400, unit: 'per quintal', trend: 'Rising', trendHistory: [1800, 1900, 2100, 2300, 2400], nearbyMarket: 'Amravati APMC', recommendation: 'Wait' },
  Banana: { crop: 'Banana', currentPrice: 1800, unit: 'per dozen bunch', trend: 'Stable', trendHistory: [1750, 1780, 1800, 1800, 1800], nearbyMarket: 'Amravati APMC', recommendation: 'Sell Now' },
};

export const DEMO_WEATHER: WeatherData = {
  temperature: 31,
  rainChance: 65,
  humidity: 72,
  wind: 14,
  condition: 'Partly Cloudy, Rain Expected',
  forecast: [
    { day: 'Today', temp: 31, rain: 65 },
    { day: 'Tomorrow', temp: 29, rain: 80 },
    { day: 'Day 3', temp: 28, rain: 40 },
    { day: 'Day 4', temp: 30, rain: 20 },
    { day: 'Day 5', temp: 32, rain: 10 },
  ],
};

export const ORGANIC_TOPICS = [
  {
    key: 'pest',
    title: 'Natural Pest Control',
    icon: 'Bug',
    what: 'Using natural methods like neem oil, companion planting, and beneficial insects to control pests without chemicals.',
    how: 'Spray neem oil solution every 7-10 days. Plant marigold as a companion crop. Encourage ladybugs and spiders that eat pests.',
    benefits: 'Keeps soil and water safe, costs less over time, and produces healthier crops.',
    precautions: 'Do not spray neem oil in strong sunlight. Test on a few plants first.',
  },
  {
    key: 'compost',
    title: 'Compost',
    icon: 'Recycle',
    what: 'Compost is natural fertilizer made from kitchen waste, dry leaves, and farm waste that decomposes over time.',
    how: 'Collect vegetable peels, dry leaves, and cow dung in a pit. Keep it moist and turn it every week. Ready in 2-3 months.',
    benefits: 'Improves soil fertility, reduces waste, and saves money on chemical fertilizer.',
    precautions: 'Avoid adding meat, oil, or diseased plants to the compost pit.',
  },
  {
    key: 'fertilizer',
    title: 'Organic Fertilizer',
    icon: 'Leaf',
    what: 'Natural fertilizers like cow dung manure, vermicompost, and green manure that feed the soil.',
    how: 'Apply well-rotted cow dung manure before sowing. Use vermicompost every 30 days. Grow legumes as green manure.',
    benefits: 'Builds long-term soil health, improves water holding, and is safe for the environment.',
    precautions: 'Use only well-decomposed manure to avoid burning young plants.',
  },
  {
    key: 'soil',
    title: 'Soil Improvement',
    icon: 'Layers',
    what: 'Methods to make soil richer and more productive, such as crop rotation, mulching, and adding organic matter.',
    how: 'Rotate crops each season. Cover soil with dry leaves or straw (mulch). Add compost regularly.',
    benefits: 'Prevents soil erosion, keeps moisture, and reduces the need for fertilizer.',
    precautions: 'Test soil every 1-2 years to know what nutrients are missing.',
  },
  {
    key: 'water',
    title: 'Water Saving',
    icon: 'Droplets',
    what: 'Techniques to use water wisely like drip irrigation, mulching, and rainwater harvesting.',
    how: 'Use drip irrigation to water roots directly. Mulch the soil to keep moisture. Collect rainwater in a small pit.',
    benefits: 'Saves up to 50% water, lowers costs, and works well in low-water areas.',
    precautions: 'Check drip lines for leaks regularly and clean the filters.',
  },
];

export const TASK_CATEGORIES = ['Watering', 'Fertilizer', 'Weeding', 'Pest checking', 'Harvesting', 'Soil preparation', 'Other'];

export const SAMPLE_TASKS = [
  { name: 'Water cotton field', date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), category: 'Watering' },
  { name: 'Check for boll weevil signs', date: new Date(Date.now() + 172800000).toISOString().slice(0, 10), category: 'Pest checking' },
  { name: 'Apply organic compost', date: new Date(Date.now() + 432000000).toISOString().slice(0, 10), category: 'Fertilizer' },
];
