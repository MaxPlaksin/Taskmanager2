import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiSend, FiArrowLeft, FiMoreVertical, FiUser } from 'react-icons/fi';

const ChatWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
`;

const ChatHeader = styled.div`
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const BackButton = styled.button`
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
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
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

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  
  ${props => props.isOwn ? `
    background: #4a90e2;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  ` : `
    background: white;
    color: #333;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  `}
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: ${props => props.isOwn ? 'rgba(255,255,255,0.7)' : '#999'};
  margin-top: 4px;
  text-align: ${props => props.isOwn ? 'right' : 'left'};
`;

const MessageInputContainer = styled.div`
  background: white;
  padding: 16px 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const MessageInput = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  font-family: inherit;
  resize: none;
  outline: none;
  
  &:focus {
    border-color: #4a90e2;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a90e2;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: white;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  align-self: flex-start;
  max-width: 70px;
`;

const TypingDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite ease-in-out;
  
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes typing {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const ChatWindow = ({ chat, onBack, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chat) {
      fetchMessages();
      
      // Обновляем сообщения каждые 2 секунды
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!chat) return;
    
    try {
      console.log(`Загружаем сообщения для чата ${chat.id}...`);
      const response = await fetch(`/api/chats/${chat.id}/messages`, {
        credentials: 'include'
      });
      
      console.log(`Ответ от API сообщений для чата ${chat.id}:`, response.status, response.statusText);
      
      if (response.ok) {
        const messagesData = await response.json();
        console.log(`Получены сообщения для чата ${chat.id}:`, messagesData);
        setMessages(prevMessages => {
          // Обновляем только если есть изменения
          if (JSON.stringify(prevMessages) !== JSON.stringify(messagesData)) {
            return messagesData;
          }
          return prevMessages;
        });
      } else {
        console.error(`Ошибка получения сообщений для чата ${chat.id}:`, response.status, response.statusText);
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat || sending) return;
    
    setSending(true);
    
    try {
      const response = await fetch(`/api/chats/${chat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newMessage.trim(),
          messageType: 'text'
        })
      });
      
      if (response.ok) {
        const messageData = await response.json();
        setNewMessage('');
        
        // Сразу обновляем список сообщений с сервера
        await fetchMessages();
      } else {
        console.error('Ошибка отправки сообщения:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    } finally {
      setSending(false);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await fetch(`/api/chats/${chat.id}/messages/${messageId}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Ошибка отметки сообщения как прочитанного:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getParticipant = () => {
    if (!chat || !currentUser) return null;
    return chat.participants.find(p => p.id !== currentUser.id);
  };

  const participant = getParticipant();

  if (!chat) {
    return (
      <ChatWindowContainer>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <EmptyText>Выберите чат для общения</EmptyText>
          <EmptySubtext>Начните диалог с коллегами</EmptySubtext>
        </EmptyState>
      </ChatWindowContainer>
    );
  }

  return (
    <ChatWindowContainer>
      <ChatHeader>
        <BackButton onClick={onBack}>
          <FiArrowLeft />
        </BackButton>
        
        <UserAvatar color="#4a90e2">
          {participant ? getInitials(participant.fullName || participant.username) : '??'}
        </UserAvatar>
        
        <UserInfo>
          <UserName>
            {participant ? (participant.fullName || participant.username) : 'Неизвестный пользователь'}
          </UserName>
          <UserStatus isOnline={participant?.isOnline}>
            <OnlineDot isOnline={participant?.isOnline} />
            {participant?.isOnline ? 'В сети' : 'Не в сети'}
          </UserStatus>
        </UserInfo>
        
        <MoreButton>
          <FiMoreVertical />
        </MoreButton>
      </ChatHeader>
      
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💭</EmptyIcon>
            <EmptyText>Пока нет сообщений</EmptyText>
            <EmptySubtext>Напишите первое сообщение!</EmptySubtext>
          </EmptyState>
        ) : (
          messages.map(message => (
            <MessageBubble
              key={message.id}
              isOwn={message.senderId === currentUser?.id}
            >
              {message.content}
              <MessageTime isOwn={message.senderId === currentUser?.id}>
                {formatTime(message.createdAt)}
              </MessageTime>
            </MessageBubble>
          ))
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <MessageInputContainer>
        <MessageInput
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Напишите сообщение..."
          disabled={sending}
        />
        <SendButton
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sending}
        >
          <FiSend />
        </SendButton>
      </MessageInputContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
