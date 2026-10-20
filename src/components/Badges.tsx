import type { RiskLevel } from '@/types';
import { useI18n } from '@/lib/i18n';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { t } = useI18n();
  const styles: Record<RiskLevel, string> = {
    Low: 'bg-success-100 text-success-700',
    Medium: 'bg-warning-100 text-warning-700',
    High: 'bg-error-100 text-error-700',
  };
  const dots: Record<RiskLevel, string> = {
    Low: 'bg-success-500',
    Medium: 'bg-warning-500',
    High: 'bg-error-500',
  };
  const label = level === 'Low' ? t('common.lowRisk') : level === 'Medium' ? t('common.mediumRisk') : t('common.highRisk');
  return (
    <span className={`badge ${styles[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[level]}`} />
      {label}
    </span>
  );
}

export function DifficultyBadge({ level }: { level: 'Easy' | 'Medium' | 'High' }) {
  const { t } = useI18n();
  const styles = {
    Easy: 'bg-success-100 text-success-700',
    Medium: 'bg-warning-100 text-warning-700',
    High: 'bg-error-100 text-error-700',
  };
  const label = level === 'Easy' ? t('common.easy') : level === 'Medium' ? t('common.medium') : t('common.high');
  return <span className={`badge ${styles[level]}`}>{label}</span>;
}

export function DemoBadge({ text }: { text?: string }) {
  const { t } = useI18n();
  const label = text ?? t('common.demoData');
  return (
    <span className="badge bg-accent-100 text-accent-700">
      <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
      {label}
    </span>
  );
}
