import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { FiEdit, FiTrash2, FiPlay, FiCheck, FiX } from 'react-icons/fi';

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

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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
  display: flex;
  align-items: center;

  &:hover {
    background-color: var(--primary-hover);
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ButtonIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const ProductTable = styled.table`
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

const StatusIndicator = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--success-color)' : '#6c757d'};
  margin-right: 0.5rem;
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
  max-width: 800px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
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

const Textarea = styled.textarea`
  width: 100%;
  min-height: 100px;
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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--light-gray);
`;

const SaveButton = styled(Button)`
  margin-left: 0.5rem;
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const SectionTitle = styled.h4`
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-gray);
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

// Компонент для управления страховыми продуктами
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // create или edit
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        type: 'standard',
        name: '',
        description: '',
        features: {
            propertyDamageLimit: 0,
            healthDamageLimit: 0,
            driverInsuranceAmount: 0,
            personalItemsAmount: 0,
            assistanceServices: true,
            ownVehicleDamage: false,
            replacementVehicle: false
        },
        pricing: {
            basePrice: 0,
            weightMultiplier: 1,
            engineVolumeMultiplier: 1,
            vehicleAgeMultiplier: 1,
            ownershipCountMultiplier: 1,
            electricVehicleDiscount: 0
        },
        active: true
    });

    // Загрузка списка продуктов
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await adminService.getAllProducts();
                setProducts(response.data);
            } catch (error) {
                toast.error('Ошибка при загрузке продуктов');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Инициализация базовых продуктов
    const handleInitializeProducts = async () => {
        try {
            setLoading(true);
            await adminService.initializeProducts();

            // Загружаем обновленный список продуктов
            const response = await adminService.getAllProducts();
            setProducts(response.data);

            toast.success('Базовые продукты успешно инициализированы');
        } catch (error) {
            toast.error('Ошибка при инициализации продуктов');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Открытие модального окна создания
    const handleOpenCreateModal = () => {
        setModalMode('create');
        setFormData({
            type: 'standard',
            name: '',
            description: '',
            features: {
                propertyDamageLimit: 50000000,
                healthDamageLimit: 50000000,
                driverInsuranceAmount: 100000,
                personalItemsAmount: 5000,
                assistanceServices: true,
                ownVehicleDamage: false,
                replacementVehicle: false
            },
            pricing: {
                basePrice: 20000,
                weightMultiplier: 1,
                engineVolumeMultiplier: 1,
                vehicleAgeMultiplier: 1,
                ownershipCountMultiplier: 1,
                electricVehicleDiscount: 10
            },
            active: true
        });
        setShowModal(true);
    };

    // Открытие модального окна редактирования
    const handleOpenEditModal = (product) => {
        setModalMode('edit');
        setCurrentProduct(product);
        setFormData(product);
        setShowModal(true);
    };

    // Закрытие модального окна
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentProduct(null);
    };

    // Обработка изменения полей формы
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('features.')) {
            const featureField = name.split('.')[1];
            setFormData({
                ...formData,
                features: {
                    ...formData.features,
                    [featureField]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
                }
            });
        } else if (name.includes('pricing.')) {
            const pricingField = name.split('.')[1];
            setFormData({
                ...formData,
                pricing: {
                    ...formData.pricing,
                    [pricingField]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    // Сохранение продукта
    const handleSaveProduct = async () => {
        try {
            setLoading(true);

            if (modalMode === 'create') {
                // Создание нового продукта
                await adminService.createProduct(formData);
                toast.success('Продукт успешно создан');
            } else {
                // Обновление существующего продукта
                await adminService.updateProduct(currentProduct._id, formData);
                toast.success('Продукт успешно обновлен');
            }

            // Загружаем обновленный список продуктов
            const response = await adminService.getAllProducts();
            setProducts(response.data);

            handleCloseModal();
        } catch (error) {
            toast.error(`Ошибка при ${modalMode === 'create' ? 'создании' : 'обновлении'} продукта`);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Удаление продукта
    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
            return;
        }

        try {
            setLoading(true);
            await adminService.deleteProduct(id);

            // Обновляем список продуктов
            setProducts(products.filter(product => product._id !== id));

            toast.success('Продукт успешно удален');
        } catch (error) {
            toast.error('Ошибка при удалении продукта');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Изменение статуса активности продукта
    const handleToggleActive = async (id, active) => {
        try {
            setLoading(true);
            await adminService.updateProduct(id, { active: !active });

            // Обновляем список продуктов
            const updatedProducts = products.map(product =>
                product._id === id ? { ...product, active: !active } : product
            );

            setProducts(updatedProducts);

            toast.success(`Продукт ${!active ? 'активирован' : 'деактивирован'}`);
        } catch (error) {
            toast.error('Ошибка при изменении статуса продукта');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Получение текстового представления типа продукта
    const getTypeText = (type) => {
        switch (type) {
            case 'standard': return 'Standard';
            case 'dominant': return 'Dominant';
            case 'premiant': return 'Premiant';
            default: return type;
        }
    };

    return (
        <Container>
            <Card>
                <HeaderActions>
                    <h2>Страховые продукты</h2>
                    <div>
                        <Button onClick={handleOpenCreateModal} style={{ marginRight: '0.5rem' }}>
                            <ButtonIcon>+</ButtonIcon> Новый продукт
                        </Button>
                        <Button onClick={handleInitializeProducts} disabled={products.length > 0}>
                            <ButtonIcon><FiPlay /></ButtonIcon> Инициализировать
                        </Button>
                    </div>
                </HeaderActions>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner /> Загрузка...
                    </div>
                ) : products.length === 0 ? (
                    <EmptyMessage>
                        <p>Страховые продукты не найдены</p>
                        <p>Нажмите "Инициализировать" для создания базовых продуктов</p>
                    </EmptyMessage>
                ) : (
                    <ProductTable>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>Название</TableHeaderCell>
                                <TableHeaderCell>Тип</TableHeaderCell>
                                <TableHeaderCell>Базовая цена</TableHeaderCell>
                                <TableHeaderCell>Лимиты</TableHeaderCell>
                                <TableHeaderCell>Статус</TableHeaderCell>
                                <TableHeaderCell>Действия</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                        {products.map((product) => (
                            <TableRow key={product._id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{getTypeText(product.type)}</TableCell>
                                <TableCell>{product.pricing.basePrice} Kč</TableCell>
                                <TableCell>
                                    {(product.features.propertyDamageLimit / 1000000).toFixed(0)}/{
                                    (product.features.healthDamageLimit / 1000000).toFixed(0)
                                } млн. Kč
                                </TableCell>
                                <TableCell>
                                    <StatusIndicator active={product.active} />
                                    {product.active ? 'Активен' : 'Неактивен'}
                                </TableCell>
                                <TableCell>
                                    <ActionButton
                                        title="Изменить"
                                        onClick={() => handleOpenEditModal(product)}
                                    >
                                        <FiEdit />
                                    </ActionButton>
                                    <ActionButton
                                        title={product.active ? 'Деактивировать' : 'Активировать'}
                                        onClick={() => handleToggleActive(product._id, product.active)}
                                    >
                                        {product.active ? <FiX /> : <FiCheck />}
                                    </ActionButton>
                                    <ActionButton
                                        title="Удалить"
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        <FiTrash2 />
                                    </ActionButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </ProductTable>
                )}
            </Card>

            {/* Модальное окно создания/редактирования */}
            {showModal && (
                <Modal>
                    <ModalContent>
                        <ModalHeader>
                            <h3>{modalMode === 'create' ? 'Создать новый продукт' : 'Редактировать продукт'}</h3>
                            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
                        </ModalHeader>

                        <FormGroup>
                            <Label htmlFor="type">Тип продукта</Label>
                            <Select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <option value="standard">Standard</option>
                                <option value="dominant">Dominant</option>
                                <option value="premiant">Premiant</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="name">Название продукта</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </FormGroup>

                        <SectionTitle>Характеристики продукта</SectionTitle>

                        <FormGrid>
                            <FormGroup>
                                <Label htmlFor="features.propertyDamageLimit">Лимит по имуществу (Kč)</Label>
                                <Input
                                    type="number"
                                    id="features.propertyDamageLimit"
                                    name="features.propertyDamageLimit"
                                    value={formData.features.propertyDamageLimit}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="1000000"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="features.healthDamageLimit">Лимит по здоровью (Kč)</Label>
                                <Input
                                    type="number"
                                    id="features.healthDamageLimit"
                                    name="features.healthDamageLimit"
                                    value={formData.features.healthDamageLimit}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="1000000"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="features.driverInsuranceAmount">Страхование водителя (Kč)</Label>
                                <Input
                                    type="number"
                                    id="features.driverInsuranceAmount"
                                    name="features.driverInsuranceAmount"
                                    value={formData.features.driverInsuranceAmount}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="10000"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="features.personalItemsAmount">Страхование личных вещей (Kč)</Label>
                                <Input
                                    type="number"
                                    id="features.personalItemsAmount"
                                    name="features.personalItemsAmount"
                                    value={formData.features.personalItemsAmount}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="1000"
                                />
                            </FormGroup>
                        </FormGrid>

                        <FormGroup>
                            <CheckboxLabel>
                                <Checkbox
                                    type="checkbox"
                                    id="features.assistanceServices"
                                    name="features.assistanceServices"
                                    checked={formData.features.assistanceServices}
                                    onChange={handleInputChange}
                                />
                                Ассистентские услуги
                            </CheckboxLabel>

                            <CheckboxLabel>
                                <Checkbox
                                    type="checkbox"
                                    id="features.ownVehicleDamage"
                                    name="features.ownVehicleDamage"
                                    checked={formData.features.ownVehicleDamage}
                                    onChange={handleInputChange}
                                />
                                Страхование при виновности в ДТП
                            </CheckboxLabel>

                            <CheckboxLabel>
                                <Checkbox
                                    type="checkbox"
                                    id="features.replacementVehicle"
                                    name="features.replacementVehicle"
                                    checked={formData.features.replacementVehicle}
                                    onChange={handleInputChange}
                                />
                                Аренда замещающего ТС
                            </CheckboxLabel>
                        </FormGroup>

                        <SectionTitle>Ценообразование</SectionTitle>

                        <FormGrid>
                            <FormGroup>
                                <Label htmlFor="pricing.basePrice">Базовая цена (Kč)</Label>
                                <Input
                                    type="number"
                                    id="pricing.basePrice"
                                    name="pricing.basePrice"
                                    value={formData.pricing.basePrice}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="100"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="pricing.electricVehicleDiscount">Скидка для электромобилей (%)</Label>
                                <Input
                                    type="number"
                                    id="pricing.electricVehicleDiscount"
                                    name="pricing.electricVehicleDiscount"
                                    value={formData.pricing.electricVehicleDiscount}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="pricing.weightMultiplier">Множитель по весу</Label>
                                <Input
                                    type="number"
                                    id="pricing.weightMultiplier"
                                    name="pricing.weightMultiplier"
                                    value={formData.pricing.weightMultiplier}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="pricing.engineVolumeMultiplier">Множитель по объему двигателя</Label>
                                <Input
                                    type="number"
                                    id="pricing.engineVolumeMultiplier"
                                    name="pricing.engineVolumeMultiplier"
                                    value={formData.pricing.engineVolumeMultiplier}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="pricing.vehicleAgeMultiplier">Множитель по возрасту ТС</Label>
                                <Input
                                    type="number"
                                    id="pricing.vehicleAgeMultiplier"
                                    name="pricing.vehicleAgeMultiplier"
                                    value={formData.pricing.vehicleAgeMultiplier}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="pricing.ownershipCountMultiplier">Множитель по количеству владельцев</Label>
                                <Input
                                    type="number"
                                    id="pricing.ownershipCountMultiplier"
                                    name="pricing.ownershipCountMultiplier"
                                    value={formData.pricing.ownershipCountMultiplier}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                />
                            </FormGroup>
                        </FormGrid>

                        <FormGroup>
                            <CheckboxLabel>
                                <Checkbox
                                    type="checkbox"
                                    id="active"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleInputChange}
                                />
                                Активен
                            </CheckboxLabel>
                        </FormGroup>

                        <ModalFooter>
                            <CancelButton onClick={handleCloseModal}>Отмена</CancelButton>
                            <SaveButton onClick={handleSaveProduct}>
                                {loading ? <><Spinner /> Сохранение...</> : 'Сохранить'}
                            </SaveButton>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default AdminProducts;