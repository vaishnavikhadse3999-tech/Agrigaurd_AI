import { useState } from 'react';
import { Sprout, Sparkles, Droplets, Shield, Gauge } from 'lucide-react';
import type { FarmProfile, PageKey, SoilType, WaterAvailability, Season, CropSuggestion } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { DifficultyBadge, DemoBadge } from '@/components/Badges';
import { BarChart } from '@/components/Charts';
import { SOIL_TYPES, WATER_LEVELS, SEASONS } from '@/lib/data';
import { suggestCrops } from '@/lib/intelligence';

interface CropAdvisorProps {
  farm: FarmProfile | null;
  onBack: () => void;
  onNavigate: (page: PageKey) => void;
}

export function CropAdvisor({ onBack }: CropAdvisorProps) {
  const [soil, setSoil] = useState<SoilType | ''>('');
  const [season, setSeason] = useState<Season | ''>('');
  const [water, setWater] = useState<WaterAvailability | ''>('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [results, setResults] = useState<CropSuggestion[] | null>(null);

  const handleSuggest = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(suggestCrops(soil, season, water));
  };

  return (
    <div>
      <PageHeader
        title="Crop Advisor"
        subtitle="Find the best crop for your soil, season and water"
        icon={<Sprout className="w-6 h-6" />}
        onBack={onBack}
      />

      <form onSubmit={handleSuggest} className="card p-5 space-y-4 animate-fade-in">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Soil Type</label>
            <select className="input" value={soil} onChange={(e) => setSoil(e.target.value as SoilType)} required>
              <option value="">Select soil type</option>
              {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Season</label>
            <select className="input" value={season} onChange={(e) => setSeason(e.target.value as Season)} required>
              <option value="">Select season</option>
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Water Availability</label>
            <select className="input" value={water} onChange={(e) => setWater(e.target.value as WaterAvailability)} required>
              <option value="">Select water level</option>
              {WATER_LEVELS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Farm Location</label>
            <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Amravati" />
          </div>
          <div>
            <label className="label">Farm Size (acres)</label>
            <input className="input" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 5" />
          </div>
        </div>
        <button type="submit" className="btn-primary w-full">
          <Sparkles className="w-5 h-5" /> Get Crop Advice
        </button>
      </form>

      {results && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Recommended Crops</h2>
            <DemoBadge text="Demo Logic" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {results.map((crop, i) => (
              <div key={crop.name} className="card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-success-100 flex items-center justify-center text-success-700">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-primary-900 text-lg">{crop.name}</h3>
                  </div>
                  <DifficultyBadge level={crop.difficulty} />
                </div>
                <div className="mb-3">
                  <span className="badge bg-primary-100 text-primary-700">{crop.suitabilityScore}% match</span>
                </div>
                <p className="text-sm text-primary-600 mb-3 leading-relaxed">{crop.why}</p>
                <div className="space-y-2 text-sm mt-auto">
                  <div className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-primary-700">{crop.waterRequirement}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
                    <span className="text-primary-700">{crop.careTips}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison chart */}
          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary-600" /> Crop Comparison
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-primary-700 mb-2">Water Requirement (1=Low, 3=High)</p>
                <BarChart
                  data={results.map((c) => ({ label: c.name, value: c.waterScore, color: '#3b82f6' }))}
                  max={3}
                  height={120}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700 mb-2">Suitability Score</p>
                <BarChart
                  data={results.map((c) => ({ label: c.name, value: c.suitabilityScore, color: '#22c55e' }))}
                  max={100}
                  height={120}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700 mb-2">Care Difficulty (1=Easy, 3=High)</p>
                <BarChart
                  data={results.map((c) => ({ label: c.name, value: c.careScore, color: '#f97316' }))}
                  max={3}
                  height={120}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
