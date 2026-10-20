import { useState } from 'react';
import { Tractor, Save, MapPin, Ruler, Layers, Sprout, Droplets, CalendarDays, User, Trash2 } from 'lucide-react';
import type { FarmProfile, PageKey, SoilType, WaterAvailability, Season } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { SOIL_TYPES, WATER_LEVELS, SEASONS, CROPS } from '@/lib/data';
import { saveFarm } from '@/lib/storage';
import { useI18n } from '@/lib/i18n';

interface MyFarmProps {
  farm: FarmProfile | null;
  onSave: (farm: FarmProfile) => void;
  onBack: () => void;
  onNavigate: (page: PageKey) => void;
}

export function MyFarm({ farm, onSave, onBack, onNavigate }: MyFarmProps) {
  const { t } = useI18n();
  const [form, setForm] = useState<FarmProfile>(
    farm ?? {
      farmerName: '', location: '', farmSize: '', soilType: '',
      currentCrop: '', waterAvailability: '', season: '',
    }
  );
  const [saved, setSaved] = useState(false);

  const update = (key: keyof FarmProfile, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFarm(form);
    onSave(form);
    setSaved(true);
  };

  const handleClear = () => {
    const empty: FarmProfile = {
      farmerName: '', location: '', farmSize: '', soilType: '',
      currentCrop: '', waterAvailability: '', season: '',
    };
    setForm(empty);
    saveFarm(empty);
    onSave(empty);
    setSaved(false);
  };

  const hasFarm = farm && farm.farmerName;

  return (
    <div>
      <PageHeader
        title={t('myFarm.title')}
        subtitle={t('myFarm.subtitle')}
        icon={<Tractor className="w-6 h-6" />}
        onBack={onBack}
      />

      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
        <div className="card p-5 space-y-4">
          <div>
            <label className="label">{t('myFarm.farmerName')}</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
              <input
                className="input pl-11"
                value={form.farmerName}
                onChange={(e) => update('farmerName', e.target.value)}
                placeholder={t('myFarm.farmerNamePlaceholder')}
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('common.location')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                <input
                  className="input pl-11"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder={t('myFarm.locationPlaceholder')}
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">{t('common.farmSize')}</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
                <input
                  className="input pl-11"
                  value={form.farmSize}
                  onChange={(e) => update('farmSize', e.target.value)}
                  placeholder={t('myFarm.farmSizePlaceholder')}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label">{t('common.soilType')}</label>
            <select
              className="input"
              value={form.soilType}
              onChange={(e) => update('soilType', e.target.value)}
              required
            >
              <option value="">{t('common.selectSoilType')}</option>
              {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="label">{t('myFarm.currentCrop')}</label>
            <div className="relative">
              <Sprout className="absolute left-3 top-3.5 w-5 h-5 text-primary-400" />
              <input
                className="input pl-11"
                list="crop-list"
                value={form.currentCrop}
                onChange={(e) => update('currentCrop', e.target.value)}
                placeholder={t('myFarm.currentCropPlaceholder')}
                required
              />
              <datalist id="crop-list">
                {CROPS.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('common.waterAvailability')}</label>
              <select
                className="input"
                value={form.waterAvailability}
                onChange={(e) => update('waterAvailability', e.target.value)}
                required
              >
                <option value="">{t('common.selectWaterLevel')}</option>
                {WATER_LEVELS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t('common.season')}</label>
              <select
                className="input"
                value={form.season}
                onChange={(e) => update('season', e.target.value)}
                required
              >
                <option value="">{t('common.selectSeason')}</option>
                {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              <Save className="w-5 h-5" /> {t('myFarm.saveFarm')}
            </button>
            {hasFarm && (
              <button type="button" onClick={handleClear} className="btn-secondary">
                <Trash2 className="w-5 h-5" /> {t('myFarm.clear')}
              </button>
            )}
          </div>
          {saved && (
            <div className="bg-success-50 text-success-700 text-sm font-medium p-3 rounded-xl animate-fade-in">
              {t('myFarm.saved')}
            </div>
          )}
        </div>
      </form>

      {/* Farm Summary */}
      {hasFarm && (
        <div className="mt-6 animate-slide-up">
          <h2 className="section-title mb-3">{t('myFarm.summary')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <SummaryCard icon={<User className="w-5 h-5" />} label={t('myFarm.farmer')} value={farm!.farmerName} />
            <SummaryCard icon={<MapPin className="w-5 h-5" />} label={t('common.location')} value={farm!.location} />
            <SummaryCard icon={<Ruler className="w-5 h-5" />} label={t('common.farmSize')} value={farm!.farmSize} />
            <SummaryCard icon={<Layers className="w-5 h-5" />} label={t('common.soilType')} value={farm!.soilType} />
            <SummaryCard icon={<Sprout className="w-5 h-5" />} label={t('myFarm.currentCrop')} value={farm!.currentCrop} />
            <SummaryCard icon={<Droplets className="w-5 h-5" />} label={t('myFarm.water')} value={farm!.waterAvailability} />
            <SummaryCard icon={<CalendarDays className="w-5 h-5" />} label={t('common.season')} value={farm!.season} />
          </div>

          <div className="card p-4 mt-4 bg-primary-50/50 border-primary-200">
            <p className="text-sm text-primary-700">
              {t('myFarm.savedNote')}
            </p>
            <button onClick={() => onNavigate('dashboard')} className="btn-ghost text-sm mt-2 -ml-2">
              {t('myFarm.viewDashboard')}
            </button>
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
