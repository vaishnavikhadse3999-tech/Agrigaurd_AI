import {
  Leaf, Droplets, Sprout, CloudSun, TrendingUp, ClipboardList,
  Stethoscope, AlertTriangle, Scale, Tractor, LayoutGrid,
  Activity, CloudRain, Sun, ArrowRight, Play, Calculator, HelpCircle, MessageCircle,
} from 'lucide-react';
import type { FarmProfile, PageKey } from '@/types';
import { BarChart, LineChart, DonutChart, ProgressBar } from '@/components/Charts';
import { RiskBadge, DemoBadge } from '@/components/Badges';
import { calculateRisk, generateRecommendations } from '@/lib/intelligence';
import { DEMO_WEATHER } from '@/lib/data';
import { useI18n } from '@/lib/i18n';

interface DashboardProps {
  farm: FarmProfile | null;
  onNavigate: (page: PageKey) => void;
  onLoadDemo: () => void;
  upcomingTasks: { name: string; date: string; category: string }[];
}

const TOOLS: { key: PageKey; labelKey: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: 'my-farm', labelKey: 'nav.myFarm', icon: Tractor, color: 'bg-primary-100 text-primary-700' },
  { key: 'talk', labelKey: 'nav.talk', icon: MessageCircle, color: 'bg-success-100 text-success-700' },
  { key: 'farmer-questions', labelKey: 'nav.farmerQuestions', icon: HelpCircle, color: 'bg-accent-100 text-accent-700' },
  { key: 'crop-advisor', labelKey: 'nav.cropAdvisor', icon: Sprout, color: 'bg-success-100 text-success-700' },
  { key: 'crop-doctor', labelKey: 'nav.cropDoctor', icon: Stethoscope, color: 'bg-error-100 text-error-700' },
  { key: 'weather', labelKey: 'nav.weather', icon: CloudSun, color: 'bg-accent-100 text-accent-700' },
  { key: 'water', labelKey: 'nav.water', icon: Droplets, color: 'bg-blue-100 text-blue-700' },
  { key: 'market', labelKey: 'nav.market', icon: TrendingUp, color: 'bg-primary-100 text-primary-700' },
  { key: 'disease-alert', labelKey: 'nav.diseaseAlert', icon: AlertTriangle, color: 'bg-warning-100 text-warning-700' },
  { key: 'organic', labelKey: 'nav.organic', icon: Leaf, color: 'bg-success-100 text-success-700' },
  { key: 'planner', labelKey: 'nav.planner', icon: ClipboardList, color: 'bg-primary-100 text-primary-700' },
  { key: 'sell-store', labelKey: 'nav.sellStore', icon: Scale, color: 'bg-accent-100 text-accent-700' },
  { key: 'budget', labelKey: 'nav.budget', icon: Calculator, color: 'bg-primary-100 text-primary-700' },
];

