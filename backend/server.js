require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./models/User');
const Product = require('./models/Product');

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicle');
const insuranceRoutes = require('./routes/insurance');
const adminRoutes = require('./routes/admin');
const initRoutes = require('./routes/init'); // Новый маршрут


const defaultProducts = [
    {
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
        pricing: { basePrice: 19229 }
    },
    {
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
        pricing: { basePrice: 20189 }
    },
    {
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
        pricing: { basePrice: 22305 }
    }
];

// Инициализация приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


const PORT = config.port || 5000;
// Подключение к базе данных
mongoose
    .connect(config.mongoURI)
    .then(async () => {
        console.log('MongoDB connected');

        // ─── Автосоздание админа ───
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount === 0) {
            await User.create({
                username: 'admin',
                password: 'admin',
                role: 'admin'
            });
            console.log('Default admin user created');
        }

        const prodCount = await Product.countDocuments();
        if (prodCount === 0) {
            await Product.insertMany(defaultProducts);
            console.log('Default insurance products inserted');
        }

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/init', initRoutes); // Регистрация нового маршрута

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Что-то пошло не так!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Запуск сервера
        app.listen(PORT, () =>
            console.log(`Server running on port ${PORT}`)
        );
    })
    .catch(err =>
        console.error('MongoDB connection error:', err)
    );