import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsurance } from '../hooks/useInsurance';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Tooltip from '../components/Tooltip';
import { FiShield, FiAlertTriangle, FiCloud, FiTarget } from 'react-icons/fi';

// Styled components
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

// Additional Services Component (Step 4)
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

    useEffect(() => {
        setLocalAdditionalServices(additionalServices);
    }, [additionalServices]);

    useEffect(() => {
        setLocalPricing(pricing);
    }, [pricing]);

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

    const handleContinue = async () => {
        try {
            updateAdditionalServices(localAdditionalServices);
            await calculateInsurance();
            nextStep();
            navigate('/insurance/summary');
        } catch (error) {
            toast.error('Error calculating insurance price');
        }
    };

    const handleBack = () => {
        updateAdditionalServices(localAdditionalServices);
        prevStep();
        navigate('/insurance/package');
    };

    if (!vehicle || !pricing) {
        return (
            <div>
                <h2>Error Loading Data</h2>
                <p>Please go back and verify your input</p>
                <Button type="button" onClick={handleBack}>
                    Back
                </Button>
            </div>
        );
    }

    const havarijniPrice = Math.round(localAdditionalServices.havarijniPojisteni.vehiclePrice * 0.05);
    const pojisteniOdcizeniPrice = Math.round(vehicle.weight * 0.5);
    const zivelniPrice = 444;
    const stetSeZveriPrice = 920;

    return (
        <Container>
            <h2>Additional Services</h2>

            <Card>
                <h3>Extend Your Car Protection</h3>
                <p>
                    Add additional services to your policy for complete protection of your car and peace of mind on the road.
                </p>
            </Card>

            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="havarijniPojisteni"
                        checked={localAdditionalServices.havarijniPojisteni.enabled}
                        onChange={(e) => handleServiceChange('havarijniPojisteni', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Comprehensive Coverage (KASKO)</ServiceTitle>
                    {localAdditionalServices.havarijniPojisteni.enabled ? (
                        <ServicePrice>{havarijniPrice} Kč / year</ServicePrice>
                    ) : (
                        <ServicePrice>Add</ServicePrice>
                    )}
                    <Tooltip text="Insurance for your car against accident damage, natural disasters, vandalism and other risks" />
                </ServiceHeader>

                <ServiceDescription>
                    Comprehensive protection for your car against all types of damage and theft.
                </ServiceDescription>

                {localAdditionalServices.havarijniPojisteni.enabled && (
                    <FormGroup>
                        <Label htmlFor="vehiclePrice">Vehicle Price (Kč)</Label>
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

            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="pojisteniOdcizeni"
                        checked={localAdditionalServices.pojisteniOdcizeni.enabled}
                        onChange={(e) => handleServiceChange('pojisteniOdcizeni', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Theft Insurance</ServiceTitle>
                    {localAdditionalServices.pojisteniOdcizeni.enabled ? (
                        <ServicePrice>{pojisteniOdcizeniPrice} Kč / year</ServicePrice>
                    ) : (
                        <ServicePrice>Add</ServicePrice>
                    )}
                    <Tooltip text="Insurance in case your car is stolen" />
                </ServiceHeader>

                <ServiceDescription>
                    Full indemnity in case your vehicle is stolen.
                </ServiceDescription>
            </ServiceOption>

            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="zivelniPojisteni"
                        checked={localAdditionalServices.zivelniPojisteni.enabled}
                        onChange={(e) => handleServiceChange('zivelniPojisteni', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Natural Disaster Insurance</ServiceTitle>
                    {localAdditionalServices.zivelniPojisteni.enabled ? (
                        <ServicePrice>{zivelniPrice} Kč / year</ServicePrice>
                    ) : (
                        <ServicePrice>Add</ServicePrice>
                    )}
                    <Tooltip text="Insurance against damage caused by natural disasters (flood, hail, hurricane, etc.)" />
                </ServiceHeader>

                <ServiceDescription>
                    Protection against damage caused by natural disasters including flood, hail, hurricane, etc.
                </ServiceDescription>
            </ServiceOption>

            <ServiceOption>
                <ServiceHeader>
                    <Checkbox
                        type="checkbox"
                        id="stetSeZveri"
                        checked={localAdditionalServices.stetSeZveri.enabled}
                        onChange={(e) => handleServiceChange('stetSeZveri', { enabled: e.target.checked })}
                    />
                    <ServiceTitle>Animal Collision Insurance</ServiceTitle>
                    {localAdditionalServices.stetSeZveri.enabled ? (
                        <ServicePrice>{stetSeZveriPrice} Kč / year</ServicePrice>
                    ) : (
                        <ServicePrice>Add</ServicePrice>
                    )}
                    <Tooltip text="Insurance against damage caused by collision with animals" />
                </ServiceHeader>

                <ServiceDescription>
                    Compensation for collisions with wild and domestic animals.
                </ServiceDescription>
            </ServiceOption>

            <h3>Advantages of Additional Insurance</h3>

            <AdditionalBenefits>
                <Benefit>
                    <BenefitIcon>
                        <FiShield />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Comprehensive Protection</BenefitTitle>
                        <p>Protection against all risks during vehicle operation</p>
                    </BenefitText>
                </Benefit>

                <Benefit>
                    <BenefitIcon>
                        <FiAlertTriangle />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Theft Protection</BenefitTitle>
                        <p>Full indemnity in case your vehicle is stolen</p>
                    </BenefitText>
                </Benefit>

                <Benefit>
                    <BenefitIcon>
                        <FiCloud />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Natural Disaster Protection</BenefitTitle>
                        <p>Peace of mind in all weather conditions</p>
                    </BenefitText>
                </Benefit>

                <Benefit>
                    <BenefitIcon>
                        <FiTarget />
                    </BenefitIcon>
                    <BenefitText>
                        <BenefitTitle>Animal Collision Protection</BenefitTitle>
                        <p>Compensation for damages in collisions with animals</p>
                    </BenefitText>
                </Benefit>
            </AdditionalBenefits>

            <ButtonGroup>
                <Button type="button" onClick={handleBack}>
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={handleContinue}
                    disabled={loadingPricing}
                >
                    {loadingPricing ? 'Loading...' : 'Continue'}
                </Button>
            </ButtonGroup>
        </Container>
    );
};

export default AdditionalServices;
