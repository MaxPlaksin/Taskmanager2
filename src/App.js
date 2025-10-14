import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Settings from './components/Settings';
import TaskModal from './components/TaskModal';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import { TaskProvider } from './contexts/TaskContext';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const LoadingText = styled.div`
  font-size: 18px;
  color: #666;
`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Проверка авторизации при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        loadTasks();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData.map(task => ({
          ...task,
          startDate: task.startDate ? new Date(task.startDate) : null,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        })));
      } else {
        console.error('Ошибка загрузки задач');
      }
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    loadTasks();
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskUpdate = async (updatedTask) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedTask)
      });

      if (response.ok) {
        const taskData = await response.json();
        const taskWithDates = {
          ...taskData,
          startDate: taskData.startDate ? new Date(taskData.startDate) : null,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          createdAt: new Date(taskData.createdAt),
          updatedAt: new Date(taskData.updatedAt)
        };
        setTasks(tasks.map(task => 
          task.id === updatedTask.id ? taskWithDates : task
        ));
        if (selectedTask && selectedTask.id === updatedTask.id) {
          setSelectedTask(taskWithDates);
        }
      }
    } catch (error) {
      console.error('Ошибка обновления задачи:', error);
    }
  };

  const handleTaskCreate = async (newTask) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        const taskData = await response.json();
        const taskWithDates = {
          ...taskData,
          startDate: taskData.startDate ? new Date(taskData.startDate) : null,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          createdAt: new Date(taskData.createdAt),
          updatedAt: new Date(taskData.updatedAt)
        };
        setTasks([...tasks, taskWithDates]);
        setShowTaskForm(false);
      }
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(null);
          setShowTaskModal(false);
        }
      }
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
    }
  };

  const handleCreateTask = () => {
    // Проверяем права пользователя
    if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
      alert('У вас нет прав для создания задач');
      return;
    }
    setShowTaskForm(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            tasks={tasks}
            onTaskSelect={handleTaskSelect}
            selectedTask={selectedTask}
            onCreateTask={handleCreateTask}
            user={user}
          />
        );
      case 'projects':
        return (
          <Projects
            tasks={tasks}
            onTaskSelect={handleTaskSelect}
            selectedTask={selectedTask}
            onCreateTask={handleCreateTask}
            user={user}
          />
        );
      case 'settings':
        return (
          <Settings
            user={user}
            onUserUpdate={handleUserUpdate}
          />
        );
      default:
        return (
          <Dashboard
            tasks={tasks}
            onTaskSelect={handleTaskSelect}
            selectedTask={selectedTask}
            onCreateTask={handleCreateTask}
            user={user}
          />
        );
    }
  };

  // Показываем загрузку
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Загрузка...</LoadingText>
      </LoadingContainer>
    );
  }

  // Показываем форму входа если пользователь не авторизован
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <TaskProvider value={{ tasks, handleTaskUpdate, handleTaskCreate, handleTaskDelete }}>
      <AppContainer>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={handleLogout} />
        <MainContent>
          <ContentArea>
            {renderContent()}
          </ContentArea>
        </MainContent>
        
        {showTaskModal && (
          <TaskModal
            task={selectedTask}
            onClose={() => setShowTaskModal(false)}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            user={user}
          />
        )}
        
        {showTaskForm && (
          <TaskForm
            onSave={handleTaskCreate}
            onCancel={() => setShowTaskForm(false)}
            user={user}
          />
        )}
      </AppContainer>
    </TaskProvider>
  );
}

export default App;