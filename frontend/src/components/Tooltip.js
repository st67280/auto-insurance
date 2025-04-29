import React from 'react';
import styled from 'styled-components';
import { FiInfo } from 'react-icons/fi';

// Стилизованные компоненты
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 0.5rem;
`;

const TooltipIcon = styled(FiInfo)`
  color: var(--secondary-color);
  cursor: pointer;
`;

const TooltipText = styled.div`
  visibility: hidden;
  width: 250px;
  background-color: var(--dark-color);
  color: #fff;
  text-align: center;
  border-radius: var(--border-radius);
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;

  ${TooltipContainer}:hover & {
    visibility: visible;
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--dark-color) transparent transparent transparent;
  }
`;

// Компонент всплывающей подсказки
const Tooltip = ({ text }) => {
    return (
        <TooltipContainer>
            <TooltipIcon size={16} />
            <TooltipText>{text}</TooltipText>
        </TooltipContainer>
    );
};

export default Tooltip;