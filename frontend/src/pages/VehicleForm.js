import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsurance } from '../hooks/useInsurance';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FiTruck, FiShoppingCart, FiBox } from 'react-icons/fi';

// Стилизованные компоненты
const VehicleTypeOptions = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const VehicleTypeOption = styled.div`
    border: 2px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--light-gray)'};
    border-radius: var(--border-radius);
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: ${props => props.selected ? 'rgba(0, 114, 163, 0.05)' : 'white'};

    &:hover {
        border-color: var(--secondary-color);
    }
`;

const OptionHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
`;

const OptionIcon = styled.div`
    font-size: 1.5rem;
    margin-right: 1rem;
    color: var(--primary-color);
`;

const OptionTitle = styled.h3`
    margin: 0;
`;

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--light-gray);
    background-color: white;
`;

const ToggleLabel = styled.span`
    margin-left: 1rem;
`;

const Toggle = styled.label`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
`;

const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;
`;

const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;

    &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    ${ToggleInput}:checked + & {
        background-color: var(--primary-color);
    }

    ${ToggleInput}:focus + & {
        box-shadow: 0 0 1px var(--primary-color);
    }

    ${ToggleInput}:checked + &:before {
        transform: translateX(26px);
    }
`;

const Form = styled.form`
    margin-bottom: 2rem;
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

const InputGroup = styled.div`
    display: flex;
    align-items: center;
`;

const InfoButton = styled.button`
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    padding: 0.375rem 0.75rem;
    margin-left: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
`;

const ErrorMessage = styled.div`
    color: var(--error-color);
    margin-top: 0.25rem;
    font-size: 0.875rem;
`;

const ManualInputToggle = styled.div`
    margin-top: 1rem;
    text-align: center;
`;

const ManualInputLink = styled.button`
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    text-decoration: underline;
    font-size: 0.875rem;
    padding: 0;

    &:hover {
        color: var(--primary-hover);
    }
