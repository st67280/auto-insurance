const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

// Проверка наличия и валидности JWT токена
exports.protect = async (req, res, next) => {
    let token;

    // Проверяем наличие токена в заголовках
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Проверяем, что токен существует
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Для доступа необходима авторизация'
        });
    }

    try {
        // Проверяем валидность токена
        const decoded = jwt.verify(token, config.jwtSecret);

        // Находим пользователя с соответствующим ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        // Добавляем пользователя в объект запроса
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Недействительный или истекший токен'
        });
    }
};

// Проверка роли пользователя
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Вы не имеете прав на выполнение этого действия'
            });
        }
        next();
    };
};