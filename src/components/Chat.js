import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend, FiSmile, FiPaperclip } from 'react-icons/fi';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #333;
`;

const UserStatus = styled.div`
  font-size: 12px;
  color: #666;
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #fafafa;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 16px;
  ${props => props.isOwn ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  ${props => props.isOwn ? `
    background: #007bff;
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    background: white;
    color: #333;
    border: 1px solid #e9ecef;
    border-bottom-left-radius: 4px;
  `}
`;

const MessageTime = styled.div`
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  text-align: ${props => props.isOwn ? 'right' : 'left'};
`;

const ChatInput = styled.div`
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 24px;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #0056b3;
  }
`;

const AttachmentButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
  }
`;

const Chat = ({ selectedChat, currentUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Привет! Как дела?',
      isOwn: false,
      time: '10:30'
    },
    {
      id: 2,
      text: 'Привет! Все хорошо, спасибо. А у тебя как?',
      isOwn: true,
      time: '10:32'
    },
    {
      id: 3,
      text: 'Тоже все отлично! Работаем над новым проектом.',
      isOwn: false,
      time: '10:35'
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isOwn: true,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <ChatContainer>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666',
          fontSize: '16px'
        }}>
          Выберите чат для начала общения
        </div>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatHeader>
        <Avatar>
          {selectedChat.avatar}
        </Avatar>
        <UserInfo>
          <UserName>{selectedChat.name}</UserName>
          <UserStatus>В сети</UserStatus>
        </UserInfo>
      </ChatHeader>

      <ChatMessages>
        {messages.map(msg => (
          <Message key={msg.id} isOwn={msg.isOwn}>
            <div>
              <MessageBubble isOwn={msg.isOwn}>
                {msg.text}
              </MessageBubble>
              <MessageTime isOwn={msg.isOwn}>
                {msg.time}
              </MessageTime>
            </div>
          </Message>
        ))}
      </ChatMessages>

      <ChatInput>
        <AttachmentButton>
          <FiPaperclip />
        </AttachmentButton>
        <InputField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
        />
        <SendButton onClick={handleSendMessage}>
          <FiSend />
        </SendButton>
      </ChatInput>
    </ChatContainer>
  );
};

export default Chat;
