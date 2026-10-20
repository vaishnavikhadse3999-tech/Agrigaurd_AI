import { useState } from 'react';
import { TrendingUp, MapPin, Store, ArrowRight, TrendingDown, Minus } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Badges';
import { LineChart } from '@/components/Charts';
import { CROPS, MARKET_DATA } from '@/lib/data';
import type { FarmProfile } from '@/types';

interface MarketProps {
  farm: FarmProfile | null;
  onBack: () => void;
}

export function Market({ farm, onBack }: MarketProps) {
  const [crop, setCrop] = useState(farm?.currentCrop ?? '');
  const data = crop ? MARKET_DATA[crop] : null;

  const trendIcon = data?.trend === 'Rising' ? <TrendingUp className="w-4 h-4 text-success-600" />
    : data?.trend === 'Falling' ? <TrendingDown className="w-4 h-4 text-error-600" />
    : <Minus className="w-4 h-4 text-primary-500" />;

  const recColor = data?.recommendation === 'Sell Now' ? 'bg-success-100 text-success-700'
    : data?.recommendation === 'Wait' ? 'bg-accent-100 text-accent-700'
    : 'bg-primary-100 text-primary-700';

  return (
    <div>
      <PageHeader
        title="Market Price"
        subtitle="Check market prices and selling advice"
        icon={<TrendingUp className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge />}
      />

      <div className="card p-5 animate-fade-in">
        <label className="label">Select Crop</label>
        <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
          <option value="">Select a crop</option>
          {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {data && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <p className="text-sm text-primary-500">Current Price</p>
              <p className="text-3xl font-bold text-primary-900 mt-1">
                ₹{data.currentPrice.toLocaleString()}
              </p>
              <p className="text-sm text-primary-500">{data.unit}</p>
              <div className="flex items-center gap-2 mt-3">
                {trendIcon}
                <span className="text-sm font-semibold text-primary-700">{data.trend} Trend</span>
              </div>
            </div>

            <div className="card p-5">
              <p className="text-sm text-primary-500">Nearby Market</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-5 h-5 text-primary-500" />
                <p className="text-lg font-semibold text-primary-900">{data.nearbyMarket}</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Store className="w-5 h-5 text-primary-500" />
                <p className="text-sm text-primary-600">Compare with other APMC markets for best price.</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-3">Price Trend (last 5 entries)</h3>
            <LineChart
              data={data.trendHistory}
              labels={['W1', 'W2', 'W3', 'W4', 'W5']}
              color={data.trend === 'Rising' ? '#10b981' : data.trend === 'Falling' ? '#ef4444' : '#16a34a'}
              unit="₹"
            />
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-primary-800 mb-3">Market Comparison</h3>
            <div className="space-y-2">
              {[
                { market: 'Amravati APMC', price: data.currentPrice, dist: '0 km' },
                { market: 'Nagpur APMC', price: Math.round(data.currentPrice * 1.05), dist: '150 km' },
                { market: 'Akola APMC', price: Math.round(data.currentPrice * 0.97), dist: '90 km' },
              ].map((m) => (
                <div key={m.market} className="flex items-center justify-between bg-primary-50 rounded-xl p-3">
                  <div>
                    <p className="font-semibold text-primary-800 text-sm">{m.market}</p>
                    <p className="text-xs text-primary-500">{m.dist} away</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-900">₹{m.price.toLocaleString()}</p>
                    <p className="text-xs text-primary-500">{data.unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`card p-5 ${recColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">AgriGuard Recommendation</p>
                <p className="text-xl font-bold mt-1">{data.recommendation}</p>
              </div>
              <ArrowRight className="w-8 h-8 opacity-60" />
            </div>
            <p className="text-sm mt-2 opacity-90">
              {data.recommendation === 'Sell Now' && `Prices are ${data.trend.toLowerCase()} right now. Selling now at ${data.currentPrice} ${data.unit} could be a good choice.`}
              {data.recommendation === 'Wait' && `Price trend is ${data.trend.toLowerCase()}. Waiting a little may get you a better price.`}
              {data.recommendation === 'Compare Markets' && `Prices differ across markets. Compare nearby APMC markets before selling.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
