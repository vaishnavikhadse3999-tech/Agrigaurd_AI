import { useState } from 'react';
import { Leaf, X, Bug, Recycle, Layers, Droplets, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { ORGANIC_TOPICS } from '@/lib/data';

interface OrganicProps {
  onBack: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bug, Recycle, Leaf, Layers, Droplets,
};

export function Organic({ onBack }: OrganicProps) {
  const [selected, setSelected] = useState<typeof ORGANIC_TOPICS[0] | null>(null);

  return (
    <div>
      <PageHeader
        title="Organic Farming"
        subtitle="Natural methods for healthier soil and crops"
        icon={<Leaf className="w-6 h-6" />}
        onBack={onBack}
      />

      <div className="grid sm:grid-cols-2 gap-3 animate-fade-in">
        {ORGANIC_TOPICS.map((topic) => {
          const Icon = iconMap[topic.icon] ?? Leaf;
          return (
            <button
              key={topic.key}
              onClick={() => setSelected(topic)}
              className="card p-5 flex items-center gap-3 text-left hover:shadow-md hover:border-primary-300 transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center text-success-700 shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">{topic.title}</h3>
                <p className="text-sm text-primary-500 line-clamp-1">{topic.what}</p>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" onClick={() => setSelected(null)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[85vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white p-5 border-b border-primary-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-success-100 flex items-center justify-center text-success-700">
                  {(() => { const Icon = iconMap[selected.icon] ?? Leaf; return <Icon className="w-6 h-6" />; })()}
                </div>
                <h2 className="font-bold text-primary-900 text-lg">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-primary-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><Info className="w-3.5 h-3.5" /> WHAT IT IS</p>
                <p className="text-sm text-primary-700 leading-relaxed">{selected.what}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> HOW TO USE IT</p>
                <p className="text-sm text-primary-700 leading-relaxed">{selected.how}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> BENEFITS</p>
                <p className="text-sm text-primary-700 leading-relaxed">{selected.benefits}</p>
              </div>

              <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-warning-700 mb-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> PRECAUTIONS</p>
                <p className="text-sm text-warning-800 leading-relaxed">{selected.precautions}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
