import { useState } from 'react';
import { CloudRain, MapPin, Droplets, Sprout, Info, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useI18n } from '@/lib/i18n';
import { SOIL_TYPES } from '@/lib/data';
import type { Season, SoilType } from '@/types';

type RainfallCondition = 'belowNormal' | 'normal' | 'aboveNormal';

interface Recommendation {
  crop: string;
  sowingWindow: string;
  waterReq: string;
  soilDrainage: string;
  seedSelection: string;
  riskReduction: string[];
  reasons: string[];
  expertNeeded: boolean;
}

interface AdvisoryInput {
  district: string;
  season: Season;
  crop: string;
  soilType: SoilType;
  irrigation: boolean;
  rainfallReceived: string;
  forecastRainfall: string;
  rainfallCondition: RainfallCondition;
}

function generateRecommendations(input: AdvisoryInput): Recommendation[] {
  const recs: Recommendation[] = [];
  const { season, rainfallCondition, soilType, irrigation } = input;

  if (season === 'Kharif') {
    if (rainfallCondition === 'belowNormal') {
      recs.push({
        crop: 'Soybean (short-duration variety)',
        sowingWindow: 'Mid-June to early July (with first monsoon rain)',
        waterReq: 'Moderate — needs 500-700 mm total. Drought-tolerant once established.',
        soilDrainage: 'Good drainage needed. Avoid waterlogging-prone black soil areas.',
        seedSelection: 'Short-duration varieties: JS 335, JS 95-60, MAUS 71 (matures in 90-95 days)',
        riskReduction: [
          'Use drought-tolerant varieties with shorter duration',
          'Apply mulch to conserve soil moisture',
          'Practice contingency sowing if monsoon delays beyond July 15',
          'Use seed treatment with bio-agents for stress tolerance',
        ],
        reasons: [
          'Below-normal rainfall favors short-duration soybean over long-duration varieties',
          `Soybean adapts well to ${soilType} under moderate water stress`,
          irrigation
            ? 'Your irrigation availability provides a safety buffer if rainfall stays below normal'
            : 'Without irrigation backup, a short-duration crop reduces exposure to prolonged dry spells',
        ],
        expertNeeded: true,
      });
      recs.push({
        crop: 'Tur (Arhar) — medium-duration',
        sowingWindow: 'Late June to mid-July',
        waterReq: 'Low to moderate — deep-rooted, drought-tolerant after establishment',
        soilDrainage: 'Well-drained soils preferred. Avoid heavy clay with poor drainage.',
        seedSelection: 'TS 3, BDN 2, AKM 9604 (medium-duration, 140-150 days)',
        riskReduction: [
          'Deep-rooted crop tolerates moisture stress better than shallow-rooted crops',
          'Use wider spacing to reduce competition for limited water',
          'Apply life-saving irrigation at critical growth stages if possible',
        ],
        reasons: [
          'Tur is a drought-tolerant pulse suitable for below-normal rainfall years',
          'Its deep root system extracts moisture from deeper soil layers',
          'Fits well in Kharif season with low water requirement',
        ],
        expertNeeded: true,
      });
    } else if (rainfallCondition === 'normal') {
      recs.push({
        crop: 'Cotton',
        sowingWindow: 'June to early July (with monsoon onset)',
        waterReq: 'Moderate — 700-900 mm. Rain-fed in most of Maharashtra.',
        soilDrainage: 'Well-drained black soil (medium to deep) is ideal.',
        seedSelection: 'Bt cotton hybrids: JKCH 9948, RCH 659, Ajeet 155 (check local suitability)',
        riskReduction: [
          'Maintain proper spacing to avoid overcrowding',
          'Monitor for boll weevil and leaf curl in humid conditions',
          'Apply recommended fertilizer split doses',
        ],
        reasons: [
          'Normal rainfall is ideal for cotton in Vidarbha/Marathwada region',
          `${soilType} supports cotton with normal monsoon rainfall`,
          'Cotton is a major cash crop suited to Kharif season in Maharashtra',
        ],
        expertNeeded: false,
      });
      recs.push({
        crop: 'Soybean',
        sowingWindow: 'Mid-June to first week of July',
        waterReq: 'Moderate — 500-700 mm evenly distributed',
        soilDrainage: 'Good drainage essential. Soybean does not tolerate waterlogging.',
        seedSelection: 'JS 335, MAUS 158, JS 95-60',
        riskReduction: [
          'Ensure field drainage to prevent waterlogging in heavy rain',
          'Monitor for yellow mosaic virus in humid conditions',
          'Apply rhizobium culture for nitrogen fixation',
        ],
        reasons: [
          'Normal rainfall with even distribution is ideal for soybean',
          'Soybean provides good returns with lower water requirement than cotton',
          'Fits well in Kharif rotation in Maharashtra',
        ],
        expertNeeded: false,
      });
    } else {
      // aboveNormal
      recs.push({
        crop: 'Rice (paddy) or Maize',
        sowingWindow: 'June to mid-July (rice); early July (maize)',
        waterReq: 'High for rice (1000-1200 mm). Moderate-high for maize (600-800 mm).',
        soilDrainage: 'Rice needs waterlogged conditions. Maize needs well-drained soil — avoid waterlogging.',
        seedSelection: 'Rice: Pusa 44, Sahyadri. Maize: NK 30, Bio 9681 (waterlogging-tolerant hybrids)',
        riskReduction: [
          'For rice: maintain field bunds for water management',
          'For maize: ensure field drainage to prevent waterlogging damage',
          'Consider resowing if early sowing fails due to heavy rainfall',
          'Apply balanced fertilizer to avoid nutrient leaching in heavy rain',
        ],
        reasons: [
          'Above-normal rainfall creates favorable conditions for rice in lowland areas',
          'Maize can tolerate excess rainfall if drainage is managed',
          'Above-normal monsoon reduces irrigation dependency for both crops',
        ],
        expertNeeded: true,
      });
      recs.push({
        crop: 'Tur or Jowar (drainage-managed)',
        sowingWindow: 'Late June to mid-July',
        waterReq: 'Moderate — both tolerate excess moisture better than cotton',
        soilDrainage: 'Critical: ensure field drainage channels to prevent waterlogging. Raised beds recommended.',
        seedSelection: 'Tur: C 11, BDN 2. Jowar: CSH 16, Phule Vasudha',
        riskReduction: [
          'Create drainage channels before sowing to handle excess rainfall',
          'Use raised bed planting to prevent waterlogging',
          'Monitor for fungal diseases in humid conditions',
          'Have resowing plan ready if heavy rain damages initial sowing',
        ],
        reasons: [
          'Tur and Jowar are more tolerant of excess moisture than cotton/soybean',
          'With proper drainage, these crops perform well in above-normal rainfall',
          'Both are staple crops suitable for Kharif in Maharashtra',
        ],
        expertNeeded: true,
      });
    }
  } else if (season === 'Rabi') {
    if (rainfallCondition === 'belowNormal') {
      recs.push({
        crop: 'Chana (Gram)',
        sowingWindow: 'October to mid-November',
        waterReq: 'Low — drought-tolerant rabi crop. 1-2 irrigations sufficient.',
        soilDrainage: 'Well-drained soils. Avoid waterlogging-prone areas.',
        seedSelection: 'JG 11, JG 16, Phule Vikram, AKG 1109 (drought-tolerant varieties)',
        riskReduction: [
          'Drought-tolerant crop ideal for below-normal rainfall',
          'Apply one life-saving irrigation at flowering if possible',
          'Use seed treatment for better stress tolerance',
        ],
        reasons: [
          'Chana is the most drought-tolerant rabi pulse crop',
          'Below-normal rainfall suits chana better than wheat which needs more water',
          'Fits well in Maharashtra rabi rotation with low water requirement',
        ],
        expertNeeded: false,
      });
      recs.push({
        crop: 'Wheat (restricted irrigation)',
        sowingWindow: 'Mid-November to early December',
        waterReq: 'Moderate-high — needs 4-6 irrigations. Only recommended if irrigation is available.',
        soilDrainage: 'Well-drained loamy soil preferred.',
        seedSelection: 'HI 1544, AKAW 3722, NIAW 301 (drought-tolerant varieties)',
        riskReduction: [
          'Choose drought-tolerant wheat varieties if growing',
          'Critical irrigation at crown root initiation and flowering stages',
          'Use mulching to conserve soil moisture',
        ],
        reasons: [
          'Wheat needs more water than chana — below-normal rainfall is a risk',
          irrigation
            ? 'Your irrigation availability can compensate for below-normal rainfall'
            : 'Without irrigation, wheat is risky in below-normal rainfall — consider chana instead',
        ],
        expertNeeded: true,
      });
    } else if (rainfallCondition === 'normal') {
      recs.push({
        crop: 'Wheat',
        sowingWindow: 'Mid-November to early December',
        waterReq: 'Moderate — 4-6 irrigations through the season',
        soilDrainage: 'Well-drained loamy soil ideal.',
        seedSelection: 'HI 1544, AKAW 3722, MACS 6478',
        riskReduction: [
          'Normal winter rainfall supports wheat with standard irrigation',
          'Monitor for rust disease in humid conditions',
          'Apply recommended fertilizer schedule',
        ],
        reasons: [
          'Normal rainfall is favorable for wheat with supplemental irrigation',
          `${soilType} can support wheat with proper management`,
          'Wheat is a primary rabi crop in Maharashtra with established markets',
        ],
        expertNeeded: false,
      });
      recs.push({
        crop: 'Chana (Gram)',
        sowingWindow: 'October to mid-November',
        waterReq: 'Low — 1-2 irrigations sufficient',
        soilDrainage: 'Well-drained soils preferred.',
        seedSelection: 'JG 11, JG 16, Phule Vikram',
        riskReduction: [
          'Good rotation option with wheat',
          'Low water requirement reduces cost',
          'Fixes nitrogen, improving soil health',
        ],
        reasons: [
          'Normal rainfall with 1-2 irrigations is ideal for chana',
          'Chana complements wheat in rabi rotation for risk diversification',
          'Lower input cost compared to wheat',
        ],
        expertNeeded: false,
      });
    } else {
      // aboveNormal Rabi
      recs.push({
        crop: 'Wheat (with drainage management)',
        sowingWindow: 'Mid-November to early December',
        waterReq: 'Moderate — reduce irrigation frequency with above-normal rainfall',
        soilDrainage: 'Critical: ensure field drainage to prevent waterlogging. Heavy clay soils need raised beds.',
        seedSelection: 'Waterlogging-tolerant varieties: PBW 5909, HD 3171',
        riskReduction: [
          'Ensure field drainage to prevent waterlogging in heavy rain',
          'Reduce irrigation frequency based on soil moisture monitoring',
          'Monitor for fungal diseases (rust, blight) in humid conditions',
          'Apply fungicide prophylactically if disease pressure is high',
        ],
        reasons: [
          'Above-normal rabi rainfall can benefit wheat by reducing irrigation needs',
          'Risk of waterlogging and fungal disease increases — drainage is critical',
          'Wheat can perform well with proper drainage management',
        ],
        expertNeeded: true,
      });
    }
  } else if (season === 'Zaid' || season === 'Summer') {
    if (rainfallCondition === 'belowNormal') {
      recs.push({
        crop: 'Maize or Fodder crops',
        sowingWindow: 'March to April',
        waterReq: 'Moderate — requires irrigation in Zaid season',
        soilDrainage: 'Well-drained soil with irrigation facility',
        seedSelection: 'Short-duration maize: NK 30. Fodder: MP Chari, SS 777',
        riskReduction: [
          'Below-normal rainfall in Zaid requires reliable irrigation',
          'Choose short-duration varieties to minimize exposure',
          'Apply mulching to reduce water loss',
        ],
        reasons: [
          'Zaid/summer crops depend on irrigation — below-normal rainfall increases water cost',
          'Short-duration maize and fodder crops minimize risk',
          'Consider water availability before sowing summer crops',
        ],
        expertNeeded: true,
      });
    } else {
      recs.push({
        crop: 'Vegetables (Tomato, Okra, Cucumber)',
        sowingWindow: 'February to April',
        waterReq: 'Moderate — 2-3 irrigations per week depending on soil',
        soilDrainage: 'Well-drained soil with good organic matter',
        seedSelection: 'Tomato: Pusa Ruby. Okra: Arka Anamika. Cucumber: Pusa Sanyog',
        riskReduction: [
          'Use drip irrigation for water efficiency',
          'Mulch to conserve moisture and reduce weed growth',
          'Monitor for pests in warm summer conditions',
        ],
        reasons: [
          'Summer vegetables have good market demand and returns',
          'Normal or above-normal rainfall reduces irrigation cost',
          'Short-duration crop cycle allows flexible planting',
        ],
        expertNeeded: false,
      });
    }
  } else {
    // Winter
    recs.push({
      crop: 'Wheat or Chana',
      sowingWindow: 'November to December',
      waterReq: 'Wheat: moderate. Chana: low.',
      soilDrainage: 'Well-drained soils.',
      seedSelection: 'Wheat: HI 1544. Chana: JG 11.',
      riskReduction: [
        'Select crop based on irrigation availability and market demand',
        'Monitor weather forecasts for frost damage',
      ],
      reasons: [
        'Winter season in Maharashtra supports both wheat and chana',
        'Crop selection depends on water availability and market price',
      ],
      expertNeeded: false,
    });
  }

  return recs;
}

