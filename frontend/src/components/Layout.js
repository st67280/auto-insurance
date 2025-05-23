import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styled from 'styled-components';

// Стилизованные компоненты
const Header = styled.header`
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  margin-left: 1rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    color: white;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
  &:hover {
    color: white;
  }
`;

const Main = styled.main`
  padding: 2rem 0;
  min-height: calc(100vh - 150px);
`;

const Footer = styled.footer`
  background-color: var(--dark-color);
  color: white;
  padding: 1rem 0;
  text-align: center;
`;

// Компонент основного макета приложения
const Layout = () => {
    const { user, logout, isAdmin } = useAuth();

    return (
        <>
            <Header>
                <div className="container">
                    <Nav>
                        <Logo to="/">Auto Insurance</Logo>
                        <div>
                            <NavLink to="/">Home</NavLink>
                            <NavLink to="/insurance">Calculate Insurance</NavLink>
                            {user ? (
                                <>
                                    {isAdmin() && <NavLink to="/admin">Admin Panel</NavLink>}
                                    <NavLink to="/" onClick={logout}>Logout</NavLink>
                                </>
                            ) : (
                                <NavLink to="/login">Login</NavLink>
                            )}
                        </div>
                    </Nav>
                </div>
            </Header>

            <Main>
                <div className="container">
                    <Outlet />
                </div>
            </Main>

            <Footer>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Auto Insurance. All rights reserved.</p>
                </div>
            </Footer>
        </>
    );
};

export default Layout;