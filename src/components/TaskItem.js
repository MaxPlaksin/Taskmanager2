import React from 'react';
import styled from 'styled-components';
import { FiCalendar, FiFlag, FiGitBranch, FiServer, FiUser } from 'react-icons/fi';

const TaskContainer = styled.div`
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 12px;
  background: ${props => props.isSelected ? '#e3f2fd' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid ${props => {
    switch(props.priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#bdc3c7';
    }
  }};

  &:hover {
    background: ${props => props.isSelected ? '#e3f2fd' : '#f8f9fa'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const TaskTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.3;
`;

const TaskDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
`;

const MetaIcon = styled.div`
  font-size: 14px;
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
`;

const DueDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${props => {
    if (!props.dueDate) return '#666';
    const today = new Date();
    const due = new Date(props.dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#e74c3c'; // Просрочено
    if (diffDays <= 1) return '#f39c12'; // Сегодня/завтра
    return '#27ae60'; // В срок
  }};
`;

const PriorityBadge = styled.span`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  background: ${props => {
    switch(props.priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#bdc3c7';
    }
  }};
  color: white;
`;

const TaskItem = ({ task, isSelected, onClick, currentUser }) => {
  const formatDate = (date) => {
    if (!date) return 'Без срока';
    const today = new Date();
    const taskDate = new Date(date);
    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    if (diffDays === -1) return 'Вчера';
    if (diffDays < 0) return `${Math.abs(diffDays)} дн. назад`;
    return `${diffDays} дн.`;
  };

  return (
    <TaskContainer 
      isSelected={isSelected}
      priority={task.priority}
      onClick={onClick}
    >
      <TaskTitle>{task.title}</TaskTitle>
      
      <TaskDescription>{task.description}</TaskDescription>
      
      <TaskMeta>
        {task.gitRepository && (
          <MetaItem>
            <MetaIcon>
              <FiGitBranch />
            </MetaIcon>
            Git
          </MetaItem>
        )}
        
        {task.serverAccess && (
          <MetaItem>
            <MetaIcon>
              <FiServer />
            </MetaIcon>
            Сервер
          </MetaItem>
        )}
        
        {currentUser && currentUser.role === 'developer' && task.creatorName && (
          <MetaItem>
            <MetaIcon>
              <FiUser />
            </MetaIcon>
            От: {task.creatorName}
          </MetaItem>
        )}
        
        {task.assignees && task.assignees.length > 0 && (
          <MetaItem>
            <MetaIcon>
              <FiUser />
            </MetaIcon>
            Исполнители: {task.assignees.map(a => a.fullName || a.username).join(', ')}
          </MetaItem>
        )}
      </TaskMeta>
      
      <TaskFooter>
        <DueDate dueDate={task.dueDate}>
          <FiCalendar />
          {formatDate(task.dueDate)}
        </DueDate>
        
        <PriorityBadge priority={task.priority}>
          <FiFlag />
          {task.priority === 'high' ? 'Высокий' : 
           task.priority === 'medium' ? 'Средний' : 
           task.priority === 'low' ? 'Низкий' : 'Не указан'}
        </PriorityBadge>
      </TaskFooter>
    </TaskContainer>
  );
};

export default TaskItem;
