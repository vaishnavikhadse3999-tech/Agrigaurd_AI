import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onBack: () => void;
  right?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon, onBack, right }: PageHeaderProps) {
  const { t } = useI18n();
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="btn-ghost -ml-2 mb-1"
          aria-label={t('common.back')}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">{t('common.back')}</span>
        </button>
        {right}
      </div>
      <div className="flex items-center gap-3 mt-2">
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-primary-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-primary-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
