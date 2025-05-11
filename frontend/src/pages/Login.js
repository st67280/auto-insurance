import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Стилизованные компоненты
const LoginContainer = styled.div`
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
`;

const LoginTitle = styled.h2`
    margin-bottom: 1.5rem;
    text-align: center;
    color: var(--primary-color);
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
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

const Button = styled.button`
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    padding: 0.75rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;

    &:hover {
        background-color: var(--primary-hover);
    }

    &:disabled {
        background-color: #6c757d;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    color: var(--error-color);
    margin-top: 1rem;
    text-align: center;
`;

// Компонент страницы авторизации
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация формы
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const user = await login(username, password);

            toast.success('You have successfully logged in');

            // Перенаправление в зависимости от роли пользователя
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
            toast.error('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <LoginTitle>Login</LoginTitle>

            <LoginForm onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                    />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </FormGroup>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </Button>
            </LoginForm>

            <div className="text-center mt-3">
                <p>
                    To access admin panel use:<br />
                    Username: <strong>admin</strong><br />
                    Password: <strong>admin</strong>
                </p>
            </div>
        </LoginContainer>
    );
};

export default Login;
