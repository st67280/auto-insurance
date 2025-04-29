import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsurance } from '../hooks/useInsurance';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Tooltip from '../components/Tooltip';
import { FiCheck, FiX, FiShield, FiHeart, FiPackage } from 'react-icons/fi';

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
  color: ${props => props.filled ? 'var(--primary-color)' : 'var(--light-gray)'};
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
        prevStep
    } = useInsurance();

    const [packagePrices, setPackagePrices] = useState({
        standard: 0,
        dominant: 0,
        premiant: 0
    });

    const navigate = useNavigate();

    // Расчет стоимости страховки при загрузке страницы
    useEffect(() => {
        const calculatePrices = async () => {
            try {
                // Расчет для выбранного пакета
                const pricingData = await calculateInsurance();

                if (pricingData) {
                    // Простая оценка для других пакетов (в реальном приложении нужно делать отдельные запросы)
                    setPackagePrices({
                        standard: Math.round(pricingData.totalPrice * 0.95),
                        dominant: pricingData.totalPrice,
                        premiant: Math.round(pricingData.totalPrice * 1.1)
                    });
                }
            } catch (error) {
                toast.error('Ошибка при расчете стоимости страховки');
            }
        };

        if (vehicle) {
            calculatePrices();
        }
    }, [vehicle, calculateInsurance]);

    // Обработчик выбора пакета
    const handlePackageSelect = (packageType) => {
        selectPackage(packageType);
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
    if (loadingPricing) {
        return (
            <LoadingContainer>
                <h2>Расчет стоимости страховки...</h2>
                <p>Пожалуйста, подождите</p>
            </LoadingContainer>
        );
    }

    return (
        <div>
            <h2>Выберите пакет страхования</h2>

            <PackagesContainer>
                <PackageOptions>
                    {/* Пакет Standard */}
                    <PackageOption
                        selected={selectedPackage === 'standard'}
                        onClick={() => handlePackageSelect('standard')}
                    >
                        <PackageHeader>
                            <StarsContainer>
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star>★</Star>
                                <Star>★</Star>
                            </StarsContainer>
                            <PackageTitle>Standard</PackageTitle>
                            <PackagePrice>
                                {packagePrices.standard} Kč<PackagePricePeriod> / год</PackagePricePeriod>
                            </PackagePrice>
                        </PackageHeader>

                        <PackageFeatures>
                            <PackageFeature>
                                <FeatureIcon>
                                    <FiShield />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ущерб имуществу и вещам</div>
                                    <FeatureValue>50 млн. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Максимальный лимит страхового возмещения за ущерб, причиненный имуществу и вещам третьих лиц" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiHeart />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ущерб здоровью</div>
                                    <FeatureValue>50 млн. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Максимальный лимит страхового возмещения за ущерб, причиненный здоровью третьих лиц" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование водителя</div>
                                    <FeatureValue>100 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Страховое возмещение при травмах водителя транспортного средства" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование личных вещей</div>
                                    <FeatureValue>5 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Страховое возмещение при повреждении или утрате личных вещей в результате ДТП" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ассистентские услуги</div>
                                </FeatureText>
                                <Tooltip text="Помощь на дороге и эвакуация при ДТП или поломке" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование при виновности в ДТП</div>
                                </FeatureText>
                                <Tooltip text="Страхование ущерба собственного транспортного средства при виновности в ДТП" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Аренда замещающего ТС</div>
                                </FeatureText>
                                <Tooltip text="Возмещение расходов на аренду замещающего транспортного средства при виновности в ДТП" />
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
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star>★</Star>
                            </StarsContainer>
                            <PackageTitle>Dominant</PackageTitle>
                            <PackagePrice>
                                {packagePrices.dominant} Kč<PackagePricePeriod> / год</PackagePricePeriod>
                            </PackagePrice>
                        </PackageHeader>

                        <PackageFeatures>
                            <PackageFeature>
                                <FeatureIcon>
                                    <FiShield />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ущерб имуществу и вещам</div>
                                    <FeatureValue>100 млн. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Максимальный лимит страхового возмещения за ущерб, причиненный имуществу и вещам третьих лиц" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiHeart />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ущерб здоровью</div>
                                    <FeatureValue>100 млн. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Максимальный лимит страхового возмещения за ущерб, причиненный здоровью третьих лиц" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование водителя</div>
                                    <FeatureValue>200 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Страховое возмещение при травмах водителя транспортного средства" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование личных вещей</div>
                                    <FeatureValue>10 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Страховое возмещение при повреждении или утрате личных вещей в результате ДТП" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ассистентские услуги</div>
                                </FeatureText>
                                <Tooltip text="Помощь на дороге и эвакуация при ДТП или поломке" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование при виновности в ДТП</div>
                                </FeatureText>
                                <Tooltip text="Страхование ущерба собственного транспортного средства при виновности в ДТП" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--error-color)">
                                    <FiX />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Аренда замещающего ТС</div>
                                </FeatureText>
                                <Tooltip text="Возмещение расходов на аренду замещающего транспортного средства при виновности в ДТП" />
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
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                                <Star filled>★</Star>
                            </StarsContainer>
                            <PackageTitle>Premiant</PackageTitle>
                            <PackagePrice>
                                {packagePrices.premiant} Kč<PackagePricePeriod> / год</PackagePricePeriod>
                            </PackagePrice>
                        </PackageHeader>

                        <PackageFeatures>
                            <PackageFeature>
                                <FeatureIcon>
                                    <FiShield />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ущерб имуществу и вещам</div>
                                    <FeatureValue>200 млн. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Максимальный лимит страхового возмещения за ущерб, причиненный имуществу и вещам третьих лиц" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiHeart />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ущерб здоровью</div>
                                    <FeatureValue>200 млн. Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Максимальный лимит страхового возмещения за ущерб, причиненный здоровью третьих лиц" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование водителя</div>
                                    <FeatureValue>300 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Страховое возмещение при травмах водителя транспортного средства" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon>
                                    <FiPackage />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование личных вещей</div>
                                    <FeatureValue>15 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Страховое возмещение при повреждении или утрате личных вещей в результате ДТП" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Ассистентские услуги</div>
                                </FeatureText>
                                <Tooltip text="Помощь на дороге и эвакуация при ДТП или поломке" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Страхование при виновности в ДТП</div>
                                    <FeatureValue>10 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Страхование ущерба собственного транспортного средства при виновности в ДТП" />
                            </PackageFeature>

                            <PackageFeature>
                                <FeatureIcon color="var(--success-color)">
                                    <FiCheck />
                                </FeatureIcon>
                                <FeatureText>
                                    <div>Аренда замещающего ТС</div>
                                    <FeatureValue>10 000 Kč</FeatureValue>
                                </FeatureText>
                                <Tooltip text="Возмещение расходов на аренду замещающего транспортного средства при виновности в ДТП" />
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
                    Назад
                </Button>
                <Button type="button" onClick={handleContinue}>
                    Продолжить
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default PackageSelection;