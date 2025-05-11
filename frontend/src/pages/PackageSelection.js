import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsurance } from '../hooks/useInsurance';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Tooltip from '../components/Tooltip';
import { FiCheck, FiX, FiShield, FiHeart, FiPackage } from 'react-icons/fi';
import insuranceService from '../services/insuranceService';

// Стилизованные компоненты
const PackagesContainer = styled.div`
    margin-bottom: 2rem;
`;

const PackageOptions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const PackageOption = styled.div`
    flex: 1;
    min-width: 250px;
    border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--light-gray)'};
    border-radius: var(--border-radius);
    padding: 1.5rem;
    background-color: ${props => props.selected ? 'rgba(0, 114, 163, 0.05)' : 'white'};
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        border-color: ${props => props.selected ? 'var(--primary-color)' : 'var(--secondary-color)'};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const PackageHeader = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--light-gray);
`;

const PackageTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
`;

const PackagePrice = styled.div`
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary-color);
`;

const PackagePricePeriod = styled.span`
    font-size: 0.875rem;
    color: #666;
`;

const PackageFeatures = styled.div`
    margin-bottom: 1.5rem;
`;

const PackageFeature = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
`;

const FeatureIcon = styled.div`
    margin-right: 0.75rem;
    font-size: 1.25rem;
    color: ${props => props.color || 'var(--primary-color)'};
`;

const FeatureText = styled.div`
    flex: 1;
`;

const FeatureValue = styled.div`
    font-weight: 500;
`;

const StarsContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
`;

const Star = styled.span`
    color: ${props => props.$filled ? 'var(--primary-color)' : 'var(--light-gray)'};
    font-size: 1.25rem;
`;

const RadioButton = styled.input`
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
`;

const Button = styled.button`
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;

    &:hover {
        background-color: var(--primary-hover);
    }

    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
`;

const LoadingContainer = styled.div`
    text-align: center;
    padding: 2rem 0;
