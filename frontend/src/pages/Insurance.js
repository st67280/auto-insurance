import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Steps from '../components/Steps';
import styled from 'styled-components';
import { useInsurance } from '../hooks/useInsurance';

// Стилизованные компоненты
const InsuranceContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: var(--primary-color);
`;

// Компонент-обертка для процесса оформления страховки
const Insurance = () => {
    const { currentStep } = useInsurance();

    // Карта маршрутов для каждого шага
    const stepRoutes = {
        1: '/insurance/vehicle',
        2: '/insurance/customer',
        3: '/insurance/package',
        4: '/insurance/additional',
        5: '/insurance/summary'
    };

    // Перенаправление на соответствующую страницу в зависимости от текущего шага
    // if (window.location.pathname === '/insurance') {
    //     return <Navigate to={stepRoutes[currentStep]} replace />;
    // }

    return (
        <InsuranceContainer>
            <Title>Insurance Registration</Title>
            <Steps />
            <Outlet />
        </InsuranceContainer>
    );
};

export default Insurance;