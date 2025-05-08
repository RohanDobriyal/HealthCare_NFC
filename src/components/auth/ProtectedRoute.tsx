import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="rounded-full bg-primary/20 h-16 w-16 mb-4"></div>
          <div className="h-4 bg-primary/20 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login/patient" />;
  }

  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    // Redirect based on role
    if (userData.role === 'patient') {
      return <Navigate to="/dashboard/patient" />;
    } else if (userData.role === 'doctor' || userData.role === 'nurse') {
      return <Navigate to="/dashboard/staff" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return <>{children}</>;
}