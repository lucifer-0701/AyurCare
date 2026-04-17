import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', age: '', gender: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = credentials, 2 = profile

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleNext = () => {
    const errs = validateStep1();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp({
        email: form.email,
        password: form.password,
        name: form.name,
        age: form.age ? parseInt(form.age) : null,
        gender: form.gender || null,
      });
      toast.success('Account created! Please check your email to confirm your account. 🌿');
      navigate('/login');
    } catch (err) {
      if (err.message?.toLowerCase().includes('already')) {
        setErrors({ email: 'An account with this email already exists.' });
        setStep(1);
      } else {
        toast.error(err.message || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute top-20 right-20 w-40 h-40 bg-turmeric-500/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-forest-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 text-center text-white">
          <div className="text-6xl mb-6 animate-float">🌱</div>
          <h2 className="font-poppins font-bold text-4xl mb-4">Start Your Journey</h2>
          <p className="text-forest-200 text-lg max-w-xs leading-relaxed">
            Create your free account and unlock personalized Ayurvedic remedies tailored to your unique constitution.
          </p>

          <div className="mt-10 bg-white/10 rounded-2xl p-6 text-left">
            <p className="text-turmeric-300 text-sm font-semibold mb-3 uppercase tracking-wider">What you get:</p>
            <ul className="space-y-3 text-forest-200 text-sm">
              {[
                '🤖 Unlimited AI-powered remedy generation',
                '📜 Saved history of all your remedies',
                '⚖️ Automatic ingredient scaling',
                '📄 PDF download for offline use',
                '🌿 Daily Ayurvedic wellness tips',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Panel */}
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

          {/* Progress indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-forest-500' : 'bg-beige-200'}`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-forest-500' : 'bg-beige-200'}`} />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-poppins font-bold text-3xl text-forest-800 mb-2">
              {step === 1 ? 'Create Account' : 'Your Ayurvedic Profile'}
            </h1>
            <p className="text-beige-400">
              {step === 1 ? 'Join AyurCare — it\'s free forever' : 'Help us personalize your remedies (optional)'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {step === 1 ? (
              <div className="space-y-5 animate-slide-up">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Priya Sharma"
                  value={form.name}
                  onChange={handleChange('name')}
                  error={errors.name}
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                  autoComplete="name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  error={errors.email}
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>}
                  autoComplete="email"
                />

                <div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange('password')}
                    error={errors.password}
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                    autoComplete="new-password"
                  />
                  <PasswordStrength password={form.password} />
                </div>

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange('confirm')}
                  error={errors.confirm}
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                  autoComplete="new-password"
                />

                <Button type="button" variant="primary" className="w-full" size="lg" onClick={handleNext}>
                  Continue →
                </Button>
              </div>
            ) : (
              <div className="space-y-5 animate-slide-up">
                <div className="bg-forest-50 rounded-xl p-4 border border-forest-200">
                  <p className="text-forest-700 text-sm">
                    🌿 <strong>Optional but helpful:</strong> Adding your age and gender helps our AI generate more personalized Ayurvedic remedies based on your constitution.
                  </p>
                </div>

                <Input
                  label="Age (optional)"
                  type="number"
                  placeholder="e.g. 32"
                  value={form.age}
                  onChange={handleChange('age')}
                  min={1}
                  max={120}
                  icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                />

                <div>
                  <label className="block text-sm font-semibold text-forest-700 mb-1.5 font-poppins">
                    Gender (optional)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['male', 'female', 'other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm({ ...form, gender: g })}
                        className={`py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200 ${
                          form.gender === g
                            ? 'border-forest-500 bg-forest-500 text-white'
                            : 'border-beige-200 text-beige-400 hover:border-forest-300'
                        }`}
                      >
                        {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : '⚧ Other'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" loading={loading} size="lg">
                    Create Account 🌿
                  </Button>
                </div>

                <p className="text-center text-xs text-beige-400">
                  You can always add this information later in your profile.
                </p>
              </div>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-beige-400">
            Already have an account?{' '}
            <Link to="/login" className="text-forest-600 font-semibold hover:text-forest-800 transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
