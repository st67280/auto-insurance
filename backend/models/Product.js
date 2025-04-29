const mongoose = require('mongoose');

// Модель для управления страховыми продуктами и их ценами
const ProductSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['standard', 'dominant', 'premiant'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    // Базовые характеристики продукта
    features: {
        propertyDamageLimit: {
            type: Number,  // лимит ответственности по имуществу (млн)
            required: true
        },
        healthDamageLimit: {
            type: Number,  // лимит ответственности по здоровью (млн)
            required: true
        },
        driverInsuranceAmount: {
            type: Number,  // страхование водителя (тыс)
            required: true
        },
        personalItemsAmount: {
            type: Number,  // страхование личных вещей (тыс)
            required: true
        },
        assistanceServices: {
            type: Boolean,
            default: true
        },
        ownVehicleDamage: {
            type: Boolean,
            default: false
        },
        replacementVehicle: {
            type: Boolean,
            default: false
        },
        // другие характеристики продукта
    },
    // Правила расчета стоимости
    pricing: {
        basePrice: {
            type: Number,
            required: true
        },
        // Множители для расчета стоимости
        weightMultiplier: {
            type: Number,
            default: 1
        },
        engineVolumeMultiplier: {
            type: Number,
            default: 1
        },
        vehicleAgeMultiplier: {
            type: Number,
            default: 1
        },
        ownershipCountMultiplier: {
            type: Number,
            default: 1
        },
        electricVehicleDiscount: {
            type: Number,  // процент скидки для электромобилей
            default: 0
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Обновление даты изменения перед сохранением
ProductSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', ProductSchema);