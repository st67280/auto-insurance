import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsurance } from '../hooks/useInsurance';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Tooltip from '../components/Tooltip';
import { FiShield, FiAlertTriangle, FiCloud, FiTarget } from 'react-icons/fi';

// Стилизованные компоненты
const Container = styled.div`
    margin-bottom: 2rem;
`;

const ServiceOption = styled.div`
    padding: 1.5rem;
    border: 1px solid var(--light-gray);
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
    background-color: white;
`;

const ServiceHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const Checkbox = styled.input`
    margin-right: 1rem;
    width: 18px;
    height: 18px;
    cursor: pointer;
`;

const ServiceTitle = styled.h3`
    margin: 0;
    flex: 1;
`;

const ServicePrice = styled.div`
    font-weight: 500;
    color: var(--primary-color);
`;

const ServiceDescription = styled.p`
    margin: 0 0 1rem 2rem;
    color: #666;
`;

const FormGroup = styled.div`
    margin: 1rem 0 1.5rem 2rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
`;

const Input = styled.input`
    width: 100%;
    max-width: 300px;
    height: var(--input-height);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border: 1px solid #ced4da;
    border-radius: var(--border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

    &:focus {
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 0.2rem rgba(0, 178, 227, 0.25);
        outline: none;
    }
`;

const Card = styled.div`
    background-color: var(--light-color);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
`;

const AdditionalBenefits = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const Benefit = styled.div`
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
`;

const BenefitIcon = styled.div`
    margin-right: 1rem;
    font-size: 1.5rem;
    color: var(--primary-color);
`;

const BenefitText = styled.div`
    flex: 1;
`;

