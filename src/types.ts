export type SoilType = 'Black Soil' | 'Red Soil' | 'Sandy Soil' | 'Loamy Soil' | 'Clay Soil';
export type WaterAvailability = 'Plenty' | 'Moderate' | 'Limited' | 'Rain-fed';
export type Season = 'Kharif' | 'Rabi' | 'Zaid' | 'Summer' | 'Winter';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Difficulty = 'Easy' | 'Medium' | 'High';

export interface FarmProfile {
  farmerName: string;
  location: string;
  farmSize: string;
  soilType: SoilType | '';
  currentCrop: string;
  waterAvailability: WaterAvailability | '';
  season: Season | '';
}

export interface Task {
  id: string;
  name: string;
  date: string;
  category: string;
  completed: boolean;
}

export interface CropSuggestion {
  name: string;
  why: string;
  waterRequirement: string;
  careTips: string;
  difficulty: Difficulty;
  waterScore: number;
  suitabilityScore: number;
  careScore: number;
}

export interface DiseaseInfo {
  crop: string;
  disease: string;
  riskLevel: RiskLevel;
  symptoms: string;
  prevention: string;
  treatment: string;
  explanation: string;
  controlMethod: string;
  isViral: boolean;
  vectorNote?: string;
}

export interface BudgetResult {
  totalCost: number;
  revenue: number;
  profit: number;
  isProfit: boolean;
  costBreakdown: { label: string; value: number }[];
  yieldAmount: number;
  pricePerKg: number;
  area: number;
  crop: string;
}

export interface MarketData {
  crop: string;
  currentPrice: number;
  unit: string;
  trend: 'Rising' | 'Falling' | 'Stable';
  trendHistory: number[];
  nearbyMarket: string;
  recommendation: 'Sell Now' | 'Wait' | 'Compare Markets';
}

export type PageKey =
  | 'dashboard'
  | 'my-farm'
  | 'crop-advisor'
  | 'crop-doctor'
  | 'weather'
  | 'water'
  | 'market'
  | 'disease-alert'
  | 'organic'
  | 'planner'
  | 'sell-store'
  | 'budget'
  | 'farmer-questions'
  | 'talk'
  | 'intelligence'
  | 'tools';

export interface WeatherData {
  temperature: number;
  rainChance: number;
  humidity: number;
  wind: number;
  condition: string;
  forecast: { day: string; temp: number; rain: number }[];
}
