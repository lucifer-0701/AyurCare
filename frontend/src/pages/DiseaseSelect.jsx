import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { DISEASES, CATEGORIES } from '../data/diseases.js';

export default function DiseaseSelect() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [search, setSearch]       = useState(params.get('q') || '');
  const [category, setCategory]   = useState('All');
  const [selected, setSelected]   = useState(null);
  const [filtered, setFiltered]   = useState(DISEASES);

  const filter = useCallback(() => {
    let list = DISEASES;
    if (category !== 'All') list = list.filter(d => d.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [search, category]);

  useEffect(() => { filter(); }, [filter]);

  const handleSelect = (disease) => {
    setSelected(disease);
  };

  const handleContinue = () => {
    if (!selected) return;
    navigate('/remedy/symptoms', { state: { disease: selected } });
  };

  return (
    <div className="min-h-screen bg-beige-50">
      <Navbar />

      <main className="page-content page-container py-8">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="mb-8 animate-fade-in">
          {/* Stepper */}
          <div className="flex items-center gap-3 mb-6">
            <div className="step-active w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div className="h-0.5 w-12 bg-beige-200" />
            <div className="step-inactive w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div className="h-0.5 w-12 bg-beige-200" />
            <div className="step-inactive w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <span className="ml-2 text-xs text-beige-400 font-medium">Step 1 of 3</span>
          </div>

          <h1 className="section-title text-3xl mb-2">Select Your Condition</h1>
          <p className="text-beige-400">Choose the health concern you'd like an Ayurvedic remedy for.</p>
        </div>

        {/* ── Search + Filter ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-beige-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conditions..."
              className="input-field pl-10"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  category === cat
                    ? 'bg-forest-500 text-white shadow-soft'
                    : 'bg-white border border-beige-200 text-beige-400 hover:border-forest-300 hover:text-forest-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Disease Grid ────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-beige-400">No conditions found for "<strong>{search}</strong>".</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-4 text-forest-600 text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 animate-fade-in">
            {filtered.map((disease) => (
              <button
                key={disease.id}
                onClick={() => handleSelect(disease)}
                className={`disease-card text-center transition-all ${
                  selected?.id === disease.id ? 'selected' : ''
                }`}
              >
                <div className="text-4xl mb-3">{disease.icon}</div>
                <h3 className="font-poppins font-semibold text-sm text-forest-800 mb-1 leading-tight">
                  {disease.name}
                </h3>
                <p className="text-xs text-beige-400 leading-snug">{disease.description}</p>
                <span className="inline-block mt-2 text-xs bg-beige-100 text-beige-400 px-2 py-0.5 rounded-full">
                  {disease.category}
                </span>
                {selected?.id === disease.id && (
                  <div className="mt-2 text-forest-600 font-medium text-xs">✓ Selected</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Footer CTA ──────────────────────────────────────────────────────── */}
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-beige-200 shadow-card p-4 transition-transform duration-300 ${
          selected ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="page-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selected?.icon}</span>
              <div>
                <p className="font-semibold text-forest-800 text-sm">{selected?.name}</p>
                <p className="text-xs text-beige-400">{selected?.category}</p>
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="btn-primary py-2.5 px-6"
            >
              Continue → Select Symptoms
            </button>
          </div>
        </div>

        {/* Bottom padding for fixed bar */}
        {selected && <div className="h-20" />}
      </main>
    </div>
  );
}
