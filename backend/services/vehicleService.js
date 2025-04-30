const axios = require('axios');
const config = require('../config');
const Vehicle = require('../models/Vehicle');

// Сервис для работы с информацией о транспортных средствах
const vehicleService = {
    // Получение информации о ТС по VIN коду из внешнего API
    async getVehicleInfoByVin(vin) {
        try {
            // Проверка кэша - возможно у нас уже есть информация об этом VIN
            const existingVehicle = await Vehicle.findOne({ vin });
            if (existingVehicle) {
                return {
                    Status: 1,
                    Data: existingVehicle.apiData
                };
            }

            // Если в кэше нет, запрашиваем информацию из внешнего API
            const apiUrl = `${config.vehicleApiUrl}?vin=${vin}`;
            console.log(`Запрос к API по VIN: ${vin}, URL: ${apiUrl}`);

            // Исправлено: API key передается в параметре apiKey вместо X-Api-Key заголовка
            const response = await axios.get(apiUrl, {
                headers: {
                    'apiKey': config.vehicleApiKey  // Изменен формат заголовка
                }
            });

            console.log('Ответ от API:', JSON.stringify(response.data, null, 2));

            // Проверка ответа от API
            if (response.data && response.data.Status === 1 && response.data.Data) {
                // Сохраняем данные в кэш для будущих запросов
                await this.saveVehicleData(vin, response.data);
                return response.data;
            } else {
                throw new Error(`Некорректный ответ от API: ${JSON.stringify(response.data)}`);
            }
        } catch (error) {
            console.error('Ошибка при получении информации о ТС из API:', error);
            throw error;
        }
    },

    // Сохранение данных о ТС в базу данных
    async saveVehicleData(vin, apiData) {
        try {
            // Проверяем, существует ли уже запись для данного VIN
            let vehicle = await Vehicle.findOne({ vin });

            if (vehicle) {
                // Обновляем существующую запись
                vehicle.apiData = apiData.Data;
                vehicle.lastUpdated = new Date();
                await vehicle.save();
            } else {
                // Создаем новую запись
                vehicle = new Vehicle({
                    vin,
                    apiData: apiData.Data,
                    type: this.determineVehicleType(apiData.Data.DruhVozidla),
                    brand: apiData.Data.TovarniZnacka,
                    model: apiData.Data.ObchodniOznaceni,
                    year: new Date(apiData.Data.DatumPrvniRegistrace).getFullYear(),
                    engineVolume: apiData.Data.MotorZdvihObjem,
                    weight: apiData.Data.HmotnostiProvozni,
                    ownersCount: apiData.Data.PocetVlastniku
                });
                await vehicle.save();
            }

            return vehicle;
        } catch (error) {
            console.error('Ошибка при сохранении данных о ТС:', error);
            throw error;
        }
    },

    // Определение типа ТС на основе данных от API
    determineVehicleType(vehicleTypeFromApi) {
        // Маппинг типов транспортных средств из API в наши типы
        const typeMapping = {
            'OSOBNÍ AUTOMOBIL': 'car',
            'MOTOCYKL': 'motorcycle',
            'PŘÍPOJNÉ VOZIDLO': 'trailer'
        };

        return typeMapping[vehicleTypeFromApi] || 'car';
    }
};

module.exports = vehicleService;