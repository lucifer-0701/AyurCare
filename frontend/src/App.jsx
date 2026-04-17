import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Landing       from './pages/Landing.jsx';
import Login         from './pages/Login.jsx';
import Signup        from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword  from './pages/ResetPassword.jsx';
import Dashboard     from './pages/Dashboard.jsx';
import DiseaseSelect from './pages/DiseaseSelect.jsx';
import SymptomFlow   from './pages/SymptomFlow.jsx';
import RemedyResult  from './pages/RemedyResult.jsx';
import History       from './pages/History.jsx';
import Profile       from './pages/Profile.jsx';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"                element={<Landing />} />
      <Route path="/login"           element={isAuthenticated && !loading ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup"          element={isAuthenticated && !loading ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/remedy/disease"   element={<ProtectedRoute><DiseaseSelect /></ProtectedRoute>} />
      <Route path="/remedy/symptoms"  element={<ProtectedRoute><SymptomFlow /></ProtectedRoute>} />
      <Route path="/remedy/result"    element={<ProtectedRoute><RemedyResult /></ProtectedRoute>} />
      <Route path="/history"          element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/profile"          element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen bg-beige-50 flex items-center justify-center text-center px-6">
          <div>
            <div className="text-6xl mb-4 animate-float">🌿</div>
            <h1 className="font-poppins font-bold text-3xl text-forest-800 mb-2">Page Not Found</h1>
            <p className="text-beige-400 mb-6">The path you're looking for doesn't exist in our wellness garden.</p>
            <a href="/" className="btn-primary">← Return Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
}
