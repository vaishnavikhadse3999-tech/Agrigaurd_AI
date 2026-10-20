import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle, Send, Sparkles, RotateCcw, User, Leaf,
  Droplets, CloudSun, AlertTriangle, TrendingUp, Sprout, CalendarDays,
  MapPin, Ruler, Layers, Shield, CheckCircle2, CloudRain, Sun,
} from 'lucide-react';
import type { FarmProfile, PageKey, SoilType, WaterAvailability, Season, RiskLevel } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { RiskBadge, DemoBadge } from '@/components/Badges';
import { ProgressBar } from '@/components/Charts';
import { saveFarm } from '@/lib/storage';
import { calculateRisk, generateRecommendations } from '@/lib/intelligence';
import { DEMO_WEATHER, MARKET_DATA, DISEASE_DATABASE } from '@/lib/data';

interface TalkToAgriGuardProps {
  farm: FarmProfile | null;
  onSave: (farm: FarmProfile) => void;
  onBack: () => void;
  onNavigate: (page: PageKey) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'farmer';
  text: string;
}

interface CollectedAnswers {
  farmerName: string;
  location: string;
  farmSize: string;
  soilType: string;
  currentCrop: string;
  season: string;
  waterAvailability: string;
  cropProblem: string;
  mainConcern: string;
}

const EMPTY_ANSWERS: CollectedAnswers = {
  farmerName: '', location: '', farmSize: '', soilType: '',
  currentCrop: '', season: '', waterAvailability: '', cropProblem: '', mainConcern: '',
};

const QUESTIONS = [
  { key: 'farmerName', prompt: (a: CollectedAnswers) => `Hello! 👋 Welcome to AgriGuard AI. I will ask you a few simple questions to understand your farm and give you better advice.\n\nWhat is your name?` },
  { key: 'location', prompt: (a: CollectedAnswers) => `Nice to meet you, ${a.farmerName}! 🌱\n\nWhich village or city is your farm located in?` },
  { key: 'farmSize', prompt: (a: CollectedAnswers) => `Great! How many acres is your farm?` },
  { key: 'soilType', prompt: (a: CollectedAnswers) => `Got it. What type of soil do you have?\n\nFor example: Black Soil, Red Soil, Sandy Soil, Loamy Soil, or Clay Soil.` },
  { key: 'currentCrop', prompt: (a: CollectedAnswers) => `Thanks! Which crop are you currently growing or planning to grow?` },
  { key: 'season', prompt: (a: CollectedAnswers) => `Good. Which season is it right now?\n\nKharif, Rabi, Zaid, Summer, or Winter?` },
  { key: 'waterAvailability', prompt: (a: CollectedAnswers) => `How is your water availability?\n\nLow, Medium, or High?` },
  { key: 'cropProblem', prompt: (a: CollectedAnswers) => `Are you facing any crop problem right now?\n\nIf yes, describe it briefly. If not, just type "no".` },
  { key: 'mainConcern', prompt: (a: CollectedAnswers) => `Last question! What is your main concern today?\n\nFor example: water, disease, selling price, fertilizer, or anything else.` },
] as const;

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function normalizeSoil(input: string): SoilType | '' {
  const lower = input.toLowerCase().trim();
  if (lower.includes('black')) return 'Black Soil';
  if (lower.includes('red')) return 'Red Soil';
  if (lower.includes('sand')) return 'Sandy Soil';
  if (lower.includes('loam')) return 'Loamy Soil';
  if (lower.includes('clay')) return 'Clay Soil';
  return '';
}

function normalizeWater(input: string): WaterAvailability | '' {
  const lower = input.toLowerCase().trim();
  if (lower.includes('low') || lower.includes('limited') || lower.includes('rain')) return 'Limited';
  if (lower.includes('medium') || lower.includes('moderate')) return 'Moderate';
  if (lower.includes('high') || lower.includes('plenty')) return 'Plenty';
  return '';
}

function normalizeSeason(input: string): Season | '' {
  const lower = input.toLowerCase().trim();
  if (lower.includes('kharif')) return 'Kharif';
  if (lower.includes('rabi')) return 'Rabi';
  if (lower.includes('zaid')) return 'Zaid';
  if (lower.includes('summer')) return 'Summer';
  if (lower.includes('winter')) return 'Winter';
  return '';
}

