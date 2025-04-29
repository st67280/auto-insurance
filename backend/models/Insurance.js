const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    // Данные страхователя
    customerInfo: {
        name: String,
        surname: String,
        birthYear: Number,
        phone: String,
        email: String,
        address: String,
        customerType: {
            type: String,
            enum: ['physical', 'entrepreneur', 'legal'],
            default: 'physical'
        },
        drivingExperience: Number,
        accidentsCount: Number
    },
    // Выбранная страховка
    selectedPackage: {
        type: String,
        enum: ['standard', 'dominant', 'premiant'],
        required: true
    },
    // Дополнительные услуги
    additionalServices: {
        havarijniPojisteni: {
            enabled: {
                type: Boolean,
                default: false
            },
            vehiclePrice: {
                type: Number,
                default: 0
            }
        },
        pojisteniOdcizeni: {
            enabled: {
                type: Boolean,
                default: false
            }
        },
        zivelniPojisteni: {
            enabled: {
                type: Boolean,
                default: false
            }
        },
        stetSeZveri: {
            enabled: {
                type: Boolean,
                default: false
            }
        }
    },
    // Расчет стоимости
    pricing: {
        basePrice: Number,
        discounts: Number,
        additionalServicesPrice: Number,
        totalPrice: Number
    },
    // Статус страховки
    status: {
        type: String,
        enum: ['draft', 'pending', 'active', 'expired', 'cancelled'],
        default: 'draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Обновление даты изменения перед сохранением
InsuranceSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Insurance', InsuranceSchema);