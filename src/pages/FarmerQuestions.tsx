import { useState } from 'react';
import {
  HelpCircle, User, MapPin, Ruler, Layers, Sprout, CalendarDays, Droplets,
  CheckCircle2, ArrowRight, Sparkles, AlertTriangle, TrendingUp, CloudSun, Shield,
  CloudRain, Sun,
} from 'lucide-react';
import type { FarmProfile, PageKey, SoilType, WaterAvailability, Season } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Badges';
import { SOIL_TYPES, WATER_LEVELS, SEASONS, CROPS, DEMO_FARM } from '@/lib/data';
import { saveFarm } from '@/lib/storage';
import { calculateRisk, generateRecommendations } from '@/lib/intelligence';

interface FarmerQuestionsProps {
  farm: FarmProfile | null;
  onSave: (farm: FarmProfile) => void;
  onBack: () => void;
  onNavigate: (page: PageKey) => void;
}

const EMPTY_FORM: FarmProfile = {
  farmerName: '', location: '', farmSize: '', soilType: '',
  currentCrop: '', waterAvailability: '', season: '',
};

export function FarmerQuestions({ farm, onSave, onBack, onNavigate }: FarmerQuestionsProps) {
  const [form, setForm] = useState<FarmProfile>(EMPTY_FORM);
  const [result, setResult] = useState<FarmProfile | null>(null);

  const update = (key: keyof FarmProfile, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFarm(form);
    onSave(form);
    setResult(form);
  };

  const loadDemo = () => {
    setForm(DEMO_FARM);
    setResult(null);
  };

  const risk = result ? calculateRisk(result) : null;
  const recs = result ? generateRecommendations(result) : [];

  return (
    <div>
      <PageHeader
        title="Farmer Questions"
        subtitle="Answer a few questions to get personalized farm advice"
        icon={<HelpCircle className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge />}
      />

      <form onSubmit={handleSubmit} className="card p-5 space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-primary-800 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" /> Basic Farm Questions
          </h3>
          <button type="button" onClick={loadDemo} className="btn-ghost text-sm">
            <Sparkles className="w-4 h-4" /> Try Demo Farm
          </button>
        </div>

        <div>
          <label className="label">What is your name?</label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
            <input className="input pl-11" value={form.farmerName} onChange={(e) => update('farmerName', e.target.value)} placeholder="e.g. Ramesh Patil" required />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">What is your farm location?</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
              <input className="input pl-11" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Amravati" required />
            </div>
          </div>
          <div>
            <label className="label">What is your farm size in acres?</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
              <input className="input pl-11" value={form.farmSize} onChange={(e) => update('farmSize', e.target.value)} placeholder="e.g. 5" required />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">What is your soil type?</label>
            <select className="input" value={form.soilType} onChange={(e) => update('soilType', e.target.value)} required>
              <option value="">Select soil type</option>
              {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Which crop are you growing or planning to grow?</label>
            <select className="input" value={form.currentCrop} onChange={(e) => update('currentCrop', e.target.value)} required>
              <option value="">Select crop</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Which season is it?</label>
            <select className="input" value={form.season} onChange={(e) => update('season', e.target.value)} required>
              <option value="">Select season</option>
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">How much water is available?</label>
            <select className="input" value={form.waterAvailability} onChange={(e) => update('waterAvailability', e.target.value)} required>
              <option value="">Select water level</option>
              {WATER_LEVELS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          <CheckCircle2 className="w-5 h-5" /> Submit & Get My Farm Advice
        </button>
      </form>

      {result && risk && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="card p-4 bg-success-50 border-success-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
              <p className="text-sm font-medium text-success-800">
                Thank you, {result.farmerName}! Your farm details are saved and will be used across all AgriGuard AI tools.
              </p>
            </div>
          </div>

          <h2 className="section-title">Your Farm Summary</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <SummaryCard icon={<User className="w-5 h-5" />} label="Farmer" value={result.farmerName} />
            <SummaryCard icon={<MapPin className="w-5 h-5" />} label="Location" value={result.location} />
            <SummaryCard icon={<Ruler className="w-5 h-5" />} label="Farm Size" value={`${result.farmSize} acres`} />
            <SummaryCard icon={<Layers className="w-5 h-5" />} label="Soil Type" value={result.soilType} />
            <SummaryCard icon={<Sprout className="w-5 h-5" />} label="Crop" value={result.currentCrop} />
            <SummaryCard icon={<CalendarDays className="w-5 h-5" />} label="Season" value={result.season} />
            <SummaryCard icon={<Droplets className="w-5 h-5" />} label="Water" value={result.waterAvailability} />
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary-600" /> Farm Risk Assessment
            </h3>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-primary-500">Overall Risk Level</p>
                <span className={`badge ${risk.overall === 'Low' ? 'bg-success-100 text-success-700' : risk.overall === 'Medium' ? 'bg-warning-100 text-warning-700' : 'bg-error-100 text-error-700'}`}>
                  {risk.overall} Risk
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <RiskPill label="Water" level={risk.water} />
                <RiskPill label="Crop" level={risk.crop} />
                <RiskPill label="Weather" level={risk.weather} />
                <RiskPill label="Market" level={risk.market} />
              </div>
            </div>
          </div>

          <h2 className="section-title">Personalized Recommendations</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {recs.map((rec, i) => {
              const Icon = iconMap[rec.icon] ?? Sprout;
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

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary-600" /> Explore Your Tools
            </h3>
            <p className="text-sm text-primary-600 mb-4">
              Your farm details are now saved. Use these tools to get specific advice for your farm:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ToolLink icon={<Sprout className="w-5 h-5" />} label="Crop Advisor" onClick={() => onNavigate('crop-advisor')} />
              <ToolLink icon={<Droplets className="w-5 h-5" />} label="Water & Irrigation" onClick={() => onNavigate('water')} />
              <ToolLink icon={<Shield className="w-5 h-5" />} label="AI Crop Doctor" onClick={() => onNavigate('crop-doctor')} />
              <ToolLink icon={<TrendingUp className="w-5 h-5" />} label="Market Price" onClick={() => onNavigate('market')} />
              <ToolLink icon={<CloudSun className="w-5 h-5" />} label="Weather" onClick={() => onNavigate('weather')} />
              <ToolLink icon={<Sparkles className="w-5 h-5" />} label="Intelligence Engine" onClick={() => onNavigate('intelligence')} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-primary-500 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-semibold text-primary-900">{value || '—'}</p>
    </div>
  );
}

function RiskPill({ label, level }: { label: string; level: 'Low' | 'Medium' | 'High' }) {
  const color = level === 'Low' ? 'text-success-600' : level === 'Medium' ? 'text-warning-600' : 'text-error-600';
  return (
    <div className="flex items-center gap-1">
      <span className="text-primary-500">{label}:</span>
      <span className={`font-semibold ${color}`}>{level}</span>
    </div>
  );
}

function ToolLink({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card p-3 flex items-center gap-2 hover:shadow-md hover:border-primary-300 transition-all active:scale-[0.98] text-left">
      <span className="text-primary-600">{icon}</span>
      <span className="text-sm font-semibold text-primary-800">{label}</span>
    </button>
  );
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CloudRain, Sun, Droplets, Sprout, AlertTriangle, TrendingUp, CloudSun,
};
