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

            // Используем заглушку для тестирования без API
            // В реальном проекте использовать vehicleService.getVehicleInfoByVin(vin)
            const vehicle = await vehicleService.getMockVehicleInfoByVin(vin);

            res.status(200).json({
                success: true,
                data: vehicle
            });
        } catch (error) {
            console.error('Ошибка при получении ТС по VIN:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось получить информацию о транспортном средстве',
                error: error.message
            });
        }
    },

    // Создание нового транспортного средства вручную (без API)
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

module.exports = vehicleController;