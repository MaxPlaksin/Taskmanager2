import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
`;

const UsersHeader = styled.div`
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const UsersTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const UsersSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #007bff;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: white;
  cursor: pointer;
  
  &:focus {
    border-color: #007bff;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #0056b3;
  }
`;

const UsersContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => {
    switch(props.role) {
      case 'admin': return '#dc3545';
      case 'director': return '#6f42c1';
      case 'manager': return '#fd7e14';
      case 'developer': return '#20c997';
      default: return '#6c757d';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
    color: #007bff;
  }
  
  &.edit:hover {
    background: #fff3cd;
    border-color: #ffc107;
    color: #856404;
  }
  
  &.delete:hover {
    background: #f8d7da;
    border-color: #dc3545;
    color: #721c24;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const UsersList = ({ users, onEditUser, onDeleteUser, onCreateUser, onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setRoleFilter(value);
    onFilter(value);
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return '#dc3545';
      case 'director': return '#6f42c1';
      case 'manager': return '#fd7e14';
      case 'developer': return '#20c997';
      default: return '#6c757d';
    }
  };

  const getRoleName = (role) => {
    switch(role) {
      case 'admin': return 'Администратор';
      case 'director': return 'Директор';
      case 'manager': return 'Менеджер';
      case 'developer': return 'Разработчик';
      default: return role;
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <UsersContainer>
      <UsersHeader>
        <UsersTitle>Пользователи</UsersTitle>
        <UsersSubtitle>Управление пользователями системы</UsersSubtitle>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Поиск пользователей..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <FilterSelect value={roleFilter} onChange={handleFilter}>
            <option value="all">Все роли</option>
            <option value="admin">Администратор</option>
            <option value="director">Директор</option>
            <option value="manager">Менеджер</option>
            <option value="developer">Разработчик</option>
          </FilterSelect>
          <AddButton onClick={onCreateUser}>
            <FiPlus />
            Создать пользователя
          </AddButton>
        </SearchContainer>
      </UsersHeader>

      <UsersContent>
        {users.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>Пользователи не найдены</EmptyTitle>
            <EmptyText>Создайте первого пользователя или измените фильтры поиска</EmptyText>
          </EmptyState>
        ) : (
          <UsersGrid>
            {users.map(user => (
              <UserCard key={user.id}>
                <UserHeader>
                  <UserAvatar role={user.role}>
                    {getInitials(user.full_name)}
                  </UserAvatar>
                  <UserInfo>
                    <UserName>{user.full_name}</UserName>
                    <UserRole style={{ color: getRoleColor(user.role) }}>
                      {getRoleName(user.role)}
                    </UserRole>
                  </UserInfo>
                </UserHeader>
                
                <UserEmail>{user.email}</UserEmail>
                
                <UserActions>
                  <ActionButton 
                    className="edit"
                    onClick={() => onEditUser(user)}
                  >
                    <FiEdit />
                    Редактировать
                  </ActionButton>
                  <ActionButton 
                    className="delete"
                    onClick={() => onDeleteUser(user)}
                  >
                    <FiTrash2 />
                    Удалить
                  </ActionButton>
                </UserActions>
              </UserCard>
            ))}
          </UsersGrid>
        )}
      </UsersContent>
    </UsersContainer>
  );
};

export default UsersList;
