import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Получаем текущего пользователя из localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setCurrentUser(user);

    if (user) {
      // Создаем подключение к WebSocket серверу
      const newSocket = io('http://localhost:5002', {
        transports: ['websocket', 'polling'],
        withCredentials: true
      });

      // Обработчики событий подключения
      newSocket.on('connect', () => {
        console.log('WebSocket connected:', newSocket.id);
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Очистка при размонтировании
      return () => {
        newSocket.close();
      };
    }
  }, []);

  const joinChat = (chatId) => {
    if (socket && currentUser) {
      socket.emit('join_chat', {
        chat_id: chatId,
        user_id: currentUser.id
      });
    }
  };

  const leaveChat = (chatId) => {
    if (socket) {
      socket.emit('leave_chat', {
        chat_id: chatId
      });
    }
  };

  const sendMessage = (chatId, content, messageType = 'text') => {
    if (socket && currentUser) {
      socket.emit('send_message', {
        chat_id: chatId,
        user_id: currentUser.id,
        content: content,
        message_type: messageType
      });
    }
  };

  const sendTyping = (chatId, isTyping = true) => {
    if (socket && currentUser) {
      socket.emit('typing', {
        chat_id: chatId,
        user_id: currentUser.id,
        is_typing: isTyping
      });
    }
  };

  const markMessagesAsRead = (chatId) => {
    if (socket && currentUser) {
      socket.emit('mark_read', {
        chat_id: chatId,
        user_id: currentUser.id
      });
    }
  };

  const value = {
    socket,
    isConnected,
    currentUser,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    markMessagesAsRead
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
