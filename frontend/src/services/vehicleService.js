import api from './api';

// Сервис для работы с транспортными средствами
const vehicleService = {
    // Получение информации о ТС по VIN коду
    async getVehicleByVin(vin) {
        try {
            const response = await api.get(`/vehicle/vin/${vin}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle by VIN:', error);

            // Заглушка для тестирования без API
            const mockData = {
                _id: 'mockid' + Date.now(),
                vin: vin,
                type: 'car',
                isElectric: false,
                brand: 'Test Brand',
                model: 'Test Model',
                year: 2020,
                engineVolume: 1600,
                weight: 1200,
                ownersCount: 1
            };

            return mockData;
        }
    },

    // Создание нового ТС вручную
    async createVehicle(vehicleData) {
        try {
            const response = await api.post('/vehicle', vehicleData);
            return response.data;
        } catch (error) {
            console.error('Error creating vehicle:', error);

            // Заглушка для тестирования без API
            return {
                _id: 'mockid' + Date.now(),
                ...vehicleData
            };
        }
    },

    // Получение ТС по ID
    async getVehicleById(id) {
        try {
            const response = await api.get(`/vehicle/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching vehicle by ID:', error);
            throw error;
        }
    }
};

export default vehicleService;