import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Хук для удобного доступа к контексту авторизации
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }

    return context;
};