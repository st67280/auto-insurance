const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// Инициализация администратора
router.post('/admin', async (req, res) => {
    try {
        // Проверяем, есть ли уже пользователи с ролью admin
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Администратор уже создан'
            });
        }

        // Создаем администратора по умолчанию
        const admin = await User.create({
            username: 'admin',
            password: 'admin',
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Администратор успешно создан',
            data: {
                id: admin._id,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Ошибка при создании администратора:', error);
        res.status(500).json({
            success: false,
            message: 'Не удалось создать администратора',
            error: error.message
        });
    }
});

// Инициализация базовых продуктов
router.post('/products', async (req, res) => {
    try {
        // Проверяем, есть ли уже продукты в базе
        const productsCount = await Product.countDocuments();
        if (productsCount > 0) {
            return res.status(400).json({
                success: false,
                message: 'Продукты уже инициализированы'
            });
        }

        // Создаем базовые продукты
        const products = [
            {
                type: 'standard',
                name: 'Standard',
                description: 'Базовый пакет страхования',
                features: {
                    propertyDamageLimit: 50000000, // 50 млн. Kč
                    healthDamageLimit: 50000000,   // 50 млн. Kč
                    driverInsuranceAmount: 100000, // 100 тыс. Kč
                    personalItemsAmount: 5000,     // 5 тыс. Kč
                    assistanceServices: true,
                    ownVehicleDamage: false,
                    replacementVehicle: false
                },
                pricing: {
                    basePrice: 6000,
                    weightMultiplier: 1.0,
                    engineVolumeMultiplier: 1.0,
                    vehicleAgeMultiplier: 1.0,
                    ownershipCountMultiplier: 1.0,
                    electricVehicleDiscount: 10
                },
                active: true
            },
            {
                type: 'dominant',
                name: 'Dominant',
                description: 'Расширенный пакет страхования',
                features: {
                    propertyDamageLimit: 100000000, // 100 млн. Kč
                    healthDamageLimit: 100000000,   // 100 млн. Kč
                    driverInsuranceAmount: 200000,  // 200 тыс. Kč
                    personalItemsAmount: 10000,     // 10 тыс. Kč
                    assistanceServices: true,
                    ownVehicleDamage: false,
                    replacementVehicle: false
                },
                pricing: {
                    basePrice: 10000,
                    weightMultiplier: 1.02,
                    engineVolumeMultiplier: 1.05,
                    vehicleAgeMultiplier: 1.02,
                    ownershipCountMultiplier: 1.02,
                    electricVehicleDiscount: 15
                },
                active: true
            },
            {
                type: 'premiant',
                name: 'Premiant',
                description: 'Премиальный пакет страхования',
                features: {
                    propertyDamageLimit: 200000000, // 200 млн. Kč
                    healthDamageLimit: 200000000,   // 200 млн. Kč
                    driverInsuranceAmount: 300000,  // 300 тыс. Kč
                    personalItemsAmount: 15000,     // 15 тыс. Kč
                    assistanceServices: true,
                    ownVehicleDamage: true,
                    replacementVehicle: true
                },
                pricing: {
                    basePrice: 15000,
                    weightMultiplier: 1.05,
                    engineVolumeMultiplier: 1.1,
                    vehicleAgeMultiplier: 1.05,
                    ownershipCountMultiplier: 1.05,
                    electricVehicleDiscount: 20
                },
                active: true
            }
        ];

        await Product.insertMany(products);

        res.status(201).json({
            success: true,
            count: products.length,
            message: 'Базовые продукты успешно инициализированы'
        });
    } catch (error) {
        console.error('Ошибка при инициализации продуктов:', error);
        res.status(500).json({
            success: false,
            message: 'Не удалось инициализировать продукты',
            error: error.message
        });
    }
});

module.exports = router;