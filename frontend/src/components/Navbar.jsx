import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isAuthenticated, profile, user, signOut } = useAuth();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef = useRef(null);
  const navigate  = useNavigate();
  const location  = useLocation();

  // detect scroll for glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const isLanding = location.pathname === '/';
  const navLinks = isAuthenticated ? [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/remedy/disease', label: '🌿 New Remedy' },
    { to: '/history', label: '📜 History' },
  ] : [
    { to: '/#features', label: 'Features' },
    { to: '/#how-it-works', label: 'How It Works' },
  ];

  const displayName = profile?.name || user?.email?.split('@')[0] || 'User';
  const initials    = displayName.slice(0, 2).toUpperCase();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isLanding
        ? 'bg-white/90 backdrop-blur-md shadow-soft border-b border-beige-200'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-green-gradient rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
              <span className="text-lg">🌿</span>
            </div>
            <span className={`font-poppins font-bold text-xl ${
              scrolled || !isLanding ? 'text-forest-800' : 'text-white'
            }`}>
              AyurCare
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled || !isLanding
                    ? 'text-forest-700 hover:bg-forest-50 hover:text-forest-900'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${location.pathname === link.to ? (scrolled || !isLanding ? 'bg-forest-50 text-forest-900' : 'bg-white/15 text-white') : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-forest-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-forest-500 rounded-full flex items-center justify-center text-white text-xs font-bold font-poppins">
                    {initials}
                  </div>
                  <span className={`text-sm font-medium ${scrolled || !isLanding ? 'text-forest-700' : 'text-white'}`}>
                    {displayName}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${dropOpen ? 'rotate-180' : ''} ${scrolled || !isLanding ? 'text-forest-500' : 'text-white/70'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card border border-beige-200 overflow-hidden animate-slide-up">
                    <div className="px-4 py-3 bg-forest-50 border-b border-beige-200">
                      <p className="text-xs text-beige-400">Signed in as</p>
                      <p className="text-sm font-semibold text-forest-800 truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                        onClick={() => setDropOpen(false)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link to="/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 transition-colors"
                        onClick={() => setDropOpen(false)}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Remedy History
                      </Link>
                    </div>
                    <div className="border-t border-beige-200 py-1">
                      <button onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                    scrolled || !isLanding
                      ? 'text-forest-700 hover:bg-forest-50'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                  Log In
                </Link>
                <Link to="/signup"
                  className="btn-primary text-sm py-2 px-5">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ${scrolled || !isLanding ? 'text-forest-700' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-beige-200 shadow-card animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-forest-700 hover:bg-forest-50"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-beige-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block px-4 py-2.5 rounded-xl text-sm text-forest-700 hover:bg-forest-50" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
                  <button onClick={() => { handleSignOut(); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline text-center" onClick={() => setMenuOpen(false)}>Log In</Link>
                  <Link to="/signup" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
