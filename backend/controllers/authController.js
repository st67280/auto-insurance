const User = require('../models/User');

// Контроллер для авторизации и управления пользователями
const authController = {
    // Регистрация нового пользователя
    async register(req, res) {
        try {
            const { username, password, role } = req.body;

            // Проверка, существует ли пользователь с таким именем
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Пользователь с таким именем уже существует'
                });
            }

            // Создание нового пользователя
            const user = await User.create({
                username,
                password,
                role: role || 'user'
            });

            // Генерация JWT токена
            const token = user.getSignedToken();

            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось зарегистрировать пользователя',
                error: error.message
            });
        }
    },

    // Авторизация пользователя
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Проверка наличия имени пользователя и пароля
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Пожалуйста, укажите имя пользователя и пароль'
                });
            }

            // Поиск пользователя в базе данных
            const user = await User.findOne({ username }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Неверное имя пользователя или пароль'
                });
            }

            // Проверка пароля
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Неверное имя пользователя или пароль'
                });
            }

            // Генерация JWT токена
            const token = user.getSignedToken();

            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось авторизоваться',
                error: error.message
            });
        }
    },

    // Получение информации о текущем пользователе
    async getMe(req, res) {
        try {
            const user = await User.findById(req.user.id);

            res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            console.error('Ошибка при получении информации о пользователе:', error);
            res.status(500).json({
                success: false,
                message: 'Не удалось получить информацию о пользователе',
                error: error.message
            });
        }
    }
};

module.exports = authController;