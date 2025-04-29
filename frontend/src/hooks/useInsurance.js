import { useContext } from 'react';
import { InsuranceContext } from '../contexts/InsuranceContext';

// Хук для удобного доступа к контексту страхования
export const useInsurance = () => {
    const context = useContext(InsuranceContext);

    if (!context) {
        throw new Error('useInsurance должен использоваться внутри InsuranceProvider');
    }

    return context;
};