import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import TaskPanel from './components/TaskPanel';
import CalendarPanel from './components/CalendarPanel';
import TaskDetails from './components/TaskDetails';
import { TaskProvider } from './contexts/TaskContext';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LeftPanel = styled.div`
  width: 350px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const CenterPanel = styled.div`
  flex: 1;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const RightPanel = styled.div`
  width: 400px;
  background: white;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  // Загрузка задач при инициализации
  useEffect(() => {
    // Здесь будет загрузка задач из API
    const mockTasks = [
      {
        id: 1,
        title: 'Разработка API для пользователей',
        description: 'Создать REST API для управления пользователями',
        status: 'active',
        priority: 'high',
        dueDate: new Date('2024-01-15'),
        gitRepository: 'https://github.com/user/api-project',
        serverAccess: 'ssh://user@server.com:22',
        password: 'encrypted_password_123',
        sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...',
        technicalSpec: 'Создать API endpoints для CRUD операций с пользователями. Использовать JWT для аутентификации. Поддержка пагинации и фильтрации.',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 2,
        title: 'Интеграция с внешним сервисом',
        description: 'Подключить внешний API для получения данных',
        status: 'active',
        priority: 'medium',
        dueDate: new Date('2024-01-20'),
        gitRepository: 'https://github.com/user/integration-service',
        serverAccess: 'ssh://user@integration-server.com:22',
        password: 'encrypted_password_456',
        sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQD...',
        technicalSpec: 'Интегрировать с внешним API. Обработать ошибки и таймауты. Добавить кэширование для оптимизации производительности.',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: 3,
        title: 'Рефакторинг старого кода',
        description: 'Улучшить архитектуру существующего кода',
        status: 'completed',
        priority: 'low',
        dueDate: new Date('2024-01-10'),
        gitRepository: 'https://github.com/user/legacy-refactor',
        serverAccess: 'ssh://user@legacy-server.com:22',
        password: 'encrypted_password_789',
        sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQE...',
        technicalSpec: 'Провести рефакторинг устаревшего кода. Улучшить читаемость и производительность. Добавить unit тесты.',
        createdAt: new Date('2023-12-20'),
        updatedAt: new Date('2024-01-10')
      }
    ];
    setTasks(mockTasks);
  }, []);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    if (selectedTask && selectedTask.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleTaskCreate = (newTask) => {
    const task = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks([...tasks, task]);
  };

  const handleTaskArchive = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'archived' } : task
    ));
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  const activeTasks = tasks.filter(task => task.status === 'active');
  const archivedTasks = tasks.filter(task => task.status === 'archived');

  return (
    <TaskProvider value={{ tasks, handleTaskUpdate, handleTaskCreate, handleTaskArchive }}>
      <AppContainer>
        <LeftPanel>
          <TaskPanel 
            tasks={showArchived ? archivedTasks : activeTasks}
            onTaskSelect={handleTaskSelect}
            selectedTask={selectedTask}
            showArchived={showArchived}
            onToggleArchived={() => setShowArchived(!showArchived)}
          />
        </LeftPanel>
        
        <CenterPanel>
          <CalendarPanel 
            tasks={activeTasks}
            onTaskSelect={handleTaskSelect}
            selectedTask={selectedTask}
          />
        </CenterPanel>
        
        <RightPanel>
          <TaskDetails 
            task={selectedTask}
            onTaskUpdate={handleTaskUpdate}
          />
        </RightPanel>
      </AppContainer>
    </TaskProvider>
  );
}

export default App;