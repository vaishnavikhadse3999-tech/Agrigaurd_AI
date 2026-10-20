import { useState } from 'react';
import { Calculator, IndianRupee, Sprout, Ruler, Layers, CalendarDays, Droplets, TrendingUp, FlaskRound, Info, AlertCircle, Sparkles } from 'lucide-react';
import type { FarmProfile, PageKey, BudgetResult, SoilType, Season } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Badges';
import { BarChart } from '@/components/Charts';
import { CROPS, SOIL_TYPES, SEASONS } from '@/lib/data';

interface CropBudgetProps {
  farm: FarmProfile | null;
  onBack: () => void;
  onNavigate: (page: PageKey) => void;
}

interface BudgetForm {
  crop: string;
  area: string;
  soil: string;
  season: string;
  irrigation: 'Yes' | 'No';
  yieldKg: string;
  pricePerKg: string;
  seedCost: string;
  fertilizerCost: string;
  labourCost: string;
  irrigationCost: string;
  pestCost: string;
  otherCost: string;
}

const EMPTY_FORM: BudgetForm = {
  crop: '', area: '', soil: '', season: '', irrigation: 'Yes',
  yieldKg: '', pricePerKg: '', seedCost: '', fertilizerCost: '',
  labourCost: '', irrigationCost: '', pestCost: '', otherCost: '',
};

const SAMPLE_FORM: BudgetForm = {
  crop: 'Cotton',
  area: '5',
  soil: 'Black Soil',
  season: 'Kharif',
  irrigation: 'Yes',
  yieldKg: '1200',
  pricePerKg: '72',
  seedCost: '8000',
  fertilizerCost: '12000',
  labourCost: '15000',
  irrigationCost: '5000',
  pestCost: '6000',
  otherCost: '3000',
};

