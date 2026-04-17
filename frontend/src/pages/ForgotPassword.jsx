import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email.'); return; }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-gradient rounded-xl flex items-center justify-center">
              <span className="text-xl">🌿</span>
            </div>
            <span className="font-poppins font-bold text-2xl text-forest-800">AyurCare</span>
          </Link>
        </div>

        <div className="glass-card p-8">
          {sent ? (
            // Success state
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-forest-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
                ✉️
              </div>
              <h2 className="font-poppins font-bold text-2xl text-forest-800 mb-3">Check Your Email</h2>
              <p className="text-beige-400 mb-6 leading-relaxed">
                We've sent a password reset link to <strong className="text-forest-700">{email}</strong>.
                Please check your inbox (and spam folder) and click the link to reset your password.
              </p>
              <div className="bg-turmeric-50 border border-turmeric-200 rounded-xl p-4 mb-6 text-sm text-turmeric-700">
                🔐 The reset link is valid for 1 hour. If you don't see the email within a few minutes, check your spam folder.
              </div>
              <Button variant="outline" className="w-full" onClick={() => { setSent(false); setEmail(''); }}>
                ← Try Another Email
              </Button>
              <Link to="/login" className="block mt-4 text-forest-600 text-sm font-medium hover:underline">
                Back to Sign In
              </Link>
            </div>
          ) : (
            // Form state
            <div className="animate-fade-in">
              <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center text-2xl mb-5">
                🔒
              </div>
              <h1 className="font-poppins font-bold text-2xl text-forest-800 mb-2">Reset Password</h1>
              <p className="text-beige-400 text-sm mb-6">
                Enter your account email and we'll send a secure reset link to your inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  error={error}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  autoComplete="email"
                  autoFocus
                />

                <Button type="submit" variant="primary" className="w-full" loading={loading} size="lg">
                  Send Reset Email
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-forest-600 font-medium hover:text-forest-800 transition-colors">
                  ← Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
