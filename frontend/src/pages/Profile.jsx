import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name:            profile?.name || '',
    age:             profile?.age || '',
    gender:          profile?.gender || '',
    medical_history: profile?.medical_history || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      await updateProfile({
        name:            form.name.trim(),
        age:             form.age ? parseInt(form.age) : null,
        gender:          form.gender || null,
        medical_history: form.medical_history.trim() || null,
      });
      toast.success('Profile updated! 🌿');
      setEditing(false);
    } catch (err) {
      toast.error(err.message || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-beige-50">
      <Navbar />

      <main className="page-content page-container pb-8 max-w-2xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title text-3xl mb-1">👤 My Profile</h1>
          <p className="text-beige-400 text-sm">Manage your account and health preferences</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <div className="flex items-center gap-5 pb-5 border-b border-beige-200 mb-5">
            {/* Avatar */}
            <div className="w-16 h-16 bg-green-gradient rounded-2xl flex items-center justify-center text-white font-bold text-2xl font-poppins shadow-soft">
              {initials}
            </div>
            <div>
              <h2 className="font-poppins font-bold text-xl text-forest-800">{displayName}</h2>
              <p className="text-beige-400 text-sm">{user?.email}</p>
              <p className="text-xs text-beige-300 mt-1">Member since {joinedDate}</p>
            </div>
          </div>

          {editing ? (
            // Edit Form
            <form onSubmit={handleSave} className="space-y-4 animate-fade-in">
              <Input
                label="Full Name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Age"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="e.g. 32"
                  min={1}
                  max={120}
                />

                <div>
                  <label className="block text-sm font-semibold text-forest-700 mb-1.5 font-poppins">Gender</label>
                  <div className="flex gap-2">
                    {['male', 'female', 'other', 'prefer_not_to_say'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold capitalize transition-all ${
                          form.gender === g
                            ? 'border-forest-500 bg-forest-500 text-white'
                            : 'border-beige-200 text-beige-400 hover:border-forest-300'
                        }`}
                      >
                        {g === 'prefer_not_to_say' ? 'N/A' : g.charAt(0).toUpperCase() + g.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-forest-700 mb-1.5 font-poppins">
                  Medical History <span className="font-normal text-beige-400">(optional)</span>
                </label>
                <textarea
                  value={form.medical_history}
                  onChange={(e) => setForm({ ...form, medical_history: e.target.value })}
                  rows={4}
                  placeholder="Any existing conditions, allergies, or medications. This helps us personalize your remedies."
                  className="input-field resize-none"
                />
                <p className="text-xs text-beige-400 mt-1">
                  🔒 This information is private and only used to personalize your Ayurvedic recommendations.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={loading} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            // View Mode
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-beige-400 uppercase tracking-wider mb-1">Age</p>
                  <p className="text-forest-800 font-medium">{profile?.age ? `${profile.age} years` : '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-beige-400 uppercase tracking-wider mb-1">Gender</p>
                  <p className="text-forest-800 font-medium capitalize">
                    {profile?.gender === 'prefer_not_to_say' ? 'Prefer not to say' : profile?.gender || '—'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-beige-400 uppercase tracking-wider mb-1">Medical History</p>
                <p className="text-forest-700 text-sm leading-relaxed">
                  {profile?.medical_history || <span className="text-beige-300 italic">Not provided</span>}
                </p>
              </div>

              <Button variant="primary" onClick={() => setEditing(true)} className="w-full mt-2">
                ✏️ Edit Profile
              </Button>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="glass-card p-6 mb-6 animate-slide-up">
          <h3 className="font-poppins font-semibold text-forest-800 mb-4">Account Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-beige-100">
              <span className="text-sm text-beige-400">Email Address</span>
              <span className="text-sm font-medium text-forest-700">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-beige-100">
              <span className="text-sm text-beige-400">Account Status</span>
              <span className="badge badge-green">✓ Active</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-beige-400">Email Verified</span>
              <span className={`badge ${user?.email_confirmed_at ? 'badge-green' : 'badge-amber'}`}>
                {user?.email_confirmed_at ? '✓ Verified' : '⚠ Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Ayurvedic tip for profile */}
        <div className="bg-forest-50 border border-forest-200 rounded-2xl p-5 animate-slide-up">
          <p className="text-forest-700 text-sm leading-relaxed">
            🌿 <strong>Personalization Tip:</strong> Adding your age, gender, and medical history helps our AI factor in your unique Ayurvedic constitution (Prakriti) when generating remedies, making them more accurate and effective.
          </p>
        </div>
      </main>
    </div>
  );
}
