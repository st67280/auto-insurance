const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

// Получение информации о ТС по VIN коду
router.get('/vin/:vin', vehicleController.getVehicleByVin);

// Создание нового ТС вручную
router.post('/', protect, vehicleController.createVehicle);

// Получение ТС по ID
router.get('/:id', vehicleController.getVehicleById);

module.exports = router;