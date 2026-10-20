import { useState } from 'react';
import { Scale, TrendingUp, TrendingDown, Minus, Warehouse, IndianRupee, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Badges';
import { CROPS, MARKET_DATA } from '@/lib/data';
import type { FarmProfile } from '@/types';

interface SellStoreProps {
  farm: FarmProfile | null;
  onBack: () => void;
}

export function SellStore({ farm, onBack }: SellStoreProps) {
  const [crop, setCrop] = useState(farm?.currentCrop ?? '');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [storage, setStorage] = useState<'Yes' | 'No'>('Yes');
  const [trend, setTrend] = useState<'Rising' | 'Falling' | 'Stable'>('Rising');
  const [result, setResult] = useState(false);

  const marketData = crop ? MARKET_DATA[crop] : null;
  const usePrice = price ? Number(price) : marketData?.currentPrice ?? 0;
  const qty = quantity ? Number(quantity) : 0;
  const totalValue = usePrice * qty;

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(true);
  };

  let recommendation = '';
  let sellScore = 0;
  let storeScore = 0;

  if (result && qty > 0) {
    if (trend === 'Rising' && storage === 'Yes') {
      storeScore += 3;
      recommendation = 'Storage is available and the price trend is rising, so waiting may be worth considering.';
    } else if (trend === 'Falling') {
      sellScore += 3;
      recommendation = 'Prices are falling. Selling now may be better than waiting.';
    } else if (storage === 'No') {
      sellScore += 2;
      recommendation = 'No storage available. Selling now avoids spoilage risk.';
    } else if (trend === 'Stable') {
      sellScore += 1;
      storeScore += 1;
      recommendation = 'Compare nearby markets before selling.';
    } else {
      recommendation = 'Compare nearby markets before selling.';
      sellScore += 1;
    }
  }

  return (
    <div>
      <PageHeader
        title="Sell or Store"
        subtitle="Decide whether to sell now or store your crop"
        icon={<Scale className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge />}
      />

      <form onSubmit={handleCheck} className="card p-5 space-y-4 animate-fade-in">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Crop</label>
            <select className="input" value={crop} onChange={(e) => { setCrop(e.target.value); setResult(false); }} required>
              <option value="">Select crop</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Quantity (quintal)</label>
            <input type="number" min="0" className="input" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="e.g. 50" required />
          </div>
          <div>
            <label className="label">Current Market Price (₹/quintal)</label>
            <input type="number" min="0" className="input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={marketData ? `${marketData.currentPrice}` : 'e.g. 7200'} />
          </div>
          <div>
            <label className="label">Storage Available</label>
            <div className="flex gap-2">
              {(['Yes', 'No'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStorage(s)}
                  className={`input flex-1 text-center ${storage === s ? 'bg-primary-600 text-white border-primary-600' : ''}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="label">Expected Future Price Trend</label>
          <div className="flex gap-2">
            {(['Rising', 'Stable', 'Falling'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTrend(t)}
                className={`input flex-1 text-center ${trend === t ? 'bg-primary-600 text-white border-primary-600' : ''}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary w-full">
          <Scale className="w-5 h-5" /> Compare Sell vs Store
        </button>
      </form>

      {result && qty > 0 && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Sell Now */}
            <div className="card p-5 border-2 border-primary-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-primary-900">Sell Now</h3>
              </div>
              <div className="space-y-2 text-sm">
                <Row label="Current Value" value={`₹${totalValue.toLocaleString()}`} />
                <Row label="Price Trend" value={trend} icon={trend === 'Rising' ? <TrendingUp className="w-4 h-4 text-success-600" /> : trend === 'Falling' ? <TrendingDown className="w-4 h-4 text-error-600" /> : <Minus className="w-4 h-4 text-primary-500" />} />
                <Row label="Storage Risk" value={storage === 'Yes' ? 'Low' : 'High'} />
                <Row label="Score" value={`${sellScore}/3`} />
              </div>
            </div>

            {/* Store */}
            <div className="card p-5 border-2 border-accent-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center text-accent-700">
                  <Warehouse className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-primary-900">Store</h3>
              </div>
              <div className="space-y-2 text-sm">
                <Row label="Expected Value" value={trend === 'Rising' ? `₹${Math.round(totalValue * 1.1).toLocaleString()}` : trend === 'Falling' ? `₹${Math.round(totalValue * 0.9).toLocaleString()}` : `₹${totalValue.toLocaleString()}`} />
                <Row label="Price Trend" value={trend} />
                <Row label="Storage Available" value={storage} />
                <Row label="Score" value={`${storeScore}/3`} />
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="card p-5 bg-primary-50/50 border-primary-200">
            <h3 className="font-bold text-primary-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-600" /> AgriGuard Recommendation
            </h3>
            <p className="text-sm text-primary-700 leading-relaxed">{recommendation}</p>
          </div>

          <div className="card p-4 bg-warning-50 border-warning-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
              <p className="text-sm text-warning-800">
                This is a basic decision-support recommendation, not financial advice. Market prices can change. Always check with your local market before making a final decision.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-primary-500">{label}</span>
      <span className="font-semibold text-primary-800 flex items-center gap-1">{icon}{value}</span>
    </div>
  );
}
