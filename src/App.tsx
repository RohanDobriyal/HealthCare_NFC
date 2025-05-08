import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import StaffLoginPage from './pages/StaffLoginPage';
import PatientLoginPage from './pages/PatientLoginPage';
import RegisterPatientPage from './pages/RegisterPatientPage';
import StaffDashboard from './pages/StaffDashboard';
import PatientDashboard from './pages/PatientDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/staff" element={<StaffLoginPage />} />
          <Route path="/login/patient" element={<PatientLoginPage />} />
          <Route path="/register/patient" element={<RegisterPatientPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard/staff" 
            element={
              <ProtectedRoute allowedRoles={['doctor', 'nurse']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/patient" 
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;