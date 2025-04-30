import api from './api';

// Сервис для работы с административными функциями
const adminService = {
    // Получение всех страховок
    async getAllInsurances() {
        try {
            const response = await api.get('/admin/insurances');
            // Нормализуем данные - убедимся, что они имеют правильную структуру
            return response.data && response.data.data ? response.data.data :
                (Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching insurances:', error);
            throw error;
        }
    },

    // Обновление информации о страховке
    async updateInsurance(id, data) {
        try {
            const response = await api.put(`/admin/insurances/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating insurance:', error);
            throw error;
        }
    },

    // Получение всех страховых продуктов
    async getAllProducts() {
        try {
            const response = await api.get('/admin/products');
            // Нормализуем данные - убедимся, что они имеют правильную структуру
            return response.data && response.data.data ?
                { data: response.data.data } :
                { data: Array.isArray(response.data) ? response.data : [] };
        } catch (error) {
            console.error('Error fetching products:', error);
            // Возвращаем пустой массив в случае ошибки
            return { data: [] };
        }
    },

    // Создание нового страхового продукта
    async createProduct(productData) {
        try {
            const response = await api.post('/admin/products', productData);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    // Обновление страхового продукта
    async updateProduct(id, productData) {
        try {
            const response = await api.put(`/admin/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    // Удаление страхового продукта
    async deleteProduct(id) {
        try {
            const response = await api.delete(`/admin/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    // Инициализация базовых продуктов
    async initializeProducts() {
        try {
            const response = await api.post('/admin/initialize/products');
            return response.data;
        } catch (error) {
            console.error('Error initializing products:', error);
            throw error;
        }
    },

    // Создание администратора по умолчанию
    async createDefaultAdmin() {
        try {
            const response = await api.post('/admin/initialize/admin');
            return response.data;
        } catch (error) {
            console.error('Error creating default admin:', error);
            throw error;
        }
    }
};

export default adminService;