const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    vin: {
        type: String,
        required: [true, 'Пожалуйста, укажите VIN код'],
        unique: true,
        trim: true,
        uppercase: true
    },
    type: {
        type: String,
        enum: ['car', 'motorcycle', 'trailer'],
        required: [true, 'Укажите тип транспортного средства']
    },
    isElectric: {
        type: Boolean,
        default: false
    },
    // Основные данные из API
    brand: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    },
    year: {
        type: Number
    },
    engineVolume: {
        type: Number
    },
    weight: {
        type: Number
    },
    ownersCount: {
        type: Number
    },
    // Оригинальные данные из API
    apiData: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);