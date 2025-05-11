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
    color: ${props => props.highlight === 'true' ? 'var(--primary-color)' : 'inherit'};
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

    useEffect(() => {
        const recalculatePricing = async () => {
            try {
                console.log('Summary: recalculating pricing...');
                const result = await calculateInsurance();
                console.log('Summary: pricing result:', result);
            } catch (error) {
                console.error('Summary: error calculating pricing:', error);
                toast.error('Error calculating insurance price');
            }
        };

        if (!pricing && vehicle) {
            recalculatePricing();
        }
    }, [vehicle, calculateInsurance, pricing]);

    // Получаем информацию о типе транспортного средства
    const getVehicleTypeText = () => {
        switch (vehicleType) {
            case 'car': return 'Passenger Car';
            case 'motorcycle': return 'Motorcycle';
            case 'trailer': return 'Trailer';
            default: return 'Vehicle';
        }
    };

    // Получаем информацию о пакете страхования
    const getPackageText = () => {
        switch (selectedPackage) {
            case 'standard': return 'Standard';
            case 'dominant': return 'Dominant';
            case 'premiant': return 'Premiant';
            default: return 'Unknown package';
        }
    };

    // Получаем информацию о типе страхователя
    const getCustomerTypeText = () => {
        switch (customerInfo.customerType) {
            case 'physical': return 'Individual';
            case 'entrepreneur': return 'Sole Proprietor';
            case 'legal': return 'Legal Entity';
            default: return 'Unknown type';
        }
    };

    // Валидация формы
    const validateForm = () => {
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Please enter email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!nationality.trim()) {
            errors.nationality = 'Please enter nationality';
        }

        if (!agreeTerms) {
            errors.agreeTerms = 'You must agree to the terms';
        }

        if (!agreePrivacy) {
            errors.agreePrivacy = 'You must agree to the privacy policy';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Обработчик оформления страховки
    const handleCreateInsurance = async () => {
        if (!validateForm()) {
            toast.error('Please correct the errors in the form');
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
            toast.success('Insurance successfully created!');
        } catch (error) {
            toast.error('Error creating insurance');
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
    if (!vehicle) {
        return (
            <div>
                <h2>Data Loading Error</h2>
                <p>Please go back to the previous steps and check the entered data.</p>
                <Button type="button" onClick={handleBack}>
                    Back
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
                        <h3>Insurance Successfully Created!</h3>
                        <p>Information about your insurance has been sent to the specified email.</p>
                    </div>
                </SuccessMessage>

                <SummaryCard>
                    <SummaryHeader>
                        <SummaryIcon>
                            <FiCheckCircle />
                        </SummaryIcon>
                        <SummaryTitle>Policy № {Date.now().toString().substr(-8)}</SummaryTitle>
                        <SummaryPrice>{pricing.totalPrice} CZK / year</SummaryPrice>
                    </SummaryHeader>

                    <SummarySection>
                        <SectionTitle>Vehicle Information</SectionTitle>
                        <ItemRow>
                            <ItemLabel>Vehicle Type</ItemLabel>
                            <ItemValue>{getVehicleTypeText()}{isElectric ? ' (electric)' : ''}</ItemValue>
                        </ItemRow>
                        <ItemRow>
                            <ItemLabel>Brand</ItemLabel>
                            <ItemValue>{vehicle.brand}</ItemValue>
                        </ItemRow>
                        <ItemRow>
                            <ItemLabel>Model</ItemLabel>
                            <ItemValue>{vehicle.model}</ItemValue>
                        </ItemRow>
                        <ItemRow>
                            <ItemLabel>VIN</ItemLabel>
                            <ItemValue>{vehicle.vin}</ItemValue>
                        </ItemRow>
                    </SummarySection>

                    <ButtonGroup>
                        <Button type="button" onClick={handleNewInsurance}>
                            Create New Insurance
                        </Button>
                        <Button type="button" onClick={() => navigate('/')}>
                            Back to Home
                        </Button>
                    </ButtonGroup>
                </SummaryCard>
            </Container>
        );
    }

    return (
        <Container>
            <h2>Insurance Summary</h2>

            <InfoMessage>
                <InfoIcon />
                <div>
                    Check all entered data before completing the insurance.
                </div>
            </InfoMessage>

            <SummaryCard>
                <SummaryHeader>
                    <SummaryIcon>
                        <FiAlertCircle />
                    </SummaryIcon>
                    <SummaryTitle>Final Calculation</SummaryTitle>
                    <SummaryPrice>{pricing.totalPrice} CZK / year</SummaryPrice>
                </SummaryHeader>

                <SummarySection>
                    <SectionTitle>Vehicle Information</SectionTitle>
                    <ItemRow>
                        <ItemLabel>Vehicle Type</ItemLabel>
                        <ItemValue>{getVehicleTypeText()}{isElectric ? ' (electric)' : ''}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Brand</ItemLabel>
                        <ItemValue>{vehicle.brand}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Model</ItemLabel>
                        <ItemValue>{vehicle.model}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>VIN</ItemLabel>
                        <ItemValue>{vehicle.vin}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Year of Manufacture</ItemLabel>
                        <ItemValue>{vehicle.year || 'Not specified'}</ItemValue>
                    </ItemRow>
                </SummarySection>

                <SummarySection>
                    <SectionTitle>Policyholder Information</SectionTitle>
                    <ItemRow>
                        <ItemLabel>Full Name</ItemLabel>
                        <ItemValue>{customerInfo.name} {customerInfo.surname}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Customer Type</ItemLabel>
                        <ItemValue>{getCustomerTypeText()}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Address</ItemLabel>
                        <ItemValue>{customerInfo.address}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Phone</ItemLabel>
                        <ItemValue>{customerInfo.phone}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Year of Birth</ItemLabel>
                        <ItemValue>{customerInfo.birthYear}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Driving Experience</ItemLabel>
                        <ItemValue>{customerInfo.drivingExperience} years</ItemValue>
                    </ItemRow>
                </SummarySection>

                <SummarySection>
                    <SectionTitle>Insurance Parameters</SectionTitle>
                    <ItemRow>
                        <ItemLabel>Insurance Package</ItemLabel>
                        <ItemValue highlight>{getPackageText()}</ItemValue>
                    </ItemRow>
                    <ItemRow>
                        <ItemLabel>Base Price</ItemLabel>
                        <ItemValue>{pricing.basePrice} CZK / year</ItemValue>
                    </ItemRow>

                    {additionalServices.havarijniPojisteni.enabled && (
                        <ItemRow>
                            <ItemLabel>Comprehensive Coverage (KASKO)</ItemLabel>
                            <ItemValue>Included ({Math.round(additionalServices.havarijniPojisteni.vehiclePrice * 0.05)} CZK)</ItemValue>
                        </ItemRow>
                    )}

                    {additionalServices.pojisteniOdcizeni.enabled && (
                        <ItemRow>
                            <ItemLabel>Theft Insurance</ItemLabel>
                            <ItemValue>Included ({Math.round(vehicle.weight * 0.5)} CZK)</ItemValue>
                        </ItemRow>
                    )}

                    {additionalServices.zivelniPojisteni.enabled && (
                        <ItemRow>
                            <ItemLabel>Natural Disaster Insurance</ItemLabel>
                            <ItemValue>Included (444 CZK)</ItemValue>
                        </ItemRow>
                    )}

                    {additionalServices.stetSeZveri.enabled && (
                        <ItemRow>
                            <ItemLabel>Animal Collision Insurance</ItemLabel>
                            <ItemValue>Included (920 CZK)</ItemValue>
                        </ItemRow>
                    )}

                    {pricing.discounts > 0 && (
                        <ItemRow>
                            <ItemLabel>Discounts</ItemLabel>
                            <ItemValue>-{pricing.discounts} CZK</ItemValue>
                        </ItemRow>
                    )}
                </SummarySection>

                <TotalSection>
                    <TotalLabel>Total Price:</TotalLabel>
                    <TotalValue>{pricing.totalPrice} CZK / year</TotalValue>
                </TotalSection>
            </SummaryCard>

            <SummaryCard>
                <h3>Additional Information</h3>

                <FormGroup>
                    <Label htmlFor="email">Email*</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email to receive the policy"
                    />
                    {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="nationality">Nationality*</Label>
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
                        I agree to the terms and conditions*
                    </CheckboxLabel>
                    {formErrors.agreeTerms && <div className="form-error">{formErrors.agreeTerms}</div>}

                    <CheckboxLabel>
                        <Checkbox
                            type="checkbox"
                            checked={agreePrivacy}
                            onChange={(e) => setAgreePrivacy(e.target.checked)}
                        />
                        I agree to the processing of personal data*
                    </CheckboxLabel>
                    {formErrors.agreePrivacy && <div className="form-error">{formErrors.agreePrivacy}</div>}
                </FormGroup>
            </SummaryCard>

            <ButtonGroup>
                <Button type="button" onClick={handleBack}>
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handleCreateInsurance}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Complete Insurance'}
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default Summary;