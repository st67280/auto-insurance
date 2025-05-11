import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsurance } from '../hooks/useInsurance';
import styled from 'styled-components';
import { toast } from 'react-toastify';

// Стилизованные компоненты
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

const CustomerTypeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CustomerTypeOption = styled.label`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : '#ced4da'};
  border-radius: var(--border-radius);
  background-color: ${props => props.selected ? 'rgba(0, 114, 163, 0.05)' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--secondary-color);
  }
`;

const RadioInput = styled.input`
  margin-right: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  margin-top: 0.25rem;
  font-size: 0.875rem;
`;

const NumberInput = styled.div`
  display: flex;
  align-items: center;
  max-width: 200px;
`;

const NumberButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--light-gray);
  border: 1px solid #ced4da;
  font-size: 1.25rem;
  font-weight: bold;
  cursor: pointer;
  user-select: none;

  &:first-child {
    border-radius: var(--border-radius) 0 0 var(--border-radius);
  }

  &:last-child {
    border-radius: 0 var(--border-radius) var(--border-radius) 0;
  }

  &:hover {
    background-color: #e2e6ea;
  }
`;

const NumberValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 40px;
  border-top: 1px solid #ced4da;
  border-bottom: 1px solid #ced4da;
  font-weight: 500;
`;

// Компонент формы данных страхователя (шаг 2)
const CustomerForm = () => {
    const { customerInfo, updateCustomerInfo, nextStep, prevStep } = useInsurance();

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Обработчик изменения полей формы
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateCustomerInfo({ [name]: value });

        // Очистка ошибки при изменении поля
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Обработчик изменения типа страхователя
    const handleCustomerTypeChange = (type) => {
        updateCustomerInfo({ customerType: type });
    };

    // Обработчик изменения числовых полей с кнопками +/-
    const handleNumberChange = (field, value) => {
        const min = field === 'birthYear' ? 1900 : 0;
        const max = field === 'birthYear' ? new Date().getFullYear() : 50;

        const newValue = Math.min(Math.max(value, min), max);
        updateCustomerInfo({ [field]: newValue });
    };

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        if (!customerInfo.name.trim()) {
            newErrors.name = 'Please, enter name';
        }

        if (!customerInfo.surname.trim()) {
            newErrors.surname = 'Please, enter surname';
        }

        if (!customerInfo.address.trim()) {
            newErrors.address = 'Please, enter address';
        }

        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!customerInfo.phone.trim()) {
            newErrors.phone = 'Please, enter phone number';
        } else if (!phoneRegex.test(customerInfo.phone.trim())) {
            newErrors.phone = 'Please, enter correct phone number';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (customerInfo.email.trim() && !emailRegex.test(customerInfo.email.trim())) {
            newErrors.email = 'Please, enter correct mail';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            nextStep();
            navigate('/insurance/package');
        } else {
            toast.error('Please, correct errors');
        }
    };

    // Обработчик кнопки "Назад"
    const handleBack = () => {
        prevStep();
        navigate('/insurance/vehicle');
    };

    return (
        <div>
            <h2>Customer Information</h2>

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>I am insuring the vehicle as:</Label>
                    <CustomerTypeOptions>
                        <CustomerTypeOption selected={customerInfo.customerType === 'physical'}>
                            <RadioInput
                                type="radio"
                                name="customerType"
                                value="physical"
                                checked={customerInfo.customerType === 'physical'}
                                onChange={() => handleCustomerTypeChange('physical')}
                            />
                            Individual
                        </CustomerTypeOption>

                        <CustomerTypeOption selected={customerInfo.customerType === 'entrepreneur'}>
                            <RadioInput
                                type="radio"
                                name="customerType"
                                value="entrepreneur"
                                checked={customerInfo.customerType === 'entrepreneur'}
                                onChange={() => handleCustomerTypeChange('entrepreneur')}
                            />
                            Sole Proprietor
                        </CustomerTypeOption>

                        <CustomerTypeOption selected={customerInfo.customerType === 'legal'}>
                            <RadioInput
                                type="radio"
                                name="customerType"
                                value="legal"
                                checked={customerInfo.customerType === 'legal'}
                                onChange={() => handleCustomerTypeChange('legal')}
                            />
                            Legal Entity
                        </CustomerTypeOption>
                    </CustomerTypeOptions>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="name">First Name*</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleChange}
                    />
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="surname">Last Name*</Label>
                    <Input
                        type="text"
                        id="surname"
                        name="surname"
                        value={customerInfo.surname}
                        onChange={handleChange}
                    />
                    {errors.surname && <ErrorMessage>{errors.surname}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="birthYear">Year of Birth</Label>
                    <NumberInput>
                        <NumberButton
                            type="button"
                            onClick={() => handleNumberChange('birthYear', customerInfo.birthYear - 1)}
                        >
                            −
                        </NumberButton>
                        <NumberValue>{customerInfo.birthYear}</NumberValue>
                        <NumberButton
                            type="button"
                            onClick={() => handleNumberChange('birthYear', customerInfo.birthYear + 1)}
                        >
                            +
                        </NumberButton>
                    </NumberInput>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="address">Address*</Label>
                    <Input
                        type="text"
                        id="address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleChange}
                    />
                    {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="phone">Phone*</Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleChange}
                        placeholder="+420XXXXXXXXX"
                    />
                    {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={customerInfo.email}
                        onChange={handleChange}
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="drivingExperience">Driving Experience (years)</Label>
                    <NumberInput>
                        <NumberButton
                            type="button"
                            onClick={() => handleNumberChange('drivingExperience', customerInfo.drivingExperience - 1)}
                        >
                            −
                        </NumberButton>
                        <NumberValue>{customerInfo.drivingExperience}</NumberValue>
                        <NumberButton
                            type="button"
                            onClick={() => handleNumberChange('drivingExperience', customerInfo.drivingExperience + 1)}
                        >
                            +
                        </NumberButton>
                    </NumberInput>
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="accidentsCount">Number of Accidents in Last 3 Years</Label>
                    <NumberInput>
                        <NumberButton
                            type="button"
                            onClick={() => handleNumberChange('accidentsCount', customerInfo.accidentsCount - 1)}
                        >
                            −
                        </NumberButton>
                        <NumberValue>{customerInfo.accidentsCount}</NumberValue>
                        <NumberButton
                            type="button"
                            onClick={() => handleNumberChange('accidentsCount', customerInfo.accidentsCount + 1)}
                        >
                            +
                        </NumberButton>
                    </NumberInput>
                </FormGroup>

                <ButtonGroup>
                    <Button type="button" onClick={handleBack}>
                        Back
                    </Button>
                    <Button type="submit">
                        Continue
                    </Button>
                </ButtonGroup>
            </Form>
        </div>
    );
};

export default CustomerForm;