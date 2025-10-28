import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMessageCircle, FiPlus, FiSearch, FiUsers } from 'react-icons/fi';

const ChatListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
`;

const ChatListHeader = styled.div`
  background: white;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const HeaderTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
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
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 16px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #357abd;
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background: #e9ecef;
    }
  }
`;

const ChatListContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const ChatItem = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-1px);
  }
  
  &.active {
    border-color: #4a90e2;
    background: #f0f7ff;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ChatTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OnlineIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#28a745' : '#6c757d'};
`;

const ChatTime = styled.div`
  font-size: 12px;
  color: #666;
`;

const ChatPreview = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const ChatMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UnreadBadge = styled.div`
  background: #4a90e2;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
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

const ChatList = ({ onChatSelect, selectedChatId, onCreateChat, onShowUsers, currentUser }) => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
    
    // Обновляем чаты каждые 5 секунд
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchChats = async () => {
    try {
      console.log('Загружаем чаты...');
      const response = await fetch('/api/chats', {
        credentials: 'include'
      });
      
      console.log('Ответ от API чатов:', response.status, response.statusText);
      
      if (response.ok) {
        const chatsData = await response.json();
        console.log('Получены чаты:', chatsData);
        setChats(chatsData);
      } else {
        console.error('Ошибка получения чатов:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Ошибка загрузки чатов:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    
    const participant = chat.participants.find(p => p.id !== getCurrentUserId());
    return participant && (
      participant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (participant.fullName && participant.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getCurrentUserId = () => {
    // Используем переданный currentUser или fallback на localStorage
    return currentUser?.id || JSON.parse(localStorage.getItem('user') || '{}').id;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'сейчас';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}м`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}ч`;
    return date.toLocaleDateString('ru-RU');
  };

  const getChatTitle = (chat) => {
    const currentUserId = getCurrentUserId();
    const participant = chat.participants.find(p => p.id !== currentUserId);
    return participant ? (participant.fullName || participant.username) : 'Неизвестный пользователь';
  };

  const getChatPreview = (chat) => {
    if (chat.lastMessage) {
      return chat.lastMessage.content.length > 50 
        ? chat.lastMessage.content.substring(0, 50) + '...'
        : chat.lastMessage.content;
    }
    return 'Нет сообщений';
  };

  const isParticipantOnline = (chat) => {
    const currentUserId = getCurrentUserId();
    const participant = chat.participants.find(p => p.id !== currentUserId);
    return participant ? participant.isOnline : false;
  };

  if (loading) {
    return (
      <ChatListContainer>
        <ChatListHeader>
          <HeaderTitle>
            <FiMessageCircle />
            Чаты
          </HeaderTitle>
        </ChatListHeader>
        <ChatListContent>
          <EmptyState>
            <EmptyText>Загрузка чатов...</EmptyText>
          </EmptyState>
        </ChatListContent>
      </ChatListContainer>
    );
  }

  return (
    <ChatListContainer>
      <ChatListHeader>
        <HeaderTitle>
          <FiMessageCircle />
          Чаты
        </HeaderTitle>
        
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Поиск чатов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <ActionButtons>
          <ActionButton onClick={onShowUsers}>
            <FiUsers />
            Все пользователи
          </ActionButton>
          <ActionButton onClick={onCreateChat}>
            <FiPlus />
            Новый чат
          </ActionButton>
        </ActionButtons>
      </ChatListHeader>
      
      <ChatListContent>
        {filteredChats.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>
              {searchTerm ? 'Чаты не найдены' : 'У вас пока нет чатов'}
            </EmptyText>
            <EmptySubtext>
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос'
                : 'Начните общение с коллегами!'
              }
            </EmptySubtext>
          </EmptyState>
        ) : (
          filteredChats.map(chat => (
            <ChatItem
              key={chat.id}
              className={selectedChatId === chat.id ? 'active' : ''}
              onClick={() => onChatSelect(chat)}
            >
              <ChatHeader>
                <ChatTitle>
                  {getChatTitle(chat)}
                  <OnlineIndicator isOnline={isParticipantOnline(chat)} />
                </ChatTitle>
                <ChatTime>
                  {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : formatTime(chat.updatedAt)}
                </ChatTime>
              </ChatHeader>
              
              <ChatPreview>
                {getChatPreview(chat)}
              </ChatPreview>
              
              <ChatMeta>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {chat.participants.length} участник{chat.participants.length !== 1 ? 'а' : ''}
                </div>
                {chat.unreadCount > 0 && (
                  <UnreadBadge>
                    {chat.unreadCount}
                  </UnreadBadge>
                )}
              </ChatMeta>
            </ChatItem>
          ))
        )}
      </ChatListContent>
    </ChatListContainer>
  );
};

export default ChatList;
