import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiUser, 
  FiMail, 
  FiLock, 
  FiSave, 
  FiCamera,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX
} from 'react-icons/fi';

const SettingsContainer = styled.div`
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  margin-bottom: 30px;
`;

const SettingsTitle = styled.h1`
  color: #333;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
`;

const SettingsSubtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const SettingsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #333;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const AvatarUpload = styled.input`
  display: none;
`;

const AvatarButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;

  &:hover {
    background: #5a6fd8;
  }
`;

const PasswordSection = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;

  &:hover {
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  ${props => props.primary && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `}

  ${props => props.secondary && `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e0e0e0;

    &:hover {
      background: #e9ecef;
      color: #333;
    }
  `}
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Settings = ({ user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('username', formData.username);
      
      if (formData.currentPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
        formDataToSend.append('newPassword', formData.newPassword);
      }

      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onUserUpdate(updatedUser.user);
        setMessage('Настройки успешно сохранены!');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setAvatar(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка сохранения настроек');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return '👤';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <SettingsTitle>Настройки профиля</SettingsTitle>
        <SettingsSubtitle>Управляйте своими данными и настройками аккаунта</SettingsSubtitle>
      </SettingsHeader>

      {message && (
        <SuccessMessage>
          <FiCheck />
          {message}
        </SuccessMessage>
      )}

      {error && (
        <ErrorMessage>
          <FiX />
          {error}
        </ErrorMessage>
      )}

      <form onSubmit={handleSubmit}>
        <SettingsSection>
          <SectionTitle>
            <FiUser />
            Личная информация
          </SectionTitle>

          <AvatarSection>
            <AvatarContainer>
              <Avatar>
                {avatar ? (
                  <img src={URL.createObjectURL(avatar)} alt="Avatar" />
                ) : (
                  getInitials(formData.fullName)
                )}
              </Avatar>
              <AvatarUpload
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                id="avatar-upload"
              />
            </AvatarContainer>
            <div>
              <AvatarButton
                type="button"
                onClick={() => document.getElementById('avatar-upload').click()}
              >
                <FiCamera />
                Изменить аватар
              </AvatarButton>
            </div>
          </AvatarSection>

          <FormGroup>
            <Label htmlFor="fullName">Полное имя</Label>
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="username">Имя пользователя</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </SettingsSection>

        <SettingsSection>
          <SectionTitle>
            <FiLock />
            Безопасность
          </SectionTitle>

          <FormGroup>
            <Label htmlFor="currentPassword">Текущий пароль</Label>
            <PasswordSection>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Введите текущий пароль для изменения"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </PasswordSection>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPassword">Новый пароль</Label>
            <PasswordSection>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Введите новый пароль"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </PasswordSection>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
            <PasswordSection>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Подтвердите новый пароль"
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </PasswordToggle>
            </PasswordSection>
          </FormGroup>
        </SettingsSection>

        <ButtonGroup>
          <Button type="submit" primary disabled={loading}>
            <FiSave />
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </ButtonGroup>
      </form>
    </SettingsContainer>
  );
};

export default Settings;