const BenefitTitle = styled.h4`
    margin: 0 0 0.5rem 0;
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

// Компонент выбора дополнительных услуг (шаг 4)
const AdditionalServices = () => {
    const {
        vehicle,
        additionalServices,
        updateAdditionalServices,
        calculateInsurance,
        pricing,
        loadingPricing,
        nextStep,
        prevStep
    } = useInsurance();

    const [localAdditionalServices, setLocalAdditionalServices] = useState(additionalServices);
    const [localPricing, setLocalPricing] = useState(null);

    const navigate = useNavigate();

    // Инициализация состояний
    useEffect(() => {
        setLocalAdditionalServices(additionalServices);
    }, [additionalServices]);

    useEffect(() => {
        setLocalPricing(pricing);
    }, [pricing]);

    // Обработчик изменения дополнительных услуг
    const handleServiceChange = (service, value) => {
        const updatedServices = {
            ...localAdditionalServices,
            [service]: {
                ...localAdditionalServices[service],
                ...value
            }
        };

        setLocalAdditionalServices(updatedServices);
    };

    // Обработчик сохранения и перехода к следующему шагу
    const handleContinue = async () => {
        try {
            // Сохранение выбранных дополнительных услуг
            updateAdditionalServices(localAdditionalServices);

            // Пересчет стоимости страховки с учетом дополнительных услуг
            await calculateInsurance();

            // Переход к следующему шагу
            nextStep();
            navigate('/insurance/summary');
        } catch (error) {
            toast.error('Ошибка при расчете стоимости страховки');
        }
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        // Сохранение выбранных дополнительных услуг
        updateAdditionalServices(localAdditionalServices);

        prevStep();
        navigate('/insurance/package');
    };

    // Если нет информации о ТС или ценах
    if (!vehicle || !pricing) {
        return (
            <div>
                <h2>Ошибка загрузки данных</h2>
                <p>Пожалуйста, вернитесь к предыдущим шагам и проверьте введенные данные.</p>
                <Button type="button" onClick={handleBack}>
                    Назад
                </Button>
            </div>
        );
    }

    // Расчет примерной стоимости КАСКО (10% от стоимости автомобиля)
    const havarijniPrice = Math.round(localAdditionalServices.havarijniPojisteni.vehiclePrice * 0.05);

    // Расчет цены страхования от угона (500 Kč на 1 тонну веса)
    const pojisteniOdcizeniPrice = Math.round(vehicle.weight * 0.5);

    // Цены других дополнительных услуг
    const zivelniPrice = 444;
    const stetSeZveriPrice = 920;

    return (
        <Container>
            <h2>Дополнительные услуги</h2>

            <Card>
                <h3>Расширьте защиту вашего автомобиля</h3>
                <p>
                    Добавьте дополнительные услуги к вашему полису для полной защиты вашего автомобиля
                    и спокойствия на дороге.
                </p>
            </Card>

            {/* КАСКО */}
            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="havarijniPojisteni"
                        checked={localAdditionalServices.havarijniPojisteni.enabled}
                        onChange={(e) => handleServiceChange('havarijniPojisteni', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Хаварийное страхование (КАСКО)</ServiceTitle>
                    {localAdditionalServices.havarijniPojisteni.enabled ? (
                        <ServicePrice>{havarijniPrice} Kč / год</ServicePrice>
                    ) : (
                        <ServicePrice>Добавить</ServicePrice>
                    )}
                    <Tooltip text="Страхование вашего автомобиля от повреждений при ДТП, стихийных бедствий, вандализма и других рисков" />
                </ServiceHeader>

                <ServiceDescription>
                    Комплексная защита вашего автомобиля от всех видов повреждений и угона.
                </ServiceDescription>

                {localAdditionalServices.havarijniPojisteni.enabled && (
                    <FormGroup>
                        <Label htmlFor="vehiclePrice">Стоимость автомобиля (Kč)</Label>
                        <Input
                            type="number"
                            id="vehiclePrice"
                            name="vehiclePrice"
                            value={localAdditionalServices.havarijniPojisteni.vehiclePrice}
                            onChange={(e) => handleServiceChange('havarijniPojisteni', { vehiclePrice: parseInt(e.target.value) || 0 })}
                            min="0"
                            step="1000"
                        />
                    </FormGroup>
                )}
            </ServiceOption>

            {/* Страхование от угона */}
            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="pojisteniOdcizeni"
                        checked={localAdditionalServices.pojisteniOdcizeni.enabled}
                        onChange={(e) => handleServiceChange('pojisteniOdcizeni', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Страхование от угона</ServiceTitle>
                    {localAdditionalServices.pojisteniOdcizeni.enabled ? (
                        <ServicePrice>{pojisteniOdcizeniPrice} Kč / год</ServicePrice>
                    ) : (
                        <ServicePrice>Добавить</ServicePrice>
                    )}
                    <Tooltip text="Страхование на случай кражи вашего автомобиля" />
                </ServiceHeader>

                <ServiceDescription>
                    Полное возмещение в случае кражи вашего автомобиля.
                </ServiceDescription>
            </ServiceOption>

            {/* Страхование от стихийных бедствий */}
            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="zivelniPojisteni"
                        checked={localAdditionalServices.zivelniPojisteni.enabled}
                        onChange={(e) => handleServiceChange('zivelniPojisteni', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Страхование от стихийных бедствий</ServiceTitle>
                    {localAdditionalServices.zivelniPojisteni.enabled ? (
                        <ServicePrice>{zivelniPrice} Kč / год</ServicePrice>
                    ) : (
                        <ServicePrice>Добавить</ServicePrice>
                    )}
                    <Tooltip text="Страхование от повреждений, вызванных стихийными бедствиями (наводнение, град, ураган и т.д.)" />
                </ServiceHeader>

                <ServiceDescription>
                    Защита от повреждений, вызванных стихийными бедствиями, включая наводнение, град, ураган и др.
                </ServiceDescription>
            </ServiceOption>

            {/* Страхование от столкновения с животными */}
            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="stetSeZveri"
                        checked={localAdditionalServices.stetSeZveri.enabled}
                        onChange={(e) => handleServiceChange('stetSeZveri', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Страхование от столкновения с животными</ServiceTitle>
                    {localAdditionalServices.stetSeZveri.enabled ? (
                        <ServicePrice>{stetSeZveriPrice} Kč / год</ServicePrice>
                    ) : (
                        <ServicePrice>Добавить</ServicePrice>
                    )}
                    <Tooltip text="Страхование от повреждений, вызванных столкновением с животными" />
                </ServiceHeader>

                <ServiceDescription>
                    Возмещение ущерба при столкновении с дикими и домашними животными.
                </ServiceDescription>
            </ServiceOption>

            <h3>Преимущества дополнительного страхования</h3>

            <AdditionalBenefits>
                <Benefit>
                    <BenefitIcon>
                        <FiShield />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Комплексная защита</BenefitTitle>
                        <p>Защита от всех рисков при эксплуатации автомобиля</p>
                    </BenefitText>
                </Benefit>

                <Benefit>
                    <BenefitIcon>
                        <FiAlertTriangle />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Защита от воров</BenefitTitle>
                        <p>Полное возмещение в случае угона вашего автомобиля</p>
                    </BenefitText>
                </Benefit>

                <Benefit>
                    <BenefitIcon>
                        <FiCloud />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Защита от стихии</BenefitTitle>
                        <p>Спокойствие при любых погодных условиях</p>
                    </BenefitText>
                </Benefit>

                <Benefit>
                    <BenefitIcon>
                        <FiTarget />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Защита от животных</BenefitTitle>
                        <p>Возмещение ущерба при столкновении с животными</p>
                    </BenefitText>
                </Benefit>
            </AdditionalBenefits>

            <ButtonGroup>
                <Button type="button" onClick={handleBack}>
                    Назад
                </Button>
                <Button
                    type="button"
                    onClick={handleContinue}
                    disabled={loadingPricing}
                >
                    {loadingPricing ? 'Загрузка...' : 'Продолжить'}
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default AdditionalServices;