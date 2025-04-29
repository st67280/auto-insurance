import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Компонент для защиты маршрутов, требующих авторизации
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    // Если данные еще загружаются, показываем индикатор загрузки
    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    // Если пользователь не авторизован, перенаправляем на страницу входа
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Если указаны разрешенные роли и роль пользователя не входит в список,
    // перенаправляем на главную страницу
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Если все проверки пройдены, отображаем содержимое защищенного маршрута
    return children;
};

export default ProtectedRoute;