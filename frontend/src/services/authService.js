import api from './api';

// Сервис для работы с авторизацией
const authService = {
    // Авторизация пользователя
    async login(username, password) {
        try {
            //const response = await api.post('/auth/login', { username, password });
            const data = await api.post('/auth/login', { username, password });
            console.log('>>> login data =', data);
            return data;
        } catch (error) {
            console.error('Error during login:', error);

            // Заглушка для тестирования без API - только для 'admin'/'admin'
            if (username === 'admin' && password === 'admin') {
                const mockToken = 'mock-token-' + Date.now();
                localStorage.setItem('token', mockToken);

                return {
                    token: mockToken,
                    user: {
                        id: 'admin-user-id',
                        username: 'admin',
                        role: 'admin'
                    }
                };
            }

            throw error;
        }
    },

    // Получение информации о текущем пользователе
    async getMe() {
        try {
            const data = await api.get('/auth/me');
            console.log('>>> getMe data =', data);
            return data.user;
        } catch (error) {
            console.error('Error fetching user info:', error);

            // Заглушка для тестирования без API
            if (localStorage.getItem('token') && localStorage.getItem('token').startsWith('mock-token-')) {
                return {
                    id: 'admin-user-id',
                    username: 'admin',
                    role: 'admin'
                };
            }

            throw error;
        }
    },

    // Проверка авторизации
    isAuthenticated() {
        return localStorage.getItem('token') !== null;
    }
};

export default authService;