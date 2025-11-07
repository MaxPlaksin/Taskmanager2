import React, { useState } from 'react';
import styled from 'styled-components';
import { FiHome, FiFolder, FiSettings, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';

const SidebarContainer = styled.div`
  width: 250px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
`;

const Logo = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 20px 0;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: ${props => props.active ? '#4a90e2' : '#666'};
  background: ${props => props.active ? '#e3f2fd' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  border-right: ${props => props.active ? '3px solid #4a90e2' : '3px solid transparent'};
  font-weight: ${props => props.active ? '600' : '500'};

  &:hover {
    background: ${props => props.active ? '#e3f2fd' : '#f8f9fa'};
    color: ${props => props.active ? '#4a90e2' : '#333'};
  }
`;

const NavIcon = styled.div`
  font-size: 18px;
`;

const NavText = styled.span`
  font-size: 14px;
`;

const SidebarFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
`;

const UserDropdownContainer = styled.div`
  position: relative;
`;

const UserDropdownButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;

  &:hover {
    background: #f8f9fa;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: #4a90e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserDetails = styled.div`
  flex: 1;
  text-align: left;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #666;
`;

const UserDropdownMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  margin-bottom: 8px;
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

const Sidebar = ({ activeTab, onTabChange, user, onLogout }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: FiHome },
    { id: 'projects', label: 'Проекты', icon: FiFolder },
    { id: 'settings', label: 'Настройки', icon: FiSettings }
  ];

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
    setShowUserDropdown(false);
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
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <LogoIcon>
            <img src="/agb-logo-simple.svg" alt="AGB Logo" />
          </LogoIcon>
          Task Manager
        </Logo>
      </SidebarHeader>

      <Navigation>
        {menuItems.map(item => (
          <NavItem
            key={item.id}
            active={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          >
            <NavIcon>
              <item.icon />
            </NavIcon>
            <NavText>{item.label}</NavText>
          </NavItem>
        ))}
      </Navigation>

      <SidebarFooter>
        <UserDropdownContainer>
          <UserDropdownButton onClick={() => setShowUserDropdown(!showUserDropdown)}>
            <UserAvatar>
              {user ? getInitials(user.fullName) : '👤'}
            </UserAvatar>
            <UserDetails>
              <UserName>{user ? user.fullName : 'Пользователь'}</UserName>
              <UserRole>{user ? getRoleLabel(user.role) : 'Гость'}</UserRole>
            </UserDetails>
            <FiChevronDown style={{ fontSize: '12px' }} />
          </UserDropdownButton>

          {showUserDropdown && (
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
                onClick={() => setShowUserDropdown(false)}
              />
              <UserDropdownMenu>
                <DropdownItem>
                  <FiUser />
                  <div>
                    <div style={{ fontWeight: '600' }}>{user ? user.fullName : 'Пользователь'}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{user ? user.email : ''}</div>
                    {user && <RoleBadge role={user.role}>{getRoleLabel(user.role)}</RoleBadge>}
                  </div>
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  <FiLogOut />
                  Выйти из системы
                </DropdownItem>
              </UserDropdownMenu>
            </>
          )}
        </UserDropdownContainer>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;