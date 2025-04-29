import React, { createContext, useState, useEffect } from 'react';
import insuranceService from '../services/insuranceService';
import vehicleService from '../services/vehicleService';
import { toast } from 'react-toastify';

// Создание контекста страхования
export const InsuranceContext = createContext(null);

export const InsuranceProvider = ({ children }) => {
    // Состояние транспортного средства
    const [vehicle, setVehicle] = useState(null);
    const [vehicleType, setVehicleType] = useState('car'); // car, motorcycle, trailer
    const [isElectric, setIsElectric] = useState(false);
    const [loadingVehicle, setLoadingVehicle] = useState(false);
    const [vehicleError, setVehicleError] = useState(null);

    // Состояние страхователя
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        surname: '',
        birthYear: new Date().getFullYear() - 30, // Значение по умолчанию
        phone: '',
        email: '',
        address: '',
        customerType: 'physical', // physical, entrepreneur, legal
        drivingExperience: 1,
        accidentsCount: 0
    });

    // Состояние страховки
    const [selectedPackage, setSelectedPackage] = useState('dominant');
    const [availablePackages, setAvailablePackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(false);

    // Дополнительные услуги
    const [additionalServices, setAdditionalServices] = useState({
        havarijniPojisteni: {
            enabled: false,
            vehiclePrice: 0
        },
        pojisteniOdcizeni: {
            enabled: false
        },
        zivelniPojisteni: {
            enabled: false
        },
        stetSeZveri: {
            enabled: false
        }
    });

    // Расчет страховки
    const [pricing, setPricing] = useState(null);
    const [loadingPricing, setLoadingPricing] = useState(false);
    const [pricingError, setPricingError] = useState(null);

    // Состояние процесса оформления
    const [currentStep, setCurrentStep] = useState(1);
    const [insurance, setInsurance] = useState(null);

    // Загрузка доступных пакетов страхования при первой загрузке
    useEffect(() => {
        const loadPackages = async () => {
            try {
                setLoadingPackages(true);
                const packages = await insuranceService.getAvailablePackages();
                setAvailablePackages(packages);
            } catch (err) {
                console.error('Ошибка при загрузке пакетов:', err);
                toast.error('Не удалось загрузить доступные пакеты страхования');
            } finally {
                setLoadingPackages(false);
            }
        };

        loadPackages();
    }, []);

    // Функция получения информации о ТС по VIN
    const getVehicleByVin = async (vin) => {
        setLoadingVehicle(true);
        setVehicleError(null);
        try {
            const vehicleData = await vehicleService.getVehicleByVin(vin);
            setVehicle(vehicleData);
            setVehicleType(vehicleData.type);
            setIsElectric(vehicleData.isElectric);
            return vehicleData;
        } catch (err) {
            console.error('Ошибка при получении ТС:', err);
            setVehicleError(err.message || 'Не удалось получить информацию о ТС');
            toast.error('Не удалось получить информацию о транспортном средстве');
            throw err;
        } finally {
            setLoadingVehicle(false);
        }
    };

    // Функция создания ТС вручную
    const createVehicle = async (vehicleData) => {
        setLoadingVehicle(true);
        setVehicleError(null);
        try {
            const newVehicle = await vehicleService.createVehicle(vehicleData);
            setVehicle(newVehicle);
            setVehicleType(newVehicle.type);
            setIsElectric(newVehicle.isElectric);
            return newVehicle;
        } catch (err) {
            console.error('Ошибка при создании ТС:', err);
            setVehicleError(err.message || 'Не удалось создать ТС');
            toast.error('Не удалось создать транспортное средство');
            throw err;
        } finally {
            setLoadingVehicle(false);
        }
    };

    // Функция обновления информации о страхователе
    const updateCustomerInfo = (info) => {
        setCustomerInfo({ ...customerInfo, ...info });
    };

    // Функция выбора пакета страхования
    const selectPackage = (packageType) => {
        setSelectedPackage(packageType);
    };

    // Функция обновления дополнительных услуг
    const updateAdditionalServices = (services) => {
        setAdditionalServices({ ...additionalServices, ...services });
    };

    // Функция расчета стоимости страховки
    const calculateInsurance = async () => {
        if (!vehicle) {
            setPricingError('Выберите транспортное средство');
            return null;
        }

        setLoadingPricing(true);
        setPricingError(null);
        try {
            const pricingData = await insuranceService.calculateInsurance(
                vehicle._id,
                selectedPackage,
                customerInfo,
                additionalServices
            );
            setPricing(pricingData);
            return pricingData;
        } catch (err) {
            console.error('Ошибка при расчете страховки:', err);
            setPricingError(err.message || 'Не удалось рассчитать стоимость страховки');
            toast.error('Не удалось рассчитать стоимость страховки');
            throw err;
        } finally {
            setLoadingPricing(false);
        }
    };

    // Функция создания страховки
    const createInsurance = async () => {
        if (!vehicle || !customerInfo.name || !customerInfo.phone) {
            toast.error('Заполните все обязательные поля');
            return null;
        }

        try {
            const newInsurance = await insuranceService.createInsurance(
                vehicle._id,
                selectedPackage,
                customerInfo,
                additionalServices
            );
            setInsurance(newInsurance);
            toast.success('Страховка успешно создана');
            return newInsurance;
        } catch (err) {
            console.error('Ошибка при создании страховки:', err);
            toast.error('Не удалось создать страховку');
            throw err;
        }
    };

    // Функция перехода к следующему шагу
    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    // Функция перехода к предыдущему шагу
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Функция сброса формы
    const resetForm = () => {
        setVehicle(null);
        setVehicleType('car');
        setIsElectric(false);
        setCustomerInfo({
            name: '',
            surname: '',
            birthYear: new Date().getFullYear() - 30,
            phone: '',
            email: '',
            address: '',
            customerType: 'physical',
            drivingExperience: 1,
            accidentsCount: 0
        });
        setSelectedPackage('dominant');
        setAdditionalServices({
            havarijniPojisteni: {
                enabled: false,
                vehiclePrice: 0
            },
            pojisteniOdcizeni: {
                enabled: false
            },
            zivelniPojisteni: {
                enabled: false
            },
            stetSeZveri: {
                enabled: false
            }
        });
        setPricing(null);
        setCurrentStep(1);
        setInsurance(null);
    };

    // Предоставляемое значение контекста
    const value = {
        vehicle,
        vehicleType,
        setVehicleType,
        isElectric,
        setIsElectric,
        loadingVehicle,
        vehicleError,
        getVehicleByVin,
        createVehicle,

        customerInfo,
        updateCustomerInfo,

        selectedPackage,
        availablePackages,
        loadingPackages,
        selectPackage,

        additionalServices,
        updateAdditionalServices,

        pricing,
        loadingPricing,
        pricingError,
        calculateInsurance,

        currentStep,
        nextStep,
        prevStep,

        insurance,
        createInsurance,
        resetForm
    };

    return (
        <InsuranceContext.Provider value={value}>
            {children}
        </InsuranceContext.Provider>
    );
};