import { CloudSun, CloudRain, Sun, Wind, Droplets, Thermometer, Cloud, Umbrella } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { DemoBadge } from '@/components/Badges';
import { BarChart } from '@/components/Charts';
import { DEMO_WEATHER } from '@/lib/data';
import { useI18n } from '@/lib/i18n';

interface WeatherProps {
  onBack: () => void;
}

export function Weather({ onBack }: WeatherProps) {
  const { t } = useI18n();
  const w = DEMO_WEATHER;

  const advice: string[] = [];
  if (w.rainChance >= 60) {
    advice.push(t('weather.advice.rain'));
  }
  if (w.temperature >= 35) {
    advice.push(t('weather.advice.highTemp'));
  }
  if (w.humidity >= 70) {
    advice.push(t('weather.advice.highHumidity'));
  }
  if (w.wind >= 20) {
    advice.push(t('weather.advice.strongWind'));
  }
  if (advice.length === 0) {
    advice.push(t('weather.advice.stable'));
  }

  return (
    <div>
      <PageHeader
        title={t('weather.title')}
        subtitle={t('weather.subtitle')}
        icon={<CloudSun className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge />}
      />

      <div className="card p-6 animate-fade-in bg-gradient-to-br from-blue-50 to-primary-50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
            {w.rainChance >= 60 ? <CloudRain className="w-9 h-9" /> : <Sun className="w-9 h-9 text-accent-500" />}
          </div>
          <div>
            <p className="text-4xl font-bold text-primary-900">{w.temperature}°C</p>
            <p className="text-primary-600">{w.condition}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <WeatherCard icon={<CloudRain className="w-5 h-5" />} label={t('weather.rainChance')} value={`${w.rainChance}%`} color="text-blue-500" />
        <WeatherCard icon={<Droplets className="w-5 h-5" />} label={t('weather.humidity')} value={`${w.humidity}%`} color="text-primary-500" />
        <WeatherCard icon={<Wind className="w-5 h-5" />} label={t('weather.wind')} value={`${w.wind} km/h`} color="text-primary-500" />
        <WeatherCard icon={<Thermometer className="w-5 h-5" />} label={t('weather.condition')} value={w.condition.split(',')[0]} color="text-accent-500" />
      </div>

      <div className="card p-5 mt-4">
        <h3 className="font-semibold text-primary-800 mb-3">{t('weather.forecast')}</h3>
        <BarChart
          data={w.forecast.map((f) => ({ label: f.day, value: f.temp, color: '#f59e0b' }))}
          height={140}
          unit="°C"
        />
        <div className="mt-4">
          <p className="text-sm font-medium text-primary-700 mb-2">{t('weather.rainChanceForecast')}</p>
          <BarChart
            data={w.forecast.map((f) => ({ label: f.day, value: f.rain, color: '#3b82f6' }))}
            max={100}
            height={120}
            unit="%"
          />
        </div>
      </div>

      <div className="card p-5 mt-4">
        <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
          <Umbrella className="w-5 h-5 text-primary-600" /> {t('weather.farmingAdvice')}
        </h3>
        <div className="space-y-2">
          {advice.map((a, i) => (
            <div key={i} className="flex items-start gap-2 bg-primary-50 rounded-xl p-3">
              <Cloud className="w-4 h-4 text-primary-500 mt-0.5 shrink-0" />
              <p className="text-sm text-primary-700">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeatherCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="card p-4">
      <div className={`mb-1 ${color}`}>{icon}</div>
      <p className="text-xs text-primary-500">{label}</p>
      <p className="font-semibold text-primary-900 text-sm">{value}</p>
    </div>
  );
}
