
import React, { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, userProfile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If not loading and no user, redirect to auth
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If we have a user but no profile, it might mean that the trigger
  // hasn't created the profile yet - we can show a loading state
  if (user && !userProfile && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Setting up your profile...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
