const express = require('express');
const router = express.Router();
const insuranceController = require('../controllers/insuranceController');
const { protect } = require('../middleware/auth');

// Расчет стоимости страховки
router.post('/calculate', insuranceController.calculateInsurance);

// Создание новой страховки
router.post('/', insuranceController.createInsurance);

// Получение информации о страховке по ID
router.get('/:id', insuranceController.getInsuranceById);

// Обновление статуса страховки
router.put('/:id/status', protect, insuranceController.updateInsuranceStatus);

// Получение доступных продуктов (пакетов страхования)
router.get('/products/available', insuranceController.getProducts);

module.exports = router;