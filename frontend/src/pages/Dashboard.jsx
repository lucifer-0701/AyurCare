import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { supabase } from '../lib/supabase.js';
import Navbar from '../components/Navbar.jsx';
import DailyTip from '../components/DailyTip.jsx';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory]   = useState([]);
  const [stats, setStats]       = useState({ total: 0, saved: 0 });
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  const displayName = profile?.name || user?.email?.split('@')[0] || 'there';

  useEffect(() => {
    async function load() {
      if (!user) return;
      const { data, count } = await supabase
        .from('histories')
        .select('id, disease, severity, created_at, remedy', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const { count: savedCount } = await supabase
        .from('saved_remedies')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setHistory(data || []);
      setStats({ total: count || 0, saved: savedCount || 0 });
      setLoading(false);
    }
    load();
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/remedy/disease?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const severityColor = (s) => ({
    mild:     'badge-green',
    moderate: 'badge-amber',
    severe:   'badge-red',
  }[s] || 'badge-gray');

  return (
    <div className="min-h-screen bg-beige-50">
      <Navbar />

      <main className="page-content page-container py-8">
        {/* ── Welcome Header ──────────────────────────────────────────────────── */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-turmeric-600 font-semibold text-sm uppercase tracking-widest mb-1">
                {getGreeting()},
              </p>
              <h1 className="font-poppins font-bold text-3xl text-forest-800">
                {displayName} 🌿
              </h1>
              <p className="text-beige-400 mt-1 text-sm">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search a disease..."
                  className="input-field pl-10 pr-4"
                />
              </div>
              <button type="submit" className="ml-2 btn-primary py-2 px-4 text-sm">Search</button>
            </form>
          </div>
        </div>

        {/* ── Stats Row ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {[
            { icon: '🌿', label: 'Remedies Generated', value: stats.total },
            { icon: '♡', label: 'Saved Remedies',     value: stats.saved },
            { icon: '🕐', label: 'Days with AyurCare', value: user ? Math.max(1, Math.floor((Date.now() - new Date(user.created_at)) / 86400000)) : 0 },
            { icon: '✨', label: 'Herbs Explored',     value: stats.total * 5 },
          ].map((s) => (
            <div key={s.label} className="glass-card p-5 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-poppins font-bold text-2xl text-forest-700">{s.value}</div>
              <div className="text-xs text-beige-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main Grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Primary CTA Card */}
            <div className="relative overflow-hidden rounded-2xl bg-green-gradient p-8 shadow-card">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
              <div className="relative z-10">
                <p className="text-forest-200 text-sm font-medium mb-2">Ready for your remedy?</p>
                <h2 className="font-poppins font-bold text-2xl text-white mb-3">
                  Start a New Remedy Session
                </h2>
                <p className="text-forest-200 text-sm mb-6 max-w-md">
                  Select your condition, describe your symptoms, and our AI will generate a personalized Ayurvedic treatment plan.
                </p>
                <Link to="/remedy/disease" className="inline-flex items-center gap-2 bg-white text-forest-700 font-semibold px-6 py-3 rounded-xl hover:bg-beige-50 transition-colors shadow-soft">
                  🌿 Explain Your Disease →
                </Link>
              </div>
            </div>

            {/* Recent History */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-poppins font-semibold text-lg text-forest-800">Recent Remedies</h2>
                <Link to="/history" className="text-forest-600 text-sm font-medium hover:underline">
                  View All →
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-beige-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">🌱</div>
                  <p className="text-beige-400 text-sm">No remedies yet. Start your first session!</p>
                  <Link to="/remedy/disease" className="mt-4 btn-outline inline-flex text-sm py-2 px-4">
                    Generate First Remedy
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.id}
                      onClick={() => navigate(`/history`)}
                      className="flex items-center justify-between p-4 rounded-xl border border-beige-200 hover:bg-forest-50 hover:border-forest-200 cursor-pointer transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center text-xl">
                          🌿
                        </div>
                        <div>
                          <p className="font-semibold text-forest-800 text-sm">{h.disease}</p>
                          <p className="text-xs text-beige-400">
                            {h.remedy?.remedyName && `${h.remedy.remedyName} • `}
                            {new Date(h.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <span className={`badge ${severityColor(h.severity)} capitalize`}>
                        {h.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Daily Tip */}
            <DailyTip />

            {/* Quick Links */}
            <div className="glass-card p-6">
              <h3 className="font-poppins font-semibold text-forest-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { to: '/remedy/disease', icon: '🌿', label: 'New Remedy',     desc: 'Generate Ayurvedic treatment' },
                  { to: '/history',        icon: '📜', label: 'View History',   desc: 'Past remedy sessions' },
                  { to: '/profile',        icon: '👤', label: 'Edit Profile',   desc: 'Update your health info' },
                ].map((link) => (
                  <Link key={link.to} to={link.to}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-forest-50 transition-all duration-200 group">
                    <div className="w-9 h-9 bg-forest-100 rounded-lg flex items-center justify-center text-lg group-hover:bg-forest-200 transition-colors">
                      {link.icon}
                    </div>
                    <div>
                      <p className="text-forest-800 text-sm font-semibold">{link.label}</p>
                      <p className="text-beige-400 text-xs">{link.desc}</p>
                    </div>
                    <svg className="w-4 h-4 text-beige-300 ml-auto group-hover:text-forest-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Safety Disclaimer */}
            <div className="bg-turmeric-50 border border-turmeric-200 rounded-2xl p-5">
              <p className="text-turmeric-700 text-xs leading-relaxed">
                ⚠️ <strong>Disclaimer:</strong> AyurCare provides traditional Ayurvedic information for educational purposes only. It is not a substitute for professional medical advice. Always consult a qualified practitioner for health concerns.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
