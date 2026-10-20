import {
  LayoutGrid, CloudRain, Sun, Droplets, Sprout, AlertTriangle, TrendingUp,
  Tractor, ArrowRight, Activity, Calculator, HelpCircle, MessageCircle,
} from 'lucide-react';
import type { FarmProfile, PageKey, RiskLevel } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { RiskBadge, DemoBadge } from '@/components/Badges';
import { ProgressBar, DonutChart } from '@/components/Charts';
import { calculateRisk, generateRecommendations } from '@/lib/intelligence';
import { DEMO_WEATHER, MARKET_DATA, DISEASE_DATABASE } from '@/lib/data';

interface IntelligenceProps {
  farm: FarmProfile | null;
  onBack: () => void;
  onNavigate: (page: PageKey) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CloudRain, Sun, Droplets, Sprout, AlertTriangle, TrendingUp,
};

export function Intelligence({ farm, onBack, onNavigate }: IntelligenceProps) {
  const risk = calculateRisk(farm);
  const recs = generateRecommendations(farm);

  const inputs = farm ? [
    { label: 'Soil Type', value: farm.soilType, icon: '🟫' },
    { label: 'Crop', value: farm.currentCrop, icon: '🌱' },
    { label: 'Season', value: farm.season, icon: '📅' },
    { label: 'Location', value: farm.location, icon: '📍' },
    { label: 'Water', value: farm.waterAvailability, icon: '💧' },
    { label: 'Rainfall', value: `${DEMO_WEATHER.rainChance}% expected`, icon: '🌧️' },
    { label: 'Weather', value: DEMO_WEATHER.condition, icon: '⛅' },
    { label: 'Market', value: farm.currentCrop && MARKET_DATA[farm.currentCrop] ? `${MARKET_DATA[farm.currentCrop].trend}` : '—', icon: '📈' },
  ] : [];

  const farmHealthScore = farm
    ? risk.overall === 'Low' ? 85 : risk.overall === 'Medium' ? 65 : 40
    : 0;

  return (
    <div>
      <PageHeader
        title="AgriGuard Intelligence Engine"
        subtitle="Combines your farm info to give personalized advice"
        icon={<LayoutGrid className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge text="Demo Intelligence" />}
      />

      {!farm?.farmerName ? (
        <div className="card p-6 text-center animate-fade-in">
          <Tractor className="w-12 h-12 text-primary-300 mx-auto mb-3" />
          <h3 className="font-semibold text-primary-800 mb-1">No farm data yet</h3>
          <p className="text-sm text-primary-500 mb-4">Save your farm details or try the demo farm to see the intelligence engine work.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => onNavigate('my-farm')} className="btn-primary">Set Up Farm</button>
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary">Try Demo</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Inputs */}
          <section>
            <h2 className="section-title mb-3">Farm Inputs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {inputs.map((inp, i) => (
                <div key={i} className="card p-3">
                  <p className="text-xs text-primary-500">{inp.label}</p>
                  <p className="font-semibold text-primary-800 text-sm mt-0.5">{inp.value || '—'}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Flow diagram */}
          <section className="card p-5 bg-primary-50/50">
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap text-center">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-xs font-semibold text-primary-700">Limited water + Kharif + Black soil + Cotton</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-400" />
              <div className="bg-primary-600 text-white rounded-xl p-3">
                <p className="text-xs font-semibold">Intelligence Engine</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-400" />
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-xs font-semibold text-primary-700">Risk Score + Advice</p>
              </div>
            </div>
          </section>

          {/* Farm Risk Score */}
          <section>
            <h2 className="section-title mb-3">Farm Risk Score</h2>
            <div className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-4">
                  <DonutChart
                    value={farmHealthScore}
                    max={100}
                    label={`${farmHealthScore}`}
                    sublabel="Health"
                    color={risk.overall === 'Low' ? '#10b981' : risk.overall === 'Medium' ? '#f97316' : '#ef4444'}
                  />
                  <div>
                    <p className="text-sm text-primary-500">Overall Risk</p>
                    <RiskBadge level={risk.overall} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary-500">
                  <Activity className="w-5 h-5" />
                  <span className="text-xs max-w-[200px]">Estimated from your farm details, weather and demo market data.</span>
                </div>
              </div>

              <div className="space-y-4">
                <RiskRow label="Water Risk" level={risk.water} />
                <RiskRow label="Crop Risk" level={risk.crop} />
                <RiskRow label="Weather Risk" level={risk.weather} />
                <RiskRow label="Market Risk" level={risk.market} />
              </div>
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <h2 className="section-title mb-3">Personalized Recommendations</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {recs.map((rec, i) => {
                const Icon = iconMap[rec.icon] ?? Sprout;
                return (
                  <div key={i} className="card p-4 flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900 text-sm">{rec.title}</h3>
                      <p className="text-sm text-primary-600 mt-0.5 leading-relaxed">{rec.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick links */}
          <section>
            <h2 className="section-title mb-3">Explore Tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {([
                { key: 'talk', label: 'Talk to AgriGuard AI', icon: MessageCircle },
                { key: 'farmer-questions', label: 'Farmer Questions', icon: HelpCircle },
                { key: 'crop-advisor', label: 'Crop Advisor', icon: Sprout },
                { key: 'water', label: 'Water & Irrigation', icon: Droplets },
                { key: 'weather', label: 'Weather', icon: Sun },
                { key: 'market', label: 'Market Price', icon: TrendingUp },
                { key: 'disease-alert', label: 'Disease Alert', icon: AlertTriangle },
                { key: 'sell-store', label: 'Sell or Store', icon: LayoutGrid },
                { key: 'budget', label: 'Budget & Profit', icon: Calculator },
              ] as const).map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.key} onClick={() => onNavigate(t.key)} className="card p-4 flex items-center gap-2 hover:shadow-md hover:border-primary-300 transition-all active:scale-[0.98]">
                    <Icon className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-semibold text-primary-800">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function RiskRow({ label, level }: { label: string; level: RiskLevel }) {
  const val = level === 'Low' ? 25 : level === 'Medium' ? 60 : 90;
  const color = level === 'Low' ? '#10b981' : level === 'Medium' ? '#f97316' : '#ef4444';
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-primary-700 w-24 shrink-0">{label}</span>
      <div className="flex-1"><ProgressBar value={val} color={color} showValue={false} /></div>
      <span className="text-xs font-semibold w-16 text-right" style={{ color }}>{level}</span>
    </div>
  );
}
