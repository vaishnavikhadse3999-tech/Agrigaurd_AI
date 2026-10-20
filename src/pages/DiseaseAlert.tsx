import { useState } from 'react';
import { AlertTriangle, X, Shield, Eye, Bug, Leaf } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { RiskBadge } from '@/components/Badges';
import { DISEASE_DATABASE, CROPS } from '@/lib/data';
import type { DiseaseInfo } from '@/types';

interface DiseaseAlertProps {
  onBack: () => void;
}

export function DiseaseAlert({ onBack }: DiseaseAlertProps) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<DiseaseInfo | null>(null);

  const filtered = filter === 'All'
    ? DISEASE_DATABASE
    : DISEASE_DATABASE.filter((d) => d.crop === filter);

  const highCount = filtered.filter((d) => d.riskLevel === 'High').length;
  const mediumCount = filtered.filter((d) => d.riskLevel === 'Medium').length;

  return (
    <div>
      <PageHeader
        title="Disease Alert"
        subtitle="Active disease alerts for common crops"
        icon={<AlertTriangle className="w-6 h-6" />}
        onBack={onBack}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in">
        <button
          onClick={() => setFilter('All')}
          className={`badge shrink-0 ${filter === 'All' ? 'bg-primary-600 text-white' : 'bg-white text-primary-700 border border-primary-200'}`}
        >
          All Crops
        </button>
        {CROPS.filter((c) => DISEASE_DATABASE.some((d) => d.crop === c)).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`badge shrink-0 ${filter === c ? 'bg-primary-600 text-white' : 'bg-white text-primary-700 border border-primary-200'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-3 mt-3">
        <div className="card p-3 flex-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-error-500" />
          <span className="text-sm text-primary-700"><b>{highCount}</b> High Risk</span>
        </div>
        <div className="card p-3 flex-1 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-warning-500" />
          <span className="text-sm text-primary-700"><b>{mediumCount}</b> Medium Risk</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        {filtered.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelected(d)}
            className="card p-4 text-left hover:shadow-md hover:border-primary-300 transition-all active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900">{d.disease}</h3>
                  <p className="text-xs text-primary-500">{d.crop}</p>
                </div>
              </div>
              <RiskBadge level={d.riskLevel} />
            </div>
            <p className="text-sm text-primary-600 line-clamp-2">{d.symptoms}</p>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 border-b border-primary-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700">
                  <Bug className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-primary-900 text-lg">{selected.disease}</h2>
                  <p className="text-sm text-primary-500">{selected.crop}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-600">Risk Level</span>
                <RiskBadge level={selected.riskLevel} />
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> SYMPTOMS</p>
                <p className="text-sm text-primary-700 leading-relaxed">{selected.symptoms}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1">EXPLANATION</p>
                <p className="text-sm text-primary-700 leading-relaxed">{selected.explanation}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> TREATMENT</p>
                <p className="text-sm text-primary-700 leading-relaxed">{selected.treatment}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> PREVENTION</p>
                <p className="text-sm text-primary-700 leading-relaxed">{selected.prevention}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
