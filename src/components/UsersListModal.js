import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiX, FiSearch, FiMessageCircle, FiUser } from 'react-icons/fi';

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

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const SearchContainer = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: #f8f9fa;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    background: white;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
`;

const UsersList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || '#4a90e2'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  margin-right: 12px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;

const UserStatus = styled.div`
  font-size: 12px;
  color: ${props => props.isOnline ? '#28a745' : '#666'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OnlineDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#28a745' : '#6c757d'};
`;

const ChatButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #357abd;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 24px;
  color: #666;
`;

const UsersListModal = ({ isOpen, onClose, onStartChat, currentUser }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      
      // Обновляем статус пользователей каждые 10 секунд
      const interval = setInterval(fetchUsers, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/online', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const usersData = await response.json();
        // Исключаем текущего пользователя из списка
        const filteredUsers = usersData.filter(user => user.id !== currentUser?.id);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      (user.fullName && user.fullName.toLowerCase().includes(searchLower)) ||
      (user.email && user.email.toLowerCase().includes(searchLower))
    );
  });

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getRoleName = (role) => {
    const roles = {
      'admin': 'Администратор',
      'manager': 'Менеджер',
      'developer': 'Разработчик',
      'tester': 'Тестировщик'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': '#dc3545',
      'manager': '#fd7e14',
      'developer': '#28a745',
      'tester': '#6f42c1'
    };
    return colors[role] || '#6c757d';
  };

  const handleStartChat = async (user) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          participantId: user.id
        })
      });
      
      if (response.ok) {
        const chatData = await response.json();
        onStartChat(chatData);
        onClose();
      }
    } catch (error) {
      console.error('Ошибка создания чата:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiUser />
            Все пользователи
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <SearchContainer>
          <div style={{ position: 'relative' }}>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </SearchContainer>
        
        <UsersList>
          {loading ? (
            <LoadingState>
              <div>Загрузка пользователей...</div>
            </LoadingState>
          ) : filteredUsers.length === 0 ? (
            <EmptyState>
              <EmptyIcon>👥</EmptyIcon>
              <EmptyText>
                {searchTerm ? 'Пользователи не найдены' : 'Нет пользователей'}
              </EmptyText>
              <EmptySubtext>
                {searchTerm 
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Другие пользователи пока не зарегистрированы'
                }
              </EmptySubtext>
            </EmptyState>
          ) : (
            filteredUsers.map(user => (
              <UserItem key={user.id}>
                <UserAvatar color={getRoleColor(user.role)}>
                  {getInitials(user.fullName || user.username)}
                </UserAvatar>
                
                <UserInfo>
                  <UserName>
                    {user.fullName || user.username}
                  </UserName>
                  <UserRole>
                    {getRoleName(user.role)}
                  </UserRole>
                  <UserStatus isOnline={user.isOnline}>
                    <OnlineDot isOnline={user.isOnline} />
                    {user.isOnline ? 'В сети' : 'Не в сети'}
                  </UserStatus>
                </UserInfo>
                
                <ChatButton onClick={() => handleStartChat(user)}>
                  <FiMessageCircle />
                  Написать
                </ChatButton>
              </UserItem>
            ))
          )}
        </UsersList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UsersListModal;

