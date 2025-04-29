import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Создание контекста авторизации
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка информации о пользователе при первой загрузке
    useEffect(() => {
        const loadUser = async () => {
            setLoading(true);
            try {
                if (token) {
                    const userData = await authService.getMe();
                    setUser(userData);
                }
            } catch (err) {
                console.error('Ошибка при загрузке пользователя:', err);
                setError(err.message);
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [token]);

    // Функция авторизации
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
            console.error('Ошибка при авторизации:', err);
            setError(err.message || 'Ошибка при авторизации');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Функция выхода из системы
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Проверка, является ли пользователь администратором
    const isAdmin = () => {
        return user && user.role === 'admin';
    };

    // Предоставляемое значение контекста
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