const insuranceService = require('../services/insuranceService');
const Insurance = require('../models/Insurance');
const Product = require('../models/Product');

// Контроллер для работы со страховками
const insuranceController = {
    // Расчет стоимости страховки
    async calculateInsurance(req, res) {
        try {
            const { vehicleId, packageType, customerInfo, additionalServices } = req.body;

            // Проверка наличия обязательных полей
            if (!vehicleId || !packageType) {
                return res.status(400).json({
                    success: false,
                    message: 'Укажите ID транспортного средства и тип пакета'
                });
            }

            // Расчет стоимости страховки
            const pricing = await insuranceService.calculateInsurance(
                vehicleId,
                packageType,
                customerInfo,
                additionalServices
            );

            res.status(200).json({
                success: true,
                data: pricing
            });
        } catch (error) {
            console.error('Ошибка при расчете страховки:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось рассчитать стоимость страховки',
                error: error.message
            });
        }
    },

    // Создание новой страховки
    async createInsurance(req, res) {
        try {
            const { vehicleId, packageType, customerInfo, additionalServices } = req.body;

            // Проверка наличия обязательных полей
            if (!vehicleId || !packageType || !customerInfo) {
                return res.status(400).json({
                    success: false,
                    message: 'Укажите ID транспортного средства, тип пакета и информацию о страхователе'
                });
            }

            // Создание новой страховки
            const insurance = await insuranceService.createInsurance(
                vehicleId,
                packageType,
                customerInfo,
                additionalServices
            );

            res.status(201).json({
                success: true,
                data: insurance
            });
        } catch (error) {
            console.error('Ошибка при создании страховки:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось создать страховку',
                error: error.message
            });
        }
    },

    // Получение информации о страховке по ID
    async getInsuranceById(req, res) {
        try {
            const { id } = req.params;

            const insurance = await Insurance.findById(id).populate('vehicle');
            if (!insurance) {
                return res.status(404).json({
                    success: false,
                    message: 'Страховка не найдена'
                });
            }

            res.status(200).json({
                success: true,
                data: insurance
            });
        } catch (error) {
            console.error('Ошибка при получении страховки:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось получить информацию о страховке',
                error: error.message
            });
        }
    },

    // Обновление статуса страховки
    async updateInsuranceStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Проверка наличия статуса
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Укажите статус страховки'
                });
            }

            // Обновление статуса страховки
            const insurance = await insuranceService.updateInsuranceStatus(id, status);

            res.status(200).json({
                success: true,
                data: insurance
            });
        } catch (error) {
            console.error('Ошибка при обновлении статуса страховки:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось обновить статус страховки',
                error: error.message
            });
        }
    },

    // Получение доступных продуктов (пакетов страхования)
    async getProducts(req, res) {
        try {
            const products = await Product.find({ active: true });

            res.status(200).json({
                success: true,
                data: products
            });
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось получить доступные продукты',
                error: error.message
            });
        }
    }
};

module.exports = insuranceController;