`;

// Компонент выбора пакета страхования (шаг 3)
const PackageSelection = () => {
    const {
        vehicle,
        selectedPackage,
        selectPackage,
        calculateInsurance,
        pricing,
        loadingPricing,
        nextStep,
        prevStep,
        availablePackages,
        customerInfo,
        additionalServices
    } = useInsurance();

    const [packagePrices, setPackagePrices] = useState({
        standard: 0,
        dominant: 0,
        premiant: 0
    });
    const [initialCalculationDone, setInitialCalculationDone] = useState(false);
    // Локальный флаг для отслеживания необходимости пересчета
    const [needsRecalculation, setNeedsRecalculation] = useState(false);

    const navigate = useNavigate();

    // Расчет стоимости страховки при загрузке страницы - только один раз
    useEffect(() => {
        const calculatePrices = async () => {
            if (!vehicle) return;

            try {
                // Сначала убедимся, что расчет работает для текущего пакета
                const currentPricing = await calculateInsurance();
                console.log('Current package pricing:', currentPricing);

                const prices = {};

                // Используем insuranceService напрямую
                for (const packageType of ['standard', 'dominant', 'premiant']) {
                    console.log(`Calculating for ${packageType}...`);

                    const pricingData = await insuranceService.calculateInsurance(
                        vehicle._id,
                        packageType,
                        customerInfo,
                        additionalServices
                    );

                    console.log(`Result for ${packageType}:`, pricingData);

                    if (pricingData && pricingData.totalPrice) {
                        prices[packageType] = pricingData.totalPrice;
                    } else {
                        console.error(`No totalPrice for ${packageType}`);
                        prices[packageType] = 0;
                    }
                }

                console.log('Final prices:', prices);
                setPackagePrices(prices);
                setInitialCalculationDone(true);
            } catch (err) {
                console.error('Ошибка при расчете цен:', err);
                toast.error('Не удалось рассчитать цены пакетов');
            }
        };

        if (vehicle && !initialCalculationDone) {
            console.log('Starting price calculation...');
            console.log('Vehicle:', vehicle);
            console.log('CustomerInfo:', customerInfo);
            console.log('AdditionalServices:', additionalServices);
            calculatePrices();
        }
    }, [vehicle, customerInfo, additionalServices]);

// Упрощенный обработчик выбора пакета
    const handlePackageSelect = (packageType) => {
        if (packageType !== selectedPackage) {
            selectPackage(packageType);
        }
    };

    // Обработчик кнопки "Продолжить"
    const handleContinue = () => {
        nextStep();
        navigate('/insurance/additional');
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        prevStep();
        navigate('/insurance/customer');
    };

    // Если данные еще загружаются
    if (loadingPricing && !initialCalculationDone) {
        return (
            <LoadingContainer>
                <h2>Calculation of insurance costs...</h2>
                <p>Please wait</p>
            </LoadingContainer>
        );
    }

    return (
        <div>
            <h2>Select Insurance Package</h2>

            <PackagesContainer>
                <PackageOptions>
                    {/* Пакет Standard */}
                    <PackageOption
                        selected={selectedPackage === 'standard'}
                        onClick={() => handlePackageSelect('standard')}
                    >
                        <PackageHeader>
                            <StarsContainer>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star>★</Star>
                                <Star>★</Star>
                            </StarsContainer>
                            <PackageTitle>Standard</PackageTitle>
                            <PackagePrice>
                                {packagePrices.standard} Kč<PackagePricePeriod> / year</PackagePricePeriod>
                            </PackagePrice>
                        </PackageHeader>

                        <PackageFeatures>
                            <PackageFeature>
                                <FeatureIcon>
                                    <FiShield />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Damage to property and belongings</div>
                                    <FeatureValue>50 mil. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Maximum limit of insurance indemnity for damage caused to property and belongings of third parties" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiHeart />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Damage to health</div>
                                    <FeatureValue>50 mil. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Maximum limit of insurance indemnity for damage caused to the health of third persons" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Driver's insurance</div>
                                    <FeatureValue>100 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Insurance indemnity for vehicle driver injuries. Driver's insurance Driver's insurance" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Personal effects insurance</div>
                                    <FeatureValue>5 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Insurance indemnity for damage to or loss of personal belongings as a result of a road traffic accident" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Assistant services</div>
                                </FeatureText>
                                <Tooltip text="Roadside assistance and towing in the event of an accident or breakdown" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Insurance at fault in a road traffic accident</div>
                                </FeatureText>
                                <Tooltip text="Insurance for damage to one's own vehicle in case of fault in a traffic accident" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Lease of a substitute vehicle</div>
                                </FeatureText>
                                <Tooltip text="Reimbursement of expenses for renting a replacement vehicle when at fault in a road traffic accident" />
                            </PackageFeature>
                        </PackageFeatures>

                        <RadioButton
                            type="radio"
                            name="package"
                            value="standard"
                            checked={selectedPackage === 'standard'}
                            onChange={() => handlePackageSelect('standard')}
                        />
                    </PackageOption>

                    {/* Пакет Dominant */}
                    <PackageOption
                        selected={selectedPackage === 'dominant'}
                        onClick={() => handlePackageSelect('dominant')}
                    >
                        <PackageHeader>
                            <StarsContainer>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star>★</Star>
                            </StarsContainer>
                            <PackageTitle>Dominant</PackageTitle>
                            <PackagePrice>
                                {packagePrices.dominant} Kč<PackagePricePeriod> / year</PackagePricePeriod>
                            </PackagePrice>
                        </PackageHeader>

                        <PackageFeatures>
                            <PackageFeature>
                                <FeatureIcon>
                                    <FiShield />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Damage to property and belongings</div>
                                    <FeatureValue>100 mil. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Maximum limit of insurance indemnity for damage caused to property and belongings of third parties" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiHeart />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Damage to health</div>
                                    <FeatureValue>100 mil. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Maximum limit of insurance indemnity for damage caused to the health of third persons" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Driver's insurance</div>
                                    <FeatureValue>200 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Insurance indemnity for injuries to the driver of a motor vehicle" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Personal effects insurance</div>
                                    <FeatureValue>10 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Insurance indemnity for damage to or loss of personal belongings as a result of a road traffic accident" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Assistant services</div>
                                </FeatureText>
                                <Tooltip text="Roadside assistance and towing in the event of an accident or breakdown" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Insurance at fault in a road traffic accident</div>
                                </FeatureText>
                                <Tooltip text="Insurance of damage to your own vehicle if you are at fault in a traffic accident" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Lease of a substitute vehicle</div>
                                </FeatureText>
                                <Tooltip text="Reimbursement of expenses for renting a replacement vehicle when at fault in a road traffic accident" />
                            </PackageFeature>
                        </PackageFeatures>

                        <RadioButton
                            type="radio"
                            name="package"
                            value="dominant"
                            checked={selectedPackage === 'dominant'}
                            onChange={() => handlePackageSelect('dominant')}
                        />
                    </PackageOption>

                    {/* Пакет Premiant */}
                    <PackageOption
                        selected={selectedPackage === 'premiant'}
                        onClick={() => handlePackageSelect('premiant')}
                    >
                        <PackageHeader>
                            <StarsContainer>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                                <Star $filled>★</Star>
                            </StarsContainer>
                            <PackageTitle>Premiant</PackageTitle>
                            <PackagePrice>
                                {packagePrices.premiant} Kč<PackagePricePeriod> / year</PackagePricePeriod>
                            </PackagePrice>
                        </PackageHeader>

                        <PackageFeatures>
                            <PackageFeature>
                                <FeatureIcon>
                                    <FiShield />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Damage to property and belongings</div>
                                    <FeatureValue>200 mil. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Maximum limit of insurance indemnity for damage caused to property and belongings of third parties" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiHeart />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Damage to health</div>
                                    <FeatureValue>200 mil. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Maximum limit of insurance indemnity for damage caused to the health of third persons" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Driver's insurance</div>
                                    <FeatureValue>300 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Insurance indemnity for injuries to the driver of a motor vehicle" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Personal effects insurance</div>
                                    <FeatureValue>15 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Insurance indemnity for damage to or loss of personal belongings as a result of a road traffic accident" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Assistant services</div>
                                </FeatureText>
                                <Tooltip text="Roadside assistance and towing in the event of an accident or breakdown" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Insurance at fault in a road traffic accident</div>
                                    <FeatureValue>10 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Insurance of damage to your own vehicle if you are at fault in a traffic accident" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Lease of a substitute vehicle</div>
                                    <FeatureValue>10 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Reimbursement of expenses for renting a replacement vehicle when at fault in a road traffic accident" />
                            </PackageFeature>
                        </PackageFeatures>

                        <RadioButton
                            type="radio"
                            name="package"
                            value="premiant"
                            checked={selectedPackage === 'premiant'}
                            onChange={() => handlePackageSelect('premiant')}
                        />
                    </PackageOption>
                </PackageOptions>
            </PackagesContainer>

            <ButtonGroup>
                <Button type="button" onClick={handleBack}>
                    Back
                </Button>
                <Button type="button" onClick={handleContinue}>
                    Continue
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default PackageSelection;