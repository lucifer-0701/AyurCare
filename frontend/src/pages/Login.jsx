import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await signIn({ email: form.email, password: form.password });
      toast.success('Welcome back! 🌿');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      if (msg.toLowerCase().includes('invalid')) {
        setErrors({ password: 'Invalid email or password. Please try again.' });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Decorations */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-turmeric-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-forest-500/20 rounded-full blur-2xl" />

        <div className="relative z-10 text-center text-white">
          <div className="text-6xl mb-6 animate-float">🌿</div>
          <h2 className="font-poppins font-bold text-4xl mb-4">Welcome Back</h2>
          <p className="text-forest-200 text-lg max-w-xs leading-relaxed">
            Continue your journey to natural wellness through the wisdom of Ayurveda.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: '🤖', text: 'AI-generated Ayurvedic remedies' },
              { icon: '📜', text: 'Track your complete remedy history' },
              { icon: '⚖️', text: 'Scale ingredient quantities automatically' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-left bg-white/10 rounded-xl px-5 py-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-forest-100 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-beige-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 bg-green-gradient rounded-xl flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
              <span className="font-poppins font-bold text-2xl text-forest-800">AyurCare</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-poppins font-bold text-3xl text-forest-800 mb-2">Sign In</h1>
            <p className="text-beige-400">Access your personalized Ayurvedic dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
              autoComplete="email"
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                autoComplete="current-password"
              />
              <div className="flex justify-end mt-1.5">
                <Link to="/forgot-password"
                  className="text-xs text-forest-600 hover:text-forest-800 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" loading={loading} size="lg">
              Sign In to AyurCare
            </Button>

            <p className="text-center text-sm text-beige-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-forest-600 font-semibold hover:text-forest-800 transition-colors">
                Create one free →
              </Link>
            </p>
          </form>

          {/* Disclaimer */}
          <p className="mt-8 text-xs text-center text-beige-300 leading-relaxed">
            By signing in, you acknowledge that AyurCare provides informational Ayurvedic guidance only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
