import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import Navbar from '../components/Navbar.jsx';
import Button from '../components/ui/Button.jsx';
import { scaleIngredients, shortUnit } from '../utils/scaleIngredients.js';
import { downloadRemedyPDF } from '../utils/pdfExport.js';
import toast from 'react-hot-toast';

export default function RemedyResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile }     = useAuth();
  const { remedy, historyId, metadata } = location.state || {};

  const [treatmentDays, setDays]   = useState(7);
  const [saved, setSaved]           = useState(false);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    if (!remedy) navigate('/remedy/disease');
  }, [remedy, navigate]);

  if (!remedy) return null;

  const scaled = scaleIngredients(remedy.ingredients, treatmentDays);

  const handleSave = async () => {
    if (!user || !historyId) { toast.error('Log in to save remedies.'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('saved_remedies').insert({
        user_id: user.id,
        history_id: historyId,
      });
      if (error?.code === '23505') {
        toast('Already saved to your profile!', { icon: '✅' });
      } else if (error) {
        throw error;
      } else {
        setSaved(true);
        toast.success('Remedy saved to your profile! 🌿');
      }
    } catch {
      toast.error('Could not save remedy. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePDF = () => {
    downloadRemedyPDF({
      remedy,
      disease: metadata?.disease || 'Unknown',
      severity: metadata?.severity || '',
      duration: treatmentDays,
      userName: profile?.name,
    });
    toast.success('PDF downloaded! 📄');
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <Navbar />

      <main className="page-content page-container pb-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{metadata?.diseaseIcon || '🌿'}</span>
              <p className="text-beige-400 text-sm">{metadata?.disease}</p>
            </div>
            <h1 className="section-title text-2xl">Your Ayurvedic Remedy</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePDF}
              className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <button onClick={handleSave} disabled={saving || saved}
              className={`text-sm py-2 px-4 rounded-xl border-2 font-semibold flex items-center gap-2 transition-all ${
                saved
                  ? 'border-turmeric-400 bg-turmeric-50 text-turmeric-600'
                  : 'border-forest-400 text-forest-600 hover:bg-forest-50'
              }`}>
              {saved ? '♡ Saved!' : saving ? '...' : '♡ Save'}
            </button>
          </div>
        </div>

        {/* Remedy Name & Description */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              🌿
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl text-forest-800 mb-1">{remedy.remedyName}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="badge badge-green capitalize">🟢 {metadata?.severity}</span>
                <span className="badge badge-gray">⏱ {metadata?.duration} days illness</span>
                {remedy.consultDoctorFlag && (
                  <span className="badge badge-red">⚠️ Consult Doctor</span>
                )}
              </div>
            </div>
          </div>
          <p className="text-forest-700 text-sm leading-relaxed">{remedy.description}</p>
        </div>

        {/* Consult Doctor Alert */}
        {remedy.consultDoctorFlag && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-slide-up">
            <p className="text-red-700 text-sm font-medium">
              🚨 <strong>Medical Attention Recommended:</strong> Based on your symptoms, we recommend consulting a qualified doctor or Ayurvedic practitioner alongside this remedy.
            </p>
          </div>
        )}

        {/* Duration Slider */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-poppins font-semibold text-forest-800">Treatment Duration</h3>
            <span className="bg-turmeric-100 text-turmeric-700 font-bold px-4 py-1.5 rounded-full text-sm">
              {treatmentDays} {treatmentDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          <input
            type="range" min={1} max={30} value={treatmentDays}
            onChange={(e) => setDays(+e.target.value)}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #D4A017 0%, #D4A017 ${((treatmentDays - 1) / 29) * 100}%, #EDE8DC ${((treatmentDays - 1) / 29) * 100}%, #EDE8DC 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-beige-400 mt-1">
            <span>1 day</span>
            <span>30 days</span>
          </div>
          <p className="text-xs text-forest-600 mt-2 bg-forest-50 rounded-lg px-3 py-2">
            💡 Ingredient quantities below are automatically scaled for <strong>{treatmentDays} days</strong> of treatment.
          </p>
        </div>

        {/* Ingredients Table */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <h3 className="font-poppins font-semibold text-forest-800 mb-5">
            Ingredients
            <span className="ml-2 text-xs text-beige-400 font-normal">({treatmentDays} day{treatmentDays > 1 ? 's' : ''} total)</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-200">
                  <th className="text-left py-2 text-xs font-semibold text-beige-400 uppercase tracking-wider">Herb / Ingredient</th>
                  <th className="text-center py-2 text-xs font-semibold text-beige-400 uppercase tracking-wider">/ Day</th>
                  <th className="text-center py-2 text-xs font-semibold text-beige-400 uppercase tracking-wider">Total</th>
                  <th className="text-left py-2 text-xs font-semibold text-beige-400 uppercase tracking-wider hidden sm:table-cell">Benefits</th>
                </tr>
              </thead>
              <tbody>
                {scaled.map((ing, i) => (
                  <tr key={i} className={`border-b border-beige-100 ${i % 2 === 0 ? 'bg-forest-50/30' : ''}`}>
                    <td className="py-3 pr-4">
                      <p className="font-semibold text-forest-800">{ing.name}</p>
                    </td>
                    <td className="py-3 text-center text-forest-700 font-medium whitespace-nowrap">
                      {ing.quantity_per_day} <span className="text-beige-400 text-xs">{shortUnit(ing.unit)}</span>
                    </td>
                    <td className="py-3 text-center font-bold text-turmeric-600 whitespace-nowrap">
                      {ing.quantity_scaled} <span className="text-beige-400 text-xs font-normal">{shortUnit(ing.unit)}</span>
                    </td>
                    <td className="py-3 text-beige-400 text-xs leading-snug hidden sm:table-cell">{ing.benefits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preparation Steps */}
        {remedy.preparationSteps?.length > 0 && (
          <div className="glass-card p-6 mb-6 animate-slide-up">
            <h3 className="font-poppins font-semibold text-forest-800 mb-4">🧑‍🍳 Preparation Method</h3>
            {remedy.timeRequired && (
              <p className="text-xs text-beige-400 mb-4">⏱ Time required: <strong className="text-forest-700">{remedy.timeRequired}</strong></p>
            )}
            <ol className="space-y-3">
              {remedy.preparationSteps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 bg-forest-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-forest-700 text-sm leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Dosage Schedule */}
        {remedy.dosageSchedule?.length > 0 && (
          <div className="glass-card p-6 mb-6 animate-slide-up">
            <h3 className="font-poppins font-semibold text-forest-800 mb-4">🕐 Dosage Schedule</h3>
            <div className="space-y-3">
              {remedy.dosageSchedule.map((d, i) => (
                <div key={i} className="flex items-start gap-4 p-3 bg-beige-50 rounded-xl">
                  <div className="bg-turmeric-100 text-turmeric-700 px-3 py-1 rounded-lg text-sm font-semibold whitespace-nowrap">
                    {d.time}
                  </div>
                  <div>
                    <p className="font-semibold text-forest-800 text-sm">{d.amount}</p>
                    <p className="text-beige-400 text-xs mt-0.5">{d.instructions}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storage & Shelf Life */}
        {(remedy.storageInstructions || remedy.shelfLife) && (
          <div className="glass-card p-6 mb-6 animate-slide-up">
            <h3 className="font-poppins font-semibold text-forest-800 mb-3">🫙 Storage & Shelf Life</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {remedy.storageInstructions && (
                <div>
                  <p className="text-xs text-beige-400 uppercase tracking-wider mb-1">Storage</p>
                  <p className="text-forest-700 text-sm">{remedy.storageInstructions}</p>
                </div>
              )}
              {remedy.shelfLife && (
                <div>
                  <p className="text-xs text-beige-400 uppercase tracking-wider mb-1">Shelf Life</p>
                  <p className="text-forest-700 text-sm">{remedy.shelfLife}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diet Notes */}
        {remedy.dietaryNotes && (
          <div className="glass-card p-6 mb-6 animate-slide-up">
            <h3 className="font-poppins font-semibold text-forest-800 mb-4">🥗 Dietary Guidelines</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {remedy.dietaryNotes.dos?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-forest-600 uppercase tracking-wider mb-2">✅ Do's</p>
                  <ul className="space-y-1.5">
                    {remedy.dietaryNotes.dos.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-forest-700">
                        <span className="text-forest-500 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {remedy.dietaryNotes.donts?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-2">❌ Don'ts</p>
                  <ul className="space-y-1.5">
                    {remedy.dietaryNotes.donts.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-forest-700">
                        <span className="text-red-400 mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle */}
        {remedy.lifestyleRecommendations?.length > 0 && (
          <div className="glass-card p-6 mb-6 animate-slide-up">
            <h3 className="font-poppins font-semibold text-forest-800 mb-3">🧘 Lifestyle Recommendations</h3>
            <ul className="space-y-2">
              {remedy.lifestyleRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-forest-700">
                  <span className="text-turmeric-500">✦</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Warning */}
        {remedy.safetyWarning && (
          <div className="bg-turmeric-50 border border-turmeric-200 rounded-2xl p-5 mb-6 animate-slide-up">
            <h3 className="font-poppins font-semibold text-turmeric-700 mb-2">⚠️ Safety Notice</h3>
            <p className="text-turmeric-700 text-sm leading-relaxed">{remedy.safetyWarning}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-beige-100 rounded-2xl p-5 mb-8 text-xs text-beige-400 leading-relaxed animate-slide-up">
          <strong className="text-beige-400">Disclaimer:</strong> This Ayurvedic remedy is provided for informational and educational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease. Always consult a qualified Ayurvedic practitioner or medical professional before beginning any new health regimen.
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
          <Link to="/remedy/disease" className="btn-outline flex-1 text-center">
            🌿 New Remedy
          </Link>
          <Link to="/history" className="btn-ghost flex-1 text-center border border-beige-200 rounded-xl">
            📜 View History
          </Link>
          <button onClick={handlePDF} className="btn-secondary flex-1">
            📄 Download PDF
          </button>
        </div>
      </main>
    </div>
  );
}
