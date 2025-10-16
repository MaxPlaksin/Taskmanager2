import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiX } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  color: #666;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #007bff;
  }
  
  &::placeholder {
    color: #999;
  }
  
  ${props => props.hasToggle && `
    padding-right: 40px;
  `}
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    color: #333;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: #007bff;
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
    }
    
    &:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
  ` : `
    background: #f8f9fa;
    color: #333;
    border: 1px solid #e9ecef;
    
    &:hover {
      background: #e9ecef;
    }
  `}
`;

const CreateUserModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Валидация
    if (!formData.fullName || !formData.username || !formData.email || !formData.role || !formData.password) {
      setError('Все поля обязательны для заполнения');
      setLoading(false);
      return;
    }

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
      await onSave(formData);
      setFormData({
        fullName: '',
        username: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: ''
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка при создании пользователя');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Создать пользователя</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Фамилия и имя *</Label>
              <InputContainer>
                <InputIcon>
                  <FiUser />
                </InputIcon>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Например: Иванов Иван"
                  required
                />
              </InputContainer>
              <HelpText>Укажите фамилию и имя для отображения в чатах</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>Имя пользователя *</Label>
              <InputContainer>
                <InputIcon>
                  <FiUser />
                </InputIcon>
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
                <InputIcon>
                  <FiMail />
                </InputIcon>
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
              <InputContainer>
                <InputIcon>
                  <FiUser />
                </InputIcon>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите роль</option>
                  <option value="director">Директор</option>
                  <option value="manager">Менеджер</option>
                  <option value="developer">Разработчик</option>
                </Select>
              </InputContainer>
            </FormGroup>

            <FormGroup>
              <Label>Пароль *</Label>
              <InputContainer>
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Введите пароль (минимум 6 символов)"
                  hasToggle={true}
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
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Подтвердите пароль"
                  hasToggle={true}
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

            {error && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                marginBottom: '16px',
                padding: '8px 12px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px'
              }}>
                {error}
              </div>
            )}

            <ButtonGroup>
              <Button type="button" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" primary disabled={loading}>
                {loading ? 'Создание...' : 'Создать пользователя'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateUserModal;
