import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { FiEdit, FiTrash2, FiPlay, FiCheck, FiX } from 'react-icons/fi';

// Styled components
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
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center;
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
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 1.5rem; padding-bottom: 1rem;
    border-bottom: 1px solid var(--light-gray);
`;

const CloseButton = styled.button`
    background: none; border: none; font-size: 1.5rem; cursor: pointer;
    color: #6c757d;
    &:hover { color: #343a40; }
`;

const FormGrid = styled.div`
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const Label = styled.label`
    display: block; margin-bottom: 0.5rem; font-weight: 500;
`;

const Input = styled.input`
    width: 100%; height: var(--input-height);
    padding: 0.375rem 0.75rem; font-size: 1rem;
    border: 1px solid #ced4da; border-radius: var(--border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:focus {
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 0.2rem rgba(0, 178, 227, 0.25);
        outline: none;
    }
`;

const Textarea = styled.textarea`
    width: 100%; min-height: 100px;
    padding: 0.375rem 0.75rem; font-size: 1rem;
    border: 1px solid #ced4da; border-radius: var(--border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:focus {
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 0.2rem rgba(0, 178, 227, 0.25);
        outline: none;
    }
`;

const Select = styled.select`
    width: 100%; height: var(--input-height);
    padding: 0.375rem 0.75rem; font-size: 1rem;
    border: 1px solid #ced4da; border-radius: var(--border-radius);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    &:focus {
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 0.2rem rgba(0, 178, 227, 0.25);
        outline: none;
    }
`;

const CheckboxLabel = styled.label`
    display: flex; align-items: center; margin-bottom: 0.5rem; cursor: pointer;
`;

const Checkbox = styled.input`
    margin-right: 0.5rem; width: 18px; height: 18px;
`;

const ModalFooter = styled.div`
    display: flex; justify-content: flex-end; margin-top: 2rem; padding-top: 1rem;
    border-top: 1px solid var(--light-gray);
`;

const SaveButton = styled(Button)`
    margin-left: 0.5rem;
`;

const CancelButton = styled(Button)`
    background-color: #6c757d;
    &:hover { background-color: #5a6268; }
`;

const SectionTitle = styled.h4`
    margin: 1.5rem 0 1rem; padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--light-gray);
`;

const Spinner = styled.div`
    display: inline-block; width: 1rem; height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%;
    border-top-color: white; animation: spin 1s ease-in-out infinite;
    margin-right: 0.5rem;
    @keyframes spin { to { transform: rotate(360deg); } }
`;

const EmptyMessage = styled.div`
    text-align: center; padding: 2rem; color: #6c757d;
`;

// AdminProducts Component
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await adminService.getAllProducts();
                const productsData = response.data || response;
                setProducts(Array.isArray(productsData) ? productsData : []);
            } catch (error) {
                toast.error('Error loading products');
                console.error(error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleInitializeProducts = async () => {
        try {
            setLoading(true);
            await adminService.initializeProducts();
            const response = await adminService.getAllProducts();
            const productsData = response.data || response;
            setProducts(Array.isArray(productsData) ? productsData : []);
            toast.success('Base products initialized successfully');
        } catch (error) {
            toast.error('Error initializing products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleOpenEditModal = product => {
        setModalMode('edit');
        setCurrentProduct(product);
        setFormData({
            ...product,
            features: product.features || {},
            pricing: product.pricing || {}
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentProduct(null);
    };

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('features.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                features: {
                    ...prev.features,
                    [field]: type === 'checkbox' ? checked : parseFloat(value)
                }
            }));
        } else if (name.startsWith('pricing.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                pricing: {
                    ...prev.pricing,
                    [field]: type === 'checkbox' ? checked : parseFloat(value)
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSaveProduct = async () => {
        try {
            setLoading(true);
            if (modalMode === 'create') {
                await adminService.createProduct(formData);
                toast.success('Product created successfully');
            } else {
                await adminService.updateProduct(currentProduct._id, formData);
                toast.success('Product updated successfully');
            }
            const response = await adminService.getAllProducts();
            const productsData = response.data || response;
            setProducts(Array.isArray(productsData) ? productsData : []);
            handleCloseModal();
        } catch (error) {
            toast.error(modalMode === 'create'
                ? 'Error creating product'
                : 'Error updating product'
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async id => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            setLoading(true);
            await adminService.deleteProduct(id);
            setProducts(prev => prev.filter(p => p._id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Error deleting product');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (id, active) => {
        try {
            setLoading(true);
            await adminService.updateProduct(id, { active: !active });
            setProducts(prev =>
                prev.map(p => p._id === id ? { ...p, active: !active } : p)
            );
            toast.success(!active ? 'Product activated' : 'Product deactivated');
        } catch (error) {
            toast.error('Error toggling product status');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeText = type => {
        switch (type) {
            case 'standard': return 'Standard';
            case 'dominant': return 'Dominant';
            case 'premiant': return 'Premiant';
            default: return type;
        }
    };

    const safeGetValue = (obj, path, def = '') => {
        try {
            return path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : def), obj);
        } catch {
            return def;
        }
    };

    return (
        <Container>
            <Card>
                <HeaderActions>
                    <h2>Insurance Products</h2>
                    <div>
                        <Button onClick={handleOpenCreateModal} style={{ marginRight: '0.5rem' }}>
                            <ButtonIcon>+</ButtonIcon> New Product
                        </Button>
                        <Button onClick={handleInitializeProducts} disabled={products.length > 0}>
                            <ButtonIcon><FiPlay /></ButtonIcon> Initialize
                        </Button>
                    </div>
                </HeaderActions>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner /> Loading...
                    </div>
                ) : products.length === 0 ? (
                    <EmptyMessage>
                        <p>No products found</p>
                        <p>Click "Initialize" to create base products</p>
                    </EmptyMessage>
                ) : (
                    <ProductTable>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Type</TableHeaderCell>
                                <TableHeaderCell>Base Price</TableHeaderCell>
                                <TableHeaderCell>Limits</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Actions</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                        {products.map(product => (
                            <TableRow key={product._id}>
                                <TableCell>{safeGetValue(product, 'name')}</TableCell>
                                <TableCell>{getTypeText(safeGetValue(product, 'type'))}</TableCell>
                                <TableCell>{safeGetValue(product, 'pricing.basePrice', 0)} Kč</TableCell>
                                <TableCell>
                                    {(safeGetValue(product, 'features.propertyDamageLimit', 0) / 1e6).toFixed(0)}/
                                    {(safeGetValue(product, 'features.healthDamageLimit', 0) / 1e6).toFixed(0)} M Kč
                                </TableCell>
                                <TableCell>
                                    <StatusIndicator active={product.active} />
                                    {product.active ? 'Active' : 'Inactive'}
                                </TableCell>
                                <TableCell>
                                    <ActionButton title="Edit" onClick={() => handleOpenEditModal(product)}><FiEdit /></ActionButton>
                                    <ActionButton
                                        title={product.active ? 'Deactivate' : 'Activate'}
                                        onClick={() => handleToggleActive(product._id, product.active)}
                                    >
                                        {product.active ? <FiX /> : <FiCheck />}
                                    </ActionButton>
                                    <ActionButton title="Delete" onClick={() => handleDeleteProduct(product._id)}><FiTrash2 /></ActionButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </ProductTable>
                )}
            </Card>

            {showModal && (
                <Modal>
                    <ModalContent>
                        <ModalHeader>
                            <h3>{modalMode === 'create' ? 'Create New Product' : 'Edit Product'}</h3>
                            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
                        </ModalHeader>

                        <FormGroup>
                            <Label htmlFor="type">Product Type</Label>
                            <Select id="type" name="type" value={formData.type} onChange={handleInputChange}>
                                <option value="standard">Standard</option>
                                <option value="dominant">Dominant</option>
                                <option value="premiant">Premiant</option>
                            </Select>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="name">Product Name</Label>
                            <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
                        </FormGroup>

                        <SectionTitle>Product Features</SectionTitle>
                        <FormGrid>
                            <FormGroup>
                                <Label htmlFor="features.propertyDamageLimit">Property Damage Limit (Kč)</Label>
                                <Input type="number" id="features.propertyDamageLimit" name="features.propertyDamageLimit" value={safeGetValue(formData, 'features.propertyDamageLimit', 0)} onChange={handleInputChange} min="0" step="1000000" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="features.healthDamageLimit">Health Damage Limit (Kč)</Label>
                                <Input type="number" id="features.healthDamageLimit" name="features.healthDamageLimit" value={safeGetValue(formData, 'features.healthDamageLimit', 0)} onChange={handleInputChange} min="0" step="1000000" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="features.driverInsuranceAmount">Driver Insurance Amount (Kč)</Label>
                                <Input type="number" id="features.driverInsuranceAmount" name="features.driverInsuranceAmount" value={safeGetValue(formData, 'features.driverInsuranceAmount', 0)} onChange={handleInputChange} min="0" step="10000" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="features.personalItemsAmount">Personal Items Coverage (Kč)</Label>
                                <Input type="number" id="features.personalItemsAmount" name="features.personalItemsAmount" value={safeGetValue(formData, 'features.personalItemsAmount', 0)} onChange={handleInputChange} min="0" step="1000" />
                            </FormGroup>
                        </FormGrid>

                        <FormGroup>
                            <CheckboxLabel>
                                <Checkbox type="checkbox" id="features.assistanceServices" name="features.assistanceServices" checked={safeGetValue(formData, 'features.assistanceServices', true)} onChange={handleInputChange} />
                                Assistance Services
                            </CheckboxLabel>
                            <CheckboxLabel>
                                <Checkbox type="checkbox" id="features.ownVehicleDamage" name="features.ownVehicleDamage" checked={safeGetValue(formData, 'features.ownVehicleDamage', false)} onChange={handleInputChange} />
                                Own Vehicle Damage Insurance
                            </CheckboxLabel>
                            <CheckboxLabel>
                                <Checkbox type="checkbox" id="features.replacementVehicle" name="features.replacementVehicle" checked={safeGetValue(formData, 'features.replacementVehicle', false)} onChange={handleInputChange} />
                                Replacement Vehicle Rental
                            </CheckboxLabel>
                        </FormGroup>

                        <SectionTitle>Pricing</SectionTitle>
                        <FormGrid>
                            <FormGroup>
                                <Label htmlFor="pricing.basePrice">Base Price (Kč)</Label>
                                <Input type="number" id="pricing.basePrice" name="pricing.basePrice" value={safeGetValue(formData, 'pricing.basePrice', 0)} onChange={handleInputChange} min="0" step="100" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="pricing.electricVehicleDiscount">Electric Vehicle Discount (%)</Label>
                                <Input type="number" id="pricing.electricVehicleDiscount" name="pricing.electricVehicleDiscount" value={safeGetValue(formData, 'pricing.electricVehicleDiscount', 0)} onChange={handleInputChange} min="0" max="100" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="pricing.weightMultiplier">Weight Multiplier</Label>
                                <Input type="number" id="pricing.weightMultiplier" name="pricing.weightMultiplier" value={safeGetValue(formData, 'pricing.weightMultiplier', 1)} onChange={handleInputChange} min="0" step="0.01" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="pricing.engineVolumeMultiplier">Engine Volume Multiplier</Label>
                                <Input type="number" id="pricing.engineVolumeMultiplier" name="pricing.engineVolumeMultiplier" value={safeGetValue(formData, 'pricing.engineVolumeMultiplier', 1)} onChange={handleInputChange} min="0" step="0.01" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="pricing.vehicleAgeMultiplier">Vehicle Age Multiplier</Label>
                                <Input type="number" id="pricing.vehicleAgeMultiplier" name="pricing.vehicleAgeMultiplier" value={safeGetValue(formData, 'pricing.vehicleAgeMultiplier', 1)} onChange={handleInputChange} min="0" step="0.01" />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="pricing.ownershipCountMultiplier">Ownership Count Multiplier</Label>
                                <Input type="number" id="pricing.ownershipCountMultiplier" name="pricing.ownershipCountMultiplier" value={safeGetValue(formData, 'pricing.ownershipCountMultiplier', 1)} onChange={handleInputChange} min="0" step="0.01" />
                            </FormGroup>
                        </FormGrid>

                        <FormGroup>
                            <CheckboxLabel>
                                <Checkbox type="checkbox" id="active" name="active" checked={safeGetValue(formData, 'active', true)} onChange={handleInputChange} />
                                Active
                            </CheckboxLabel>
                        </FormGroup>

                        <ModalFooter>
                            <CancelButton onClick={handleCloseModal}>Cancel</CancelButton>
                            <SaveButton onClick={handleSaveProduct}>
                                {loading ? <><Spinner /> Saving...</> : 'Save'}
                            </SaveButton>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default AdminProducts;
