const axios = require('axios');
const config = require('../config');
const Vehicle = require('../models/Vehicle');

// Сервис для работы с информацией о транспортных средствах
const vehicleService = {
    // Получение информации о ТС по VIN коду из внешнего API
    async getVehicleInfoByVin(vin) {
        try {
            // 1) Сначала проверяем, не закеширован ли уже этот VIN в базе
            const existingVehicle = await Vehicle.findOne({ vin });
            if (existingVehicle) {
                return {
                    Status: 1,
                    Data: existingVehicle.apiData
                };
            }

            // 2) Если нет — делаем реальный запрос в API, передавая VIN как параметр
            // и кладя API-ключ в заголовок api_key
            console.log(`Запрос к API по VIN: ${vin}`);
            const response = await axios.get(config.vehicleApiUrl, {
                params: { vin },
                headers: { api_key: config.vehicleApiKey }
            });
            console.log('Ответ от API:', JSON.stringify(response.data, null, 2));

            // 3) Если всё ок — сохраняем в кеш и возвращаем
            if (response.data && response.data.Status === 1 && response.data.Data) {
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
            const update = {
                apiData: apiData.Data,
                lastUpdated: new Date(),
                type: this.determineVehicleType(apiData.Data.DruhVozidla),
                brand: apiData.Data.TovarniZnacka,
                model: apiData.Data.ObchodniOznaceni,
                year: new Date(apiData.Data.DatumPrvniRegistrace).getFullYear(),
                engineVolume: apiData.Data.MotorZdvihObjem,
                weight: apiData.Data.HmotnostiProvozni,
                ownersCount: apiData.Data.PocetVlastniku
            };

            // upsert: если документ с таким vin есть – обновить, иначе – создать
            const vehicle = await Vehicle.findOneAndUpdate(
                { vin },
                update,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

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