import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { FiEdit, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';

// Стилизованные компоненты
const Container = styled.div`
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const InsuranceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: var(--light-color);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f9f9f9;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
        case 'active': return '#d4edda';
        case 'pending': return '#fff3cd';
        case 'expired': return '#f8d7da';
        case 'cancelled': return '#d6d8db';
        default: return '#e2e3e5';
    }
}};
  color: ${props => {
    switch (props.status) {
        case 'active': return '#155724';
        case 'pending': return '#856404';
        case 'expired': return '#721c24';
        case 'cancelled': return '#383d41';
        default: return '#383d41';
    }
}};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  margin-right: 0.5rem;
  
  &:hover {
    color: var(--primary-hover);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #343a40;
  }
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

const Select = styled.select`
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

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--light-gray);
`;

const Button = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  margin-left: 0.5rem;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

// Компонент для управления страховками
const AdminInsurances = () => {
    const [insurances, setInsurances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(false);
    const [currentInsurance, setCurrentInsurance] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [packageFilter, setPackageFilter] = useState('all');

    // Загрузка списка страховок
    useEffect(() => {
        const fetchInsurances = async () => {
            try {
                setLoading(true);
                const response = await adminService.getAllInsurances();
                setInsurances(response);

            } catch (error) {
                toast.error('Ошибка при загрузке страховок');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsurances();
    }, []);

    // Открытие модального окна редактирования
    const handleEditInsurance = (insurance) => {
        setCurrentInsurance(insurance);
        setEditModal(true);
    };

    // Закрытие модального окна
    const handleCloseModal = () => {
        setEditModal(false);
        setCurrentInsurance(null);
    };

    // Обновление статуса страховки
    const handleUpdateStatus = async (id, status) => {
        try {
            setLoading(true);
            await adminService.updateInsurance(id, { status });

            // Обновляем список страховок
            const updatedInsurances = insurances.map((insurance) =>
                insurance._id === id
                    ? { ...insurance, status }
                    : insurance
            );

            setInsurances(updatedInsurances);
            toast.success('Статус страховки обновлен');
        } catch (error) {
            toast.error('Ошибка при обновлении статуса');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Применение скидки
    const handleApplyDiscount = async () => {
        if (!currentInsurance) return;

        try {
            const discounts = parseInt(currentInsurance.pricing.discounts) || 0;

            await adminService.updateInsurance(currentInsurance._id, {
                pricing: {
                    discounts
                }
            });

            // Обновляем список страховок
            const updatedInsurances = insurances.map((insurance) =>
                insurance._id === currentInsurance._id
                    ? {
                        ...insurance,
                        pricing: {
                            ...insurance.pricing,
                            discounts,
                            totalPrice: insurance.pricing.basePrice +
                                insurance.pricing.additionalServicesPrice -
                                discounts
                        }
                    }
                    : insurance
            );

            setInsurances(updatedInsurances);
            toast.success('Скидка применена');
            handleCloseModal();
        } catch (error) {
            toast.error('Ошибка при применении скидки');
            console.error(error);
        }
    };

    // Обработка изменения поля в форме редактирования
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('pricing.')) {
            const pricingField = name.split('.')[1];
            setCurrentInsurance({
                ...currentInsurance,
                pricing: {
                    ...currentInsurance.pricing,
                    [pricingField]: value
                }
            });
        } else {
            setCurrentInsurance({
                ...currentInsurance,
                [name]: value
            });
        }
    };

    // Фильтрация страховок
    const filteredInsurances = insurances.filter((insurance) => {
        const statusMatch = statusFilter === 'all' || insurance.status === statusFilter;
        const packageMatch = packageFilter === 'all' || insurance.selectedPackage === packageFilter;

        return statusMatch && packageMatch;
    });

    // Отображение статуса страховки
    const renderStatus = (status) => {
        const statusText = {
            draft: 'Черновик',
            pending: 'Ожидает оплаты',
            active: 'Активна',
            expired: 'Истекла',
            cancelled: 'Отменена'
        };

        return <StatusBadge status={status}>{statusText[status] || status}</StatusBadge>;
    };

    // Получение информации о пакете страхования
    const getPackageText = (packageType) => {
        switch (packageType) {
            case 'standard': return 'Standard';
            case 'dominant': return 'Dominant';
            case 'premiant': return 'Premiant';
            default: return 'Неизвестный пакет';
        }
    };

    return (
        <Container>
            <Card>
                <h2>Управление страховками</h2>

                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <label htmlFor="statusFilter" className="mr-2">Статус:</label>
                        <Select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{ width: 'auto', marginRight: '1rem' }}
                        >
                            <option value="all">Все</option>
                            <option value="draft">Черновик</option>
                            <option value="pending">Ожидает оплаты</option>
                            <option value="active">Активна</option>
                            <option value="expired">Истекла</option>
                            <option value="cancelled">Отменена</option>
                        </Select>

                        <label htmlFor="packageFilter" className="mr-2">Пакет:</label>
                        <Select
                            id="packageFilter"
                            value={packageFilter}
                            onChange={(e) => setPackageFilter(e.target.value)}
                            style={{ width: 'auto' }}
                        >
                            <option value="all">Все</option>
                            <option value="standard">Standard</option>
                            <option value="dominant">Dominant</option>
                            <option value="premiant">Premiant</option>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner /> Загрузка...
                    </div>
                ) : filteredInsurances.length === 0 ? (
                    <EmptyMessage>
                        Страховки не найдены
                    </EmptyMessage>
                ) : (
                    <InsuranceTable>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Клиент</TableHeaderCell>
                                <TableHeaderCell>Транспортное средство</TableHeaderCell>
                                <TableHeaderCell>Пакет</TableHeaderCell>
                                <TableHeaderCell>Стоимость</TableHeaderCell>
                                <TableHeaderCell>Статус</TableHeaderCell>
                                <TableHeaderCell>Действия</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                        {filteredInsurances.map((insurance) => (
                            <TableRow key={insurance._id}>
                                <TableCell>{insurance._id.substring(0, 8)}...</TableCell>
                                <TableCell>
                                    {insurance.customerInfo.name} {insurance.customerInfo.surname}<br />
                                    <small>{insurance.customerInfo.phone}</small>
                                </TableCell>
                                <TableCell>
                                    {insurance.vehicle.brand} {insurance.vehicle.model}<br />
                                    <small>{insurance.vehicle.vin}</small>
                                </TableCell>
                                <TableCell>{getPackageText(insurance.selectedPackage)}</TableCell>
                                <TableCell>{insurance.pricing.totalPrice} Kč</TableCell>
                                <TableCell>{renderStatus(insurance.status)}</TableCell>
                                <TableCell>
                                    <ActionButton
                                        title="Изменить"
                                        onClick={() => handleEditInsurance(insurance)}
                                    >
                                        <FiEdit />
                                    </ActionButton>
                                    <ActionButton
                                        title="Активировать"
                                        onClick={() => handleUpdateStatus(insurance._id, 'active')}
                                    >
                                        <FiCheckCircle />
                                    </ActionButton>
                                    <ActionButton
                                        title="Отменить"
                                        onClick={() => handleUpdateStatus(insurance._id, 'cancelled')}
                                    >
                                        <FiXCircle />
                                    </ActionButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </InsuranceTable>
                )}
            </Card>

            {/* Модальное окно редактирования */}
            {editModal && currentInsurance && (
                <Modal>
                    <ModalContent>
                        <ModalHeader>
                            <h3>Редактировать страховку</h3>
                            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
                        </ModalHeader>

                        <FormGroup>
                            <Label>ID страховки</Label>
                            <Input value={currentInsurance._id} disabled />
                        </FormGroup>

                        <FormGroup>
                            <Label>Клиент</Label>
                            <Input
                                value={`${currentInsurance.customerInfo.name} ${currentInsurance.customerInfo.surname}`}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Транспортное средство</Label>
                            <Input
                                value={`${currentInsurance.vehicle.brand} ${currentInsurance.vehicle.model} (${currentInsurance.vehicle.vin})`}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Пакет страхования</Label>
                            <Input
                                value={getPackageText(currentInsurance.selectedPackage)}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Базовая стоимость</Label>
                            <Input
                                value={currentInsurance.pricing.basePrice}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="pricing.discounts">Скидка (Kč)</Label>
                            <Input
                                type="number"
                                id="pricing.discounts"
                                name="pricing.discounts"
                                value={currentInsurance.pricing.discounts || 0}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Итоговая стоимость</Label>
                            <Input
                                value={
                                    (currentInsurance.pricing.basePrice +
                                        currentInsurance.pricing.additionalServicesPrice -
                                        (parseInt(currentInsurance.pricing.discounts) || 0)) + ' Kč'
                                }
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="status">Статус</Label>
                            <Select
                                id="status"
                                name="status"
                                value={currentInsurance.status}
                                onChange={handleInputChange}
                            >
                                <option value="draft">Черновик</option>
                                <option value="pending">Ожидает оплаты</option>
                                <option value="active">Активна</option>
                                <option value="expired">Истекла</option>
                                <option value="cancelled">Отменена</option>
                            </Select>
                        </FormGroup>

                        <ModalFooter>
                            <CancelButton onClick={handleCloseModal}>Отмена</CancelButton>
                            <Button onClick={handleApplyDiscount}>Сохранить</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default AdminInsurances;