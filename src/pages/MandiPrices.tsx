import { useState, useEffect, useCallback } from 'react';
import { Store, MapPin, Navigation, RefreshCw, TrendingUp, AlertTriangle, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useI18n } from '@/lib/i18n';
import {
  MANDI_MARKETS, MANDI_CROPS, DEFAULT_LOCATION, findNearestMarket,
  haversineDistance, type MandiPriceEntry,
} from '@/lib/mandiData';
import { useSupabase } from '@/lib/useSupabase';

type LoadState = 'idle' | 'loading' | 'success' | 'error';

interface MandiPricesProps {
  onBack: () => void;
}

export function MandiPrices({ onBack }: MandiPricesProps) {
  const { t } = useI18n();
  const supabase = useSupabase();
  const [selectedMarketId, setSelectedMarketId] = useState<string>('shegaon');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [prices, setPrices] = useState<MandiPriceEntry[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
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

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const fetchPrices = useCallback(
    async (marketId: string, crop: string) => {
      if (!crop) return;
      setLoadState('loading');
      setErrorMsg('');
      try {
        const { data, error } = await supabase.functions.invoke('mandi-prices', {
          body: { marketId, crop },
        });
        if (error) throw error;
        const entries: MandiPriceEntry[] = data?.prices ?? [];
        setPrices(entries);
        setLoadState('success');
      } catch {
        setLoadState('error');
        setErrorMsg(t('mandi.error'));
      }
    },
    [supabase, t]
  );

  const fetchCompare = useCallback(
    async (crop: string) => {
      if (!crop) return;
      setCompareMode(true);
      const results: Record<string, MandiPriceEntry | null> = {};
      for (const market of MANDI_MARKETS) {
        try {
          const { data, error } = await supabase.functions.invoke('mandi-prices', {
            body: { marketId: market.id, crop },
          });
          if (error) throw error;
          results[market.id] = data?.prices?.[0] ?? null;
        } catch {
          results[market.id] = null;
        }
      }
      setComparePrices(results);
    },
    [supabase]
  );

  useEffect(() => {
    if (selectedCrop) {
      fetchPrices(selectedMarketId, selectedCrop);
      setCompareMode(false);
    }
  }, [selectedMarketId, selectedCrop, fetchPrices]);

  const currentMarket = MANDI_MARKETS.find((m) => m.id === selectedMarketId) ?? DEFAULT_LOCATION;
  const userDist = userCoords
    ? haversineDistance(userCoords.lat, userCoords.lng, currentMarket.lat, currentMarket.lng)
    : null;

  return (
    <div>
      <PageHeader
        title={t('mandi.title')}
        subtitle={t('mandi.subtitle')}
        icon={<Store className="w-6 h-6" />}
        onBack={onBack}
      />

      <div className="card p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={requestLocation}
            disabled={locating}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            {t('mandi.useLocation')}
          </button>
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
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="">{t('common.selectCrop')}</option>
              {MANDI_CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedCrop && loadState === 'loading' && (
        <div className="card p-8 mt-4 flex items-center justify-center gap-2 text-primary-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">{t('mandi.loading')}</span>
        </div>
      )}

      {selectedCrop && loadState === 'error' && (
        <div className="card p-8 mt-4 text-center">
          <AlertTriangle className="w-8 h-8 text-error-500 mx-auto mb-2" />
          <p className="text-sm text-error-600 mb-4">{errorMsg}</p>
          <button onClick={() => fetchPrices(selectedMarketId, selectedCrop)} className="btn-primary text-sm">
            {t('mandi.retry')}
          </button>
        </div>
      )}

      {selectedCrop && loadState === 'success' && prices.length === 0 && (
        <div className="card p-8 mt-4 text-center text-primary-500 text-sm">
          {t('mandi.noData')}
        </div>
      )}

      {selectedCrop && loadState === 'success' && prices.length > 0 && (
        <div className="mt-6 space-y-4 animate-slide-up">
          {prices.map((entry, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold text-primary-900">{entry.marketName}</span>
                </div>
                <span className="text-xs text-primary-500">{entry.reportDate}</span>
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
            onClick={() => fetchCompare(selectedCrop)}
            className="btn-ghost flex items-center gap-2 text-sm w-full justify-center"
          >
            <TrendingUp className="w-4 h-4" />
            {t('mandi.compareMarkets')}
            <ArrowRight className="w-4 h-4" />
          </button>

          {compareMode && (
            <div className="card p-5">
              <h3 className="font-semibold text-primary-800 mb-3">
                {t('mandi.compareTitle', { crop: selectedCrop })}
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
          onClick={() => selectedCrop && fetchPrices(selectedMarketId, selectedCrop)}
          disabled={loadState === 'loading'}
          className="btn-ghost flex items-center gap-1.5 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loadState === 'loading' ? 'animate-spin' : ''}`} />
          {t('mandi.refresh')}
        </button>
      </div>
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
