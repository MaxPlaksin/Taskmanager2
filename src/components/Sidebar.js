import React from 'react';
import styled from 'styled-components';
import { FiHome, FiFolder, FiCalendar, FiSettings } from 'react-icons/fi';

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
  background: #4a90e2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
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

const Sidebar = ({ activeTab, onTabChange, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: FiHome },
    { id: 'projects', label: 'Проекты', icon: FiFolder },
    { id: 'calendar', label: 'Календарь', icon: FiCalendar },
    { id: 'settings', label: 'Настройки', icon: FiSettings }
  ];

  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>
          <LogoIcon>📋</LogoIcon>
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
        <UserInfo>
          <UserAvatar>{user ? user.fullName.split(' ').map(word => word[0]).join('').toUpperCase() : '👤'}</UserAvatar>
          <UserDetails>
            <UserName>{user ? user.fullName : 'Пользователь'}</UserName>
            <UserRole>
              {user ? (user.role === 'admin' ? 'Администратор' : 
                      user.role === 'manager' ? 'Менеджер' : 
                      'Разработчик') : 'Гость'}
            </UserRole>
          </UserDetails>
        </UserInfo>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
