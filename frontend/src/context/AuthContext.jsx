import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import toast from 'react-hot-toast';

// ─── Initial State ────────────────────────────────────────────────────────────
const initialState = {
  user: null,
  profile: null,
  session: null,
  loading: true,
  profileLoading: false,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, user: action.payload?.user ?? null, session: action.payload, loading: false };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, profileLoading: false };
    case 'SET_PROFILE_LOADING':
      return { ...state, profileLoading: true };
    case 'CLEAR_AUTH':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Fetch user profile ──────────────────────────────────────────────────────
  const fetchProfile = useCallback(async (userId) => {
    dispatch({ type: 'SET_PROFILE_LOADING' });
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      dispatch({ type: 'SET_PROFILE', payload: data });
    } else {
      dispatch({ type: 'SET_PROFILE', payload: null });
    }
  }, []);

  // ── Auth state listener ─────────────────────────────────────────────────────
  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ type: 'SET_SESSION', payload: session });
      if (session?.user) fetchProfile(session.user.id);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      dispatch({ type: 'SET_SESSION', payload: session });

      if (event === 'SIGNED_IN' && session?.user) {
        fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        dispatch({ type: 'CLEAR_AUTH' });
      } else if (event === 'USER_UPDATED' && session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ── Auth Actions ────────────────────────────────────────────────────────────
  const signUp = async ({ email, password, name, age, gender }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // stored in raw_user_meta_data → picked up by trigger
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) throw error;

    // Update profile with age/gender if provided
    if (data.user && (age || gender)) {
      await supabase.from('profiles').update({ age, gender, name }).eq('id', data.user.id);
    }

    return data;
  };

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    dispatch({ type: 'CLEAR_AUTH' });
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const updateProfile = async (updates) => {
    if (!state.user) throw new Error('Not authenticated');
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id);
    if (error) throw error;
    dispatch({ type: 'SET_PROFILE', payload: { ...state.profile, ...updates } });
  };

  const getAccessToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  return (
    <AuthContext.Provider value={{
      user: state.user,
      profile: state.profile,
      session: state.session,
      loading: state.loading,
      profileLoading: state.profileLoading,
      isAuthenticated: !!state.user,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      getAccessToken,
      refetchProfile: () => state.user && fetchProfile(state.user.id),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
