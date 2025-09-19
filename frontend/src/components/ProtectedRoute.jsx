import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requirePermission = null }) => {
  const { isAuthenticated, loading, isAdmin, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" style={{width: '4rem', height: '4rem'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="h2 fw-bold text-danger mb-4">Access Denied</h1>
          <p className="text-muted">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (requirePermission && !hasPermission(requirePermission)) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1 className="h2 fw-bold text-danger mb-4">Access Denied</h1>
          <p className="text-muted">You don't have the required permission: {requirePermission}</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;