import { useState } from 'react';
import { Stethoscope, Search, Upload, ImageIcon, AlertTriangle, Shield, Lightbulb, Info } from 'lucide-react';
import type { FarmProfile, PageKey } from '@/types';
import { PageHeader } from '@/components/PageHeader';
import { RiskBadge, DemoBadge } from '@/components/Badges';
import { CROPS, CROP_PROBLEMS, DISEASE_DATABASE } from '@/lib/data';

interface CropDoctorProps {
  farm: FarmProfile | null;
  onBack: () => void;
  onNavigate: (page: PageKey) => void;
}

interface Diagnosis {
  crop: string;
  problem: string;
  risk: 'Low' | 'Medium' | 'High';
  explanation: string;
  treatment: string;
  prevention: string;
  controlMethod: string;
  isViral: boolean;
  vectorNote?: string;
  fromImage: boolean;
}

export function CropDoctor({ onBack }: CropDoctorProps) {
  const [crop, setCrop] = useState('');
  const [problem, setProblem] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [result, setResult] = useState<Diagnosis | null>(null);

  const problems = crop ? CROP_PROBLEMS[crop] ?? [] : [];

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop) return;

    let disease = DISEASE_DATABASE.find((d) => d.crop === crop && d.disease === problem);
    if (!disease && problem) {
      disease = DISEASE_DATABASE.find((d) => d.crop === crop);
    }
    if (!disease) {
      disease = DISEASE_DATABASE.find((d) => d.crop === crop);
    }
    if (!disease) {
      disease = { crop, disease: 'General Stress', riskLevel: 'Medium',
        symptoms: 'General signs of stress like yellowing or wilting.',
        prevention: 'Maintain regular watering and check soil health.',
        treatment: 'Apply balanced fertilizer and ensure proper drainage.',
        explanation: 'No specific disease database entry for this crop.',
        controlMethod: 'Maintain regular watering, check soil health, and apply balanced fertilizer.',
        isViral: false };
    }

    setResult({
      crop: disease.crop,
      problem: disease.disease,
      risk: disease.riskLevel,
      explanation: disease.explanation,
      treatment: disease.treatment,
      prevention: disease.prevention,
      controlMethod: disease.controlMethod,
      isViral: disease.isViral,
      vectorNote: disease.vectorNote,
      fromImage: !!image,
    });
  };

  return (
    <div>
      <PageHeader
        title="AI Crop Doctor"
        subtitle="Check your crop for diseases and problems"
        icon={<Stethoscope className="w-6 h-6" />}
        onBack={onBack}
      />

      <form onSubmit={handleCheck} className="card p-5 space-y-4 animate-fade-in">
        <div>
          <label className="label">Select Crop</label>
          <select className="input" value={crop} onChange={(e) => { setCrop(e.target.value); setProblem(''); setResult(null); }} required>
            <option value="">Select a crop</option>
            {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Select a Common Problem</label>
          <select className="input" value={problem} onChange={(e) => setProblem(e.target.value)} disabled={!crop}>
            <option value="">Choose a problem (optional)</option>
            {problems.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Or Upload a Crop Image</label>
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-primary-200 rounded-xl p-6 cursor-pointer hover:bg-primary-50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              {image ? <ImageIcon className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
            </div>
            <span className="text-sm font-medium text-primary-700">
              {imageName ? imageName : 'Click to upload a crop photo'}
            </span>
            <span className="text-xs text-primary-500">PNG or JPG</span>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          {image && (
            <div className="mt-2 relative">
              <img src={image} alt="Crop preview" className="w-full max-h-48 object-cover rounded-xl" />
              <button type="button" onClick={() => { setImage(null); setImageName(''); }} className="absolute top-2 right-2 bg-white/90 rounded-lg p-1.5 text-primary-700 hover:bg-white">
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={!crop}>
          <Search className="w-5 h-5" /> Check Crop
        </button>
      </form>

      {result && (
        <div className="mt-6 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Diagnosis Result</h2>
            <DemoBadge text="Demo Mode" />
          </div>

          {result.fromImage && (
            <div className="card p-4 bg-accent-50 border-accent-200">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-accent-600 shrink-0 mt-0.5" />
                <p className="text-sm text-accent-800">
                  Image analysis demo mode. For accurate diagnosis, consult a local agriculture expert.
                </p>
              </div>
            </div>
          )}

          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-primary-900 text-lg">{result.problem}</h3>
                <p className="text-sm text-primary-500">{result.crop}</p>
              </div>
              <RiskBadge level={result.risk} />
            </div>

            <div className="space-y-3">
              <div className="bg-primary-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-primary-500 mb-1">RISK LEVEL</p>
                <p className="text-sm text-primary-800">{result.risk} risk detected.</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1">EXPLANATION</p>
                <p className="text-sm text-primary-700 leading-relaxed">{result.explanation}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> RECOMMENDED CONTROL / TREATMENT</p>
                <p className="text-sm text-primary-700 leading-relaxed">{result.controlMethod}</p>
                {result.isViral && result.vectorNote && (
                  <div className="mt-2 bg-accent-50 border border-accent-200 rounded-xl p-3">
                    <p className="text-sm text-accent-800 leading-relaxed">
                      There is no direct cure for the virus after infection. Management focuses on reducing disease spread and controlling the insect vector.
                    </p>
                    <p className="text-sm text-accent-800 leading-relaxed mt-2">
                      <b>Vector control:</b> {result.vectorNote}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> BASIC TREATMENT GUIDANCE</p>
                <p className="text-sm text-primary-700 leading-relaxed">{result.treatment}</p>
                {!result.isViral && (
                  <p className="text-xs text-primary-500 mt-2 italic">
                    Always check local registration, crop suitability, label instructions, and consult an agriculture expert before use.
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-primary-500 mb-1 flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> PREVENTION TIPS</p>
                <p className="text-sm text-primary-700 leading-relaxed">{result.prevention}</p>
              </div>
            </div>
          </div>

          <div className="card p-4 bg-warning-50 border-warning-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-warning-800 font-medium">
                  AI result is only for guidance. Ask a local agriculture expert before using any treatment.
                </p>
                <p className="text-sm text-warning-800 mt-2">
                  Use only products approved for the crop and region. Follow the product label and consult a local agriculture expert for the correct product and dosage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
