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
                return existingVehicle;
            }

            // Если в кэше нет, запрашиваем информацию из внешнего API
            // В реальном проекте тут нужно использовать ваш API с корректными параметрами
            const response = await axios.get(`${config.vehicleApiUrl}/${vin}`, {
                headers: {
                    'Authorization': `Bearer ${config.vehicleApiKey}`
                }
            });

            // Проверка ответа от API
            if (response.data && response.data.Status === 1 && response.data.Data) {
                const vehicleData = response.data.Data;

                // Преобразуем дату первой регистрации в год
                const registrationYear = vehicleData.DatumPrvniRegistrace ?
                    new Date(vehicleData.DatumPrvniRegistrace).getFullYear() : null;

                // Создаем новую запись в базе данных
                const vehicle = new Vehicle({
                    vin: vin,
                    type: this.determineVehicleType(vehicleData.VozidloDruh),
                    isElectric: vehicleData.VozidloElektricke === "ANO",
                    brand: vehicleData.TovarniZnacka,
                    model: vehicleData.ObchodniOznaceni,
                    year: registrationYear,
                    engineVolume: vehicleData.MotorZdvihObjem,
                    weight: vehicleData.HmotnostiProvozni,
                    ownersCount: vehicleData.PocetVlastniku,
                    apiData: vehicleData
                });

                await vehicle.save();
                return vehicle;
            } else {
                throw new Error('Не удалось получить данные транспортного средства');
            }
        } catch (error) {
            console.error('Ошибка при получении информации о ТС:', error);
            throw error;
        }
    },

    // Определение типа ТС на основе данных от API
    determineVehicleType(vehicleTypeFromApi) {
        // Заглушка, в реальном проекте нужно реализовать логику преобразования
        // на основе реальных данных от API
        const typeMapping = {
            'OSOBNÍ AUTOMOBIL': 'car',
            'MOTOCYKL': 'motorcycle',
            'PŘÍPOJNÉ VOZIDLO': 'trailer'
        };

        return typeMapping[vehicleTypeFromApi] || 'car';
    },

    // Функция-заглушка для тестирования без реального API
    async getMockVehicleInfoByVin(vin) {
        // Пример данных, которые может вернуть API
        const mockData = {
            Status: 1,
            Data: {
                DatumPrvniRegistrace: "2007-08-21T00:00:00",
                TovarniZnacka: "RENAULT",
                ObchodniOznaceni: "MEGANE",
                MotorZdvihObjem: 1598.0,
                HmotnostiProvozni: 1230,
                PocetVlastniku: 4,
                VozidloDruh: "OSOBNÍ AUTOMOBIL",
                VozidloElektricke: "NE"
            }
        };

        // Создаем запись в базе данных на основе моковых данных
        const vehicle = new Vehicle({
            vin: vin,
            type: this.determineVehicleType(mockData.Data.VozidloDruh),
            isElectric: mockData.Data.VozidloElektricke === "ANO",
            brand: mockData.Data.TovarniZnacka,
            model: mockData.Data.ObchodniOznaceni,
            year: new Date(mockData.Data.DatumPrvniRegistrace).getFullYear(),
            engineVolume: mockData.Data.MotorZdvihObjem,
            weight: mockData.Data.HmotnostiProvozni,
            ownersCount: mockData.Data.PocetVlastniku,
            apiData: mockData.Data
        });

        await vehicle.save();
        return vehicle;
    }
};

module.exports = vehicleService;