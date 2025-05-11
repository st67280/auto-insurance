import React from 'react';
import styled from 'styled-components';
import { useInsurance } from '../hooks/useInsurance';

// Стилизованные компоненты
const StepsContainer = styled.div`
  margin-bottom: 2rem;
`;

const StepsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: var(--light-gray);
    z-index: 1;
  }
`;

const Step = styled.div.withConfig({
      // не шлем в DOM эти пропсы
      shouldForwardProp: (prop) => !['active', 'completed'].includes(prop)
    })`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props =>
    props.active ? 'var(--primary-color)' :
        props.completed ? 'var(--success-color)' : 'var(--light-gray)'};
  color: ${props =>
    (props.active || props.completed) ? 'white' : 'var(--dark-color)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  position: relative;
  z-index: 2;
`;

const StepTitle = styled.div`
  position: absolute;
  bottom: -25px;
  white-space: nowrap;
  font-size: 0.875rem;
  width: 120px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
`;

// Компонент отображения шагов оформления страховки
const Steps = () => {
    const { currentStep } = useInsurance();

    // Определение шагов
    const steps = [
        { number: 1, title: 'Vehicle Info' },
        { number: 2, title: 'Customer Info' },
        { number: 3, title: 'Package Selection' },
        { number: 4, title: 'Additional Services' },
        { number: 5, title: 'Confirmation' }
    ];

    return (
        <StepsContainer>
            <StepsWrapper>
                {steps.map(step => (
                    <Step
                        key={step.number}
                        active={step.number === currentStep}
                        completed={step.number < currentStep}
                    >
                        {step.number}
                        <StepTitle>{step.title}</StepTitle>
                    </Step>
                ))}
            </StepsWrapper>
        </StepsContainer>
    );
};

export default Steps;