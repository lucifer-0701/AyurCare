import axios from 'axios';
import { supabase } from '../lib/supabase.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 60000, // 60s for AI calls
  headers: { 'Content-Type': 'application/json' },
});

// ─── Attach JWT to every request ──────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// ─── Handle errors globally ───────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── API Methods ──────────────────────────────────────────────────────────────
export const remedyAPI = {
  generate: (data) => api.post('/remedy/generate', data),
};

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
