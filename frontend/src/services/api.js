import axios from 'axios';

// Создание экземпляра axios с базовым URL
const api = axios.create({
    baseURL: '/api'
});

// Добавление перехватчика запросов для добавления токена авторизации
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Добавление перехватчика ответов для обработки ошибок
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Обработка ошибок авторизации
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        // Формирование понятного сообщения об ошибке
        const errorMessage = error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : 'Что-то пошло не так. Попробуйте еще раз позже.';

        return Promise.reject(new Error(errorMessage));
    }
);

export default api;