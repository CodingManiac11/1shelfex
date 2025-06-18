import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally, render a loading spinner or skeleton here
    return <div>Loading...</div>; 
  }

  if (!user) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children; // Authenticated, render the children
};

export default PrivateRoute; 