export function TalkToAgriGuard({ farm, onSave, onBack, onNavigate }: TalkToAgriGuardProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<CollectedAnswers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [phase, setPhase] = useState<'chat' | 'done'>('chat');
  const [hasStarted, setHasStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const farmProfile: FarmProfile | null = phase === 'done' ? {
    farmerName: answers.farmerName,
    location: answers.location,
    farmSize: answers.farmSize,
    soilType: normalizeSoil(answers.soilType),
    currentCrop: answers.currentCrop,
    waterAvailability: normalizeWater(answers.waterAvailability),
    season: normalizeSeason(answers.season),
  } : null;

  const risk = farmProfile ? calculateRisk(farmProfile) : null;
  const recs = farmProfile ? generateRecommendations(farmProfile) : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const startConversation = () => {
    setHasStarted(true);
    setMessages([]);
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setPhase('chat');
    askQuestion(0, EMPTY_ANSWERS);
  };

  const askQuestion = (stepIndex: number, currentAnswers: CollectedAnswers) => {
    setIsThinking(true);
    const q = QUESTIONS[stepIndex];
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      setMessages((m) => [...m, { id: uid(), sender: 'ai', text: q.prompt(currentAnswers) }]);
      setIsThinking(false);
    }, delay);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking || phase !== 'chat') return;

    const userText = input.trim();
    const farmerMsg: ChatMessage = { id: uid(), sender: 'farmer', text: userText };
    setMessages((m) => [...m, farmerMsg]);
    setInput('');

    const currentKey = QUESTIONS[step].key as keyof CollectedAnswers;
    const newAnswers = { ...answers, [currentKey]: userText };
    setAnswers(newAnswers);

    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep < QUESTIONS.length) {
      setIsThinking(true);
      const ackDelay = 500 + Math.random() * 500;
      setTimeout(() => {
        const ack = generateAcknowledgement(currentKey, userText, newAnswers);
        setMessages((m) => [...m, { id: uid(), sender: 'ai', text: ack }]);
        setIsThinking(false);
        setTimeout(() => askQuestion(nextStep, newAnswers), 300);
      }, ackDelay);
    } else {
      setIsThinking(true);
      setTimeout(() => {
        setMessages((m) => [...m, { id: uid(), sender: 'ai', text: 'Thank you! I have understood your farm information. Let me analyze it. 🌾' }]);
        setIsThinking(false);
        setTimeout(() => {
          setPhase('done');
          const profile: FarmProfile = {
            farmerName: newAnswers.farmerName,
            location: newAnswers.location,
            farmSize: newAnswers.farmSize,
            soilType: normalizeSoil(newAnswers.soilType),
            currentCrop: newAnswers.currentCrop,
            waterAvailability: normalizeWater(newAnswers.waterAvailability),
            season: normalizeSeason(newAnswers.season),
          };
          saveFarm(profile);
          onSave(profile);
        }, 1000);
      }, 800);
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setPhase('chat');
    setHasStarted(false);
    setInput('');
    setIsThinking(false);
  };

  const farmHealthScore = risk
    ? risk.overall === 'Low' ? 85 : risk.overall === 'Medium' ? 65 : 40
    : 0;

  return (
    <div>
      <PageHeader
        title="Talk to AgriGuard AI"
        subtitle="Chat with AgriGuard AI to get personalized farm advice"
        icon={<MessageCircle className="w-6 h-6" />}
        onBack={onBack}
        right={<DemoBadge />}
      />

      {!hasStarted ? (
        <div className="card p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-primary-900 mb-2">Chat with AgriGuard AI</h3>
          <p className="text-sm text-primary-600 max-w-md mx-auto mb-6">
            AgriGuard AI will ask you a few simple questions one by one, just like talking to a farming expert. After you answer all questions, you will get a personalized farm summary and advice.
          </p>
          <button onClick={startConversation} className="btn-primary">
            <MessageCircle className="w-5 h-5" /> Start Conversation
          </button>
        </div>
      ) : phase === 'chat' ? (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
          {/* Chat messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-4 bg-primary-50/30 rounded-2xl border border-primary-100">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isThinking && (
              <div className="flex items-start gap-2 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-primary-100">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-primary-500 italic">AgriGuard AI is thinking</span>
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSend} className="mt-3 flex gap-2">
            <input
              type="text"
              className="input flex-1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isThinking}
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={!input.trim() || isThinking}>
              <Send className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-primary-400">Question {Math.min(step + 1, QUESTIONS.length)} of {QUESTIONS.length}</span>
            <button onClick={handleRestart} className="btn-ghost text-sm">
              <RotateCcw className="w-4 h-4" /> Start New Conversation
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-slide-up">
          {/* Completion banner */}
          <div className="card p-4 bg-success-50 border-success-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
              <p className="text-sm font-medium text-success-800">
                Conversation complete! Here is your personalized farm analysis.
              </p>
            </div>
          </div>

          {/* Farm Summary */}
          <div>
            <h2 className="section-title">Your Personalized Farm Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <SummaryCard icon={<User className="w-5 h-5" />} label="Farmer Name" value={answers.farmerName} />
              <SummaryCard icon={<MapPin className="w-5 h-5" />} label="Location" value={answers.location} />
              <SummaryCard icon={<Ruler className="w-5 h-5" />} label="Farm Size" value={`${answers.farmSize} acres`} />
              <SummaryCard icon={<Layers className="w-5 h-5" />} label="Soil Type" value={answers.soilType} />
              <SummaryCard icon={<Sprout className="w-5 h-5" />} label="Current Crop" value={answers.currentCrop} />
              <SummaryCard icon={<CalendarDays className="w-5 h-5" />} label="Season" value={answers.season} />
              <SummaryCard icon={<Droplets className="w-5 h-5" />} label="Water Availability" value={answers.waterAvailability} />
              <SummaryCard icon={<AlertTriangle className="w-5 h-5" />} label="Crop Problem" value={answers.cropProblem} />
              <SummaryCard icon={<Shield className="w-5 h-5" />} label="Main Concern" value={answers.mainConcern} />
            </div>
          </div>

          {/* Risk Score */}
          {risk && (
            <div className="card p-5">
              <h3 className="font-semibold text-primary-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary-600" /> Farm Risk Score
              </h3>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-primary-500">Overall Risk Level</p>
                  <RiskBadge level={risk.overall} />
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <RiskPill label="Water" level={risk.water} />
                  <RiskPill label="Crop" level={risk.crop} />
                  <RiskPill label="Weather" level={risk.weather} />
                  <RiskPill label="Market" level={risk.market} />
                </div>
              </div>
              <div>
                <p className="text-sm text-primary-500 mb-1">Farm Health Score: {farmHealthScore}/100</p>
                <ProgressBar
                  value={farmHealthScore}
                  color={risk.overall === 'Low' ? '#10b981' : risk.overall === 'Medium' ? '#f97316' : '#ef4444'}
                  showValue={false}
                />
              </div>
            </div>
          )}

          {/* Today's Advice */}
          <div>
            <h2 className="section-title">Today's AgriGuard Advice</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {recs.map((rec, i) => {
                const Icon = iconMap[rec.icon] ?? Sprout;
                return (
                  <div key={i} className="card p-4 flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-900 text-sm">{rec.title}</h3>
                      <p className="text-sm text-primary-600 mt-0.5 leading-relaxed">{rec.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specific concern advice */}
          {answers.mainConcern && answers.mainConcern.toLowerCase() !== 'no' && (
            <div className="card p-4 bg-accent-50 border-accent-200">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-accent-800 text-sm mb-1">About Your Concern: {answers.mainConcern}</h3>
                  <p className="text-sm text-accent-800 leading-relaxed">
                    {generateConcernAdvice(answers.mainConcern, answers.currentCrop)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button onClick={handleRestart} className="btn-primary">
              <RotateCcw className="w-5 h-5" /> Start New Conversation
            </button>
            <button onClick={() => onNavigate('dashboard')} className="btn-secondary">
              View Dashboard
            </button>
            <button onClick={() => onNavigate('intelligence')} className="btn-ghost">
              <Sparkles className="w-5 h-5" /> Intelligence Engine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAI = message.sender === 'ai';
  return (
    <div className={`flex items-start gap-2 animate-fade-in ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAI ? 'bg-primary-600 text-white' : 'bg-primary-200 text-primary-700'}`}>
        {isAI ? <Leaf className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-line ${isAI ? 'bg-white rounded-tl-sm border border-primary-100 text-primary-800' : 'bg-primary-600 rounded-tr-sm text-white'}`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-primary-500 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-semibold text-primary-900">{value || '—'}</p>
    </div>
  );
}

function RiskPill({ label, level }: { label: string; level: RiskLevel }) {
  const color = level === 'Low' ? 'text-success-600' : level === 'Medium' ? 'text-warning-600' : 'text-error-600';
  return (
    <div className="flex items-center gap-1">
      <span className="text-primary-500">{label}:</span>
      <span className={`font-semibold ${color}`}>{level}</span>
    </div>
  );
}

function generateAcknowledgement(key: string, answer: string, answers: CollectedAnswers): string {
  const ans = answer.toLowerCase().trim();
  switch (key) {
    case 'farmerName':
      return `Nice to meet you, ${answer}! 🌱`;
    case 'location':
      return `Great, ${answer} sounds like a good farming area!`;
    case 'farmSize':
      return `Got it, ${answer} acres. That's helpful to know.`;
    case 'soilType':
      return `Thanks! ${answer} soil noted.`;
    case 'currentCrop':
      return `Good choice with ${answer}. Let me continue.`;
    case 'season':
      return `Understood, ${answer} season.`;
    case 'waterAvailability':
      return `Thanks for sharing your water situation.`;
    case 'cropProblem':
      if (ans === 'no' || ans === 'none' || ans === 'nothing' || ans === 'n/a') {
        return `That's good to hear — no problems right now!`;
      }
      return `I understand. Let me note that: "${answer}".`;
    case 'mainConcern':
      return `Thank you for sharing. I will include advice about that in your report.`;
    default:
      return `Thanks!`;
  }
}

function generateConcernAdvice(concern: string, crop: string): string {
  const lower = concern.toLowerCase();
  if (lower.includes('water') || lower.includes('irrigation')) {
    return 'Based on your water concern, I recommend checking soil moisture before each irrigation. Use drip irrigation if possible to save water, and mulch the soil with dry leaves or straw to keep moisture in. Water early morning or late evening to reduce evaporation.';
  }
  if (lower.includes('disease') || lower.includes('pest') || lower.includes('bug') || lower.includes('insect')) {
    const disease = DISEASE_DATABASE.find((d) => d.crop.toLowerCase() === crop.toLowerCase());
    if (disease) {
      return `For ${crop}, watch out for ${disease.disease}. Symptoms: ${disease.symptoms} Prevention: ${disease.prevention} If you see signs, consult a local agriculture expert before using any treatment.`;
    }
    return `Check your crop regularly for any signs of disease or pests. Remove affected leaves or plants quickly. Use neem oil spray as a natural first option. Always consult a local agriculture expert before using any chemical treatment.`;
  }
  if (lower.includes('price') || lower.includes('sell') || lower.includes('market')) {
    const md = crop ? MARKET_DATA[crop] : null;
    if (md) {
      return `For ${crop}, the current market price is ${md.currentPrice} ${md.unit} and the trend is ${md.trend.toLowerCase()}. Recommendation: ${md.recommendation}. Compare prices at nearby markets before selling to get the best deal.`;
    }
    return 'Check current market prices at your nearest APMC or market yard. Compare prices from 2-3 buyers before selling. Consider storing your crop briefly if prices are falling and you have storage space.';
  }
  if (lower.includes('fertilizer') || lower.includes('nutrient')) {
    return `For fertilizer, apply balanced doses based on your soil type. Use organic compost or vermicompost as a base. Avoid over-fertilizing as it can harm the crop. Test your soil every 1-2 years to know which nutrients are missing.`;
  }
  return 'Based on your concern, I recommend checking the relevant AgriGuard AI tools for detailed advice. You can use the Crop Advisor, Water & Irrigation, AI Crop Doctor, and Market Price tools for specific guidance.';
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CloudRain, Sun, Droplets, Sprout, AlertTriangle, TrendingUp, CloudSun,
};
