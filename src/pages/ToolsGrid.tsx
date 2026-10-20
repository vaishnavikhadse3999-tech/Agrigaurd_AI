import {
  Sprout, Stethoscope, CloudSun, Droplets, TrendingUp,
  AlertTriangle, Leaf, ClipboardList, Scale, ArrowRight, Calculator, HelpCircle, MessageCircle,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import type { PageKey } from '@/types';

interface ToolsGridProps {
  onNavigate: (page: PageKey) => void;
  onBack: () => void;
}

const TOOLS: { key: PageKey; label: string; desc: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { key: 'talk', label: 'Talk to AgriGuard AI', desc: 'Chat with AI to get personalized advice', icon: MessageCircle, color: 'bg-success-100 text-success-700' },
  { key: 'farmer-questions', label: 'Farmer Questions', desc: 'Answer questions to get personalized advice', icon: HelpCircle, color: 'bg-accent-100 text-accent-700' },
  { key: 'crop-advisor', label: 'Crop Advisor', desc: 'Find the best crop for your farm', icon: Sprout, color: 'bg-success-100 text-success-700' },
  { key: 'crop-doctor', label: 'AI Crop Doctor', desc: 'Check crop diseases', icon: Stethoscope, color: 'bg-error-100 text-error-700' },
  { key: 'weather', label: 'Weather', desc: 'Weather and farming advice', icon: CloudSun, color: 'bg-accent-100 text-accent-700' },
  { key: 'water', label: 'Water & Irrigation', desc: 'Check irrigation needs', icon: Droplets, color: 'bg-blue-100 text-blue-700' },
  { key: 'market', label: 'Market Price', desc: 'Check prices and trends', icon: TrendingUp, color: 'bg-primary-100 text-primary-700' },
  { key: 'disease-alert', label: 'Disease Alert', desc: 'Active disease alerts', icon: AlertTriangle, color: 'bg-warning-100 text-warning-700' },
  { key: 'organic', label: 'Organic Farming', desc: 'Natural farming methods', icon: Leaf, color: 'bg-success-100 text-success-700' },
  { key: 'planner', label: 'Farm Work Planner', desc: 'Plan and track tasks', icon: ClipboardList, color: 'bg-primary-100 text-primary-700' },
  { key: 'sell-store', label: 'Sell or Store', desc: 'Decide sell vs store', icon: Scale, color: 'bg-accent-100 text-accent-700' },
  { key: 'budget', label: 'Budget & Profit Planner', desc: 'Calculate farm budget and profit', icon: Calculator, color: 'bg-primary-100 text-primary-700' },
];

export function ToolsGrid({ onNavigate, onBack }: ToolsGridProps) {
  return (
    <div>
      <PageHeader
        title="Farm Tools"
        subtitle="All your farming tools in one place"
        onBack={onBack}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.key}
              onClick={() => onNavigate(tool.key)}
              className="card p-4 flex items-center gap-3 text-left hover:shadow-md hover:border-primary-300 transition-all active:scale-[0.98] group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-900">{tool.label}</h3>
                <p className="text-sm text-primary-500">{tool.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary-300 group-hover:text-primary-600 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
