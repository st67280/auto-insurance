import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiShield, FiPackage, FiLogOut } from 'react-icons/fi';

// Стилизованные компоненты
const DashboardContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 200px);
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: var(--dark-color);
  color: white;
  padding: 2rem 1rem;
`;

const Content = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #f9f9f9;
`;

const SidebarHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const Username = styled.div`
  font-weight: 500;
`;

const Role = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
`;

const SidebarMenu = styled.nav`
  margin-bottom: 2rem;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background-color: var(--primary-color);
    color: white;
  }
`;

const LinkIcon = styled.div`
  margin-right: 0.75rem;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const PageTitle = styled.h1`
  margin-bottom: 2rem;
  color: var(--dark-color);
`;

// Компонент административной панели
const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <DashboardContainer>
            {/* Боковое меню */}
            <Sidebar>
                <SidebarHeader>
                    <UserInfo>
                        <UserIcon>
                            <FiUser />
                        </UserIcon>
                        <div>
                            <Username>{user?.username || 'Администратор'}</Username>
                            <Role>{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</Role>
                        </div>
                    </UserInfo>
                </SidebarHeader>

                <SidebarMenu>
                    <SidebarLink to="/admin/insurances">
                        <LinkIcon>
                            <FiShield />
                        </LinkIcon>
                        Страховки
                    </SidebarLink>
                    <SidebarLink to="/admin/products">
                        <LinkIcon>
                            <FiPackage />
                        </LinkIcon>
                        Продукты
                    </SidebarLink>
                </SidebarMenu>

                <LogoutButton onClick={logout}>
                    <LinkIcon>
                        <FiLogOut />
                    </LinkIcon>
                    Выйти
                </LogoutButton>
            </Sidebar>

            {/* Основное содержимое */}
            <Content>
                <PageTitle>Панель администратора</PageTitle>
                <Outlet />
            </Content>
        </DashboardContainer>
    );
};

export default AdminDashboard;