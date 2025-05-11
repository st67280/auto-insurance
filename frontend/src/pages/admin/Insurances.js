import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import { FiEdit, FiCheckCircle, FiXCircle } from 'react-icons/fi';

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

// Component for managing insurances
const AdminInsurances = () => {
    const [insurances, setInsurances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(false);
    const [currentInsurance, setCurrentInsurance] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [packageFilter, setPackageFilter] = useState('all');

    // Load insurances
    useEffect(() => {
        const fetchInsurances = async () => {
            try {
                setLoading(true);
                const response = await adminService.getAllInsurances();
                setInsurances(response);
            } catch (error) {
                toast.error('Error loading insurances');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsurances();
    }, []);

    const handleEditInsurance = insurance => {
        setCurrentInsurance(insurance);
        setEditModal(true);
    };

    const handleCloseModal = () => {
        setEditModal(false);
        setCurrentInsurance(null);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            setLoading(true);
            await adminService.updateInsurance(id, { status });
            setInsurances(insurances.map(ins =>
                ins._id === id ? { ...ins, status } : ins
            ));
            toast.success('Insurance status updated');
        } catch (error) {
            toast.error('Error updating status');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyDiscount = async () => {
        if (!currentInsurance) return;
        try {
            const discounts = parseInt(currentInsurance.pricing.discounts) || 0;
            await adminService.updateInsurance(currentInsurance._id, {
                pricing: { discounts }
            });
            setInsurances(insurances.map(ins =>
                ins._id === currentInsurance._id
                    ? {
                        ...ins,
                        pricing: {
                            ...ins.pricing,
                            discounts,
                            totalPrice:
                                ins.pricing.basePrice +
                                ins.pricing.additionalServicesPrice -
                                discounts
                        }
                    }
                    : ins
            ));
            toast.success('Discount applied');
            handleCloseModal();
        } catch (error) {
            toast.error('Error applying discount');
            console.error(error);
        }
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        if (name.includes('pricing.')) {
            const field = name.split('.')[1];
            setCurrentInsurance({
                ...currentInsurance,
                pricing: {
                    ...currentInsurance.pricing,
                    [field]: value
                }
            });
        } else {
            setCurrentInsurance({ ...currentInsurance, [name]: value });
        }
    };

    const filteredInsurances = insurances.filter(ins => {
        const statusMatch =
            statusFilter === 'all' || ins.status === statusFilter;
        const packageMatch =
            packageFilter === 'all' || ins.selectedPackage === packageFilter;
        return statusMatch && packageMatch;
    });

    const renderStatus = status => {
        const statusText = {
            draft: 'Draft',
            pending: 'Pending Payment',
            active: 'Active',
            expired: 'Expired',
            cancelled: 'Cancelled'
        };
        return (
            <StatusBadge status={status}>
                {statusText[status] || status}
            </StatusBadge>
        );
    };

    const getPackageText = type => {
        switch (type) {
            case 'standard':
                return 'Standard';
            case 'dominant':
                return 'Dominant';
            case 'premiant':
                return 'Premiant';
            default:
                return 'Unknown package';
        }
    };

    return (
        <Container>
            <Card>
                <h2>Manage Insurances</h2>

                <div className="d-flex justify-content-between mb-3">
                    <div>
                        <Label htmlFor="statusFilter" className="mr-2">
                            Status:
                        </Label>
                        <Select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            style={{ width: 'auto', marginRight: '1rem' }}
                        >
                            <option value="all">All</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending Payment</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="cancelled">Cancelled</option>
                        </Select>

                        <Label htmlFor="packageFilter" className="mr-2">
                            Package:
                        </Label>
                        <Select
                            id="packageFilter"
                            value={packageFilter}
                            onChange={e => setPackageFilter(e.target.value)}
                            style={{ width: 'auto' }}
                        >
                            <option value="all">All</option>
                            <option value="standard">Standard</option>
                            <option value="dominant">Dominant</option>
                            <option value="premiant">Premiant</option>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner /> Loading...
                    </div>
                ) : filteredInsurances.length === 0 ? (
                    <EmptyMessage>No insurances found</EmptyMessage>
                ) : (
                    <InsuranceTable>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Customer</TableHeaderCell>
                                <TableHeaderCell>Vehicle</TableHeaderCell>
                                <TableHeaderCell>Package</TableHeaderCell>
                                <TableHeaderCell>Price</TableHeaderCell>
                                <TableHeaderCell>Status</TableHeaderCell>
                                <TableHeaderCell>Actions</TableHeaderCell>
                            </TableRow>
                        </TableHeader>
                        <tbody>
                        {filteredInsurances.map(ins => (
                            <TableRow key={ins._id}>
                                <TableCell>{ins._id.substring(0, 8)}...</TableCell>
                                <TableCell>
                                    {ins.customerInfo.name} {ins.customerInfo.surname}
                                    <br />
                                    <small>{ins.customerInfo.phone}</small>
                                </TableCell>
                                <TableCell>
                                    {ins.vehicle.brand} {ins.vehicle.model}
                                    <br />
                                    <small>{ins.vehicle.vin}</small>
                                </TableCell>
                                <TableCell>
                                    {getPackageText(ins.selectedPackage)}
                                </TableCell>
                                <TableCell>
                                    {ins.pricing.totalPrice} Kč
                                </TableCell>
                                <TableCell>{renderStatus(ins.status)}</TableCell>
                                <TableCell>
                                    <ActionButton
                                        title="Edit"
                                        onClick={() => handleEditInsurance(ins)}
                                    >
                                        <FiEdit />
                                    </ActionButton>
                                    <ActionButton
                                        title="Activate"
                                        onClick={() =>
                                            handleUpdateStatus(ins._id, 'active')
                                        }
                                    >
                                        <FiCheckCircle />
                                    </ActionButton>
                                    <ActionButton
                                        title="Cancel"
                                        onClick={() =>
                                            handleUpdateStatus(ins._id, 'cancelled')
                                        }
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

            {editModal && currentInsurance && (
                <Modal>
                    <ModalContent>
                        <ModalHeader>
                            <h3>Edit Insurance</h3>
                            <CloseButton onClick={handleCloseModal}>
                                &times;
                            </CloseButton>
                        </ModalHeader>

                        <FormGroup>
                            <Label>Insurance ID</Label>
                            <Input value={currentInsurance._id} disabled />
                        </FormGroup>

                        <FormGroup>
                            <Label>Customer</Label>
                            <Input
                                value={`${currentInsurance.customerInfo.name} ${currentInsurance.customerInfo.surname}`}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Vehicle</Label>
                            <Input
                                value={`${currentInsurance.vehicle.brand} ${currentInsurance.vehicle.model} (${currentInsurance.vehicle.vin})`}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Insurance Package</Label>
                            <Input
                                value={getPackageText(
                                    currentInsurance.selectedPackage
                                )}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label>Base Price</Label>
                            <Input
                                value={currentInsurance.pricing.basePrice}
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="pricing.discounts">
                                Discount (Kč)
                            </Label>
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
                            <Label>Total Price</Label>
                            <Input
                                value={
                                    currentInsurance.pricing.basePrice +
                                    currentInsurance.pricing.additionalServicesPrice -
                                    (parseInt(
                                            currentInsurance.pricing.discounts
                                        ) ||
                                        0) +
                                    ' Kč'
                                }
                                disabled
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                id="status"
                                name="status"
                                value={currentInsurance.status}
                                onChange={handleInputChange}
                            >
                                <option value="draft">Draft</option>
                                <option value="pending">Pending Payment</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                            </Select>
                        </FormGroup>

                        <ModalFooter>
                            <CancelButton onClick={handleCloseModal}>
                                Cancel
                            </CancelButton>
                            <Button onClick={handleApplyDiscount}>
                                Save
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default AdminInsurances;
