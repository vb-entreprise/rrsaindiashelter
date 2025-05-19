import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PawPrint } from 'lucide-react';

/**
 * Authentication layout for login and registration
 * Redirects authenticated users to dashboard
 */
const AuthLayout: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-teal-100 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-full shadow-md">
            <PawPrint size={40} className="text-green-600" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">RRSA India</h1>
          <p className="text-gray-600">Animal Welfare Management System</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;