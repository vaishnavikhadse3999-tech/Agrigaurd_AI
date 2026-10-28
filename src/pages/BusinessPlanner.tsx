import { useState, useMemo } from 'react';
import {
  Briefcase, Tractor, Building2, IndianRupee, Calendar, TrendingUp,
  AlertCircle, Ruler, Droplets, Award, Clock, ExternalLink, Scale,
  Printer, Sparkles, ChevronRight, FlaskConical, Store, Leaf, Wheat, Milk, Egg, Sprout,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useI18n } from '@/lib/i18n';

interface BusinessPlan {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'village' | 'city' | 'all';
  startupCostMin: number;
  startupCostMax: number;
  operatingCostMin: number;
  operatingCostMax: number;
  revenueMin: number;
  revenueMax: number;
  breakEvenMonths: number;
  spaceReq: string;
  equipment: string[];
  sellingChannels: string[];
  waterReq: 'Plenty' | 'Moderate' | 'Limited';
  experienceReq: 'Beginner' | 'Intermediate' | 'Experienced';
  timeToStart: string;
  risks: string;
  govtSchemes: { name: string; url: string }[];
}

const BUSINESSES: BusinessPlan[] = [
  {
    id: 'dairy', name: 'Dairy Farming & Milk Products', icon: Milk, category: 'village',
    startupCostMin: 100000, startupCostMax: 500000,
    operatingCostMin: 15000, operatingCostMax: 50000,
    revenueMin: 25000, revenueMax: 80000,
    breakEvenMonths: 18, spaceReq: '200-500 sq ft per animal + shed',
    equipment: ['Milking cans or machine', 'Feed troughs', 'Water troughs', 'Storage shed'],
    sellingChannels: ['Local dairy', 'Milk cooperative', 'Direct selling to households'],
    waterReq: 'Plenty', experienceReq: 'Beginner',
    timeToStart: '1-2 months',
    risks: 'Disease outbreak, feed price fluctuation, milk price changes in summer/winter',
    govtSchemes: [
      { name: 'PM-KISAN', url: 'https://pmkisan.gov.in/' },
      { name: 'Kisan Credit Card', url: 'https://www.pmkisan.gov.in/Documents/Kcc.pdf' },
    ],
  },
  {
    id: 'poultry', name: 'Poultry & Goat Farming', icon: Egg, category: 'village',
    startupCostMin: 50000, startupCostMax: 400000,
    operatingCostMin: 8000, operatingCostMax: 40000,
    revenueMin: 15000, revenueMax: 70000,
    breakEvenMonths: 12, spaceReq: '1-2 sq ft per bird; 10-15 sq ft per goat',
    equipment: ['Poultry shed', 'Feeders', 'Waterers', 'Goat shed', 'Fencing'],
    sellingChannels: ['Local market', 'Hotel/restaurant', 'Festival sales', 'Wholesale buyer'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
    timeToStart: '1-2 months',
    risks: 'Disease (Newcastle, PPR), feed cost, seasonal demand fluctuation',
    govtSchemes: [
      { name: 'MahaDBT Machinery Subsidy', url: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin' },
      { name: 'PM-KISAN', url: 'https://pmkisan.gov.in/' },
    ],
  },
  {
    id: 'mushroom', name: 'Mushroom Cultivation', icon: FlaskConical, category: 'all',
    startupCostMin: 25000, startupCostMax: 100000,
    operatingCostMin: 5000, operatingCostMax: 20000,
    revenueMin: 12000, revenueMax: 50000,
    breakEvenMonths: 8, spaceReq: '100-300 sq ft (indoor)',
    equipment: ['Growing bags', 'Sterilization equipment', 'Humidity controller', 'Racks'],
    sellingChannels: ['Local market', 'Hotel/restaurant', 'Wholesale'],
    waterReq: 'Moderate', experienceReq: 'Intermediate',
    timeToStart: '1-2 months',
    risks: 'Contamination, temperature/humidity control, seasonal demand',
    govtSchemes: [
      { name: 'Mushroom Development (NHM)', url: 'https://midh.gov.in/' },
      { name: 'MahaDBT', url: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin' },
    ],
  },
  {
    id: 'vermicompost', name: 'Vermicompost & Organic Fertilizer', icon: Leaf, category: 'all',
    startupCostMin: 15000, startupCostMax: 80000,
    operatingCostMin: 3000, operatingCostMax: 10000,
    revenueMin: 8000, revenueMax: 30000,
    breakEvenMonths: 6, spaceReq: '200-500 sq ft (covered shed)',
    equipment: ['Vermi beds', 'Shade net', 'Water sprinkler', 'Sieve'],
    sellingChannels: ['Local farmers', 'Nursery', 'Organic store'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
    timeToStart: '2-3 months (first harvest)',
    risks: 'Temperature extremes, predator attacks, monsoon flooding',
    govtSchemes: [
      { name: 'PMKSY (Soil Health)', url: 'https://pmkky.gov.in/' },
      { name: 'Organic Farming Support', url: 'https://midh.gov.in/' },
    ],
  },
  {
    id: 'foodprocessing', name: 'Food Processing (Soybean, Flour, Pickles)', icon: Wheat, category: 'all',
    startupCostMin: 50000, startupCostMax: 300000,
    operatingCostMin: 10000, operatingCostMax: 40000,
    revenueMin: 20000, revenueMax: 80000,
    breakEvenMonths: 14, spaceReq: '300-800 sq ft (processing + storage)',
    equipment: ['Grinder/mill', 'Packaging machine', 'Storage containers', 'Sealing machine'],
    sellingChannels: ['Local shops', 'Markets', 'Online', 'Wholesale'],
    waterReq: 'Moderate', experienceReq: 'Intermediate',
    timeToStart: '2-3 months',
    risks: 'Raw material price fluctuation, food safety compliance, shelf-life management',
    govtSchemes: [
      { name: 'PMFME (Micro Food Processing)', url: 'https://pmfme.mofpi.gov.in/' },
      { name: 'MahaDBT', url: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin' },
    ],
  },
  {
    id: 'nursery', name: 'Seedling Nursery & Vegetable Farming', icon: Sprout, category: 'all',
    startupCostMin: 20000, startupCostMax: 100000,
    operatingCostMin: 5000, operatingCostMax: 20000,
    revenueMin: 10000, revenueMax: 50000,
    breakEvenMonths: 12, spaceReq: '200-1000 sq ft (outdoor or polyhouse)',
    equipment: ['Poly bags', 'Shade net', 'Watering system', 'Potting tables'],
    sellingChannels: ['Nursery shops', 'Online', 'Garden centers', 'Local farmers'],
    waterReq: 'Moderate', experienceReq: 'Intermediate',
    timeToStart: '1-2 months',
    risks: 'Seasonal demand, pest attacks, weather damage',
    govtSchemes: [
      { name: 'National Horticulture Mission', url: 'https://midh.gov.in/' },
      { name: 'MahaDBT Seed Subsidy', url: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin' },
    ],
  },
  {
    id: 'machrental', name: 'Farm Equipment Rental Services', icon: Tractor, category: 'village',
    startupCostMin: 200000, startupCostMax: 1000000,
    operatingCostMin: 10000, operatingCostMax: 40000,
    revenueMin: 20000, revenueMax: 80000,
    breakEvenMonths: 24, spaceReq: 'Shed for machine storage',
    equipment: ['Tractor', 'Implements (plough, harvester, etc.)', 'Maintenance tools'],
    sellingChannels: ['Local farmers', 'Custom hiring to nearby villages'],
    waterReq: 'Limited', experienceReq: 'Experienced',
    timeToStart: '1 month',
    risks: 'Machinery breakdown, seasonal demand (peak during sowing/harvest), fuel costs',
    govtSchemes: [
      { name: 'SMAM (Machinery Subsidy)', url: 'https://farmmachinery.gov.in/' },
      { name: 'MahaDBT Machinery', url: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin' },
    ],
  },
  {
    id: 'directselling', name: 'Direct-to-Customer Vegetable Sales', icon: Store, category: 'all',
    startupCostMin: 10000, startupCostMax: 60000,
    operatingCostMin: 3000, operatingCostMax: 12000,
    revenueMin: 5000, revenueMax: 25000,
    breakEvenMonths: 10, spaceReq: '200-800 sq ft (terrace or plot)',
    equipment: ['Grow bags', 'Drip kit', 'Trellis', 'Compost bin', 'Transport (cart/bike)'],
    sellingChannels: ['Local market', 'Neighbors', 'Restaurant', 'Home delivery'],
    waterReq: 'Moderate', experienceReq: 'Beginner',
    timeToStart: '1-3 months',
    risks: 'Seasonal production, price fluctuation, perishable goods spoilage',
    govtSchemes: [
      { name: 'FPO Formation Support', url: 'https://sfacindia.com/formation-and-promotion-of-fpo' },
      { name: 'PM-KISAN', url: 'https://pmkisan.gov.in/' },
    ],
  },
  {
    id: 'fpo', name: 'Farmer Producer Organization (FPO)', icon: Briefcase, category: 'all',
    startupCostMin: 50000, startupCostMax: 200000,
    operatingCostMin: 10000, operatingCostMax: 30000,
    revenueMin: 20000, revenueMax: 100000,
    breakEvenMonths: 18, spaceReq: 'Office space + collection center',
    equipment: ['Office setup', 'Storage facility', 'Computer', 'Weighing scales'],
    sellingChannels: ['Bulk buyers', 'Mandis', 'Direct to processors', 'Online platforms'],
    waterReq: 'Limited', experienceReq: 'Experienced',
    timeToStart: '3-6 months (registration + setup)',
    risks: 'Group management challenges, market access, member retention',
    govtSchemes: [
      { name: 'FPO Formation & Promotion', url: 'https://sfacindia.com/formation-and-promotion-of-fpo' },
      { name: 'KCC for FPOs', url: 'https://www.pmkisan.gov.in/Documents/Kcc.pdf' },
    ],
  },
];

const formatRupee = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export function BusinessPlanner({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [view, setView] = useState<'browse' | 'calculator' | 'compare'>('browse');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');

  // Calculator inputs
  const [budget, setBudget] = useState<string>('');
  const [land, setLand] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [production, setProduction] = useState<string>('');
  const [calcBusinessId, setCalcBusinessId] = useState<string>('');
  const [calcResult, setCalcResult] = useState(false);

  // Compare inputs
  const [compareA, setCompareA] = useState<string>('');
  const [compareB, setCompareB] = useState<string>('');

  const selectedPlan = BUSINESSES.find((b) => b.id === selectedBusinessId);
  const calcBusiness = BUSINESSES.find((b) => b.id === calcBusinessId);
  const planA = BUSINESSES.find((b) => b.id === compareA);
  const planB = BUSINESSES.find((b) => b.id === compareB);

  const budgetNum = parseInt(budget) || 0;
  const productionNum = parseFloat(production) || 0;

  const calcResults = useMemo(() => {
    if (!calcBusiness || !budgetNum) return null;
    const startupCost = calcBusiness.startupCostMin;
    const monthlyOperating = calcBusiness.operatingCostMin;
    const monthlyRevenue = calcBusiness.revenueMin;
    const monthlyProfit = monthlyRevenue - monthlyOperating;
    const yearlyProfit = monthlyProfit * 12;
    const totalYear1Cost = startupCost + monthlyOperating * 12;
    return {
      startupCost,
      monthlyOperating,
      monthlyRevenue,
      monthlyProfit,
      yearlyProfit,
      totalYear1Cost,
      canStart: budgetNum >= startupCost,
      scale: budgetNum >= startupCost ? 1 : Math.max(0.25, budgetNum / startupCost),
    };
  }, [calcBusiness, budgetNum, productionNum]);

  const handleCalculate = () => {
    if (!calcBusinessId || !budget) return;
    setCalcResult(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <PageHeader
        title={t('bizPlanner.hubTitle')}
        subtitle={t('bizPlanner.hubSubtitle')}
        icon={<Briefcase className="w-6 h-6" />}
        onBack={onBack}
      />

      {/* View switcher */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <ViewTab active={view === 'browse'} onClick={() => setView('browse')} icon={<Sparkles className="w-4 h-4" />} label={t('bizPlanner.browseBusinesses')} />
        <ViewTab active={view === 'calculator'} onClick={() => setView('calculator')} icon={<IndianRupee className="w-4 h-4" />} label={t('bizPlanner.calculator')} />
        <ViewTab active={view === 'compare'} onClick={() => setView('compare')} icon={<Scale className="w-4 h-4" />} label={t('bizPlanner.compare')} />
      </div>

      {/* BROWSE: Business cards */}
      {view === 'browse' && (
        <div className="space-y-4 animate-fade-in">
          {selectedPlan ? (
            <BusinessDetail plan={selectedPlan} onClose={() => setSelectedBusinessId('')} onCalculate={(id) => { setCalcBusinessId(id); setView('calculator'); }} t={t} />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUSINESSES.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.id} className="card p-5 hover:border-primary-300 transition-all cursor-pointer group" onClick={() => setSelectedBusinessId(b.id)}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-primary-900 text-sm leading-tight flex-1">{b.name}</h3>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-primary-600">
                        <IndianRupee className="w-3 h-3" />
                        <span className="font-medium">{formatRupee(b.startupCostMin)} – {formatRupee(b.startupCostMax)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary-600">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-medium">{formatRupee(b.revenueMin)} – {formatRupee(b.revenueMax)}/mo</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary-600">
                        <Clock className="w-3 h-3" />
                        <span>{b.timeToStart}</span>
                      </div>
                    </div>
                    <button className="btn-ghost w-full mt-3 text-sm flex items-center justify-center gap-1.5">
                      {t('bizPlanner.calculateBtn')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CALCULATOR */}
      {view === 'calculator' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('bizPlanner.budget')}</label>
                <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder={t('bizPlanner.enterBudget')} className="input" />
              </div>
              <div>
                <label className="label">{t('bizPlanner.space')}</label>
                <input type="text" value={land} onChange={(e) => setLand(e.target.value)} placeholder="e.g. 500 sq ft" className="input" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('bizPlanner.villageDistrict')}</label>
                <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Shegaon, Buldhana" className="input" />
              </div>
              <div>
                <label className="label">{t('bizPlanner.expectedProduction')}</label>
                <input type="text" value={production} onChange={(e) => setProduction(e.target.value)} placeholder="e.g. 100 kg/month" className="input" />
              </div>
            </div>
            <div>
              <label className="label">{t('bizPlanner.selectBusiness')}</label>
              <select className="input" value={calcBusinessId} onChange={(e) => setCalcBusinessId(e.target.value)}>
                <option value="">—</option>
                {BUSINESSES.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <button onClick={handleCalculate} disabled={!calcBusinessId || !budget} className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {t('bizPlanner.calculateBtn')}
            </button>
          </div>

          {calcResult && calcBusiness && calcResults && (
            <div className="space-y-4 animate-slide-up">
              <div className="card p-5 bg-gradient-to-br from-primary-50 to-white">
                <div className="flex items-center gap-3 mb-4">
                  <calcBusiness.icon className="w-8 h-8 text-primary-600" />
                  <div>
                    <h3 className="text-lg font-bold text-primary-900">{calcBusiness.name}</h3>
                    <p className="text-sm text-primary-500">{t('bizPlanner.results')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <CalcCard label={t('bizPlanner.startupCost')} value={formatRupee(Math.round(calcResults.startupCost * calcResults.scale))} color="text-primary-700" />
                  <CalcCard label={t('bizPlanner.operatingCost')} value={`${formatRupee(Math.round(calcResults.monthlyOperating * calcResults.scale))}/mo`} color="text-accent-600" />
                  <CalcCard label={t('bizPlanner.revenue')} value={`${formatRupee(Math.round(calcResults.monthlyRevenue * calcResults.scale))}/mo`} color="text-success-600" />
                  <CalcCard label={t('bizPlanner.monthlyProfit')} value={`${formatRupee(Math.round(calcResults.monthlyProfit * calcResults.scale))}/mo`} color={calcResults.monthlyProfit > 0 ? 'text-success-600' : 'text-error-600'} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <CalcCard label={t('bizPlanner.yearlyProfit')} value={formatRupee(Math.round(calcResults.yearlyProfit * calcResults.scale))} color={calcResults.yearlyProfit > 0 ? 'text-success-600' : 'text-error-600'} />
                  <CalcCard label={t('bizPlanner.breakEven')} value={`${calcBusiness.breakEvenMonths} ${t('bizPlanner.months')}`} color="text-primary-600" />
                </div>
                {!calcResults.canStart && (
                  <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-accent-700">
                      Your budget ({formatRupee(budgetNum)}) is below the estimated startup cost. Consider starting at a smaller scale ({Math.round(calcResults.scale * 100)}% of full capacity) or exploring lower-cost options.
                    </p>
                  </div>
                )}
                <div className="bg-primary-50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-primary-600">
                    <strong>Formula:</strong> Monthly Profit = Monthly Revenue − Monthly Operating Cost.
                    Yearly Profit = Monthly Profit × 12. Scale factor: {calcResults.scale < 1 ? `${Math.round(calcResults.scale * 100)}% (budget-limited)` : '100% (full scale)'}.
                  </p>
                </div>
                <button onClick={handlePrint} className="btn-ghost flex items-center gap-2 text-sm">
                  <Printer className="w-4 h-4" />
                  {t('bizPlanner.printPlan')}
                </button>
              </div>

              <div className="card p-5">
                <h4 className="font-semibold text-primary-800 mb-3 flex items-center gap-2"><Ruler className="w-4 h-4 text-primary-500" />{t('bizPlanner.spaceReq')}</h4>
                <p className="text-sm text-primary-700">{calcBusiness.spaceReq}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card p-5">
                  <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-primary-500" />{t('bizPlanner.setupCost')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {calcBusiness.equipment.map((eq, i) => (
                      <span key={i} className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">{eq}</span>
                    ))}
                  </div>
                </div>
                <div className="card p-5">
                  <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-primary-500" />{t('bizPlanner.sellingChannels')}</h4>
                  <div className="space-y-2">
                    {calcBusiness.sellingChannels.map((ch, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-primary-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />{ch}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" />{t('bizPlanner.timeToStart')}</h4>
                <p className="text-sm text-primary-700">{calcBusiness.timeToStart}</p>
              </div>

              <div className="card p-5">
                <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-accent-500" />{t('bizPlanner.risks')}</h4>
                <p className="text-sm text-primary-700">{calcBusiness.risks}</p>
              </div>

              {calcBusiness.govtSchemes.length > 0 && (
                <div className="card p-5">
                  <h4 className="font-semibold text-primary-800 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary-500" />{t('bizPlanner.govtSchemes')}</h4>
                  <div className="space-y-2">
                    {calcBusiness.govtSchemes.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-900 transition-colors">
                        <ExternalLink className="w-4 h-4 text-primary-400" />{s.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-accent-600 mt-0.5 shrink-0" />
                <p className="text-sm text-accent-700">{t('bizPlanner.estimateNote')}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMPARE */}
      {view === 'compare' && (
        <div className="space-y-4 animate-fade-in">
          <div className="card p-5">
            <p className="text-sm text-primary-600 mb-3">{t('bizPlanner.selectTwoBusinesses')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('bizPlanner.selectBusinessA')}</label>
                <select className="input" value={compareA} onChange={(e) => setCompareA(e.target.value)}>
                  <option value="">—</option>
                  {BUSINESSES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">{t('bizPlanner.selectBusinessB')}</label>
                <select className="input" value={compareB} onChange={(e) => setCompareB(e.target.value)}>
                  <option value="">—</option>
                  {BUSINESSES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {planA && planB && (
            <div className="card p-5 overflow-x-auto animate-slide-up">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary-100">
                    <th className="text-left py-2 pr-3 text-primary-500 font-medium">{t('bizPlanner.vs')}</th>
                    <th className="text-left py-2 px-3 text-primary-800 font-semibold">{planA.name}</th>
                    <th className="text-left py-2 pl-3 text-primary-800 font-semibold">{planB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow label={t('bizPlanner.startupCost')} a={formatRupee(planA.startupCostMin)} b={formatRupee(planB.startupCostMin)} lowerIsBetter />
                  <CompareRow label={t('bizPlanner.operatingCost')} a={`${formatRupee(planA.operatingCostMin)}/mo`} b={`${formatRupee(planB.operatingCostMin)}/mo`} lowerIsBetter />
                  <CompareRow label={t('bizPlanner.revenue')} a={`${formatRupee(planA.revenueMin)}/mo`} b={`${formatRupee(planB.revenueMin)}/mo`} />
                  <CompareRow label={t('bizPlanner.monthlyProfit')} a={`${formatRupee(planA.revenueMin - planA.operatingCostMin)}/mo`} b={`${formatRupee(planB.revenueMin - planB.operatingCostMin)}/mo`} />
                  <CompareRow label={t('bizPlanner.breakEven')} a={`${planA.breakEvenMonths} ${t('bizPlanner.months')}`} b={`${planB.breakEvenMonths} ${t('bizPlanner.months')}`} lowerIsBetter />
                  <CompareRow label={t('bizPlanner.timeToStart')} a={planA.timeToStart} b={planB.timeToStart} />
                  <CompareRow label={t('bizPlanner.spaceReq')} a={planA.spaceReq} b={planB.spaceReq} />
                </tbody>
              </table>
              <button onClick={handlePrint} className="btn-ghost mt-4 flex items-center gap-2 text-sm">
                <Printer className="w-4 h-4" />
                {t('bizPlanner.printPlan')}
              </button>
            </div>
          )}

          <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-accent-600 mt-0.5 shrink-0" />
            <p className="text-sm text-accent-700">{t('bizPlanner.estimateNote')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        active ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-primary-100 text-primary-600 hover:bg-primary-50'
      }`}
    >
      <span className="flex items-center gap-2">{icon}{label}</span>
    </button>
  );
}

function CalcCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-primary-100">
      <p className="text-xs text-primary-500">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function CompareRow({ label, a, b, lowerIsBetter }: { label: string; a: string; b: string; lowerIsBetter?: boolean }) {
  return (
    <tr className="border-b border-primary-50">
      <td className="py-2.5 pr-3 text-primary-500 font-medium">{label}</td>
      <td className="py-2.5 px-3 text-primary-900 font-semibold">{a}</td>
      <td className="py-2.5 pl-3 text-primary-900 font-semibold">{b}</td>
    </tr>
  );
}

function BusinessDetail({ plan, onClose, onCalculate, t }: {
  plan: BusinessPlan;
  onClose: () => void;
  onCalculate: (id: string) => void;
  t: (key: string) => string;
}) {
  const Icon = plan.icon;
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="card p-5 bg-gradient-to-br from-primary-50 to-white">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center text-white">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-900">{plan.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md capitalize">{plan.category}</span>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md">{plan.experienceReq}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost text-sm shrink-0">✕</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <CalcCard label={t('bizPlanner.startupCost')} value={`${formatRupee(plan.startupCostMin)} – ${formatRupee(plan.startupCostMax)}`} color="text-primary-700" />
          <CalcCard label={t('bizPlanner.operatingCost')} value={`${formatRupee(plan.operatingCostMin)} – ${formatRupee(plan.operatingCostMax)}/mo`} color="text-accent-600" />
          <CalcCard label={t('bizPlanner.revenue')} value={`${formatRupee(plan.revenueMin)} – ${formatRupee(plan.revenueMax)}/mo`} color="text-success-600" />
          <CalcCard label={t('bizPlanner.breakEven')} value={`${plan.breakEvenMonths} ${t('bizPlanner.months')}`} color="text-primary-600" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><Ruler className="w-4 h-4 text-primary-500" />{t('bizPlanner.spaceReq')}</h4>
          <p className="text-sm text-primary-700">{plan.spaceReq}</p>
          <h4 className="font-semibold text-primary-800 mt-3 mb-2 flex items-center gap-2"><Droplets className="w-4 h-4 text-primary-500" />{t('bizPlanner.water')}</h4>
          <p className="text-sm text-primary-700">{plan.waterReq}</p>
        </div>
        <div className="card p-5">
          <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><IndianRupee className="w-4 h-4 text-primary-500" />{t('bizPlanner.setupCost')}</h4>
          <div className="flex flex-wrap gap-2">
            {plan.equipment.map((eq, i) => (
              <span key={i} className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">{eq}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-primary-500" />{t('bizPlanner.sellingChannels')}</h4>
          <div className="space-y-2">
            {plan.sellingChannels.map((ch, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-primary-700">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />{ch}
              </div>
            ))}
          </div>
        </div>
        <div className="card p-5">
          <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-primary-500" />{t('bizPlanner.timeToStart')}</h4>
          <p className="text-sm text-primary-700 mb-3">{plan.timeToStart}</p>
          <h4 className="font-semibold text-primary-800 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-accent-500" />{t('bizPlanner.risks')}</h4>
          <p className="text-sm text-primary-700">{plan.risks}</p>
        </div>
      </div>

      {plan.govtSchemes.length > 0 && (
        <div className="card p-5">
          <h4 className="font-semibold text-primary-800 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary-500" />{t('bizPlanner.govtSchemes')}</h4>
          <div className="space-y-2">
            {plan.govtSchemes.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary-700 hover:text-primary-900 transition-colors">
                <ExternalLink className="w-4 h-4 text-primary-400" />{s.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => onCalculate(plan.id)} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
        <IndianRupee className="w-4 h-4" />
        {t('bizPlanner.calculateBtn')}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
