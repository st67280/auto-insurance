import api from './api';

// Сервис для работы со страховками
const insuranceService = {
    // Получение доступных пакетов страхования
    async getAvailablePackages() {
        try {
            const response = await api.get('/insurance/products/available');
            return response.data;
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

    // Расчет стоимости страховки
    async calculateInsurance(vehicleId, packageType, customerInfo, additionalServices) {
        try {
            const response = await api.post('/insurance/calculate', {
                vehicleId,
                packageType,
                customerInfo,
                additionalServices
            });
            return response.data;
        } catch (error) {
            console.error('Error calculating insurance:', error);

            // Заглушка для тестирования без API
            let basePrice = 0;
            switch (packageType) {
                case 'standard':
                    basePrice = 19229;
                    break;
                case 'dominant':
                    basePrice = 20189;
                    break;
                case 'premiant':
                    basePrice = 22305;
                    break;
                default:
                    basePrice = 20000;
            }

            // Расчет цены дополнительных услуг
            let additionalServicesPrice = 0;
            if (additionalServices) {
                if (additionalServices.havarijniPojisteni && additionalServices.havarijniPojisteni.enabled) {
                    additionalServicesPrice += additionalServices.havarijniPojisteni.vehiclePrice * 0.05;
                }
                if (additionalServices.pojisteniOdcizeni && additionalServices.pojisteniOdcizeni.enabled) {
                    additionalServicesPrice += 1500;
                }
                if (additionalServices.zivelniPojisteni && additionalServices.zivelniPojisteni.enabled) {
                    additionalServicesPrice += 444;
                }
                if (additionalServices.stetSeZveri && additionalServices.stetSeZveri.enabled) {
                    additionalServicesPrice += 920;
                }
            }

            // Моковые скидки
            const discounts = customerInfo.drivingExperience > 5 ? 1000 : 0;

            return {
                basePrice: basePrice,
                additionalServicesPrice: Math.round(additionalServicesPrice),
                discounts: discounts,
                totalPrice: Math.round(basePrice + additionalServicesPrice - discounts)
            };
        }
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

export default insuranceService;