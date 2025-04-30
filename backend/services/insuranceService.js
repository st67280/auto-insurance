const Product = require('../models/Product');
const Vehicle = require('../models/Vehicle');
const Insurance = require('../models/Insurance');

// Сервис для расчета и управления страховками
const insuranceService = {
    // Расчет стоимости страховки
    async calculateInsurance(vehicleId, packageType, customerInfo, additionalServices) {
        try {
            const mongoose = require('mongoose');
            if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
                throw new Error('Некорректный ID транспортного средства');
            }
            // Получаем информацию о ТС и продукте
            const vehicle = await Vehicle.findById(vehicleId);
            if (!vehicle) {
                throw new Error('Транспортное средство не найдено');
            }

            const product = await Product.findOne({ type: packageType, active: true });
            if (!product) {
                throw new Error('Продукт не найден');
            }

            // Расчет базовой стоимости
            let basePrice = this.calculateBasePrice(vehicle, product, customerInfo);

            // Расчет стоимости дополнительных услуг
            const additionalServicesPrice = this.calculateAdditionalServicesPrice(
                additionalServices,
                vehicle
            );

            // Применение скидок
            const discounts = this.calculateDiscounts(vehicle, customerInfo);

            // Итоговая цена
            const totalPrice = Math.round(basePrice + additionalServicesPrice - discounts);

            return {
                basePrice,
                additionalServicesPrice,
                discounts,
                totalPrice
            };
        } catch (error) {
            console.error('Ошибка при расчете страховки:', error);
            throw error;
        }
    },

    // Расчет базовой стоимости страховки
    calculateBasePrice(vehicle, product, customerInfo) {
        let basePrice = product.pricing.basePrice;

        // Учет веса ТС
        basePrice *= (vehicle.weight / 1000) * product.pricing.weightMultiplier;

        // Учет объема двигателя (если не электромобиль)
        if (!vehicle.isElectric && vehicle.engineVolume) {
            basePrice *= (vehicle.engineVolume / 1500) * product.pricing.engineVolumeMultiplier;
        }

        // Учет возраста ТС
        const currentYear = new Date().getFullYear();
        if (vehicle.year) {
            const vehicleAge = currentYear - vehicle.year;
            basePrice *= (1 + (vehicleAge * 0.02)) * product.pricing.vehicleAgeMultiplier;
        }

        // Учет количества владельцев
        if (vehicle.ownersCount) {
            basePrice *= (1 + (vehicle.ownersCount * 0.05)) * product.pricing.ownershipCountMultiplier;
        }

        // Учет опыта вождения
        if (customerInfo && customerInfo.drivingExperience) {
            basePrice *= Math.max(0.8, 1 - (customerInfo.drivingExperience * 0.02));
        }

        // Учет количества аварий
        if (customerInfo && customerInfo.accidentsCount) {
            basePrice *= (1 + (customerInfo.accidentsCount * 0.15));
        }

        return Math.round(basePrice);
    },

    // Расчет стоимости дополнительных услуг
    calculateAdditionalServicesPrice(additionalServices, vehicle) {
        let price = 0;

        if (!additionalServices) {
            return price;
        }

        // Расчет стоимости КАСКО
        if (additionalServices.havarijniPojisteni && additionalServices.havarijniPojisteni.enabled) {
            const vehiclePrice = additionalServices.havarijniPojisteni.vehiclePrice || 0;
            price += vehiclePrice * 0.05; // 5% от стоимости ТС
        }

        // Расчет стоимости страхования от угона
        if (additionalServices.pojisteniOdcizeni && additionalServices.pojisteniOdcizeni.enabled) {
            price += vehicle.weight * 0.5;
        }

        // Расчет стоимости страхования от стихийных бедствий
        if (additionalServices.zivelniPojisteni && additionalServices.zivelniPojisteni.enabled) {
            price += 444;
        }

        // Расчет стоимости страхования от столкновения с животными
        if (additionalServices.stetSeZveri && additionalServices.stetSeZveri.enabled) {
            price += 920;
        }

        return Math.round(price);
    },

    // Расчет скидок
    calculateDiscounts(vehicle, customerInfo) {
        let discounts = 0;

        // Скидка для электромобилей
        if (vehicle.isElectric) {
            discounts += 1500;
        }

        // Скидка за возраст страхователя (если старше 30 лет)
        if (customerInfo && customerInfo.birthYear) {
            const age = new Date().getFullYear() - customerInfo.birthYear;
            if (age > 30) {
                discounts += 500;
            }
        }

        return Math.round(discounts);
    },

    // Создание новой страховки
    async createInsurance(vehicleId, packageType, customerInfo, additionalServices) {
        try {
            // Рассчитываем стоимость страховки
            const pricing = await this.calculateInsurance(
                vehicleId,
                packageType,
                customerInfo,
                additionalServices
            );

            // Создаем новую страховку
            const insurance = new Insurance({
                vehicle: vehicleId,
                customerInfo,
                selectedPackage: packageType,
                additionalServices,
                pricing,
                status: 'draft'
            });

            await insurance.save();
            return insurance;
        } catch (error) {
            console.error('Ошибка при создании страховки:', error);
            throw error;
        }
    },

    // Обновление статуса страховки
    async updateInsuranceStatus(insuranceId, status) {
        try {
            const insurance = await Insurance.findById(insuranceId);
            if (!insurance) {
                throw new Error('Страховка не найдена');
            }

            insurance.status = status;
            await insurance.save();

            return insurance;
        } catch (error) {
            console.error('Ошибка при обновлении статуса страховки:', error);
            throw error;
        }
    }
};

module.exports = insuranceService;