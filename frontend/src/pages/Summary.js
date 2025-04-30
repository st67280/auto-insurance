import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsurance } from '../hooks/useInsurance';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

// Стилизованные компоненты
const Container = styled.div`
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
`;

const SummaryIcon = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
  color: var(--primary-color);
`;

const SummaryTitle = styled.h3`
  margin: 0;
  flex: 1;
`;

const SummaryPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const SummarySection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h4`
  margin-bottom: 1rem;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemLabel = styled.div`
  font-weight: ${props => props.bold ? '700' : '400'};
`;

const ItemValue = styled.div`
  font-weight: ${props => props.bold ? '700' : '400'};
  color: ${props => props.highlight ? 'var(--primary-color)' : 'inherit'};
`;

const TotalSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalLabel = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
`;

const TotalValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
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

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
`;

const SuccessIcon = styled(FiCheckCircle)`
  font-size: 2rem;
  margin-right: 1rem;
  color: #28a745;
`;

const InfoMessage = styled.div`
  background-color: #e2f1ff;
  color: #0c5460;
  padding: 1rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
`;

const InfoIcon = styled(FiInfo)`
  font-size: 1.5rem;
  margin-right: 1rem;
  color: var(--secondary-color);
`;

// Компонент итогового оформления страховки (шаг 5)
const Summary = () => {
    const {
        vehicle,
        vehicleType,
        isElectric,
        customerInfo,
        selectedPackage,
        additionalServices,
        pricing,
        calculateInsurance,
        createInsurance,
        insurance,
        resetForm
    } = useInsurance();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState(customerInfo.email || '');
    const [nationality, setNationality] = useState('CZ');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const navigate = useNavigate();

    // Пересчитываем стоимость страховки при загрузке страницы
    // useEffect(() => {
    //     const recalculatePricing = async () => {
    //         try {
    //             await calculateInsurance();
    //         } catch (error) {
    //             toast.error('Ошибка при расчете стоимости страховки');
    //         }
    //     };
    //
    //     if (!pricing && vehicle) {
    //         recalculatePricing();
    //     }
    // }, []);

    // Получаем информацию о типе транспортного средства
    const getVehicleTypeText = () => {
        switch (vehicleType) {
            case 'car': return 'Легковой автомобиль';
            case 'motorcycle': return 'Мотоцикл';
            case 'trailer': return 'Прицеп';
            default: return 'Транспортное средство';
        }
    };

    // Получаем информацию о пакете страхования
    const getPackageText = () => {
        switch (selectedPackage) {
            case 'standard': return 'Standard';
            case 'dominant': return 'Dominant';
            case 'premiant': return 'Premiant';
            default: return 'Неизвестный пакет';
        }
    };

    // Получаем информацию о типе страхователя
    const getCustomerTypeText = () => {
        switch (customerInfo.customerType) {
            case 'physical': return 'Физическое лицо';
            case 'entrepreneur': return 'Физическое лицо-предприниматель';
            case 'legal': return 'Юридическое лицо';
            default: return 'Неизвестный тип';
        }
    };

    // Валидация формы
    const validateForm = () => {
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Пожалуйста, укажите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Пожалуйста, укажите корректный email';
        }

        if (!nationality.trim()) {
            errors.nationality = 'Пожалуйста, укажите гражданство';
        }

        if (!agreeTerms) {
            errors.agreeTerms = 'Необходимо согласиться с условиями';
        }

        if (!agreePrivacy) {
            errors.agreePrivacy = 'Необходимо согласиться с политикой конфиденциальности';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Обработчик оформления страховки
    const handleCreateInsurance = async () => {
        if (!validateForm()) {
            toast.error('Пожалуйста, исправьте ошибки в форме');
            return;
        }

        setLoading(true);

        try {
            // Обновляем данные клиента с учетом дополнительных полей
            const updatedCustomerInfo = {
                ...customerInfo,
                email,
                nationality
            };

            // Создаем страховку
            await createInsurance(vehicle._id, selectedPackage, updatedCustomerInfo, additionalServices);

            setSuccess(true);
            toast.success('Страховка успешно оформлена!');
        } catch (error) {
            toast.error('Ошибка при оформлении страховки');
        } finally {
            setLoading(false);
        }
    };

    // Обработчик начала нового оформления
    const handleNewInsurance = () => {
        resetForm();
        navigate('/insurance');
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        navigate('/insurance/additional');
    };

    // Если нет данных о ТС или стоимости
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

    // Если страховка успешно оформлена
    if (success || insurance) {
        return (
            <Container>
                <SuccessMessage>
                    <SuccessIcon />
                    <div>
                        <h3>Страховка успешно оформлена!</h3>
                        <p>Информация о вашей страховке отправлена на указанный email.</p>
                    </div>
                </SuccessMessage>

                <SummaryCard>
                    <SummaryHeader>
                        <SummaryIcon>
                            <FiCheckCircle />
                        </SummaryIcon>
                        <SummaryTitle>Полис № {Date.now().toString().substr(-8)}</SummaryTitle>
                        <SummaryPrice>{pricing.totalPrice} Kč / год</SummaryPrice>
                    </SummaryHeader>

                    <SummarySection>
                        <SectionTitle>Данные транспортного средства</SectionTitle>
                        <ItemRow>
                            <ItemLabel>Тип ТС</ItemLabel>
                            <ItemValue>{getVehicleTypeText()}{isElectric ? ' (электромобиль)' : ''}</ItemValue>
                        </ItemRow>
                        <ItemRow>
                            <ItemLabel>Марка</ItemLabel>
                            <ItemValue>{vehicle.brand}</ItemValue>
                        </ItemRow>
                        <ItemRow>
                            <ItemLabel>Модель</ItemLabel>
                            <ItemValue>{vehicle.model}</ItemValue>
                        </ItemRow>
                        <ItemRow>
                            <ItemLabel>VIN</ItemLabel>
                            <ItemValue>{vehicle.vin}</ItemValue>
                        </ItemRow>
                    </SummarySection>

                    <ButtonGroup>
                        <Button type="button" onClick={handleNewInsurance}>
                            Оформить новую страховку
                        </Button>
                        <Button type="button" onClick={() => navigate('/')}>
                            Вернуться на главную
                        </Button>
                    </ButtonGroup>
                </SummaryCard>
            </Container>
        );
    }

    return (
        <Container>
            <h2>Оформление страховки</h2>

            <InfoMessage>
                <InfoIcon />
                <div>
                    Проверьте правильность введенных данных перед оформлением страховки.
                </div>
            </InfoMessage>

            <SummaryCard>
                <SummaryHeader>
                    <SummaryIcon>
                        <FiAlertCircle />
                    </SummaryIcon>
                    <SummaryTitle>Итоговый расчет</SummaryTitle>
                    <SummaryPrice>{pricing.totalPrice} Kč / год</SummaryPrice>
                </SummaryHeader>

                <SummarySection>
                    <SectionTitle>Данные транспортного средства</SectionTitle>
                    <ItemRow>
                        <ItemLabel>Тип ТС</ItemLabel>
                        <ItemValue>{getVehicleTypeText()}{isElectric ? ' (электромобиль)' : ''}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Марка</ItemLabel>
                        <ItemValue>{vehicle.brand}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Модель</ItemLabel>
                        <ItemValue>{vehicle.model}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>VIN</ItemLabel>
                        <ItemValue>{vehicle.vin}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Год выпуска</ItemLabel>
                        <ItemValue>{vehicle.year || 'Не указан'}</ItemValue>
                    </ItemRow>
                </SummarySection>

                <SummarySection>
                    <SectionTitle>Данные страхователя</SectionTitle>
                    <ItemRow>
                        <ItemLabel>Имя и фамилия</ItemLabel>
                        <ItemValue>{customerInfo.name} {customerInfo.surname}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Тип страхователя</ItemLabel>
                        <ItemValue>{getCustomerTypeText()}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Адрес</ItemLabel>
                        <ItemValue>{customerInfo.address}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Телефон</ItemLabel>
                        <ItemValue>{customerInfo.phone}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Год рождения</ItemLabel>
                        <ItemValue>{customerInfo.birthYear}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Стаж вождения</ItemLabel>
                        <ItemValue>{customerInfo.drivingExperience} лет</ItemValue>
                    </ItemRow>
                </SummarySection>

                <SummarySection>
                    <SectionTitle>Параметры страховки</SectionTitle>
                    <ItemRow>
                        <ItemLabel>Пакет страхования</ItemLabel>
                        <ItemValue highlight>{getPackageText()}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Базовая стоимость</ItemLabel>
                        <ItemValue>{pricing.basePrice} Kč / год</ItemValue>
                    </ItemRow>

                    {additionalServices.havarijniPojisteni.enabled && (
                        <ItemRow>
                            <ItemLabel>Хаварийное страхование (КАСКО)</ItemLabel>
                            <ItemValue>Включено ({Math.round(additionalServices.havarijniPojisteni.vehiclePrice * 0.05)} Kč)</ItemValue>
                        </ItemRow>
                    )}

                    {additionalServices.pojisteniOdcizeni.enabled && (
                        <ItemRow>
                            <ItemLabel>Страхование от угона</ItemLabel>
                            <ItemValue>Включено ({Math.round(vehicle.weight * 0.5)} Kč)</ItemValue>
                        </ItemRow>
                    )}

                    {additionalServices.zivelniPojisteni.enabled && (
                        <ItemRow>
                            <ItemLabel>Страхование от стихийных бедствий</ItemLabel>
                            <ItemValue>Включено (444 Kč)</ItemValue>
                        </ItemRow>
                    )}

                    {additionalServices.stetSeZveri.enabled && (
                        <ItemRow>
                            <ItemLabel>Страхование от столкновения с животными</ItemLabel>
                            <ItemValue>Включено (920 Kč)</ItemValue>
                        </ItemRow>
                    )}

                    {pricing.discounts > 0 && (
                        <ItemRow>
                            <ItemLabel>Скидки</ItemLabel>
                            <ItemValue>-{pricing.discounts} Kč</ItemValue>
                        </ItemRow>
                    )}
                </SummarySection>

                <TotalSection>
                    <TotalLabel>Итоговая стоимость:</TotalLabel>
                    <TotalValue>{pricing.totalPrice} Kč / год</TotalValue>
                </TotalSection>
            </SummaryCard>

            <SummaryCard>
                <h3>Дополнительная информация</h3>

                <FormGroup>
                    <Label htmlFor="email">E-mail*</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите ваш email для получения полиса"
                    />
                    {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="nationality">Гражданство*</Label>
                    <Input
                        type="text"
                        id="nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                    />
                    {formErrors.nationality && <div className="form-error">{formErrors.nationality}</div>}
                </FormGroup>

                <FormGroup>
                    <CheckboxLabel>
                        <Checkbox
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                        />
                        Я согласен с условиями страхования*
                    </CheckboxLabel>
                    {formErrors.agreeTerms && <div className="form-error">{formErrors.agreeTerms}</div>}

                    <CheckboxLabel>
                        <Checkbox
                            type="checkbox"
                            checked={agreePrivacy}
                            onChange={(e) => setAgreePrivacy(e.target.checked)}
                        />
                        Я согласен с обработкой персональных данных*
                    </CheckboxLabel>
                    {formErrors.agreePrivacy && <div className="form-error">{formErrors.agreePrivacy}</div>}
                </FormGroup>
            </SummaryCard>

            <ButtonGroup>
                <Button type="button" onClick={handleBack}>
                    Назад
                </Button>
                <Button
                    type="button"
                    onClick={handleCreateInsurance}
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Оформить страховку'}
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default Summary;