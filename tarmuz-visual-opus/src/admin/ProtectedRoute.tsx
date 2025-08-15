import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { token, loading } = useAuth();
  if (loading) return <div className="p-6 text-center">...يجري التحميل</div>;
  if (!token) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
