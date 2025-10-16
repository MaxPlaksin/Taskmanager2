import React, { useState } from 'react';
import styled from 'styled-components';
import { FiFolder, FiPlus, FiSearch, FiFilter, FiCalendar, FiFlag, FiSettings } from 'react-icons/fi';
import TaskItem from './TaskItem';
import ProjectManager from './ProjectManager';

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
`;

const ProjectsHeader = styled.div`
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const ProjectsTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const ProjectsSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#4a90e2' : '#666'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#4a90e2' : 'transparent'};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.active ? 'white' : '#f5f5f5'};
    color: ${props => props.active ? '#4a90e2' : '#333'};
  }
`;

const ProjectsContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow: hidden;
`;

const ProjectsPanel = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

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

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  background: ${props => props.color || '#4a90e2'};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const Projects = ({ tasks, onTaskSelect, selectedTask, onCreateTask, user }) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Сортируем задачи по дате создания (от новых к старым)
  const sortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Статистика
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(task => task.status === 'active').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const archivedTasks = tasks.filter(task => task.status === 'archived').length;

  // Определяем текст фильтрации в зависимости от роли
  const getFilterText = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'admin':
        return 'Показываются все задачи в системе';
      case 'director':
        return 'Показываются все задачи в системе';
      case 'manager':
        return 'Показываются только ваши задачи';
      case 'developer':
        return 'Показываются только ваши задачи';
      default:
        return '';
    }
  };

  const handleTaskClick = (task) => {
    onTaskSelect(task);
  };

  return (
    <ProjectsContainer>
      <ProjectsHeader>
        <ProjectsTitle>Проекты</ProjectsTitle>
        <ProjectsSubtitle>Управление проектами и задачами</ProjectsSubtitle>
        {getFilterText() && (
          <ProjectsSubtitle style={{ color: '#007bff', fontSize: '13px', marginTop: '5px' }}>
            {getFilterText()}
          </ProjectsSubtitle>
        )}
        
        <TabsContainer>
          <Tab 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')}
          >
            <FiFolder />
            Задачи
          </Tab>
          <Tab 
            active={activeTab === 'projects'} 
            onClick={() => setActiveTab('projects')}
          >
            <FiSettings />
            Управление проектами
          </Tab>
        </TabsContainer>
      </ProjectsHeader>

      <ProjectsContent>
        {activeTab === 'projects' ? (
          <ProjectManager user={user} />
        ) : (
          <>
            <StatsContainer>
              <StatCard>
                <StatIcon color="#4a90e2">
                  <FiFolder />
                </StatIcon>
                <StatContent>
                  <StatValue>{totalTasks}</StatValue>
                  <StatLabel>Всего задач</StatLabel>
                </StatContent>
              </StatCard>

              <StatCard>
                <StatIcon color="#27ae60">
                  <FiFlag />
                </StatIcon>
                <StatContent>
                  <StatValue>{activeTasks}</StatValue>
                  <StatLabel>Активные</StatLabel>
                </StatContent>
              </StatCard>

              <StatCard>
                <StatIcon color="#f39c12">
                  <FiCalendar />
                </StatIcon>
                <StatContent>
                  <StatValue>{completedTasks}</StatValue>
                  <StatLabel>Завершенные</StatLabel>
                </StatContent>
              </StatCard>

              <StatCard>
                <StatIcon color="#95a5a6">
                  <FiFolder />
                </StatIcon>
                <StatContent>
                  <StatValue>{archivedTasks}</StatValue>
                  <StatLabel>Архивные</StatLabel>
                </StatContent>
              </StatCard>
            </StatsContainer>

            <ProjectsPanel>
            <PanelHeader>
              <Title>
                <FiFolder />
                Список задач
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
                Все приоритеты
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

            <FilterContainer>
              <FilterButton
                active={statusFilter === 'all'}
                onClick={() => setStatusFilter('all')}
              >
                Все статусы
              </FilterButton>
              <FilterButton
                active={statusFilter === 'active'}
                onClick={() => setStatusFilter('active')}
              >
                Активные
              </FilterButton>
              <FilterButton
                active={statusFilter === 'completed'}
                onClick={() => setStatusFilter('completed')}
              >
                Завершенные
              </FilterButton>
              <FilterButton
                active={statusFilter === 'archived'}
                onClick={() => setStatusFilter('archived')}
              >
                Архивные
              </FilterButton>
            </FilterContainer>

            {user && (
              <AddButton onClick={onCreateTask}>
                <FiPlus />
                Добавить задачу
              </AddButton>
            )}
          </PanelHeader>

          <TasksList>
            {sortedTasks.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📋</EmptyIcon>
                <EmptyText>
                  {searchTerm || priorityFilter !== 'all' || statusFilter !== 'all'
                    ? 'Задачи не найдены по заданным фильтрам'
                    : 'Нет задач'
                  }
                </EmptyText>
              </EmptyState>
            ) : (
              sortedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTask?.id === task.id}
                  onClick={() => handleTaskClick(task)}
                  currentUser={user}
                />
              ))
            )}
            </TasksList>
            </ProjectsPanel>
          </>
        )}
      </ProjectsContent>
    </ProjectsContainer>
  );
};

export default Projects;
