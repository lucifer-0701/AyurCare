import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  { icon: '🤖', title: 'AI-Powered Remedies', desc: 'Groq-powered AI trained on Ayurvedic texts provides personalized herbal prescriptions in seconds.' },
  { icon: '🌿', title: 'Traditional Herbs Only', desc: 'Strictly Ayurvedic — no allopathic drugs. Only time-tested herbs like Ashwagandha, Triphala, and Tulsi.' },
  { icon: '⚖️', title: 'Ingredient Scaling', desc: 'Set your treatment duration (1–30 days) and we automatically scale ingredient quantities for you.' },
  { icon: '📄', title: 'PDF Download', desc: 'Download your personalized remedy as a beautifully formatted PDF to keep offline or share.' },
  { icon: '📜', title: 'Remedy History', desc: 'All your past remedies are saved securely. Revisit, bookmark, and track your wellness journey.' },
  { icon: '🔔', title: 'Daily Ayurvedic Tips', desc: 'Get one fresh Ayurvedic practice tip every day — from oil pulling to pranayama.' },
];

const STEPS = [
  { num: '01', title: 'Choose Your Disease', desc: 'Browse 30+ conditions or search your specific health concern from our comprehensive disease list.' },
  { num: '02', title: 'Select Your Symptoms', desc: 'Pick from a dynamic symptom checklist tailored to your disease. Add severity and duration.' },
  { num: '03', title: 'Get Your Remedy', desc: 'Our AI generates a complete Ayurvedic protocol — herbs, preparation, dosage, and diet guidance.' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'Yoga Instructor, Mumbai', text: 'AyurCare suggested Triphala and ginger decoction for my digestion after just 3 symptoms. Within a week I felt a significant difference. The preparation guide was crystal clear.', rating: 5 },
  { name: 'Rajan Mehta', role: 'Software Engineer, Bangalore', text: 'I was skeptical at first, but the remedy for my chronic back pain — Shallaki and sesame oil massage — matched exactly what my grandmother used to suggest. Truly impressive.', rating: 5 },
  { name: 'Ananya Krishnan', role: 'Homemaker, Chennai', text: 'The ingredient scaling feature is brilliant. I set it to 21 days and it calculated all quantities automatically. My husband\'s arthritis has improved noticeably.', rating: 5 },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-beige-50">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-hero flex items-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-forest-600/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-turmeric-500/15 blur-2xl animate-float" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-forest-700/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />

        {/* Leaf decorations */}
        <div className="absolute top-32 left-20 text-6xl opacity-10 animate-float-slow select-none">🌿</div>
        <div className="absolute bottom-32 right-20 text-5xl opacity-10 animate-float select-none">🌱</div>
        <div className="absolute top-1/3 right-1/4 text-4xl opacity-10 animate-float-slow select-none">🍃</div>

        <div className="page-container relative z-10 py-32 text-center">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
              <span className="text-turmeric-300 text-sm">✨</span>
              <span className="text-white/90 text-sm font-medium">AI-Powered Ayurvedic Wellness</span>
              <span className="w-2 h-2 bg-turmeric-400 rounded-full animate-pulse-soft" />
            </div>

            {/* Heading */}
            <h1 className="font-poppins font-bold text-5xl sm:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              Ancient Wisdom,{' '}
              <span className="text-gradient-gold">Modern Intelligence</span>
            </h1>

            <p className="text-forest-200 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Get personalized Ayurvedic remedies powered by AI. Enter your symptoms and receive
              traditional herbal treatments with detailed ingredient guides, preparation steps, and dosage schedules.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/dashboard' : '/signup'}
                className="btn-secondary px-8 py-4 text-base">
                🌿 Start Your Healing Journey
              </Link>
              <Link to={isAuthenticated ? '/remedy/disease' : '/login'}
                className="btn-outline border-white/40 text-white hover:bg-white hover:text-forest-800 px-8 py-4 text-base">
                View Demo →
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-beige-200 py-6">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '30+',  label: 'Conditions Covered' },
              { value: '500+', label: 'Ayurvedic Herbs' },
              { value: '10K+', label: 'Remedies Generated' },
              { value: '100%', label: 'Natural Ingredients' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-poppins font-bold text-2xl text-forest-600">{stat.value}</div>
                <div className="text-sm text-beige-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-turmeric-600 font-semibold text-sm uppercase tracking-widest mb-3">Why AyurCare?</p>
            <h2 className="section-title text-4xl">Everything You Need For Natural Healing</h2>
            <p className="text-beige-400 mt-4 max-w-xl mx-auto">
              A complete Ayurvedic wellness platform built with ancient wisdom and modern technology.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title}
                className="glass-card p-6 hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-forest-50 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-inner">
                  {f.icon}
                </div>
                <h3 className="font-poppins font-semibold text-forest-800 text-lg mb-2">{f.title}</h3>
                <p className="text-beige-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-forest-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-30" />
        <div className="page-container relative z-10">
          <div className="text-center mb-14">
            <p className="text-turmeric-400 font-semibold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="font-poppins font-bold text-4xl text-white">How It Works</h2>
            <p className="text-forest-300 mt-4 max-w-lg mx-auto">Get your personalized Ayurvedic remedy in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-forest-600" />
                )}
                <div className="w-20 h-20 mx-auto bg-turmeric-500/20 border-2 border-turmeric-500/40 rounded-2xl flex items-center justify-center mb-5">
                  <span className="font-poppins font-bold text-2xl text-turmeric-300">{step.num}</span>
                </div>
                <h3 className="font-poppins font-semibold text-white text-xl mb-3">{step.title}</h3>
                <p className="text-forest-300 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup" className="btn-secondary px-8 py-4 text-base">
              🌿 Try It Free — No Credit Card Needed
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-turmeric-600 font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="section-title text-4xl">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-turmeric-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-forest-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center font-bold text-forest-700 text-sm font-poppins">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-forest-800 text-sm">{t.name}</p>
                    <p className="text-beige-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-forest-100 to-beige-100">
        <div className="page-container text-center">
          <div className="text-5xl mb-5 animate-float">🌿</div>
          <h2 className="section-title text-4xl mb-4">Begin Your Healing Journey Today</h2>
          <p className="text-beige-400 max-w-lg mx-auto mb-8">
            Join thousands of users who trust AyurCare for safe, natural, and personalized Ayurvedic wellness guidance.
          </p>
          <Link to="/signup" className="btn-primary px-10 py-4 text-base">
            Create Your Free Account →
          </Link>
          <p className="mt-4 text-xs text-beige-400">
            ⚠️ This platform is for informational purposes only. Always consult a qualified practitioner for medical advice.
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="bg-forest-900 text-forest-300 py-12">
        <div className="page-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                <span className="text-sm">🌿</span>
              </div>
              <span className="font-poppins font-bold text-white text-lg">AyurCare</span>
            </div>
            <p className="text-xs text-forest-500 text-center max-w-md">
              AyurCare is an informational wellness platform. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/login" className="hover:text-forest-100 transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-forest-100 transition-colors">Sign Up</Link>
            </div>
          </div>
          <div className="border-t border-forest-800 mt-8 pt-6 text-center text-xs text-forest-600">
            © {new Date().getFullYear()} AyurCare. Built with 🌿 for natural wellness.
          </div>
        </div>
      </footer>
    </div>
  );
}
