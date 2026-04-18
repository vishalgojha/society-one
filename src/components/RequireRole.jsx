import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { can, hasRole } from '@/lib/rbac';

export default function RequireRole({ children, permission, roles }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/OperatorAuth" state={{ from: location }} replace />;
  }

  if (!hasRole(role, roles) || !can(role, permission)) {
    return <Navigate to="/NoAccess" replace />;
  }

  return children;
}