export function Dashboard({ farm, onNavigate, onLoadDemo, upcomingTasks }: DashboardProps) {
  const { t } = useI18n();
  const risk = calculateRisk(farm);
  const recs = generateRecommendations(farm);

  const farmHealthScore = farm
    ? risk.overall === 'Low' ? 85 : risk.overall === 'Medium' ? 65 : 40
    : 0;

  const waterStatus = farm
    ? farm.waterAvailability === 'Plenty' ? t('common.high')
      : farm.waterAvailability === 'Moderate' ? t('common.medium')
      : t('common.low')
    : t('dashboard.notSet');

  const weatherStatus = DEMO_WEATHER.rainChance >= 60 ? t('weather.advice.rain').split('.')[0] : DEMO_WEATHER.condition;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white p-6 sm:p-8">
        <div className="absolute right-0 top-0 opacity-10">
          <Leaf className="w-40 h-40 -mr-8 -mt-8" />
        </div>
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{t('app.name')}</h1>
          <p className="text-primary-100 text-lg mt-1">{t('app.subtitle')}</p>
          <p className="text-primary-100/90 text-sm mt-3 max-w-xl">
            {t('app.description')}
          </p>
          {!farm && (
            <button
              onClick={onLoadDemo}
              className="mt-5 inline-flex items-center gap-2 bg-white text-primary-700 font-semibold rounded-xl px-5 py-3 hover:bg-primary-50 transition-all active:scale-[0.98] shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              {t('dashboard.tryDemoFarm')}
            </button>
          )}
          {farm && (
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge bg-white/20 text-white">
                <Tractor className="w-3 h-3" /> {farm.farmerName}
              </span>
              <span className="badge bg-white/20 text-white">{farm.location}</span>
              <span className="badge bg-white/20 text-white">{farm.currentCrop}</span>
            </div>
          )}
        </div>
      </section>

      {/* Talk to AgriGuard AI prominent card */}
      <section>
        <button
          onClick={() => onNavigate('talk')}
          className="w-full card p-5 flex items-center gap-4 hover:shadow-lg hover:border-success-300 transition-all active:scale-[0.98] text-left group bg-gradient-to-r from-success-50 to-primary-50"
        >
          <div className="w-14 h-14 rounded-2xl bg-success-100 flex items-center justify-center text-success-700 shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-primary-900 text-lg">{t('dashboard.talkTitle')}</h3>
            <p className="text-sm text-primary-600">{t('dashboard.talkDesc')}</p>
          </div>
          <ArrowRight className="w-6 h-6 text-success-500 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </section>

      {/* Dashboard cards */}
      <section>
        <h2 className="section-title mb-3">{t('dashboard.farmDashboard')}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-500">{t('dashboard.farmHealth')}</span>
              <Activity className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-2xl font-bold text-primary-900">{farm ? farmHealthScore : '--'}</p>
            <p className="text-xs text-primary-500">{farm ? `${risk.overall === 'Low' ? t('common.lowRisk') : risk.overall === 'Medium' ? t('common.mediumRisk') : t('common.highRisk')}` : t('dashboard.setUpFarm')}</p>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-500">{t('dashboard.waterStatus')}</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-primary-900">{waterStatus}</p>
            <p className="text-xs text-primary-500">{farm?.waterAvailability || t('dashboard.notSet')}</p>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-500">{t('dashboard.cropRisk')}</span>
              <Sprout className="w-4 h-4 text-success-600" />
            </div>
            <p className="text-lg font-bold text-primary-900">{farm?.currentCrop || t('dashboard.notSet')}</p>
            <div className="mt-1">{farm && <RiskBadge level={risk.crop} />}</div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-500">{t('dashboard.weather')}</span>
              {DEMO_WEATHER.rainChance >= 60 ? <CloudRain className="w-4 h-4 text-blue-500" /> : <Sun className="w-4 h-4 text-accent-500" />}
            </div>
            <p className="text-lg font-bold text-primary-900">{DEMO_WEATHER.temperature}°C</p>
            <p className="text-xs text-primary-500">{weatherStatus}</p>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-500">{t('dashboard.marketTrend')}</span>
              <TrendingUp className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-lg font-bold text-primary-900">
              {farm?.currentCrop ? MARKET_TREND[farm.currentCrop] ?? t('common.stable') : t('dashboard.notSet')}
            </p>
            <p className="text-xs text-primary-500">{farm?.currentCrop ? t('dashboard.demoDataLabel') : t('dashboard.setUpFarm')}</p>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-500">{t('dashboard.upcomingTasks')}</span>
              <ClipboardList className="w-4 h-4 text-primary-500" />
            </div>
            <p className="text-lg font-bold text-primary-900">{upcomingTasks.length}</p>
            <p className="text-xs text-primary-500">{upcomingTasks.length > 0 ? upcomingTasks[0].name : t('dashboard.noTasks')}</p>
          </div>
        </div>
      </section>

      {/* Today's Farm Advice */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('dashboard.todaysAdvice')}</h2>
          {farm && <DemoBadge text={t('common.demoIntelligence')} />}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {recs.map((rec, i) => {
            const Icon = iconMap[rec.icon] ?? Leaf;
            return (
              <div key={i} className="card p-4 flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
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

      {/* Farm Overview Charts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('dashboard.farmOverview')}</h2>
          <DemoBadge />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-4">
            <h3 className="font-semibold text-primary-800 mb-3">{t('dashboard.waterUsage')}</h3>
            <BarChart
              data={[
                { label: 'Mon', value: 320 }, { label: 'Tue', value: 280 },
                { label: 'Wed', value: 350 }, { label: 'Thu', value: 200 },
                { label: 'Fri', value: 180 },
              ]}
              unit="L"
            />
          </div>
          <div className="card p-4">
            <h3 className="font-semibold text-primary-800 mb-3">{t('dashboard.cropHealthTrend')}</h3>
            <LineChart
              data={[70, 72, 75, 73, 78, 80, 82]}
              labels={['', '', '', '', '', '', 'Now']}
              color="#16a34a"
            />
          </div>
          <div className="card p-4 flex flex-col items-center">
            <h3 className="font-semibold text-primary-800 mb-3 self-start">{t('dashboard.farmHealthScore')}</h3>
            <DonutChart
              value={farm ? farmHealthScore : 0}
              max={100}
              label={farm ? `${farmHealthScore}` : '--'}
              sublabel={farm ? `${risk.overall === 'Low' ? t('common.lowRisk') : risk.overall === 'Medium' ? t('common.mediumRisk') : t('common.highRisk')}` : t('dashboard.noFarm')}
              color={risk.overall === 'Low' ? '#10b981' : risk.overall === 'Medium' ? '#f97316' : '#ef4444'}
            />
          </div>
        </div>
      </section>

      {/* Risk Score */}
      {farm && (
        <section>
          <h2 className="section-title mb-3">{t('dashboard.farmRiskScore')}</h2>
          <div className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-primary-600">{t('dashboard.overallRisk')}</p>
                <RiskBadge level={risk.overall} />
              </div>
              <p className="text-xs text-primary-500 max-w-xs">
                {t('dashboard.riskEstimate')}
              </p>
            </div>
            <div className="space-y-3">
              <RiskBar label={t('dashboard.waterRisk')} level={risk.water} />
              <RiskBar label={t('dashboard.cropRiskLabel')} level={risk.crop} />
              <RiskBar label={t('dashboard.weatherRisk')} level={risk.weather} />
              <RiskBar label={t('dashboard.marketRisk')} level={risk.market} />
            </div>
          </div>
        </section>
      )}

      {/* Tools grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">{t('dashboard.farmTools')}</h2>
          <button onClick={() => onNavigate('intelligence')} className="btn-ghost text-sm">
            <LayoutGrid className="w-4 h-4" /> {t('dashboard.allTools')}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.key}
                onClick={() => onNavigate(tool.key)}
                className="card p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-primary-300 transition-all active:scale-[0.98] group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-primary-800 text-center">{t(tool.labelKey)}</span>
                <ArrowRight className="w-3 h-3 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RiskBar({ label, level }: { label: string; level: 'Low' | 'Medium' | 'High' }) {
  const { t } = useI18n();
  const val = level === 'Low' ? 25 : level === 'Medium' ? 60 : 90;
  const color = level === 'Low' ? '#10b981' : level === 'Medium' ? '#f97316' : '#ef4444';
  const levelLabel = level === 'Low' ? t('common.low') : level === 'Medium' ? t('common.medium') : t('common.high');
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-primary-700 w-24 shrink-0">{label}</span>
      <div className="flex-1">
        <ProgressBar value={val} color={color} showValue={false} />
      </div>
      <span className="text-xs font-semibold w-16 text-right" style={{ color }}>{levelLabel}</span>
    </div>
  );
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CloudRain, Sun, Droplets, Sprout, AlertTriangle, TrendingUp, Leaf, CloudSun,
};

const MARKET_TREND: Record<string, string> = {
  Cotton: 'Rising', Rice: 'Stable', Wheat: 'Falling', Sugarcane: 'Stable',
  Maize: 'Rising', Soybean: 'Rising', Groundnut: 'Stable', Millet: 'Rising',
  Pulses: 'Rising', Tomato: 'Falling', Onion: 'Rising', Banana: 'Stable',
};
