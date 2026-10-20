import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n, LANGUAGES, type Language } from '@/lib/i18n';

export function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const handleSelect = (code: Language) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-50 transition-all active:scale-[0.98]"
        aria-label={t('lang.selectLanguage')}
      >
        <Globe className="w-5 h-5 text-primary-500" />
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-primary-100 py-1 min-w-[160px] z-50 animate-fade-in">
          <div className="px-3 py-1.5 text-xs font-semibold text-primary-400 border-b border-primary-50">
            {t('lang.selectLanguage')}
          </div>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                lang === l.code ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-primary-700 hover:bg-primary-50'
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.nativeLabel}</span>
              <span className="text-xs text-primary-400 ml-auto">{l.label}</span>
              {lang === l.code && <Check className="w-4 h-4 text-primary-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
