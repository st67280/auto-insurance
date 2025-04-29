const Product = require('../models/Product');
const Insurance = require('../models/Insurance');
const User = require('../models/User');

// Контроллер для административных функций
const adminController = {
    // Получение всех страховок
    async getAllInsurances(req, res) {
        try {
            const insurances = await Insurance.find()
                .populate('vehicle')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                count: insurances.length,
                data: insurances
            });
        } catch (error) {
            console.error('Ошибка при получении страховок:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось получить список страховок',
                error: error.message
            });
        }
    },

    // Обновление информации о страховке (включая скидки)
    async updateInsurance(req, res) {
        try {
            const { id } = req.params;
            const { status, pricing } = req.body;

            let insurance = await Insurance.findById(id);
            if (!insurance) {
                return res.status(404).json({
                    success: false,
                    message: 'Страховка не найдена'
                });
            }

            // Обновление статуса
            if (status) {
                insurance.status = status;
            }

            // Обновление цен
            if (pricing) {
                if (pricing.discounts !== undefined) {
                    insurance.pricing.discounts = pricing.discounts;
                    // Пересчитываем итоговую цену
                    insurance.pricing.totalPrice = insurance.pricing.basePrice +
                        insurance.pricing.additionalServicesPrice - pricing.discounts;
                }

                if (pricing.basePrice !== undefined) {
                    insurance.pricing.basePrice = pricing.basePrice;
                    // Пересчитываем итоговую цену
                    insurance.pricing.totalPrice = pricing.basePrice +
                        insurance.pricing.additionalServicesPrice - insurance.pricing.discounts;
                }
            }

            await insurance.save();

            res.status(200).json({
                success: true,
                data: insurance
            });
        } catch (error) {
            console.error('Ошибка при обновлении страховки:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось обновить страховку',
                error: error.message
            });
        }
    },

    // Получение всех страховых продуктов
    async getAllProducts(req, res) {
        try {
            const products = await Product.find().sort({ type: 1 });

            res.status(200).json({
                success: true,
                count: products.length,
                data: products
            });
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось получить список продуктов',
                error: error.message
            });
        }
    },

    // Создание нового страхового продукта
    async createProduct(req, res) {
        try {
            const { type, name, description, features, pricing, active } = req.body;

            // Проверка наличия обязательных полей
            if (!type || !name || !features || !pricing) {
                return res.status(400).json({
                    success: false,
                    message: 'Укажите тип, название, характеристики и цены продукта'
                });
            }

            // Создание нового продукта
            const product = await Product.create({
                type,
                name,
                description,
                features,
                pricing,
                active: active !== undefined ? active : true
            });

            res.status(201).json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Ошибка при создании продукта:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось создать продукт',
                error: error.message
            });
        }
    },

    // Обновление страхового продукта
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, description, features, pricing, active } = req.body;

            let product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Продукт не найден'
                });
            }

            // Обновление полей продукта
            if (name) product.name = name;
            if (description) product.description = description;
            if (features) product.features = { ...product.features, ...features };
            if (pricing) product.pricing = { ...product.pricing, ...pricing };
            if (active !== undefined) product.active = active;

            await product.save();

            res.status(200).json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Ошибка при обновлении продукта:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось обновить продукт',
                error: error.message
            });
        }
    },

    // Удаление страхового продукта
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Продукт не найден'
                });
            }

            await product.remove();

            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            console.error('Ошибка при удалении продукта:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось удалить продукт',
                error: error.message
            });
        }
    },

    // Инициализация базовых продуктов
    async initializeProducts(req, res) {
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
                        basePrice: 19229,
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
                        basePrice: 20189,
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
                        basePrice: 22305,
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
    },

    // Создание администратора по умолчанию
    async createDefaultAdmin(req, res) {
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
    }
};

module.exports = adminController;