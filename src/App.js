import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Settings from './components/Settings';
import TaskModal from './components/TaskModal';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import Register from './components/Register';
import NavigationSidebar from './components/NavigationSidebar';
import AddProjectModal from './components/AddProjectModal';
import EditProjectModal from './components/EditProjectModal';
import Chat from './components/Chat';
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
  const [showRegister, setShowRegister] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

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
        loadProjects();
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

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/projects', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      } else {
        console.error('Ошибка загрузки проектов');
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    loadTasks();
    loadProjects();
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setProjects([]);
  };

  // Project management functions
  const handleAddProject = () => {
    setShowAddProjectModal(true);
  };

  const handleCreateProject = async (projectData) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        alert(`Проект "${newProject.name}" успешно создан!`);
      } else {
        throw new Error('Ошибка создания проекта');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(prev => prev.map(p => (p.id === projectId ? updatedProject : p)));
        alert(`Проект "${updatedProject.name}" успешно обновлен!`);
      } else {
        throw new Error('Ошибка обновления проекта');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setProjects(prev => prev.filter(p => p.id !== projectId));
          if (selectedProjectId === projectId) {
            setSelectedProjectId(null);
          }
          alert('Проект успешно удален!');
        } else {
          throw new Error('Ошибка удаления проекта');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Ошибка при удалении проекта. Попробуйте еще раз.');
      }
    }
  };

  const handleChatSelect = (chatId) => {
    // Находим информацию о чате
    const allUsers = [
      { id: 'manager1', name: 'Иванов Иван', avatar: '👔' },
      { id: 'developer1', name: 'Петров Петр', avatar: '👨‍💻' },
      { id: 'developer2', name: 'Сидоров Сидор', avatar: '👨‍💻' },
      { id: 'director1', name: 'Козлов Козел', avatar: '🎯' }
    ];
    
    const chatInfo = allUsers.find(user => user.id === chatId);
    setSelectedChatId(chatInfo);
    setActiveTab('chat');
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

  const handleCreateTask = (selectedDate = null) => {
    // Проверяем права пользователя - все роли могут создавать задачи
    if (!user) {
      alert('Необходимо войти в систему');
      return;
    }
    setShowTaskForm(true);
    setSelectedDate(selectedDate);
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
      case 'chat':
        return (
          <Chat
            selectedChat={selectedChatId}
            currentUser={user}
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

  // Показываем форму входа или регистрации если пользователь не авторизован
  if (!user) {
    if (showRegister) {
      return <Register onBackToLogin={() => setShowRegister(false)} onLogin={handleLogin} />;
    }
    return <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />;
  }

  return (
    <TaskProvider value={{ tasks, handleTaskUpdate, handleTaskCreate, handleTaskDelete }}>
      <AppContainer>
        <NavigationSidebar
          onProjectSelect={setSelectedProjectId}
          onAddProject={handleAddProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onChatSelect={handleChatSelect}
          selectedProjectId={selectedProjectId}
          selectedChatId={selectedChatId}
          projects={projects}
          user={user}
          onLogout={handleLogout}
        />
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
            selectedDate={selectedDate}
          />
        )}

        {/* Project Modals */}
        <AddProjectModal
          isOpen={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
          onSave={handleCreateProject}
        />

        <EditProjectModal
          isOpen={showEditProjectModal}
          onClose={() => {
            setShowEditProjectModal(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onSave={handleUpdateProject}
        />
      </AppContainer>
    </TaskProvider>
  );
}

export default App;