`;

// Компонент формы выбора транспортного средства (шаг 1)
const VehicleForm = () => {
    const {
        vehicleType,
        setVehicleType,
        isElectric,
        setIsElectric,
        getVehicleByVin,
        createVehicle,
        nextStep,
        loadingVehicle
    } = useInsurance();

    const [vin, setVin] = useState('');
    const [vinError, setVinError] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualVehicle, setManualVehicle] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        engineVolume: 0,
        weight: 0,
        ownersCount: 1
    });

    const navigate = useNavigate();

    // Обработчик изменения ручного ввода данных
    const handleManualInputChange = (e) => {
        const { name, value } = e.target;
        setManualVehicle({
            ...manualVehicle,
            [name]: name === 'year' || name === 'engineVolume' || name === 'weight' || name === 'ownersCount'
                ? parseInt(value) || 0
                : value
        });
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Если используется ручной ввод
        if (showManualInput) {
            try {
                // Проверка обязательных полей
                if (!manualVehicle.brand || !manualVehicle.model || !manualVehicle.weight) {
                    toast.error('Пожалуйста, заполните все обязательные поля');
                    return;
                }

                // Создание ТС вручную
                await createVehicle({
                    vin: vin || `MANUAL-${Date.now()}`,
                    type: vehicleType,
                    isElectric,
                    ...manualVehicle
                });

                toast.success('Информация о транспортном средстве сохранена');
                nextStep();
                navigate('/insurance/customer');
            } catch (error) {
                toast.error('Ошибка при сохранении данных');
            }
            return;
        }

        // Валидация VIN кода
        if (!vin) {
            setVinError('Пожалуйста, введите VIN код');
            return;
        }

        if (vin.length < 7) {
            setVinError('VIN код должен содержать не менее 7 символов');
            return;
        }

        try {
            // Получение информации о ТС по VIN
            await getVehicleByVin(vin);
            toast.success('Информация о транспортном средстве получена');
            nextStep();
            navigate('/insurance/customer');
        } catch (error) {
            toast.error('Не удалось получить информацию о транспортном средстве');
            setVinError('Не удалось получить информацию о транспортном средстве по VIN коду');
        }
    };

    return (
        <div>
            <h2>Выберите тип транспортного средства</h2>

            <VehicleTypeOptions>
                <VehicleTypeOption
                    selected={vehicleType === 'car'}
                    onClick={() => setVehicleType('car')}
                >
                    <OptionHeader>
                        <OptionIcon>
                            <FiTruck />
                        </OptionIcon>
                        <OptionTitle>Легковой автомобиль до 3,5 т</OptionTitle>
                    </OptionHeader>
                </VehicleTypeOption>

                <VehicleTypeOption
                    selected={vehicleType === 'motorcycle'}
                    onClick={() => setVehicleType('motorcycle')}
                >
                    <OptionHeader>
                        <OptionIcon>
                            <FiShoppingCart />
                        </OptionIcon>
                        <OptionTitle>Мотоцикл</OptionTitle>
                    </OptionHeader>
                </VehicleTypeOption>

                <VehicleTypeOption
                    selected={vehicleType === 'trailer'}
                    onClick={() => setVehicleType('trailer')}
                >
                    <OptionHeader>
                        <OptionIcon>
                            <FiBox />
                        </OptionIcon>
                        <OptionTitle>Прицеп</OptionTitle>
                    </OptionHeader>
                </VehicleTypeOption>
            </VehicleTypeOptions>

            <ToggleContainer>
                <Toggle>
                    <ToggleInput
                        type="checkbox"
                        checked={isElectric}
                        onChange={() => setIsElectric(!isElectric)}
                    />
                    <ToggleSlider />
                </Toggle>
                <ToggleLabel>Электромобиль</ToggleLabel>
            </ToggleContainer>

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="vin">VIN код автомобиля</Label>
                    <InputGroup>
                        <Input
                            type="text"
                            id="vin"
                            placeholder="Например: WBA3N5C52FK123456"
                            value={vin}
                            onChange={(e) => {
                                setVin(e.target.value);
                                setVinError('');
                            }}
                        />
                        <InfoButton
                            type="button"
                            onClick={() => toast.info('VIN код - это уникальный идентификатор транспортного средства, состоящий из 17 символов')}
                        >
                            ?
                        </InfoButton>
                    </InputGroup>
                    {vinError && <ErrorMessage>{vinError}</ErrorMessage>}
                </FormGroup>

                {showManualInput && (
                    <>
                        <h3>Ручной ввод данных</h3>
                        <FormGroup>
                            <Label htmlFor="brand">Марка автомобиля*</Label>
                            <Input
                                type="text"
                                id="brand"
                                name="brand"
                                value={manualVehicle.brand}
                                onChange={handleManualInputChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="model">Модель автомобиля*</Label>
                            <Input
                                type="text"
                                id="model"
                                name="model"
                                value={manualVehicle.model}
                                onChange={handleManualInputChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="year">Год выпуска</Label>
                            <Input
                                type="number"
                                id="year"
                                name="year"
                                value={manualVehicle.year}
                                onChange={handleManualInputChange}
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="engineVolume">Объем двигателя (куб. см)</Label>
                            <Input
                                type="number"
                                id="engineVolume"
                                name="engineVolume"
                                value={manualVehicle.engineVolume}
                                onChange={handleManualInputChange}
                                min="0"
                                step="0.1"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="weight">Вес автомобиля (кг)*</Label>
                            <Input
                                type="number"
                                id="weight"
                                name="weight"
                                value={manualVehicle.weight}
                                onChange={handleManualInputChange}
                                min="0"
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="ownersCount">Количество владельцев</Label>
                            <Input
                                type="number"
                                id="ownersCount"
                                name="ownersCount"
                                value={manualVehicle.ownersCount}
                                onChange={handleManualInputChange}
                                min="1"
                            />
                        </FormGroup>
                    </>
                )}

                <ManualInputToggle>
                    <ManualInputLink
                        type="button"
                        onClick={() => setShowManualInput(!showManualInput)}
                    >
                        {showManualInput ? 'Скрыть ручной ввод' : 'У меня нет VIN кода'}
                    </ManualInputLink>
                </ManualInputToggle>

                <ButtonGroup>
                    <Button type="button" onClick={() => navigate('/')}>
                        Назад
                    </Button>
                    <Button type="submit" disabled={loadingVehicle}>
                        {loadingVehicle ? 'Загрузка...' : 'Продолжить'}
                    </Button>
                </ButtonGroup>
            </Form>
        </div>
    );
};

export default VehicleForm;