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
            // Генерируем ключ кэша
            const cacheKey = this._generateCacheKey(vehicleId, packageType, customerInfo, additionalServices);

            // Проверяем наличие результата в кэше
            if (calculationCache.has(cacheKey)) {
                return calculationCache.get(cacheKey);
            }

            // Если в кэше нет, делаем запрос к API
            const response = await api.post('/insurance/calculate', {
                vehicleId,
                packageType,
                customerInfo,
                additionalServices
            });

            const result = response.data && response.data.data ? response.data.data : response.data;

            // Сохраняем результат в кэш
            calculationCache.set(cacheKey, result);

            return result;
        } catch (error) {
            console.error('Error calculating insurance:', error);

            // Заглушка для тестирования без API
            // Получаем базовую цену для выбранного пакета
            let basePrice = 0;
            switch (packageType) {
                case 'standard':
                    basePrice = 15500;  // Снижено с 19229
                    break;
                case 'dominant':
                    basePrice = 17800;  // Снижено с 20189
                    break;
                case 'premiant':
                    basePrice = 19900;  // Снижено с 22305
                    break;
                default:
                    basePrice = 18000;
            }

            // Для транзитности между отображаемой и итоговой ценой
            // добавим множители, которые точнее имитируют итоговую цену
            // и делают ее более предсказуемой

            // Расчет цены дополнительных услуг
            let additionalServicesPrice = 0;
            if (additionalServices) {
                if (additionalServices.havarijniPojisteni && additionalServices.havarijniPojisteni.enabled) {
                    additionalServicesPrice += additionalServices.havarijniPojisteni.vehiclePrice * 0.05;
                }
                if (additionalServices.pojisteniOdcizeni && additionalServices.pojisteniOdcizeni.enabled) {
                    additionalServicesPrice += 1200;  // Изменено с 1500
                }
                if (additionalServices.zivelniPojisteni && additionalServices.zivelniPojisteni.enabled) {
                    additionalServicesPrice += 400;  // Изменено с 444
                }
                if (additionalServices.stetSeZveri && additionalServices.stetSeZveri.enabled) {
                    additionalServicesPrice += 900;  // Изменено с 920
                }
            }

            // Изменены и упрощены скидки для лучшей предсказуемости
            const discounts = customerInfo && customerInfo.drivingExperience > 5 ? 800 : 0;

            const mockResult = {
                basePrice: basePrice,
                additionalServicesPrice: Math.round(additionalServicesPrice),
                discounts: discounts,
                totalPrice: Math.round(basePrice + additionalServicesPrice - discounts)
            };

            // Создаем ключ кэша для заглушки
            const mockCacheKey = this._generateCacheKey(vehicleId, packageType, customerInfo, additionalServices);

            // Сохраняем заглушку в кэш
            calculationCache.set(mockCacheKey, mockResult);

            return mockResult;
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