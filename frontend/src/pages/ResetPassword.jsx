import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import PasswordStrength from '../components/PasswordStrength.jsx';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await updatePassword(form.password);
      toast.success('Password updated successfully! 🌿');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to update password. Try reloading the page.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3 animate-float">🔐</div>
            <h1 className="font-poppins font-bold text-2xl text-forest-800 mb-2">Set New Password</h1>
            <p className="text-beige-400 text-sm">Choose a strong, unique password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="New Password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                autoFocus
              />
              <PasswordStrength password={form.password} />
            </div>

            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat your new password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              error={errors.confirm}
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading} size="lg">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
