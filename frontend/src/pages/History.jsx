import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.js';
import Navbar from '../components/Navbar.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';

const SEVERITY_COLORS = { mild: 'badge-green', moderate: 'badge-amber', severe: 'badge-red' };

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);
  const [filter, setFilter]       = useState('all'); // all | saved

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from('histories')
      .select(`
        id, disease, disease_id, symptoms, severity, duration, created_at, is_bookmarked, remedy,
        saved_remedies(id)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (!error) setHistories(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const toggleBookmark = async (id, current) => {
    const { error } = await supabase
      .from('histories')
      .update({ is_bookmarked: !current })
      .eq('id', id);
    if (!error) {
      setHistories(prev => prev.map(h => h.id === id ? { ...h, is_bookmarked: !current } : h));
      toast.success(current ? 'Bookmark removed' : 'Bookmarked! ⭐');
    }
  };

  const deleteHistory = async (id) => {
    if (!window.confirm('Delete this remedy from your history?')) return;
    const { error } = await supabase.from('histories').delete().eq('id', id);
    if (!error) {
      setHistories(prev => prev.filter(h => h.id !== id));
      toast.success('Remedy removed from history');
    }
  };

  const displayed = filter === 'saved'
    ? histories.filter(h => h.is_bookmarked || h.saved_remedies?.length > 0)
    : histories;

  return (
    <div className="min-h-screen bg-beige-50">
      <Navbar />

      <main className="page-content page-container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="section-title text-3xl mb-1">📜 Remedy History</h1>
            <p className="text-beige-400 text-sm">Your complete Ayurvedic treatment record</p>
          </div>
          <div className="flex gap-2">
            {['all', 'saved'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  filter === f ? 'bg-forest-500 text-white' : 'bg-white border border-beige-200 text-beige-400'
                }`}>
                {f === 'saved' ? '⭐ Saved' : '📋 All'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-beige-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <div className="text-5xl mb-4">{filter === 'saved' ? '⭐' : '🌱'}</div>
            <h3 className="font-poppins font-semibold text-forest-800 text-xl mb-2">
              {filter === 'saved' ? 'No saved remedies yet' : 'No remedy history yet'}
            </h3>
            <p className="text-beige-400 mb-6">
              {filter === 'saved' ? 'Bookmark remedies to access them quickly.' : 'Start your first Ayurvedic remedy session!'}
            </p>
            <Button variant="primary" onClick={() => navigate('/remedy/disease')}>
              🌿 Generate First Remedy
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {displayed.map((h) => (
              <div key={h.id} className="glass-card overflow-hidden">
                {/* Row */}
                <div className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    🌿
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-poppins font-semibold text-forest-800">{h.disease}</h3>
                      <span className={`badge ${SEVERITY_COLORS[h.severity] || 'badge-gray'} capitalize`}>
                        {h.severity}
                      </span>
                      {(h.is_bookmarked || h.saved_remedies?.length > 0) && (
                        <span className="badge badge-amber">⭐ Saved</span>
                      )}
                    </div>
                    {h.remedy?.remedyName && (
                      <p className="text-sm text-forest-600 font-medium">{h.remedy.remedyName}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-beige-400">
                        {new Date(h.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <span className="text-beige-300">•</span>
                      <p className="text-xs text-beige-400">{h.duration} days illness</p>
                      {h.symptoms.length > 0 && (
                        <>
                          <span className="text-beige-300">•</span>
                          <p className="text-xs text-beige-400">{h.symptoms.length} symptoms</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Bookmark */}
                    <button
                      onClick={() => toggleBookmark(h.id, h.is_bookmarked)}
                      className={`p-2 rounded-lg transition-colors ${h.is_bookmarked ? 'text-turmeric-500 bg-turmeric-50' : 'text-beige-400 hover:text-turmeric-500 hover:bg-turmeric-50'}`}
                      title="Bookmark"
                    >
                      {h.is_bookmarked ? '⭐' : '☆'}
                    </button>

                    {/* Expand */}
                    <button
                      onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                      className="p-2 rounded-lg text-beige-400 hover:text-forest-600 hover:bg-forest-50 transition-colors"
                      title="View remedy"
                    >
                      <svg className={`w-4 h-4 transition-transform ${expanded === h.id ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteHistory(h.id)}
                      className="p-2 rounded-lg text-beige-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Remedy Summary */}
                {expanded === h.id && h.remedy && (
                  <div className="border-t border-beige-200 bg-beige-50/50 p-5 animate-slide-up">
                    <p className="font-poppins font-semibold text-forest-800 mb-3">{h.remedy.remedyName}</p>
                    {h.remedy.description && (
                      <p className="text-sm text-forest-700 mb-4 leading-relaxed">{h.remedy.description}</p>
                    )}

                    {/* Symptoms used */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-beige-400 uppercase tracking-wider mb-2">Symptoms Reported</p>
                      <div className="flex flex-wrap gap-1.5">
                        {h.symptoms.map(s => (
                          <span key={s} className="badge badge-green text-xs">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Ingredients summary */}
                    {h.remedy.ingredients?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-beige-400 uppercase tracking-wider mb-2">Key Ingredients</p>
                        <div className="flex flex-wrap gap-1.5">
                          {h.remedy.ingredients.map((ing, i) => (
                            <span key={i} className="badge badge-gray">{ing.name}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {h.remedy.safetyWarning && (
                      <div className="mt-4 bg-turmeric-50 border border-turmeric-200 rounded-lg p-3">
                        <p className="text-turmeric-700 text-xs">⚠️ {h.remedy.safetyWarning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