export function RainfallAdvisor({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [district, setDistrict] = useState<string>('');
  const [season, setSeason] = useState<Season>('Kharif');
  const [crop, setCrop] = useState<string>('');
  const [soilType, setSoilType] = useState<SoilType | ''>('');
  const [irrigation, setIrrigation] = useState<boolean>(false);
  const [rainfallReceived, setRainfallReceived] = useState<string>('');
  const [forecastRainfall, setForecastRainfall] = useState<string>('');
  const [rainfallCondition, setRainfallCondition] = useState<RainfallCondition>('normal');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!season || !soilType) return;
    const input: AdvisoryInput = {
      district, season, crop, soilType, irrigation,
      rainfallReceived, forecastRainfall, rainfallCondition,
    };
    setRecommendations(generateRecommendations(input));
    setGenerated(true);
  };

  const seasons: Season[] = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter'];

  return (
    <div>
      <PageHeader
        title={t('rainfall.title')}
        subtitle={t('rainfall.subtitle')}
        icon={<CloudRain className="w-6 h-6" />}
        onBack={onBack}
      />

      <div className="card p-5 animate-fade-in space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('rainfall.district')}</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Buldhana, Akola"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('rainfall.season')}</label>
            <select className="input" value={season} onChange={(e) => setSeason(e.target.value as Season)}>
              {seasons.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('rainfall.crop')}</label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              placeholder="e.g. Cotton, Soybean"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('rainfall.soilType')}</label>
            <select className="input" value={soilType} onChange={(e) => setSoilType(e.target.value as SoilType)}>
              <option value="">{t('common.selectSoilType')}</option>
              {SOIL_TYPES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('rainfall.irrigation')}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIrrigation(true)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  irrigation ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'
                }`}
              >
                {t('common.yes')}
              </button>
              <button
                onClick={() => setIrrigation(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  !irrigation ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-700'
                }`}
              >
                {t('common.no')}
              </button>
            </div>
          </div>
          <div>
            <label className="label">{t('rainfall.selectRainfall')}</label>
            <div className="flex flex-wrap gap-2">
              {(['belowNormal', 'normal', 'aboveNormal'] as RainfallCondition[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setRainfallCondition(c)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    rainfallCondition === c
                      ? 'bg-primary-600 text-white'
                      : 'bg-primary-50 text-primary-700'
                  }`}
                >
                  {t(`rainfall.${c}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('rainfall.rainfallReceived')}</label>
            <input
              type="number"
              value={rainfallReceived}
              onChange={(e) => setRainfallReceived(e.target.value)}
              placeholder="e.g. 450"
              className="input"
            />
          </div>
          <div>
            <label className="label">{t('rainfall.forecastRainfall')}</label>
            <input
              type="number"
              value={forecastRainfall}
              onChange={(e) => setForecastRainfall(e.target.value)}
              placeholder="e.g. 300"
              className="input"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!season || !soilType}
          className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('rainfall.getAdvice')}
        </button>
      </div>

      {generated && recommendations.length > 0 && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <h3 className="font-semibold text-primary-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary-600" />
            {t('rainfall.recommendations')}
          </h3>

          {recommendations.map((rec, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-primary-900">{rec.crop}</h4>
                {rec.expertNeeded && (
                  <span className="badge bg-accent-100 text-accent-700">
                    <AlertTriangle className="w-3 h-3" />
                    {t('rainfall.expertNeeded')}
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <InfoBox icon={<Calendar className="w-4 h-4" />} label={t('rainfall.sowingWindow')} value={rec.sowingWindow} />
                <InfoBox icon={<Droplets className="w-4 h-4" />} label={t('rainfall.waterReq')} value={rec.waterReq} />
                <InfoBox icon={<MapPin className="w-4 h-4" />} label={t('rainfall.soilDrainage')} value={rec.soilDrainage} />
                <InfoBox icon={<Sprout className="w-4 h-4" />} label={t('rainfall.seedSelection')} value={rec.seedSelection} />
              </div>

              <div className="mb-4">
                <h5 className="text-xs font-semibold text-primary-500 uppercase mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t('rainfall.riskReduction')}
                </h5>
                <div className="space-y-1.5">
                  {rec.riskReduction.map((r, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-primary-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-3">
                <h5 className="text-xs font-semibold text-primary-500 uppercase mb-2 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  {t('rainfall.reasons')}
                </h5>
                <div className="space-y-1.5">
                  {rec.reasons.map((reason, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-primary-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-accent-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-accent-700">{t('rainfall.disclaimer')}</p>
              <p className="text-xs text-accent-600 mt-1">{t('rainfall.dataSource')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-primary-50/50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1 text-primary-500">
        {icon}
        <span className="text-xs font-semibold uppercase">{label}</span>
      </div>
      <p className="text-sm text-primary-700">{value}</p>
    </div>
  );
}
