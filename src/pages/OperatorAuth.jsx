import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import NoAccess from '@/pages/NoAccess';
import { useAuth } from '@/lib/AuthContext';

export default function OperatorAuth() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, operator, role } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && operator) {
      navigate(role === 'guard' ? '/GuardCheckIn' : '/Dashboard', { replace: true });
    }
  }, [isLoading, isAuthenticated, operator, role, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!isAuthenticated) return <Landing />;
  if (!operator) return <NoAccess />;

  return <Navigate to={role === 'guard' ? '/GuardCheckIn' : '/Dashboard'} replace />;
}
