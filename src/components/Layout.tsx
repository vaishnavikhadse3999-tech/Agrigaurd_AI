import { useState } from 'react';
import { Leaf, Menu, X } from 'lucide-react';
import { NAV_ITEMS, MOBILE_NAV } from './navConfig';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from '@/lib/i18n';
import type { PageKey } from '@/types';

interface LayoutProps {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  farmName: string | null;
  children: React.ReactNode;
  onShowTools: () => void;
}

const NAV_LABEL_KEYS: Record<PageKey, string> = {
  'dashboard': 'nav.home',
  'my-farm': 'nav.myFarm',
  'talk': 'nav.talk',
  'crop-advisor': 'nav.cropAdvisor',
  'crop-doctor': 'nav.cropDoctor',
  'weather': 'nav.weather',
  'water': 'nav.water',
  'market': 'nav.market',
  'mandi-prices': 'nav.mandiPrices',
  'schemes': 'nav.schemes',
  'business-planner': 'nav.businessPlanner',
  'rainfall-advisor': 'nav.rainfallAdvisor',
  'disease-alert': 'nav.diseaseAlert',
  'organic': 'nav.organic',
  'planner': 'nav.planner',
  'sell-store': 'nav.sellStore',
  'budget': 'nav.budget',
  'farmer-questions': 'nav.farmerQuestions',
  'intelligence': 'nav.intelligence',
  'tools': 'nav.tools',
};

export function Layout({ current, onNavigate, farmName, children, onShowTools }: LayoutProps) {
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageKey) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleMobileNav = (key: PageKey) => {
    if (key === 'tools') {
      onShowTools();
    } else {
      onNavigate(key);
    }
  };

  const navLabel = (key: PageKey) => t(NAV_LABEL_KEYS[key] ?? `nav.${key}`);

  return (
    <div className="min-h-screen bg-primary-50/40">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-primary-100 flex-col z-30">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-primary-100">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-primary-900 leading-tight">{t('app.name')}</h1>
            <p className="text-[11px] text-primary-500">{t('app.tagline')}</p>
          </div>
        </div>

        <div className="px-3 pt-3 pb-1">
          <LanguageSelector />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-primary-700 hover:bg-primary-50'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{navLabel(item.key)}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-primary-100">
          {farmName && (
            <div className="px-1">
              <p className="text-[11px] text-primary-500">{t('app.signedInAs')}</p>
              <p className="text-sm font-semibold text-primary-800 truncate">{farmName}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 bg-white border-b border-primary-100 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Leaf className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-primary-900">{t('app.name')}</h1>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-ghost p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-primary-100 shadow-lg animate-fade-in max-h-[70vh] overflow-y-auto">
            <nav className="p-3 grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = current === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      active ? 'bg-primary-600 text-white' : 'text-primary-700 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{navLabel(item.key)}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="lg:ml-64 pb-20 lg:pb-8 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary-100 z-30">
        <div className="flex justify-around">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleMobileNav(item.key)}
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 flex-1 transition-colors ${
                  active ? 'text-primary-600' : 'text-primary-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{navLabel(item.key)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
