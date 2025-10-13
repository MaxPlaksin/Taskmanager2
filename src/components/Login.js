import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
`;

const LoginTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
`;

const LoginSubtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 32px;
  font-size: 16px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;

  &:hover {
    color: #667eea;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  border: 1px solid #fcc;
`;

const DemoAccounts = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const DemoTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #495057;
  font-weight: 600;
`;

const DemoAccount = styled.div`
  margin-bottom: 8px;
  font-size: 13px;
  color: #6c757d;
`;

const DemoRole = styled.span`
  font-weight: 600;
  color: #495057;
`;

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Ошибка входа в систему');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (username, password) => {
    setFormData(prev => ({
      ...prev,
      username,
      password
    }));
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Task Manager</LoginTitle>
        <LoginSubtitle>Войдите в систему для продолжения</LoginSubtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Имя пользователя</Label>
            <InputContainer>
              <Icon>
                <FiUser />
              </Icon>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Введите имя пользователя"
                required
              />
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Пароль</Label>
            <InputContainer>
              <Icon>
                <FiLock />
              </Icon>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Введите пароль"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputContainer>
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            <FiLogIn />
            {loading ? 'Вход...' : 'Войти'}
          </LoginButton>
        </form>

        <DemoAccounts>
          <DemoTitle>Тестовые аккаунты:</DemoTitle>
          <DemoAccount>
            <DemoRole>Администратор:</DemoRole> admin / admin123
            <button 
              onClick={() => fillDemoAccount('admin', 'admin123')}
              style={{ marginLeft: '8px', fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Заполнить
            </button>
          </DemoAccount>
          <DemoAccount>
            <DemoRole>Менеджер:</DemoRole> manager / manager123
            <button 
              onClick={() => fillDemoAccount('manager', 'manager123')}
              style={{ marginLeft: '8px', fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Заполнить
            </button>
          </DemoAccount>
          <DemoAccount>
            <DemoRole>Разработчик:</DemoRole> developer / developer123
            <button 
              onClick={() => fillDemoAccount('developer', 'developer123')}
              style={{ marginLeft: '8px', fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Заполнить
            </button>
          </DemoAccount>
        </DemoAccounts>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
