import React, { createContext, useState, useEffect } from 'react';
import insuranceService from '../services/insuranceService';
import vehicleService from '../services/vehicleService';
import { toast } from 'react-toastify';

// Create Insurance context
export const InsuranceContext = createContext(null);

export const InsuranceProvider = ({ children }) => {
    // Vehicle state
    const [vehicle, setVehicle] = useState(null);
    const [vehicleType, setVehicleType] = useState('car'); // car, motorcycle, trailer
    const [isElectric, setIsElectric] = useState(false);
    const [loadingVehicle, setLoadingVehicle] = useState(false);
    const [vehicleError, setVehicleError] = useState(null);

    // Customer state
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        surname: '',
        birthYear: new Date().getFullYear() - 30, // Default value
        phone: '',
        email: '',
        address: '',
        customerType: 'physical', // physical, entrepreneur, legal
        drivingExperience: 1,
        accidentsCount: 0
    });

    // Insurance package state
    const [selectedPackage, setSelectedPackage] = useState('dominant');
    const [availablePackages, setAvailablePackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(false);

    // Additional services (keep original keys so component finds them)
    const [additionalServices, setAdditionalServices] = useState({
        havarijniPojisteni: { enabled: false, vehiclePrice: 0 },
        pojisteniOdcizeni: { enabled: false },
        zivelniPojisteni: { enabled: false },
        stetSeZveri: { enabled: false }
    });

    // Pricing state
    const [pricing, setPricing] = useState(null);
    const [loadingPricing, setLoadingPricing] = useState(false);
    const [pricingError, setPricingError] = useState(null);
    const [needRecalculation, setNeedRecalculation] = useState(false);

    // Form process state
    const [currentStep, setCurrentStep] = useState(1);
    const [insurance, setInsurance] = useState(null);

    // Load available packages on first render
    useEffect(() => {
        const loadPackages = async () => {
            try {
                setLoadingPackages(true);
                const packages = await insuranceService.getAvailablePackages();
                setAvailablePackages(packages);
            } catch (err) {
                console.error('Error loading packages:', err);
                toast.error('Failed to load available insurance packages');
            } finally {
                setLoadingPackages(false);
            }
        };
        loadPackages();
    }, []);

    // Get vehicle info by VIN
    const getVehicleByVin = async (vin) => {
        setLoadingVehicle(true);
        setVehicleError(null);
        try {
            const vehicleData = await vehicleService.getVehicleByVin(vin);
            setVehicle(vehicleData);
            setVehicleType(vehicleData.type);
            setIsElectric(vehicleData.isElectric);
            setNeedRecalculation(true);
            setPricing(null);
            return vehicleData;
        } catch (err) {
            console.error('Error fetching vehicle:', err);
            setVehicleError(err.message || 'Failed to fetch vehicle information');
            toast.error('Failed to fetch vehicle information');
            throw err;
        } finally {
            setLoadingVehicle(false);
        }
    };

    // Create vehicle manually
    const createVehicle = async (vehicleData) => {
        setLoadingVehicle(true);
        setVehicleError(null);
        try {
            const newVehicle = await vehicleService.createVehicle(vehicleData);
            setVehicle(newVehicle);
            setVehicleType(newVehicle.type);
            setIsElectric(newVehicle.isElectric);
            setNeedRecalculation(true);
            setPricing(null);
            return newVehicle;
        } catch (err) {
            console.error('Error creating vehicle:', err);
            setVehicleError(err.message || 'Failed to create vehicle');
            toast.error('Failed to create vehicle');
            throw err;
        } finally {
            setLoadingVehicle(false);
        }
    };

    // Update customer info
    const updateCustomerInfo = (info) => {
        setCustomerInfo({ ...customerInfo, ...info });
        setNeedRecalculation(true);
    };

    // Select insurance package
    const selectPackage = (packageType) => {
        if (packageType !== selectedPackage) {
            setSelectedPackage(packageType);
            setNeedRecalculation(true);
        }
    };

    // Update additional services (using original keys)
    const updateAdditionalServices = (services) => {
        setAdditionalServices({ ...additionalServices, ...services });
        setNeedRecalculation(true);
    };

    // Calculate insurance cost
    const calculateInsurance = async () => {
        if (!vehicle) {
            setPricingError('Please select a vehicle');
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
            setNeedRecalculation(false);
            return pricingData;
        } catch (err) {
            console.error('Error calculating insurance:', err);
            setPricingError(err.message || 'Failed to calculate insurance cost');
            toast.error('Failed to calculate insurance cost');
            throw err;
        } finally {
            setLoadingPricing(false);
        }
    };

    // Auto-recalculate when needed
    useEffect(() => {
        const autoRecalculate = async () => {
            if (vehicle && needRecalculation && currentStep >= 3) {
                try {
                    await calculateInsurance();
                } catch (error) {
                    console.error('Error in auto-recalculation:', error);
                }
            }
        };
        autoRecalculate();
    }, [vehicle, needRecalculation, currentStep]);

    // Create insurance record
    const createInsurance = async () => {
        if (!vehicle || !customerInfo.name || !customerInfo.phone) {
            toast.error('Please fill all required fields');
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
            toast.success('Insurance created successfully');
            return newInsurance;
        } catch (err) {
            console.error('Error creating insurance:', err);
            toast.error('Failed to create insurance');
            throw err;
        }
    };

    // Navigation between steps
    const nextStep = () => setCurrentStep(currentStep + 1);
    const prevStep = () => setCurrentStep(currentStep - 1);

    // Reset form
    const resetForm = () => {
        insuranceService.clearCalculationCache();
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
            havarijniPojisteni: { enabled: false, vehiclePrice: 0 },
            pojisteniOdcizeni: { enabled: false },
            zivelniPojisteni: { enabled: false },
            stetSeZveri: { enabled: false }
        });
        setPricing(null);
        setCurrentStep(1);
        setInsurance(null);
        setNeedRecalculation(false);
    };

    // Context value
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
