import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';

const UserInfoContainer = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const UserRole = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 200px;
  z-index: 1000;
  border: 1px solid #e1e5e9;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #333;
  font-size: 14px;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const RoleBadge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch(props.role) {
      case 'admin': return '#dc3545';
      case 'manager': return '#fd7e14';
      case 'developer': return '#28a745';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const UserInfo = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      onLogout();
    } catch (error) {
      console.error('Ошибка выхода:', error);
      onLogout(); // Выходим в любом случае
    }
    setShowDropdown(false);
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Администратор';
      case 'manager': return 'Менеджер';
      case 'developer': return 'Разработчик';
      default: return role;
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <UserInfoContainer>
      <UserButton onClick={() => setShowDropdown(!showDropdown)}>
        <UserAvatar>
          {getInitials(user.fullName)}
        </UserAvatar>
        <UserDetails>
          <UserName>{user.fullName}</UserName>
          <UserRole>{getRoleLabel(user.role)}</UserRole>
        </UserDetails>
        <FiChevronDown style={{ fontSize: '12px' }} />
      </UserButton>

      {showDropdown && (
        <>
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 999 
            }} 
            onClick={() => setShowDropdown(false)}
          />
          <DropdownMenu>
            <DropdownItem>
              <FiUser />
              <div>
                <div style={{ fontWeight: '600' }}>{user.fullName}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
                <RoleBadge role={user.role}>{getRoleLabel(user.role)}</RoleBadge>
              </div>
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              <FiLogOut />
              Выйти из системы
            </DropdownItem>
          </DropdownMenu>
        </>
      )}
    </UserInfoContainer>
  );
};

export default UserInfo;
