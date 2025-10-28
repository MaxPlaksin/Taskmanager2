import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import UsersListModal from './UsersListModal';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #f5f5f5;
`;

const ChatSidebar = styled.div`
  width: 350px;
  border-right: 1px solid #e0e0e0;
  background: white;
  display: flex;
  flex-direction: column;
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Chat = ({ currentUser }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Обновляем статус онлайн при загрузке компонента
    updateOnlineStatus(true);
    
    // Обновляем статус онлайн каждые 30 секунд
    const interval = setInterval(() => {
      updateOnlineStatus(true);
    }, 30000);
    
    // Отмечаем как оффлайн при закрытии страницы
    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateOnlineStatus(false);
    };
  }, [currentUser]);

  const updateOnlineStatus = async (online) => {
    if (!currentUser) return;
    
    try {
      await fetch(`/api/users/${currentUser.id}/online`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          isOnline: online
        })
      });
      
      setIsOnline(online);
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleShowUsers = () => {
    setShowUsersModal(true);
  };

  const handleCloseUsersModal = () => {
    setShowUsersModal(false);
  };

  const handleStartChat = (chat) => {
    setSelectedChat(chat);
    setShowUsersModal(false);
  };

  const handleCreateChat = () => {
    setShowUsersModal(true);
  };

  return (
    <ChatContainer>
      <ChatSidebar>
        <ChatList
          onChatSelect={handleChatSelect}
          selectedChatId={selectedChat?.id}
          onCreateChat={handleCreateChat}
          onShowUsers={handleShowUsers}
          currentUser={currentUser}
        />
      </ChatSidebar>
      
      <ChatMain>
        <ChatWindow
          chat={selectedChat}
          onBack={handleBackToList}
          currentUser={currentUser}
        />
      </ChatMain>
      
      <UsersListModal
        isOpen={showUsersModal}
        onClose={handleCloseUsersModal}
        onStartChat={handleStartChat}
        currentUser={currentUser}
      />
    </ChatContainer>
  );
};

export default Chat;