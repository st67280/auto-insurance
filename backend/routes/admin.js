const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Применяем middleware для всех маршрутов
router.use(protect);
router.use(authorize('admin'));

// Получение всех страховок
router.get('/insurances', adminController.getAllInsurances);

// Обновление информации о страховке
router.put('/insurances/:id', adminController.updateInsurance);

// Получение всех страховых продуктов
router.get('/products', adminController.getAllProducts);

// Создание нового страхового продукта
router.post('/products', adminController.createProduct);

// Обновление страхового продукта
router.put('/products/:id', adminController.updateProduct);

// Удаление страхового продукта
router.delete('/products/:id', adminController.deleteProduct);

// Инициализация базовых продуктов
router.post('/initialize/products', adminController.initializeProducts);

// Создание администратора по умолчанию
router.post('/initialize/admin', adminController.createDefaultAdmin);

module.exports = router;