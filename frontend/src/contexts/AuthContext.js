import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create Auth context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user info on first render
    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                if (token) {
                    const userData = await authService.getMe();
                    setUser(userData);
                }
            } catch (err) {
                console.error('Error loading user:', err);
                setError(err.message);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Login function
    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(username, password);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            console.error('Error during login:', err);
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Check if user is admin
    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    // Context value
    const value = {
        user,
        token,
        loading,
        error,
        login,
        logout,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
