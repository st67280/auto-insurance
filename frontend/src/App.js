import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Компоненты
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Страницы
import Home from './pages/Home';
import Insurance from './pages/Insurance';
import VehicleForm from './pages/VehicleForm';
import CustomerForm from './pages/CustomerForm';
import PackageSelection from './pages/PackageSelection';
import AdditionalServices from './pages/AdditionalServices';
import Summary from './pages/Summary';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminInsurances from './pages/admin/Insurances';
import AdminProducts from './pages/admin/Products';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Публичные маршруты */}
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />

                {/* Процесс оформления страховки */}
                <Route path="insurance" element={<Insurance />}>
                    <Route index element={<VehicleForm />} />
                    <Route path="vehicle" element={<VehicleForm />} />
                    <Route path="customer" element={<CustomerForm />} />
                    <Route path="package" element={<PackageSelection />} />
                    <Route path="additional" element={<AdditionalServices />} />
                    <Route path="summary" element={<Summary />} />
                </Route>

                {/* Административные маршруты (защищенные) */}
                <Route
                    path="admin"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<AdminInsurances />} />
                    <Route path="insurances" element={<AdminInsurances />} />
                    <Route path="products" element={<AdminProducts />} />
                </Route>

                {/* Обработка несуществующих маршрутов */}
                <Route path="*" element={<div>Страница не найдена</div>} />
            </Route>
        </Routes>
    );
}

export default App;