import { useState, useMemo } from 'react';
import { Landmark, ShieldCheck, ExternalLink, FileText, CheckCircle2, Calendar, FileCheck, Briefcase, Search } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useI18n } from '@/lib/i18n';

interface Scheme {
  id: string;
  name: string;
  category: 'insurance' | 'irrigation' | 'machinery' | 'seeds' | 'horticulture' | 'financial' | 'business';
  benefits: string;
  eligibility: string;
  documents: string[];
  applicationProcess: string;
  deadline: string;
  applyUrl: string;
  verified: boolean;
  state: 'Central' | 'Maharashtra' | 'Both';
  status: 'open' | 'closed' | 'unknown';
}

const SCHEMES: Scheme[] = [
  {
    id: 'pmkisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'financial',
    benefits: 'Income support of ₹6,000 per year in three instalments to eligible farmer families.',
    eligibility: 'All landholding farmer families with cultivable land, subject to exclusion criteria (income tax payers, institutional landholders, government employees above certain grade).',
    documents: ['Aadhaar card', 'Land ownership documents (7/12 extract)', 'Bank account details', 'Mobile number'],
    applicationProcess: 'Register at the PM-KISAN portal or visit the nearest Common Service Centre (CSC). New farmers can apply through the portal; existing beneficiaries can check status and download KCC form.',
    deadline: 'Open throughout the year (instalments released periodically)',
    applyUrl: 'https://pmkisan.gov.in/',
    verified: true,
    state: 'Central',
    status: 'open',
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'insurance',
    benefits: 'Crop insurance coverage against natural calamities, pests, and diseases. Farmers pay 1.5%-2% of sum insured for Kharif/Rabi crops.',
    eligibility: 'All farmers (loanee and non-loanee) growing notified crops in notified areas. Loanee farmers are enrolled compulsorily; non-loanee voluntary.',
    documents: ['Aadhaar card', 'Land documents (7/12)', 'Bank account details', 'Loan account number (if loanee)', 'Sowing certificate'],
    applicationProcess: 'Contact your bank (for loanee farmers) or register at the PMFBY portal or CSC centre. Application window opens before each crop season.',
    deadline: 'Before sowing season (Kharif: June-July, Rabi: October-November). Check state notifications.',
    applyUrl: 'https://pmfby.gov.in/',
    verified: true,
    state: 'Central',
    status: 'open',
  },
  {
    id: 'pmksym',
    name: 'Pradhan Mantri Kisan Maan Dhan Yojana (PMKMY)',
    category: 'financial',
    benefits: 'Monthly pension of ₹3,000 after 60 years of age for small and marginal farmers. Both farmer and government contribute equally.',
    eligibility: 'Small and marginal farmers (holding up to 2 hectares), aged 18-40 years. Should not be receiving any other government pension.',
    documents: ['Aadhaar card', 'Land documents proving small/marginal farmer status', 'Bank account details', 'Age proof'],
    applicationProcess: 'Register at the nearest CSC or through the PMKMY portal. Monthly contribution is auto-debited from bank account.',
    deadline: 'Open throughout the year',
    applyUrl: 'https://pmkmy.gov.in/',
    verified: true,
    state: 'Central',
    status: 'open',
  },
  {
    id: 'pmkky',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    category: 'irrigation',
    benefits: 'Financial assistance for micro irrigation (drip/sprinkler), watershed development, and rainwater harvesting. Up to 55% subsidy for micro irrigation.',
    eligibility: 'All farmers with cultivable land. Priority to small and marginal farmers and water-stressed areas.',
    documents: ['Aadhaar card', 'Land documents (7/12)', 'Bank account details', 'Project estimate from approved agency'],
    applicationProcess: 'Apply through the state agriculture department or District Agriculture Office. Contact local agriculture officer for project approval.',
    deadline: 'Contact local agriculture office for seasonal application windows',
    applyUrl: 'https://pmkky.gov.in/',
    verified: true,
    state: 'Central',
    status: 'unknown',
  },
  {
    id: 'smam',
    name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    category: 'machinery',
    benefits: 'Subsidy of 40-50% on purchase of farm machinery and equipment (tractors, power tillers, harvesters, etc.) through CHCs and individual farmers.',
    eligibility: 'Individual farmers, farmer groups, FPOs, and Custom Hiring Centres. Subsidy rates vary by category and farmer type.',
    documents: ['Aadhaar card', 'Land documents', 'Bank account details', 'Quotation from approved manufacturer', 'CHC registration (if applicable)'],
    applicationProcess: 'Apply through the state agriculture department portal or visit the District Agriculture Office with the machinery quotation.',
    deadline: 'Applications accepted during notified periods; contact District Agriculture Office',
    applyUrl: 'https://farmmachinery.gov.in/',
    verified: true,
    state: 'Central',
    status: 'unknown',
  },
  {
    id: 'maha-dbtcrop',
    name: 'MahaDBT — Crop Insurance Subsidy (Maharashtra)',
    category: 'insurance',
    benefits: 'Additional state subsidy on crop insurance premiums for Maharashtra farmers enrolled in PMFBY.',
    eligibility: 'Maharashtra farmers with cultivable land enrolled in PMFBY. Check district-wise notified crops.',
    documents: ['Aadhaar card', '7/12 extract', 'Bank account details', 'PMFBY enrollment proof'],
    applicationProcess: 'Apply through the MahaDBT farmer portal with your PMFBY enrollment details. Bank verification required.',
    deadline: 'Aligned with crop insurance enrollment windows',
    applyUrl: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin',
    verified: true,
    state: 'Maharashtra',
    status: 'open',
  },
  {
    id: 'mahadbtt',
    name: 'MahaDBT — Agriculture Machinery Subsidy (Maharashtra)',
    category: 'machinery',
    benefits: 'State subsidy on farm machinery and equipment for Maharashtra farmers, in addition to central SMAM subsidy.',
    eligibility: 'Maharashtra farmers with valid 7/12 land records. Small and marginal farmers get higher subsidy rates.',
    documents: ['Aadhaar card', '7/12 extract', 'Bank account details', 'Caste/income certificate (if applicable)', 'Machinery quotation'],
    applicationProcess: 'Register on the MahaDBT portal, select the agriculture machinery scheme, and submit the application online with documents.',
    deadline: 'Applications open periodically; check MahaDBT portal for notifications',
    applyUrl: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin',
    verified: true,
    state: 'Maharashtra',
    status: 'unknown',
  },
  {
    id: 'seedsubsidy',
    name: 'Seed Subsidy Scheme (Maharashtra)',
    category: 'seeds',
    benefits: 'Subsidized certified seeds for major crops. Up to 50-75% discount on certified seeds for small and marginal farmers.',
    eligibility: 'Maharashtra farmers with cultivable land. Priority to small and marginal farmers for subsidized seeds.',
    documents: ['Aadhaar card', '7/12 extract', 'Bank account details', 'Seed purchase receipt from authorized dealer'],
    applicationProcess: 'Purchase certified seeds from authorized seed dealers and apply for subsidy through MahaDBT portal or District Agriculture Office.',
    deadline: 'Before sowing season (Kharif: May-June, Rabi: September-October)',
    applyUrl: 'https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin',
    verified: true,
    state: 'Maharashtra',
    status: 'unknown',
  },
  {
    id: 'nhm',
    name: 'National Horticulture Mission (NHM)',
    category: 'horticulture',
    benefits: 'Financial assistance for establishing orchards, planting materials, drip irrigation for horticulture, and post-harvest infrastructure.',
    eligibility: 'Farmers, farmer groups, and organizations undertaking horticulture activities. Subsidy varies by activity and area.',
    documents: ['Aadhaar card', 'Land documents', 'Bank account details', 'Project report', 'Nursery quotation (if applicable)'],
    applicationProcess: 'Apply through the state horticulture department or District Horticulture Office with project details.',
    deadline: 'Contact local horticulture office for seasonal application windows',
    applyUrl: 'https://midh.gov.in/',
    verified: true,
    state: 'Central',
    status: 'unknown',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    category: 'financial',
    benefits: 'Access to credit at subsidized interest rates (4% on repayment on time) for crop production, post-harvest, and allied activities. Credit limit based on landholding.',
    eligibility: 'All farmers with cultivable land, including oral lessees and sharecroppers. Also available for animal husbandry and fisheries.',
    documents: ['Aadhaar card', 'Land documents (7/12)', 'Bank account details', 'PAN card', 'Identity proof'],
    applicationProcess: 'Apply at your bank branch where you have your farm account. The bank issues the KCC after verification of land records.',
    deadline: 'Open throughout the year',
    applyUrl: 'https://www.pmkisan.gov.in/Documents/Kcc.pdf',
    verified: true,
    state: 'Central',
    status: 'open',
  },
  {
    id: 'fpo',
    name: 'Formation & Promotion of FPOs',
    category: 'business',
    benefits: 'Financial support up to ₹18 lakh per FPO over 3 years for formation, management, and capacity building. Equity grant up to ₹15 lakh.',
    eligibility: 'Farmer groups with minimum 50-100 farmer members, primarily small and marginal farmers. Must be registered under Companies or Cooperative Act.',
    documents: ['Registration certificate', 'List of member farmers', 'Aadhaar cards of members', 'Bank account details', 'Business plan'],
    applicationProcess: 'Apply through CBBO (Cluster-Based Business Organization) or the SFAC portal. FPOs are formed and promoted by designated agencies.',
    deadline: 'Applications accepted through designated agencies',
    applyUrl: 'https://sfacindia.com/formation-and-promotion-of-fpo',
    verified: true,
    state: 'Central',
    status: 'unknown',
  },
  {
    id: 'acds',
    name: 'Agricultural Credit for Deepening of Seasonal Operations',
    category: 'financial',
    benefits: 'Crop loans up to ₹3 lakh at 7% interest (reduced to 4% with prompt repayment incentive). Subvention available for all farmers.',
    eligibility: 'All farmers with cultivable land. Loan amount based on scale of finance for the crop and area.',
    documents: ['Aadhaar card', '7/12 extract', 'Bank account details', 'Crop sowing certificate', 'Previous loan records (if any)'],
    applicationProcess: 'Apply at your bank branch before sowing season. Bank verifies land records and sanctions crop loan.',
    deadline: 'Before sowing season (Kharif: April-July, Rabi: September-November)',
    applyUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    verified: true,
    state: 'Both',
    status: 'open',
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  insurance: <ShieldCheck className="w-5 h-5" />,
  irrigation: <Landmark className="w-5 h-5" />,
  machinery: <Briefcase className="w-5 h-5" />,
  seeds: <FileText className="w-5 h-5" />,
  horticulture: <Landmark className="w-5 h-5" />,
  financial: <Landmark className="w-5 h-5" />,
  business: <Briefcase className="w-5 h-5" />,
};

export function FarmerSchemes({ onBack }: { onBack: () => void }) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t('schemes.category.all') },
    { id: 'insurance', label: t('schemes.category.insurance') },
    { id: 'irrigation', label: t('schemes.category.irrigation') },
    { id: 'machinery', label: t('schemes.category.machinery') },
    { id: 'seeds', label: t('schemes.category.seeds') },
    { id: 'horticulture', label: t('schemes.category.horticulture') },
    { id: 'financial', label: t('schemes.category.financial') },
    { id: 'business', label: t('schemes.category.business') },
  ];

  const filteredSchemes = useMemo(() => {
    return SCHEMES.filter((s) => {
      const matchCategory = activeCategory === 'all' || s.category === activeCategory;
      const matchSearch = !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.benefits.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div>
      <PageHeader
        title={t('schemes.title')}
        subtitle={t('schemes.subtitle')}
        icon={<Landmark className="w-6 h-6" />}
        onBack={onBack}
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white border border-primary-100 text-primary-600 hover:bg-primary-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="card p-4 mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-primary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search schemes..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-primary-800"
          />
        </div>
      </div>

      {filteredSchemes.length === 0 && (
        <div className="card p-8 text-center text-primary-500 text-sm">
          {t('schemes.noResults')}
        </div>
      )}

      <div className="space-y-4 animate-fade-in">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="card p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                  {CATEGORY_ICONS[scheme.category]}
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 leading-tight">{scheme.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block text-xs font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-md">
                      {scheme.state}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                      scheme.status === 'open' ? 'bg-success-50 text-success-700'
                      : scheme.status === 'closed' ? 'bg-error-50 text-error-700'
                      : 'bg-accent-50 text-accent-700'
                    }`}>
                      {scheme.status === 'open' ? t('schemes.statusOpen')
                        : scheme.status === 'closed' ? t('schemes.statusClosed')
                        : t('schemes.statusUnknown')}
                    </span>
                  </div>
                </div>
              </div>
              {scheme.verified && (
                <span className="badge bg-success-100 text-success-700 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('schemes.verified')}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <InfoRow label={t('schemes.benefits')} value={scheme.benefits} />
              <InfoRow label={t('schemes.eligibility')} value={scheme.eligibility} />

              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase mb-1">{t('schemes.documents')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {scheme.documents.map((doc, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-lg">
                      <FileCheck className="w-3 h-3" />
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

              <InfoRow label={t('schemes.applicationProcess')} value={scheme.applicationProcess} />

              <div className="flex items-center gap-2 text-sm text-primary-600">
                <Calendar className="w-4 h-4 text-primary-400 shrink-0" />
                <span className="font-medium text-primary-500">{t('schemes.deadline')}:</span>
                <span>{scheme.deadline}</span>
              </div>

              <a
                href={scheme.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-sm mt-2"
              >
                <ExternalLink className="w-4 h-4" />
                {t('schemes.applyLink')}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://mahadbt.maharashtra.gov.in/Farmer/RegistrationLogin/RegistrationLogin"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-5 flex items-center gap-3 hover:border-primary-300 transition-colors"
          >
            <Landmark className="w-8 h-8 text-primary-600" />
            <div>
              <p className="font-semibold text-primary-900">{t('schemes.mahaDBT')}</p>
              <p className="text-xs text-primary-500">mahadbt.maharashtra.gov.in</p>
            </div>
            <ExternalLink className="w-4 h-4 text-primary-400 ml-auto" />
          </a>
          <a
            href="https://pmkisan.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="card p-5 flex items-center gap-3 hover:border-primary-300 transition-colors"
          >
            <Landmark className="w-8 h-8 text-primary-600" />
            <div>
              <p className="font-semibold text-primary-900">{t('schemes.pmKisan')}</p>
              <p className="text-xs text-primary-500">pmkisan.gov.in</p>
            </div>
            <ExternalLink className="w-4 h-4 text-primary-400 ml-auto" />
          </a>
        </div>

        <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-accent-600 mt-0.5 shrink-0" />
          <p className="text-sm text-accent-700">{t('schemes.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-primary-500 uppercase mb-1">{label}</p>
      <p className="text-sm text-primary-700">{value}</p>
    </div>
  );
}
