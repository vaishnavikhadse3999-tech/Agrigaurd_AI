import { useState } from 'react';
import { Briefcase, Tractor, Building2, Ruler, Droplets, Award, Wheat, TrendingUp, AlertCircle, IndianRupee, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useI18n } from '@/lib/i18n';

interface BusinessPlan {
  id: string;
  name: string;
  icon: string;
  startupCostMin: number;
  startupCostMax: number;
  operatingCostMin: number;
  operatingCostMax: number;
  revenueMin: number;
  revenueMax: number;
  breakEvenMonths: number;
  spaceReq: string;
  equipment: string[];
  setupCost: string;
  recurringCost: string;
  sellingChannels: string[];
  waterReq: 'Plenty' | 'Moderate' | 'Limited';
  experienceReq: 'Beginner' | 'Intermediate' | 'Experienced';
}

const VILLAGE_BUSINESSES: BusinessPlan[] = [
  {
    id: 'dairy', name: 'Dairy Farming', icon: '🐄',
    startupCostMin: 100000, startupCostMax: 500000,
    operatingCostMin: 15000, operatingCostMax: 50000,
    revenueMin: 25000, revenueMax: 80000,
    breakEvenMonths: 18, spaceReq: '200-500 sq ft per animal + shed',
    equipment: ['Milking cans or machine', 'Feed troughs', 'Water troughs', 'Storage shed'],
    setupCost: 'Shed construction, animal purchase, milking equipment',
    recurringCost: 'Feed, veterinary, labor, electricity',
    sellingChannels: ['Local dairy', 'Milk cooperative', 'Direct selling to households'],
    waterReq: 'Plenty', experienceReq: 'Beginner',
  },
  {
    id: 'poultry', name: 'Poultry Farming', icon: '🐔',
    startupCostMin: 50000, startupCostMax: 300000,
    operatingCostMin: 10000, operatingCostMax: 40000,
    revenueMin: 20000, revenueMax: 70000,
    breakEvenMonths: 12, spaceReq: '1-2 sq ft per bird (broiler)',
    equipment: ['Poultry shed', 'Feeders', 'Waterers', 'Heating system', 'Lighting'],
    setupCost: 'Shed, chicks, feeders, initial feed stock',
    recurringCost: 'Feed, vaccines, labor, electricity',
    sellingChannels: ['Local market', 'Hotel/restaurant', 'Wholesale buyer'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
  },
  {
    id: 'goat', name: 'Goat Farming', icon: '🐐',
    startupCostMin: 80000, startupCostMax: 400000,
    operatingCostMin: 8000, operatingCostMax: 30000,
    revenueMin: 15000, revenueMax: 60000,
    breakEvenMonths: 15, spaceReq: '10-15 sq ft per goat',
    equipment: ['Goat shed', 'Feed troughs', 'Water troughs', 'Fencing'],
    setupCost: 'Shed, goat purchase, fencing, feeders',
    recurringCost: 'Feed, veterinary, labor',
    sellingChannels: ['Local market', 'Festival sales', 'Direct buyer'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
  },
  {
    id: 'beekeeping', name: 'Beekeeping', icon: '🐝',
    startupCostMin: 30000, startupCostMax: 150000,
    operatingCostMin: 5000, operatingCostMax: 15000,
    revenueMin: 10000, revenueMax: 40000,
    breakEvenMonths: 10, spaceReq: 'Minimal land needed (place hives near flowering crops)',
    equipment: ['Bee boxes', 'Protective gear', 'Honey extractor', 'Smoker'],
    setupCost: 'Bee boxes, bee colonies, extractor, gear',
    recurringCost: 'Sugar syrup, maintenance, transport',
    sellingChannels: ['Local market', 'Organic store', 'Direct selling'],
    waterReq: 'Limited', experienceReq: 'Intermediate',
  },
  {
    id: 'mushroom', name: 'Mushroom Cultivation', icon: '🍄',
    startupCostMin: 25000, startupCostMax: 100000,
    operatingCostMin: 5000, operatingCostMax: 20000,
    revenueMin: 12000, revenueMax: 50000,
    breakEvenMonths: 8, spaceReq: '100-300 sq ft (indoor)',
    equipment: ['Growing bags', 'Sterilization equipment', 'Humidity controller', 'Racks'],
    setupCost: 'Room preparation, spawn, bags, sterilization',
    recurringCost: 'Spawn, substrate, electricity, water',
    sellingChannels: ['Local market', 'Hotel/restaurant', 'Wholesale'],
    waterReq: 'Moderate', experienceReq: 'Intermediate',
  },
  {
    id: 'vermicompost', name: 'Vermicompost Production', icon: '🪱',
    startupCostMin: 15000, startupCostMax: 80000,
    operatingCostMin: 3000, operatingCostMax: 10000,
    revenueMin: 8000, revenueMax: 30000,
    breakEvenMonths: 6, spaceReq: '200-500 sq ft (covered shed)',
    equipment: ['Vermi beds', 'Shade net', 'Water sprinkler', 'Sieve'],
    setupCost: 'Beds, earthworms, shed, initial waste',
    recurringCost: 'Waste material, water, labor',
    sellingChannels: ['Local farmers', 'Nursery', 'Organic store'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
  },
  {
    id: 'seedprod', name: 'Seed Production', icon: '🌱',
    startupCostMin: 20000, startupCostMax: 100000,
    operatingCostMin: 5000, operatingCostMax: 20000,
    revenueMin: 10000, revenueMax: 40000,
    breakEvenMonths: 12, spaceReq: '0.5-2 acres of farmland',
    equipment: ['Processing equipment', 'Storage bags', 'Drying sheets', 'Testing kit'],
    setupCost: 'Certified seed, processing, storage',
    recurringCost: 'Labor, irrigation, certification fee',
    sellingChannels: ['Seed companies', 'Agriculture dept', 'Local farmers'],
    waterReq: 'Moderate', experienceReq: 'Experienced',
  },
  {
    id: 'machrental', name: 'Farm Machinery Rental', icon: '🚜',
    startupCostMin: 200000, startupCostMax: 1000000,
    operatingCostMin: 10000, operatingCostMax: 40000,
    revenueMin: 20000, revenueMax: 80000,
    breakEvenMonths: 24, spaceReq: 'Shed for machine storage',
    equipment: ['Tractor', 'Implements (plough, harvester, etc.)', 'Maintenance tools'],
    setupCost: 'Tractor and implements purchase, shed',
    recurringCost: 'Fuel, maintenance, operator salary',
    sellingChannels: ['Local farmers', 'Custom hiring to nearby villages'],
    waterReq: 'Limited', experienceReq: 'Experienced',
  },
];

const CITY_BUSINESSES: BusinessPlan[] = [
  {
    id: 'terrace', name: 'Terrace Gardening', icon: '🪴',
    startupCostMin: 5000, startupCostMax: 30000,
    operatingCostMin: 1000, operatingCostMax: 5000,
    revenueMin: 2000, revenueMax: 15000,
    breakEvenMonths: 8, spaceReq: '100-500 sq ft terrace or balcony',
    equipment: ['Grow bags or pots', 'Potting mix', 'Drip kit', 'Trellis'],
    setupCost: 'Containers, soil, seeds, basic tools',
    recurringCost: 'Seeds, fertilizer, water',
    sellingChannels: ['Neighbors', 'Local market', 'Home delivery'],
    waterReq: 'Limited', experienceReq: 'Beginner',
  },
  {
    id: 'kitchen', name: 'Kitchen Garden', icon: '🥬',
    startupCostMin: 2000, startupCostMax: 15000,
    operatingCostMin: 500, operatingCostMax: 3000,
    revenueMin: 1000, revenueMax: 8000,
    breakEvenMonths: 6, spaceReq: '50-200 sq ft backyard or balcony',
    equipment: ['Planters', 'Soil', 'Compost bin', 'Watering can'],
    setupCost: 'Containers, seeds, soil, compost bin',
    recurringCost: 'Seeds, water, organic inputs',
    sellingChannels: ['Self-consumption', 'Surplus to neighbors'],
    waterReq: 'Limited', experienceReq: 'Beginner',
  },
  {
    id: 'nursery', name: 'Plant Nursery', icon: '🌿',
    startupCostMin: 20000, startupCostMax: 100000,
    operatingCostMin: 5000, operatingCostMax: 20000,
    revenueMin: 10000, revenueMax: 50000,
    breakEvenMonths: 12, spaceReq: '200-1000 sq ft (outdoor or polyhouse)',
    equipment: ['Poly bags', 'Shade net', 'Watering system', 'Potting tables'],
    setupCost: 'Shade structure, seeds, pots, soil',
    recurringCost: 'Seeds, soil, water, labor',
    sellingChannels: ['Nursery shops', 'Online', 'Garden centers'],
    waterReq: 'Moderate', experienceReq: 'Intermediate',
  },
  {
    id: 'microgreens', name: 'Microgreens', icon: '🌾',
    startupCostMin: 10000, startupCostMax: 50000,
    operatingCostMin: 2000, operatingCostMax: 10000,
    revenueMin: 8000, revenueMax: 40000,
    breakEvenMonths: 6, spaceReq: '50-200 sq ft (indoor)',
    equipment: ['Grow trays', 'Grow lights', 'Shelving', 'Spray bottles'],
    setupCost: 'Trays, lights, seeds, shelving',
    recurringCost: 'Seeds, substrate, electricity, water',
    sellingChannels: ['Restaurants', 'Organic stores', 'Direct delivery'],
    waterReq: 'Limited', experienceReq: 'Beginner',
  },
  {
    id: 'hydroponics', name: 'Hydroponics', icon: '💧',
    startupCostMin: 50000, startupCostMax: 300000,
    operatingCostMin: 8000, operatingCostMax: 30000,
    revenueMin: 15000, revenueMax: 70000,
    breakEvenMonths: 18, spaceReq: '100-500 sq ft (indoor or polyhouse)',
    equipment: ['NFT/DWC system', 'Water pump', 'Grow lights', 'Nutrient solution', 'pH meter'],
    setupCost: 'System setup, pump, lights, nutrient stock',
    recurringCost: 'Nutrients, electricity, seeds, water',
    sellingChannels: ['Restaurants', 'Supermarkets', 'Direct delivery'],
    waterReq: 'Plenty', experienceReq: 'Experienced',
  },
  {
    id: 'composting', name: 'Composting', icon: '♻️',
    startupCostMin: 5000, startupCostMax: 30000,
    operatingCostMin: 1000, operatingCostMax: 5000,
    revenueMin: 3000, revenueMax: 15000,
    breakEvenMonths: 6, spaceReq: '100-300 sq ft (balcony or backyard)',
    equipment: ['Compost bin', 'Aeration tool', 'Thermometer', 'Shredder (optional)'],
    setupCost: 'Bins, initial waste stock, tools',
    recurringCost: 'Waste collection, labor, packaging',
    sellingChannels: ['Garden centers', 'Nurseries', 'Online'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
  },
  {
    id: 'urbanveg', name: 'Urban Vegetable Production', icon: '🥕',
    startupCostMin: 10000, startupCostMax: 60000,
    operatingCostMin: 3000, operatingCostMax: 12000,
    revenueMin: 5000, revenueMax: 25000,
    breakEvenMonths: 10, spaceReq: '200-800 sq ft (terrace or plot)',
    equipment: ['Grow bags', 'Drip kit', 'Trellis', 'Compost bin'],
    setupCost: 'Containers, soil, seeds, drip kit',
    recurringCost: 'Seeds, fertilizer, water',
    sellingChannels: ['Local market', 'Neighbors', 'Restaurant'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
  },
];

type FarmerType = 'village' | 'city';
type WaterLevel = 'Plenty' | 'Moderate' | 'Limited';
type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Experienced';

export function BusinessPlanner({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [farmerType, setFarmerType] = useState<FarmerType>('village');
  const [budget, setBudget] = useState<string>('');
  const [space, setSpace] = useState<string>('');
  const [water, setWater] = useState<WaterLevel>('Moderate');
  const [experience, setExperience] = useState<ExperienceLevel>('Beginner');
  const [selectedBusiness, setSelectedBusiness] = useState<string>('');
  const [generated, setGenerated] = useState(false);

  const businesses = farmerType === 'village' ? VILLAGE_BUSINESSES : CITY_BUSINESSES;
  const selectedPlan = businesses.find((b) => b.id === selectedBusiness);

  const generatePlan = () => {
    if (!selectedBusiness || !budget) return;
    setGenerated(true);
  };

  const budgetNum = parseInt(budget) || 0;

  const formatRupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div>
      <PageHeader
        title={t('bizPlanner.title')}
        subtitle={t('bizPlanner.subtitle')}
        icon={<Briefcase className="w-6 h-6" />}
        onBack={onBack}
      />

      <div className="card p-5 animate-fade-in">
        <label className="label">{t('bizPlanner.selectType')}</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setFarmerType('village'); setSelectedBusiness(''); setGenerated(false); }}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
              farmerType === 'village' ? 'bg-primary-600 text-white shadow-sm' : 'bg-primary-50 text-primary-700'
            }`}
          >
            <Tractor className="w-5 h-5" />
            <span className="font-semibold text-sm">{t('bizPlanner.village')}</span>
          </button>
          <button
            onClick={() => { setFarmerType('city'); setSelectedBusiness(''); setGenerated(false); }}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
              farmerType === 'city' ? 'bg-primary-600 text-white shadow-sm' : 'bg-primary-50 text-primary-700'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-semibold text-sm">{t('bizPlanner.city')}</span>
          </button>
        </div>
      </div>

      <div className="card p-5 mt-4 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('bizPlanner.budget')}</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={t('bizPlanner.enterBudget')}
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('bizPlanner.space')}</label>
            <input
              type="text"
              value={space}
              onChange={(e) => setSpace(e.target.value)}
              placeholder="e.g. 500 sq ft"
              className="input"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('bizPlanner.water')}</label>
            <select className="input" value={water} onChange={(e) => setWater(e.target.value as WaterLevel)}>
              <option value="Plenty">{t('bizPlanner.plenty')}</option>
              <option value="Moderate">{t('bizPlanner.moderate')}</option>
              <option value="Limited">{t('bizPlanner.limited')}</option>
            </select>
          </div>
          <div>
            <label className="label">{t('bizPlanner.experience')}</label>
            <select className="input" value={experience} onChange={(e) => setExperience(e.target.value as ExperienceLevel)}>
              <option value="Beginner">{t('bizPlanner.beginner')}</option>
              <option value="Intermediate">{t('bizPlanner.intermediate')}</option>
              <option value="Experienced">{t('bizPlanner.experienced')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">{t('bizPlanner.selectBusiness')}</label>
          <select
            className="input"
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
          >
            <option value="">—</option>
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>{b.icon} {b.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={generatePlan}
          disabled={!selectedBusiness || !budget}
          className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('bizPlanner.generatePlan')}
        </button>
      </div>

      {generated && selectedPlan && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="card p-5 bg-gradient-to-br from-primary-50 to-white">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedPlan.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-primary-900">{selectedPlan.name}</h3>
                <p className="text-sm text-primary-500">{t('bizPlanner.yourPlan')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              <StatCard
                icon={<IndianRupee className="w-4 h-4" />}
                label={t('bizPlanner.startupCost')}
                value={`${formatRupee(selectedPlan.startupCostMin)} – ${formatRupee(selectedPlan.startupCostMax)}`}
                color="text-primary-700"
              />
              <StatCard
                icon={<IndianRupee className="w-4 h-4" />}
                label={t('bizPlanner.operatingCost')}
                value={`${formatRupee(selectedPlan.operatingCostMin)} – ${formatRupee(selectedPlan.operatingCostMax)}`}
                color="text-accent-600"
              />
              <StatCard
                icon={<TrendingUp className="w-4 h-4" />}
                label={t('bizPlanner.revenue')}
                value={`${formatRupee(selectedPlan.revenueMin)} – ${formatRupee(selectedPlan.revenueMax)}`}
                color="text-success-600"
              />
              <StatCard
                icon={<Calendar className="w-4 h-4" />}
                label={t('bizPlanner.breakEven')}
                value={`${selectedPlan.breakEvenMonths} ${t('bizPlanner.months')}`}
                color="text-primary-600"
              />
            </div>

            {budgetNum > 0 && selectedPlan.startupCostMin > budgetNum && (
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" />
                <p className="text-sm text-accent-700">
                  Your budget ({formatRupee(budgetNum)}) is below the estimated startup cost. Consider starting at a smaller scale or exploring lower-cost options.
                </p>
              </div>
            )}
          </div>

          <div className="card p-5">
            <h4 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary-500" />
              {t('bizPlanner.spaceReq')}
            </h4>
            <p className="text-sm text-primary-700">{selectedPlan.spaceReq}</p>
          </div>

          <div className="card p-5">
            <h4 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
              <Wheat className="w-4 h-4 text-primary-500" />
              {t('bizPlanner.equipment')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedPlan.equipment.map((eq, i) => (
                <span key={i} className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">
                  {eq}
                </span>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-primary-500" />
                {t('bizPlanner.setupCost')}
              </h4>
              <p className="text-sm text-primary-700">{selectedPlan.setupCost}</p>
            </div>
            <div className="card p-5">
              <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary-500" />
                {t('bizPlanner.recurringCost')}
              </h4>
              <p className="text-sm text-primary-700">{selectedPlan.recurringCost}</p>
            </div>
          </div>

          <div className="card p-5">
            <h4 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary-500" />
              {t('bizPlanner.sellingChannels')}
            </h4>
            <div className="space-y-2">
              {selectedPlan.sellingChannels.map((ch, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-primary-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                  {ch}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-accent-600 mt-0.5 shrink-0" />
            <p className="text-sm text-accent-700">{t('bizPlanner.disclaimer')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-primary-100">
      <div className={`mb-1 ${color}`}>{icon}</div>
      <p className="text-xs text-primary-500">{label}</p>
      <p className="text-sm font-semibold text-primary-900">{value}</p>
    </div>
  );
}
