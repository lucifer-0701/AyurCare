import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Button from '../components/ui/Button.jsx';
import { remedyAPI } from '../services/api.js';
import { getSymptomsByDiseaseId } from '../data/symptoms.js';
import toast from 'react-hot-toast';

const STEPS = ['Disease', 'Symptoms', 'Review'];
const SEVERITY_OPTIONS = [
  { value: 'mild',     label: 'Mild',     emoji: '🟡', desc: 'Manageable, day-to-day tasks not severely impacted' },
  { value: 'moderate', label: 'Moderate', emoji: '🟠', desc: 'Noticeably affecting daily activities' },
  { value: 'severe',   label: 'Severe',   emoji: '🔴', desc: 'Significantly impacting quality of life' },
];

export default function SymptomFlow() {
  const location = useLocation();
  const navigate = useNavigate();
  const disease  = location.state?.disease;

  const [step, setStep]                   = useState(2); // steps: 1=disease(done), 2=symptoms, 3=review
  const [selectedSymptoms, setSelected]   = useState([]);
  const [otherSymptoms, setOther]         = useState('');
  const [severity, setSeverity]           = useState('');
  const [duration, setDuration]           = useState(7);
  const [loading, setLoading]             = useState(false);

  if (!disease) {
    navigate('/remedy/disease');
    return null;
  }

  const availableSymptoms = getSymptomsByDiseaseId(disease.id);

  const toggleSymptom = (s) => {
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const canReview = () => selectedSymptoms.length > 0 && severity;

  const handleSubmit = async () => {
    if (!canReview()) return;
    setLoading(true);
    try {
      const response = await remedyAPI.generate({
        disease: disease.name,
        diseaseId: disease.id,
        symptoms: selectedSymptoms,
        otherSymptoms: otherSymptoms.trim() || null,
        severity,
        duration,
      });
      navigate('/remedy/result', {
        state: {
          remedy: response.remedy,
          historyId: response.historyId,
          metadata: { ...response.metadata, disease: disease.name, diseaseIcon: disease.icon },
        },
      });
    } catch (err) {
      toast.error(err.message || 'Failed to generate remedy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <Navbar />

      <main className="page-content page-container pb-8 max-w-3xl">
        {/* Stepper */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const isDone = stepNum < step;
            const isActive = stepNum === step;
            return (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isDone ? 'step-done' : isActive ? 'step-active' : 'step-inactive'
                }`}>
                  {isDone ? '✓' : stepNum}
                </div>
                <span className={`text-sm font-medium ${isActive ? 'text-forest-700' : 'text-beige-400'}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <div className="h-0.5 w-8 bg-beige-200" />}
              </div>
            );
          })}
        </div>

        {/* ── Step 2: Symptoms ─────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="animate-slide-up">
            {/* Disease heading */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{disease.icon}</span>
              <div>
                <h1 className="section-title text-2xl">{disease.name}</h1>
                <p className="text-beige-400 text-sm">Select all symptoms that apply to you</p>
              </div>
            </div>

            {/* Symptoms grid */}
            <div className="glass-card p-6 mb-6">
              <h2 className="font-poppins font-semibold text-forest-800 mb-4">
                Common Symptoms ({selectedSymptoms.length} selected)
              </h2>
              {availableSymptoms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSymptoms.map((symptom) => {
                    const isChecked = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => toggleSymptom(symptom)}
                        className={`symptom-checkbox text-left ${isChecked ? 'checked' : ''}`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                          isChecked ? 'bg-forest-500 border-forest-500' : 'border-beige-300'
                        }`}>
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm ${isChecked ? 'text-forest-700 font-medium' : 'text-forest-600'}`}>
                          {symptom}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-beige-400 text-sm italic">No predefined symptoms — please describe yours below.</p>
              )}
            </div>

            {/* Other symptoms */}
            <div className="glass-card p-6 mb-6">
              <label className="block font-poppins font-semibold text-forest-800 mb-2">
                Other Symptoms <span className="text-beige-400 font-normal text-sm">(optional)</span>
              </label>
              <textarea
                value={otherSymptoms}
                onChange={(e) => setOther(e.target.value)}
                placeholder="Describe any additional symptoms not listed above..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {/* Severity */}
            <div className="glass-card p-6 mb-6">
              <h2 className="font-poppins font-semibold text-forest-800 mb-4">How Severe are Your Symptoms?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SEVERITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSeverity(opt.value)}
                    className={`severity-btn ${opt.value} ${severity === opt.value ? 'active ring-2 ring-offset-1 ' + (opt.value === 'mild' ? 'ring-herb-sage bg-herb-sage text-white' : opt.value === 'moderate' ? 'ring-turmeric-500 bg-turmeric-500 text-white' : 'ring-red-400 bg-red-400 text-white') : ''} text-center`}
                  >
                    <span className="text-2xl block mb-1">{opt.emoji}</span>
                    <span className="block font-bold">{opt.label}</span>
                    <span className="block text-xs mt-1 opacity-80">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-poppins font-semibold text-forest-800">Duration of Illness</h2>
                <span className="bg-forest-100 text-forest-700 font-bold px-4 py-1 rounded-full text-sm">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={90}
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4A7C59 0%, #4A7C59 ${(duration / 90) * 100}%, #EDE8DC ${(duration / 90) * 100}%, #EDE8DC 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-beige-400 mt-1">
                <span>1 day</span>
                <span>3 months</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/remedy/disease')}>
                ← Change Disease
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedSymptoms.length === 0 && !otherSymptoms.trim()) {
                    toast.error('Please select at least one symptom.');
                    return;
                  }
                  if (!severity) { toast.error('Please select severity.'); return; }
                  setStep(3);
                }}
                className="flex-1"
              >
                Review & Generate →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Review ──────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="animate-slide-up">
            <h1 className="section-title text-2xl mb-6">Review Your Information</h1>

            <div className="glass-card p-6 mb-6 space-y-5">
              {/* Disease */}
              <div className="flex items-center gap-4 pb-4 border-b border-beige-200">
                <span className="text-3xl">{disease.icon}</span>
                <div>
                  <p className="text-xs text-beige-400 font-medium uppercase tracking-wider">Condition</p>
                  <p className="font-poppins font-semibold text-forest-800 text-lg">{disease.name}</p>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <p className="text-xs text-beige-400 font-medium uppercase tracking-wider mb-2">Symptoms Selected</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map(s => (
                    <span key={s} className="badge badge-green">{s}</span>
                  ))}
                  {otherSymptoms && (
                    <span className="badge badge-gray italic">{otherSymptoms}</span>
                  )}
                </div>
              </div>

              {/* Severity & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-beige-400 font-medium uppercase tracking-wider mb-1">Severity</p>
                  <p className="font-semibold text-forest-800 capitalize">
                    {SEVERITY_OPTIONS.find(o => o.value === severity)?.emoji} {severity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-beige-400 font-medium uppercase tracking-wider mb-1">Duration</p>
                  <p className="font-semibold text-forest-800">{duration} days</p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-turmeric-50 border border-turmeric-200 rounded-xl p-4 mb-6">
              <p className="text-turmeric-700 text-sm">
                ⚠️ <strong>Disclaimer:</strong> The remedy generated is based on traditional Ayurvedic principles and is for informational purposes only. It is not a substitute for professional medical diagnosis or treatment. Consult a qualified healthcare provider for serious conditions.
              </p>
            </div>

            {severity === 'severe' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-700 text-sm">
                  🚨 <strong>Consult a Doctor:</strong> You've indicated severe symptoms. While we provide traditional Ayurvedic guidance, we strongly recommend seeing a qualified medical professional for severe conditions.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>
                ← Edit Symptoms
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                className="flex-1"
                size="lg"
              >
                {loading ? 'Generating Your Remedy...' : '🌿 Generate Ayurvedic Remedy'}
              </Button>
            </div>

            {loading && (
              <div className="mt-6 text-center animate-pulse-soft">
                <p className="text-forest-600 text-sm">🤖 Our AI is consulting ancient Ayurvedic texts...</p>
                <p className="text-beige-400 text-xs mt-1">This may take 10–30 seconds</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
