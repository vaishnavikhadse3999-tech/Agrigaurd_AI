import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, MapPin, Store, ArrowRight, TrendingDown, Minus,
  Navigation, RefreshCw, AlertTriangle, Loader2, ExternalLink, Calendar,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Badges';
import { LineChart } from '@/components/Charts';
import { CROPS, MARKET_DATA } from '@/lib/data';
import {
  MANDI_MARKETS, MANDI_CROPS, DEFAULT_LOCATION, findNearestMarket,
  haversineDistance, type MandiPriceEntry,
} from '@/lib/mandiData';
import { useSupabase } from '@/lib/useSupabase';
import { useI18n } from '@/lib/i18n';
import type { FarmProfile } from '@/types';

interface MarketProps {
  farm: FarmProfile | null;
  onBack: () => void;
}

type MandiLoadState = 'idle' | 'loading' | 'success' | 'error';

export function Market({ farm, onBack }: MarketProps) {
  const { t } = useI18n();
  const supabase = useSupabase();
  const [crop, setCrop] = useState(farm?.currentCrop ?? '');
  const data = crop ? MARKET_DATA[crop] : null;

  // Mandi prices state
  const [tab, setTab] = useState<'guide' | 'mandi'>('guide');
  const [selectedMarketId, setSelectedMarketId] = useState<string>('shegaon');
  const [selectedMandiCrop, setSelectedMandiCrop] = useState<string>('');
  const [prices, setPrices] = useState<MandiPriceEntry[]>([]);
  const [mandiLoadState, setMandiLoadState] = useState<MandiLoadState>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePrices, setComparePrices] = useState<Record<string, MandiPriceEntry | null>>({});

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationDenied(true);
      setSelectedMarketId(DEFAULT_LOCATION.id);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        const nearest = findNearestMarket(latitude, longitude);
        setSelectedMarketId(nearest.id);
        setLocating(false);
        setLocationDenied(false);
      },
      () => {
        setLocationDenied(true);
        setSelectedMarketId(DEFAULT_LOCATION.id);
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const fetchPrices = useCallback(
    async (marketId: string, mandiCrop: string) => {
      if (!mandiCrop) return;
      setMandiLoadState('loading');
      setErrorMsg('');
      try {
        const { data: fnData, error } = await supabase.functions.invoke('mandi-prices', {
          body: { marketId, crop: mandiCrop },
        });
        if (error) throw error;
        const entries: MandiPriceEntry[] = fnData?.prices ?? [];
        setPrices(entries);
        setMandiLoadState('success');
      } catch {
        setMandiLoadState('error');
        setErrorMsg(t('mandi.error'));
      }
    },
    [supabase, t]
  );

  const fetchCompare = useCallback(
    async (mandiCrop: string) => {
      if (!mandiCrop) return;
      setCompareMode(true);
      const results: Record<string, MandiPriceEntry | null> = {};
      for (const market of MANDI_MARKETS) {
        try {
          const { data: fnData, error } = await supabase.functions.invoke('mandi-prices', {
            body: { marketId: market.id, crop: mandiCrop },
          });
          if (error) throw error;
          results[market.id] = fnData?.prices?.[0] ?? null;
        } catch {
          results[market.id] = null;
        }
      }
      setComparePrices(results);
    },
    [supabase]
  );

  useEffect(() => {
    if (tab === 'mandi') {
      requestLocation();
    }
  }, [tab, requestLocation]);

  useEffect(() => {
    if (tab === 'mandi' && selectedMandiCrop) {
      fetchPrices(selectedMarketId, selectedMandiCrop);
      setCompareMode(false);
    }
  }, [tab, selectedMarketId, selectedMandiCrop, fetchPrices]);

  const currentMarket = MANDI_MARKETS.find((m) => m.id === selectedMarketId) ?? DEFAULT_LOCATION;
  const userDist = userCoords
    ? haversineDistance(userCoords.lat, userCoords.lng, currentMarket.lat, currentMarket.lng)
    : null;

  const trendIcon = data?.trend === 'Rising' ? <TrendingUp className="w-4 h-4 text-success-600" />
    : data?.trend === 'Falling' ? <TrendingDown className="w-4 h-4 text-error-600" />
    : <Minus className="w-4 h-4 text-primary-500" />;

  const recColor = data?.recommendation === 'Sell Now' ? 'bg-success-100 text-success-700'
    : data?.recommendation === 'Wait' ? 'bg-accent-100 text-accent-700'
    : 'bg-primary-100 text-primary-700';

  return (
    <div>
      <PageHeader
        title={t('market.title')}
        subtitle={t('market.subtitle')}
        icon={<TrendingUp className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge />}
      />

      {/* Tab switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('guide')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            tab === 'guide'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-white border border-primary-100 text-primary-600 hover:bg-primary-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t('market.tabGuide')}
          </span>
        </button>
        <button
          onClick={() => setTab('mandi')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            tab === 'mandi'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-white border border-primary-100 text-primary-600 hover:bg-primary-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            {t('market.tabMandi')}
          </span>
        </button>
      </div>

      {/* TAB 1: Price Guide (existing) */}
      {tab === 'guide' && (
        <>
          <div className="card p-5 animate-fade-in">
            <label className="label">{t('market.selectCrop')}</label>
            <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="">{t('common.selectCrop')}</option>
              {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {data && (
            <div className="mt-6 space-y-4 animate-slide-up">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card p-5">
                  <p className="text-sm text-primary-500">{t('market.currentPrice')}</p>
                  <p className="text-3xl font-bold text-primary-900 mt-1">
                    ₹{data.currentPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-primary-500">{data.unit}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {trendIcon}
                    <span className="text-sm font-semibold text-primary-700">{data.trend} {t('market.trend')}</span>
                  </div>
                </div>

                <div className="card p-5">
                  <p className="text-sm text-primary-500">{t('market.nearbyMarket')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    <p className="text-lg font-semibold text-primary-900">{data.nearbyMarket}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary-500" />
                    <p className="text-sm text-primary-600">{t('market.compareHint')}</p>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-primary-800 mb-3">{t('market.trendChart')}</h3>
                <LineChart
                  data={data.trendHistory}
                  labels={['W1', 'W2', 'W3', 'W4', 'W5']}
                  color={data.trend === 'Rising' ? '#10b981' : data.trend === 'Falling' ? '#ef4444' : '#16a34a'}
                  unit="₹"
                />
              </div>

              <div className="card p-5">
                <h3 className="font-semibold text-primary-800 mb-3">{t('market.comparison')}</h3>
                <div className="space-y-2">
                  {[
                    { market: 'Amravati APMC', price: data.currentPrice, dist: '0 km' },
                    { market: 'Nagpur APMC', price: Math.round(data.currentPrice * 1.05), dist: '150 km' },
                    { market: 'Akola APMC', price: Math.round(data.currentPrice * 0.97), dist: '90 km' },
                  ].map((m) => (
                    <div key={m.market} className="flex items-center justify-between bg-primary-50 rounded-xl p-3">
                      <div>
                        <p className="font-semibold text-primary-800 text-sm">{m.market}</p>
                        <p className="text-xs text-primary-500">{m.dist}</p>
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
                    <p className="text-sm font-medium opacity-80">{t('market.recommendationLabel')}</p>
                    <p className="text-xl font-bold mt-1">{data.recommendation}</p>
                  </div>
                  <ArrowRight className="w-8 h-8 opacity-60" />
                </div>
                <p className="text-sm mt-2 opacity-90">
                  {data.recommendation === 'Sell Now' && t('market.recSell').replace('{price}', `₹${data.currentPrice}`).replace('{unit}', data.unit)}
                  {data.recommendation === 'Wait' && t('market.recWait')}
                  {data.recommendation === 'Compare Markets' && t('market.recCompare')}
                </p>
              </div>

              <div className="card p-5 bg-primary-50 border border-primary-100">
                <div className="flex items-start gap-3">
                  <Store className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-primary-800 text-sm">{t('market.mandiHintTitle')}</p>
                    <p className="text-sm text-primary-600 mt-1">{t('market.mandiHintText')}</p>
                    <button
                      onClick={() => setTab('mandi')}
                      className="btn-ghost mt-2 text-sm inline-flex items-center gap-1.5"
                    >
                      {t('market.viewMandiPrices')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: Live Mandi Prices (merged) */}
      {tab === 'mandi' && (
        <div className="animate-fade-in">
          <div className="card p-5">
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <button
                onClick={requestLocation}
                disabled={locating}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                {t('mandi.useLocation')}
              </button>
              <a
                href="https://agmarknet.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex items-center gap-1.5 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                AGMARKNET
              </a>
            </div>

            {locationDenied && (
              <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-accent-600 mt-0.5 shrink-0" />
                <p className="text-sm text-accent-700">{t('mandi.locationDenied')}</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">{t('mandi.selectMarket')}</label>
                <select
                  className="input"
                  value={selectedMarketId}
                  onChange={(e) => setSelectedMarketId(e.target.value)}
                >
                  {MANDI_MARKETS.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} — {m.district}</option>
                  ))}
                </select>
                {userDist !== null && (
                  <p className="text-xs text-primary-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {userDist} km {t('mandi.distance').toLowerCase()}
                  </p>
                )}
              </div>
              <div>
                <label className="label">{t('mandi.selectCrop')}</label>
                <select
                  className="input"
                  value={selectedMandiCrop}
                  onChange={(e) => setSelectedMandiCrop(e.target.value)}
                >
                  <option value="">{t('common.selectCrop')}</option>
                  {MANDI_CROPS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {selectedMandiCrop && mandiLoadState === 'loading' && (
            <div className="card p-8 mt-4 flex items-center justify-center gap-2 text-primary-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">{t('mandi.loading')}</span>
            </div>
          )}

          {selectedMandiCrop && mandiLoadState === 'error' && (
            <div className="card p-8 mt-4 text-center">
              <AlertTriangle className="w-8 h-8 text-error-500 mx-auto mb-2" />
              <p className="text-sm text-primary-700 mb-2">{t('mandi.unavailable')}</p>
              <p className="text-xs text-primary-500 mb-4">{t('mandi.dataSource')}</p>
              <a
                href="https://agmarknet.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                {t('mandi.viewAgmarknet')}
              </a>
            </div>
          )}

          {selectedMandiCrop && mandiLoadState === 'success' && prices.length === 0 && (
            <div className="card p-8 mt-4 text-center text-primary-500 text-sm">
              {t('mandi.noData')}
            </div>
          )}

          {selectedMandiCrop && mandiLoadState === 'success' && prices.length > 0 && (
            <div className="mt-6 space-y-4 animate-slide-up">
              {prices.map((entry, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-5 h-5 text-primary-600" />
                      <span className="font-semibold text-primary-900">{entry.marketName}</span>
                    </div>
                    <span className="text-xs text-primary-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.reportDate}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <PriceField label={t('mandi.commodity')} value={entry.commodity} />
                    <PriceField label={t('mandi.variety')} value={entry.variety || '—'} />
                    <PriceField label={t('mandi.minPrice')} value={entry.minPrice != null ? `₹${entry.minPrice.toLocaleString()}` : t('mandi.priceUnavailable')} />
                    <PriceField label={t('mandi.maxPrice')} value={entry.maxPrice != null ? `₹${entry.maxPrice.toLocaleString()}` : t('mandi.priceUnavailable')} />
                    <PriceField label={t('mandi.modalPrice')} value={entry.modalPrice != null ? `₹${entry.modalPrice.toLocaleString()}` : t('mandi.priceUnavailable')} highlight />
                    <PriceField label={t('mandi.priceUnit')} value={entry.unit} />
                    <PriceField label={t('mandi.arrival')} value={entry.arrival ?? '—'} />
                    <PriceField label={t('mandi.reportDate')} value={entry.reportDate} />
                  </div>
                  {entry.modalPrice == null && (
                    <p className="text-xs text-accent-600 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {t('mandi.priceUnavailable')} — {t('mandi.lastReported')}: {entry.reportDate}
                    </p>
                  )}
                </div>
              ))}

              <button
                onClick={() => fetchCompare(selectedMandiCrop)}
                className="btn-ghost flex items-center gap-2 text-sm w-full justify-center"
              >
                <TrendingUp className="w-4 h-4" />
                {t('mandi.compareMarkets')}
                <ArrowRight className="w-4 h-4" />
              </button>

              {compareMode && (
                <div className="card p-5">
                  <h3 className="font-semibold text-primary-800 mb-3">
                    {t('mandi.compareTitle', { crop: selectedMandiCrop })}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-primary-100">
                          <th className="text-left py-2 pr-3 text-primary-600 font-medium">{t('mandi.marketName')}</th>
                          <th className="text-right py-2 px-3 text-primary-600 font-medium">{t('mandi.modalPrice')}</th>
                          <th className="text-right py-2 px-3 text-primary-600 font-medium">{t('mandi.minPrice')}</th>
                          <th className="text-right py-2 px-3 text-primary-600 font-medium">{t('mandi.maxPrice')}</th>
                          <th className="text-right py-2 pl-3 text-primary-600 font-medium">{t('mandi.reportDate')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MANDI_MARKETS.map((m) => {
                          const entry = comparePrices[m.id];
                          return (
                            <tr key={m.id} className="border-b border-primary-50">
                              <td className="py-2.5 pr-3 font-medium text-primary-800">{m.name}</td>
                              <td className="py-2.5 px-3 text-right font-semibold text-primary-900">
                                {entry?.modalPrice != null ? `₹${entry.modalPrice.toLocaleString()}` : t('mandi.priceUnavailable')}
                              </td>
                              <td className="py-2.5 px-3 text-right text-primary-700">
                                {entry?.minPrice != null ? `₹${entry.minPrice.toLocaleString()}` : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-right text-primary-700">
                                {entry?.maxPrice != null ? `₹${entry.maxPrice.toLocaleString()}` : '—'}
                              </td>
                              <td className="py-2.5 pl-3 text-right text-xs text-primary-500">
                                {entry?.reportDate ?? '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-primary-400">{t('mandi.dataSource')}</p>
            <button
              onClick={() => selectedMandiCrop && fetchPrices(selectedMarketId, selectedMandiCrop)}
              disabled={mandiLoadState === 'loading'}
              className="btn-ghost flex items-center gap-1.5 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${mandiLoadState === 'loading' ? 'animate-spin' : ''}`} />
              {t('mandi.refresh')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PriceField({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-primary-500">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-primary-700' : 'text-primary-900'}`}>{value}</p>
    </div>
  );
}
