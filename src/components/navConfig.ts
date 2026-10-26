import {
  Home, Sprout, Stethoscope, CloudSun, Droplets,
  TrendingUp, AlertTriangle, Leaf, ClipboardList, Scale,
  LayoutGrid, Tractor, Menu, X, Calculator, HelpCircle, MessageCircle,
  Store, Landmark, Briefcase, CloudRain,
} from 'lucide-react';
import type { PageKey } from '@/types';

export const NAV_ITEMS: { key: PageKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Home', icon: Home },
  { key: 'my-farm', label: 'My Farm', icon: Tractor },
  { key: 'talk', label: 'Talk to AgriGuard AI', icon: MessageCircle },
  { key: 'crop-advisor', label: 'Crop Advisor', icon: Sprout },
  { key: 'crop-doctor', label: 'AI Crop Doctor', icon: Stethoscope },
  { key: 'weather', label: 'Weather', icon: CloudSun },
  { key: 'water', label: 'Water & Irrigation', icon: Droplets },
  { key: 'market', label: 'Market Price', icon: TrendingUp },
  { key: 'mandi-prices', label: 'Nearby Mandi Prices', icon: Store },
  { key: 'schemes', label: 'Farmer Schemes', icon: Landmark },
  { key: 'business-planner', label: 'Business Planner', icon: Briefcase },
  { key: 'rainfall-advisor', label: 'Rainfall Advisor', icon: CloudRain },
  { key: 'disease-alert', label: 'Disease Alert', icon: AlertTriangle },
  { key: 'organic', label: 'Organic Farming', icon: Leaf },
  { key: 'planner', label: 'Farm Work Planner', icon: ClipboardList },
  { key: 'sell-store', label: 'Sell or Store', icon: Scale },
  { key: 'farmer-questions', label: 'Farmer Questions', icon: HelpCircle },
  { key: 'budget', label: 'Budget & Profit', icon: Calculator },
  { key: 'intelligence', label: 'Intelligence Engine', icon: LayoutGrid },
];

export const TOOLS: PageKey[] = [
  'talk', 'farmer-questions', 'crop-advisor', 'crop-doctor', 'weather', 'water',
  'market', 'disease-alert', 'organic', 'planner', 'sell-store', 'budget',
];

export const MOBILE_NAV: { key: PageKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Home', icon: Home },
  { key: 'my-farm', label: 'My Farm', icon: Tractor },
  { key: 'tools', label: 'Tools', icon: LayoutGrid },
  { key: 'disease-alert', label: 'Alerts', icon: AlertTriangle },
];

export { Menu, X };
