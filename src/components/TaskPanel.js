import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiArchive, FiList, FiFilter, FiSearch } from 'react-icons/fi';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';

const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 35px 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: ${props => props.active ? '#4a90e2' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#357abd' : '#f5f5f5'};
  }
`;

const AddButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
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
`;

const TasksList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
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

const EmptyText = styled.p`
  font-size: 14px;
  line-height: 1.5;
`;

const TaskPanel = ({ 
  tasks, 
  onTaskSelect, 
  selectedTask, 
  showArchived, 
  onToggleArchived 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showTaskForm, setShowTaskForm] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleTaskClick = (task) => {
    onTaskSelect(task);
  };

  const handleCreateTask = (taskData) => {
    // Здесь будет логика создания задачи через контекст
    setShowTaskForm(false);
  };

  return (
    <>
      <PanelHeader>
        <Title>
          <FiList />
          {showArchived ? 'Архив задач' : 'Активные задачи'}
        </Title>
        
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Поиск задач..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon />
        </SearchContainer>

        <FilterContainer>
          <FilterButton
            active={priorityFilter === 'all'}
            onClick={() => setPriorityFilter('all')}
          >
            Все
          </FilterButton>
          <FilterButton
            active={priorityFilter === 'high'}
            onClick={() => setPriorityFilter('high')}
          >
            Высокий
          </FilterButton>
          <FilterButton
            active={priorityFilter === 'medium'}
            onClick={() => setPriorityFilter('medium')}
          >
            Средний
          </FilterButton>
          <FilterButton
            active={priorityFilter === 'low'}
            onClick={() => setPriorityFilter('low')}
          >
            Низкий
          </FilterButton>
        </FilterContainer>

        <AddButton onClick={() => setShowTaskForm(true)}>
          <FiPlus />
          Добавить задачу
        </AddButton>
      </PanelHeader>

      <TasksList>
        {filteredTasks.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>
              {showArchived 
                ? 'Архив пуст' 
                : 'Нет активных задач'
              }
            </EmptyText>
          </EmptyState>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              isSelected={selectedTask?.id === task.id}
              onClick={() => handleTaskClick(task)}
            />
          ))
        )}
      </TasksList>

      {showTaskForm && (
        <TaskForm
          onSave={handleCreateTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}
    </>
  );
};

export default TaskPanel;
