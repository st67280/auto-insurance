import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiShield, FiTruck, FiDollarSign, FiClock } from 'react-icons/fi';

// Стилизованные компоненты
const Hero = styled.div`
    background-color: var(--primary-color);
    color: white;
    padding: 4rem 0;
    margin-bottom: 3rem;
    border-radius: var(--border-radius);
`;

const HeroContent = styled.div`
    max-width: 700px;
`;

const HeroTitle = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: white;
`;

const HeroText = styled.p`
    font-size: 1.25rem;
    margin-bottom: 2rem;
`;

const HeroButton = styled(Link)`
    display: inline-block;
    background-color: white;
    color: var(--primary-color);
    font-weight: 500;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
        background-color: var(--light-color);
        color: var(--primary-color);
    }
`;

const Features = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
`;

const Feature = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
`;

const FeatureIcon = styled.div`
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
    margin-bottom: 1rem;
`;

const FeatureText = styled.p`
    color: #666;
`;

// Компонент домашней страницы
const Home = () => {
    return (
        <>
            <Hero>
                <div className="container">
                    <HeroContent>
                        <HeroTitle>Надежная страховка для вашего автомобиля</HeroTitle>
                        <HeroText>
                            Оформите полис автострахования онлайн за несколько минут и получите лучшие условия и защиту
                            для вашего транспортного средства.
                        </HeroText>
                        <HeroButton to="/insurance">Рассчитать стоимость</HeroButton>
                    </HeroContent>
                </div>
            </Hero>

            <div className="container">
                <h2 className="text-center mb-4">Почему выбирают нас</h2>

                <Features>
                    <Feature>
                        <FeatureIcon>
                            <FiShield />
                        </FeatureIcon>
                        <FeatureTitle>Надежная защита</FeatureTitle>
                        <FeatureText>
                            Мы предлагаем комплексную защиту вашего автомобиля от всех видов рисков.
                        </FeatureText>
                    </Feature>

                    <Feature>
                        <FeatureIcon>
                            <FiTruck />
                        </FeatureIcon>
                        <FeatureTitle>Для любых автомобилей</FeatureTitle>
                        <FeatureText>
                            Оформите страховку для легковых автомобилей, мотоциклов и прицепов.
                        </FeatureText>
                    </Feature>

                    <Feature>
                        <FeatureIcon>
                            <FiDollarSign />
                        </FeatureIcon>
                        <FeatureTitle>Выгодные условия</FeatureTitle>
                        <FeatureText>
                            Мы предлагаем конкурентные цены и гибкие условия страхования.
                        </FeatureText>
                    </Feature>

                    <Feature>
                        <FeatureIcon>
                            <FiClock />
                        </FeatureIcon>
                        <FeatureTitle>Быстрое оформление</FeatureTitle>
                        <FeatureText>
                            Оформите полис онлайн всего за несколько минут без лишних документов.
                        </FeatureText>
                    </Feature>
                </Features>

                <div className="text-center mt-4">
                    <HeroButton to="/insurance" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                        Рассчитать страховку
                    </HeroButton>
                </div>
            </div>
        </>
    );
};

export default Home;