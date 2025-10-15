import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0 0 32px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const Icon = styled.div`
  position: absolute;
  left: 16px;
  color: #666;
  font-size: 18px;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
  z-index: 1;

  &:hover {
    color: #333;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const RoleInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  background: #efe;
  border: 1px solid #cfc;
  color: #3c3;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 8px 0;

  &:hover {
    color: #764ba2;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Register = ({ onBackToLogin, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    loadAvailableRoles();
  }, []);

  const loadAvailableRoles = async () => {
    try {
      const response = await fetch('/api/auth/roles');
      if (response.ok) {
        const data = await response.json();
        setAvailableRoles(data.roles);
      }
    } catch (error) {
      console.error('Ошибка загрузки ролей:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          role: formData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Регистрация успешна! Теперь вы можете войти в систему.');
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = availableRoles.find(role => role.value === formData.role);

  return (
    <Container>
      <Card>
        <BackButton onClick={onBackToLogin}>
          <FiArrowLeft />
          Вернуться к входу
        </BackButton>

        <Title>Регистрация</Title>
        <Subtitle>Создайте новый аккаунт</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Полное имя *</Label>
            <InputContainer>
              <Icon>
                <FiUser />
              </Icon>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Введите ваше полное имя"
                required
              />
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label>Имя пользователя *</Label>
            <InputContainer>
              <Icon>
                <FiUser />
              </Icon>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Введите имя пользователя"
                required
              />
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label>Email *</Label>
            <InputContainer>
              <Icon>
                <FiMail />
              </Icon>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Введите email"
                required
              />
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label>Роль *</Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Выберите роль</option>
              {availableRoles.map(role => (
                <option 
                  key={role.value} 
                  value={role.value}
                  disabled={!role.available}
                >
                  {role.label} {!role.available ? '(недоступно)' : ''}
                </option>
              ))}
            </Select>
            {selectedRole && (
              <RoleInfo>
                <strong>{selectedRole.label}:</strong> {selectedRole.description}
                {selectedRole.max_count && (
                  <div>
                    Текущее количество: {selectedRole.current_count}/{selectedRole.max_count}
                  </div>
                )}
              </RoleInfo>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Пароль *</Label>
            <InputContainer>
              <Icon>
                <FiLock />
              </Icon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Введите пароль (минимум 6 символов)"
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

          <FormGroup>
            <Label>Подтверждение пароля *</Label>
            <InputContainer>
              <Icon>
                <FiLock />
              </Icon>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Подтвердите пароль"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </InputContainer>
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Зарегистрироваться'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Register;
