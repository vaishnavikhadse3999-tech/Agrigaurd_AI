import { useState } from 'react';
import { Droplets, Search, Clock, Shield, Lightbulb, CloudRain, Gauge } from 'lucide-react';
import type { FarmProfile, WaterAvailability, RiskLevel } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { RiskBadge, DemoBadge } from '@/components/Badges';
import { BarChart } from '@/components/Charts';
import { CROPS, SOIL_TYPES, WATER_LEVELS } from '@/lib/data';
import { checkIrrigation } from '@/lib/intelligence';

interface WaterPageProps {
  farm: FarmProfile | null;
  onBack: () => void;
}

const RAINFALL_OPTIONS = ['None', 'Light', 'Moderate', 'Heavy'] as const;
const MOISTURE_OPTIONS = ['Dry', 'Slightly Moist', 'Moist', 'Wet'] as const;

export function WaterPage({ onBack }: WaterPageProps) {
  const [crop, setCrop] = useState('');
  const [soil, setSoil] = useState<string>('');
  const [rainfall, setRainfall] = useState<typeof RAINFALL_OPTIONS[number]>('None');
  const [water, setWater] = useState<WaterAvailability | ''>('');
  const [moisture, setMoisture] = useState<typeof MOISTURE_OPTIONS[number]>('Dry');
  const [result, setResult] = useState<ReturnType<typeof checkIrrigation> | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(checkIrrigation(crop, soil, rainfall, water));
  };

  return (
    <div>
      <PageHeader
        title="Water & Irrigation"
        subtitle="Check if your crop needs watering"
        icon={<Droplets className="w-6 h-6" />}
        onBack={onBack}
      />

      <form onSubmit={handleCheck} className="card p-5 space-y-4 animate-fade-in">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Crop</label>
            <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)} required>
              <option value="">Select crop</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Soil Type</label>
            <select className="input" value={soil} onChange={(e) => setSoil(e.target.value)} required>
              <option value="">Select soil</option>
              {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Recent Rainfall</label>
            <select className="input" value={rainfall} onChange={(e) => setRainfall(e.target.value as typeof RAINFALL_OPTIONS[number])} required>
              {RAINFALL_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Water Available</label>
            <select className="input" value={water} onChange={(e) => setWater(e.target.value as WaterAvailability)} required>
              <option value="">Select water level</option>
              {WATER_LEVELS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Soil Moisture Level</label>
            <select className="input" value={moisture} onChange={(e) => setMoisture(e.target.value as typeof MOISTURE_OPTIONS[number])} required>
              {MOISTURE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full">
          <Search className="w-5 h-5" /> Check Irrigation
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Irrigation Result</h2>
            <DemoBadge />
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.needed ? 'bg-blue-100 text-blue-600' : 'bg-success-100 text-success-600'}`}>
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-primary-500">Irrigation Needed</p>
                  <p className="text-xl font-bold text-primary-900">{result.needed ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-500">Water Risk</p>
                <RiskBadge level={result.risk as RiskLevel} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2 bg-primary-50 rounded-xl p-3">
                <Clock className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-primary-500">SUGGESTED TIMING</p>
                  <p className="text-sm text-primary-800">{result.timing}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
                <CloudRain className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-primary-500">TIP</p>
                  <p className="text-sm text-primary-800">{result.tip}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-primary-50 rounded-xl p-3">
                <Gauge className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-primary-500">SOIL MOISTURE</p>
                  <p className="text-sm text-primary-800">{moisture}. {moisture === 'Dry' ? 'Soil needs water soon.' : moisture === 'Wet' ? 'Soil has enough water. Wait before irrigating.' : 'Soil moisture is adequate. Check again in 1-2 days.'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary-600" /> Water Saving Tips
            </h3>
            <div className="space-y-2 text-sm text-primary-700">
              <p className="flex items-start gap-2"><Shield className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" /> Use drip irrigation to water roots directly and save up to 50% water.</p>
              <p className="flex items-start gap-2"><Shield className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" /> Cover soil with dry leaves or straw (mulch) to keep moisture in.</p>
              <p className="flex items-start gap-2"><Shield className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" /> Water early morning or late evening to reduce evaporation.</p>
              <p className="flex items-start gap-2"><Shield className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" /> Check soil moisture before watering — dig 2 inches down.</p>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-3">Water Usage (last 5 days)</h3>
            <BarChart
              data={[
                { label: 'Mon', value: 320, color: '#3b82f6' },
                { label: 'Tue', value: 280, color: '#3b82f6' },
                { label: 'Wed', value: 350, color: '#3b82f6' },
                { label: 'Thu', value: 200, color: '#3b82f6' },
                { label: 'Fri', value: 180, color: '#3b82f6' },
              ]}
              unit="L"
            />
          </div>
        </div>
      )}
    </div>
  );
}
