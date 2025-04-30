const vehicleService = require('../services/vehicleService');
const Vehicle = require('../models/Vehicle');

// Контроллер для работы с транспортными средствами
const vehicleController = {
    // Получение информации о ТС по VIN коду
    async getVehicleByVin(req, res) {
        try {
            const { vin } = req.params;

            // Проверка валидности VIN кода
            if (!vin || vin.length < 7) {
                return res.status(400).json({
                    success: false,
                    message: 'Укажите корректный VIN код'
                });
            }

            // Проверяем, есть ли уже такая машина в базе данных
            let vehicle = await Vehicle.findOne({ vin });

            // Если машина уже есть в базе, возвращаем ее данные
            if (vehicle) {
                return res.status(200).json({
                    success: true,
                    data: vehicle
                });
            }

            // Если машины нет в базе, запрашиваем данные из API
            try {
                const vehicleInfo = await vehicleService.getVehicleInfoByVin(vin);

                // Парсим и преобразуем данные из API в нашу модель данных
                const vehicleData = vehicleInfo.Data;

                // Преобразуем дату регистрации в год выпуска
                const registrationYear = vehicleData.DatumPrvniRegistrace
                    ? new Date(vehicleData.DatumPrvniRegistrace).getFullYear()
                    : null;

                // Создаем новую запись в базе данных
                vehicle = new Vehicle({
                    vin: vin,
                    type: determineVehicleType(vehicleData.VozidloDruh),
                    isElectric: vehicleData.VozidloElektricke === "ANO",
                    brand: vehicleData.TovarniZnacka,
                    model: vehicleData.ObchodniOznaceni,
                    year: registrationYear,
                    engineVolume: vehicleData.MotorZdvihObjem,
                    weight: vehicleData.HmotnostiProvozni,
                    ownersCount: vehicleData.PocetVlastniku,
                    apiData: vehicleData // Сохраняем оригинальные данные из API
                });

                await vehicle.save();
                return res.status(200).json({
                    success: true,
                    data: vehicle
                });
            } catch (error) {
                console.error('Error fetching vehicle info from API:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Не удалось получить информацию о транспортном средстве из API',
                    error: error.message
                });
            }
        } catch (error) {
            console.error('Error in getVehicleByVin:', error);
            return res.status(500).json({
                success: false,
                message: 'Не удалось обработать запрос',
                error: error.message
            });
        }
    },

    // Создание нового транспортного средства вручную
    async createVehicle(req, res) {
        try {
            const {
                vin,
                type,
                isElectric,
                brand,
                model,
                year,
                engineVolume,
                weight,
                ownersCount
            } = req.body;

            // Проверка наличия обязательных полей
            if (!vin || !type) {
                return res.status(400).json({
                    success: false,
                    message: 'Укажите VIN код и тип транспортного средства'
                });
            }

            // Проверка, существует ли ТС с таким VIN
            const existingVehicle = await Vehicle.findOne({ vin });
            if (existingVehicle) {
                return res.status(400).json({
                    success: false,
                    message: 'Транспортное средство с таким VIN уже существует'
                });
            }

            // Создание нового ТС
            const vehicle = await Vehicle.create({
                vin,
                type,
                isElectric: isElectric || false,
                brand,
                model,
                year,
                engineVolume,
                weight,
                ownersCount
            });

            res.status(201).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            console.error('Ошибка при создании ТС:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось создать транспортное средство',
                error: error.message
            });
        }
    },

    // Получение ТС по ID
    async getVehicleById(req, res) {
        try {
            const { id } = req.params;

            const vehicle = await Vehicle.findById(id);
            if (!vehicle) {
                return res.status(404).json({
                    success: false,
                    message: 'Транспортное средство не найдено'
                });
            }

            res.status(200).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            console.error('Ошибка при получении ТС по ID:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось получить информацию о транспортном средстве',
                error: error.message
            });
        }
    }
};

// Вспомогательная функция для определения типа транспортного средства
function determineVehicleType(vehicleTypeFromApi) {
    const typeMapping = {
        'OSOBNÍ AUTOMOBIL': 'car',
        'MOTOCYKL': 'motorcycle',
        'PŘÍPOJNÉ VOZIDLO': 'trailer'
    };

    return typeMapping[vehicleTypeFromApi] || 'car';
}

module.exports = vehicleController;