export function CropBudget({ onBack }: CropBudgetProps) {
  const [form, setForm] = useState<BudgetForm>(EMPTY_FORM);
  const [result, setResult] = useState<BudgetResult | null>(null);

  const update = (key: keyof BudgetForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setResult(null);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const yieldKg = Number(form.yieldKg) || 0;
    const pricePerKg = Number(form.pricePerKg) || 0;
    const revenue = yieldKg * pricePerKg;
    const costBreakdown = [
      { label: 'Seed', value: Number(form.seedCost) || 0 },
      { label: 'Fertilizer', value: Number(form.fertilizerCost) || 0 },
      { label: 'Labour', value: Number(form.labourCost) || 0 },
      { label: 'Irrigation', value: Number(form.irrigationCost) || 0 },
      { label: 'Pest & Disease', value: Number(form.pestCost) || 0 },
      { label: 'Other', value: Number(form.otherCost) || 0 },
    ];
    const totalCost = costBreakdown.reduce((sum, c) => sum + c.value, 0);
    const profit = revenue - totalCost;
    setResult({
      totalCost, revenue, profit, isProfit: profit >= 0,
      costBreakdown, yieldAmount: yieldKg, pricePerKg, area: Number(form.area) || 0, crop: form.crop,
    });
  };

  const loadSample = () => {
    setForm(SAMPLE_FORM);
    setResult(null);
  };

  const num = (v: string) => v === '' ? '' : v;

  return (
    <div>
      <PageHeader
        title="Crop Budget & Profit Planner"
        subtitle="Estimate your farm costs, revenue and profit"
        icon={<Calculator className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge />}
      />

      <form onSubmit={handleCalculate} className="card p-5 space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary-800 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary-600" /> Crop & Farm Details
          </h3>
          <button type="button" onClick={loadSample} className="btn-ghost text-sm">
            <Sparkles className="w-4 h-4" /> Use Sample Data
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Which crop do you want to grow?</label>
            <select className="input" value={form.crop} onChange={(e) => update('crop', e.target.value)} required>
              <option value="">Select crop</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Farm area (acres)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
              <input type="number" min="0" step="any" className="input pl-11" value={num(form.area)} onChange={(e) => update('area', e.target.value)} placeholder="e.g. 5" required />
            </div>
          </div>
          <div>
            <label className="label">Soil type</label>
            <select className="input" value={form.soil} onChange={(e) => update('soil', e.target.value)} required>
              <option value="">Select soil</option>
              {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Season</label>
            <select className="input" value={form.season} onChange={(e) => update('season', e.target.value)} required>
              <option value="">Select season</option>
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Irrigation available?</label>
            <div className="flex gap-2">
              {(['Yes', 'No'] as const).map((s) => (
                <button key={s} type="button" onClick={() => update('irrigation', s)}
                  className={`input flex-1 text-center ${form.irrigation === s ? 'bg-primary-600 text-white border-primary-600' : ''}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-primary-100">
          <div>
            <label className="label">Expected yield (kg)</label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
              <input type="number" min="0" className="input pl-11" value={num(form.yieldKg)} onChange={(e) => update('yieldKg', e.target.value)} placeholder="e.g. 1200" required />
            </div>
          </div>
          <div>
            <label className="label">Expected market price (₹ per kg)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
              <input type="number" min="0" step="any" className="input pl-11" value={num(form.pricePerKg)} onChange={(e) => update('pricePerKg', e.target.value)} placeholder="e.g. 72" required />
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-primary-100">
          <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
            <FlaskRound className="w-5 h-5 text-primary-600" /> Farming Expenses (₹)
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <ExpenseField label="Seed cost" value={form.seedCost} onChange={(v) => update('seedCost', v)} />
            <ExpenseField label="Fertilizer cost" value={form.fertilizerCost} onChange={(v) => update('fertilizerCost', v)} />
            <ExpenseField label="Labour cost" value={form.labourCost} onChange={(v) => update('labourCost', v)} />
            <ExpenseField label="Irrigation cost" value={form.irrigationCost} onChange={(v) => update('irrigationCost', v)} />
            <ExpenseField label="Pest & disease management cost" value={form.pestCost} onChange={(v) => update('pestCost', v)} />
            <ExpenseField label="Other expenses" value={form.otherCost} onChange={(v) => update('otherCost', v)} />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Calculator className="w-5 h-5" /> Calculate Budget
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <h2 className="section-title">Budget Result</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard label="Total Estimated Cost" value={`₹${result.totalCost.toLocaleString()}`} color="text-error-600" />
            <ResultCard label="Expected Revenue" value={`₹${result.revenue.toLocaleString()}`} color="text-primary-600" />
            <ResultCard label={result.isProfit ? 'Estimated Profit' : 'Estimated Loss'} value={`${result.isProfit ? '+' : '-'}₹${Math.abs(result.profit).toLocaleString()}`} color={result.isProfit ? 'text-success-600' : 'text-error-600'} />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="card p-4">
              <p className="text-xs text-primary-500">Expected Production</p>
              <p className="text-lg font-bold text-primary-900">{result.yieldAmount.toLocaleString()} kg</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-primary-500">Expected Market Price</p>
              <p className="text-lg font-bold text-primary-900">₹{result.pricePerKg}/kg</p>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-4">Cost vs Revenue vs Profit</h3>
            <BarChart
              data={[
                { label: 'Total Cost', value: result.totalCost, color: '#ef4444' },
                { label: 'Revenue', value: result.revenue, color: '#16a34a' },
                { label: result.isProfit ? 'Profit' : 'Loss', value: Math.abs(result.profit), color: result.isProfit ? '#10b981' : '#f97316' },
              ]}
              unit="₹"
              height={160}
            />
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-3">Cost Breakdown</h3>
            <div className="space-y-2">
              {result.costBreakdown.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-sm">
                  <span className="text-primary-600">{c.label}</span>
                  <span className="font-semibold text-primary-800">₹{c.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-primary-100">
                <span className="font-bold text-primary-800">Total</span>
                <span className="font-bold text-primary-900">₹{result.totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-accent-50 border-accent-200">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
              <p className="text-sm text-accent-800">
                These are estimated calculations based on sample or user-provided data. Actual costs, yield and income may vary.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpenseField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <IndianRupee className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
        <input type="number" min="0" className="input pl-11" value={value} onChange={(e) => onChange(e.target.value)} placeholder="0" />
      </div>
    </div>
  );
}

function ResultCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-primary-500">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
