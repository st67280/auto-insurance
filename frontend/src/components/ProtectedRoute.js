import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    // Show loading indicator while auth state is loading
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // If not authenticated, redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If user role is not in allowedRoles, redirect to home
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Otherwise, render the protected content
    return children;
};

export default ProtectedRoute;
