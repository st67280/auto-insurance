import api from './api';

// Кэш для результатов расчетов
const calculationCache = new Map();

// Сервис для работы со страховками
const insuranceService = {
    // Получение доступных пакетов страхования
    async getAvailablePackages() {
        try {
            const response = await api.get('/insurance/products/available');
            return response.data && response.data.data ? response.data.data : [];
        } catch (error) {
            console.error('Error fetching packages:', error);

            // Заглушка для тестирования без API
            return [
                {
                    _id: 'standard1',
                    type: 'standard',
                    name: 'Standard',
                    description: 'Базовый пакет страхования',
                    features: {
                        propertyDamageLimit: 50000000,
                        healthDamageLimit: 50000000,
                        driverInsuranceAmount: 100000,
                        personalItemsAmount: 5000,
                        assistanceServices: true,
                        ownVehicleDamage: false,
                        replacementVehicle: false
                    },
                    pricing: {
                        basePrice: 19229
                    }
                },
                {
                    _id: 'dominant1',
                    type: 'dominant',
                    name: 'Dominant',
                    description: 'Расширенный пакет страхования',
                    features: {
                        propertyDamageLimit: 100000000,
                        healthDamageLimit: 100000000,
                        driverInsuranceAmount: 200000,
                        personalItemsAmount: 10000,
                        assistanceServices: true,
                        ownVehicleDamage: false,
                        replacementVehicle: false
                    },
                    pricing: {
                        basePrice: 20189
                    }
                },
                {
                    _id: 'premiant1',
                    type: 'premiant',
                    name: 'Premiant',
                    description: 'Премиальный пакет страхования',
                    features: {
                        propertyDamageLimit: 200000000,
                        healthDamageLimit: 200000000,
                        driverInsuranceAmount: 300000,
                        personalItemsAmount: 15000,
                        assistanceServices: true,
                        ownVehicleDamage: true,
                        replacementVehicle: true
                    },
                    pricing: {
                        basePrice: 22305
                    }
                }
            ];
        }
    },

    // Генерация ключа кэша для расчета
    _generateCacheKey(vehicleId, packageType, customerInfo, additionalServices) {
        return `${vehicleId}_${packageType}_${JSON.stringify(customerInfo)}_${JSON.stringify(additionalServices)}`;
    },

// В функции calculateInsurance в insuranceService.js
// Улучшенный расчет стоимости страховки
    async calculateInsurance(vehicleId, packageType, customerInfo, additionalServices) {
        try {
            const cacheKey = this._generateCacheKey(vehicleId, packageType, customerInfo, additionalServices);

            if (calculationCache.has(cacheKey)) {
                return calculationCache.get(cacheKey);
            }

            // Делаем запрос к API
            const response = await api.post('/insurance/calculate', {
                vehicleId,
                packageType,
                customerInfo,
                additionalServices
            });

            const result = response.data;

            calculationCache.set(cacheKey, result);

            return result;
        } catch (error) {
            console.error('Error calculating insurance:', error);
            throw error;
        }
    },

    // Сброс кэша расчетов
    clearCalculationCache() {
        calculationCache.clear();
    },

    // Создание новой страховки
    async createInsurance(vehicleId, packageType, customerInfo, additionalServices) {
        try {
            const response = await api.post('/insurance', {
                vehicleId,
                packageType,
                customerInfo,
                additionalServices
            });
            return response.data;
        } catch (error) {
            console.error('Error creating insurance:', error);

            // Заглушка для тестирования без API
            return {
                _id: 'insurance' + Date.now(),
                vehicleId,
                packageType,
                customerInfo,
                additionalServices,
                status: 'draft',
                createdAt: new Date().toISOString()
            };
        }
    },

    // Получение информации о страховке по ID
    async getInsuranceById(id) {
        try {
            const response = await api.get(`/insurance/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching insurance:', error);
            throw error;
        }
    }
};

// Экспорт сервиса
export default insuranceService;