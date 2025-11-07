import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import Settings from './components/Settings';
import TaskModal from './components/TaskModal';
import TaskForm from './components/TaskForm';
import Login from './components/Login';
import NavigationSidebar from './components/NavigationSidebar';
import AddProjectModal from './components/AddProjectModal';
import EditProjectModal from './components/EditProjectModal';
import CreateUserModal from './components/CreateUserModal';
import UsersList from './components/UsersList';
import EditUserModal from './components/EditUserModal';
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

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


  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при создании пользователя');
      }

      const result = await response.json();
      
      // Показываем модальное окно с паролем
      const passwordModal = document.createElement('div');
      passwordModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      passwordModal.innerHTML = `
        <div style="
          background: white;
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
          <h3 style="margin: 0 0 16px 0; color: #333; font-size: 18px;">
            ✅ Пользователь создан успешно!
          </h3>
          <p style="margin: 0 0 16px 0; color: #666; line-height: 1.5;">
            <strong>Имя:</strong> ${result.user.full_name || result.user.fullName || 'Не указано'}<br>
            <strong>Email:</strong> ${result.user.email}<br>
            <strong>Роль:</strong> ${result.user.role}
          </p>
          <div style="
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          ">
            <p style="margin: 0 0 8px 0; color: #333; font-weight: 600;">
              🔑 Сгенерированный пароль:
            </p>
            <div style="
              background: white;
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 12px;
              font-family: monospace;
              font-size: 16px;
              font-weight: 600;
              color: #4a90e2;
              text-align: center;
              letter-spacing: 1px;
              user-select: all;
            " id="password-display">
              ${result.generated_password}
            </div>
            <p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">
              ⚠️ Обязательно сохраните этот пароль! Он больше не будет показан.
            </p>
          </div>
          <button onclick="this.closest('.password-modal').remove(); window.location.reload();" style="
            width: 100%;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          " onmouseover="this.style.background='#357abd'" onmouseout="this.style.background='#4a90e2'">
            Понятно, закрыть
          </button>
        </div>
      `;
      
      passwordModal.className = 'password-modal';
      document.body.appendChild(passwordModal);
      
      // Автоматически выделяем пароль для копирования
      setTimeout(() => {
        const passwordDisplay = document.getElementById('password-display');
        if (passwordDisplay) {
          // Создаем временный input для выделения текста
          const tempInput = document.createElement('input');
          tempInput.value = passwordDisplay.textContent;
          tempInput.style.position = 'absolute';
          tempInput.style.left = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.select();
          document.body.removeChild(tempInput);
        }
      }, 100);
    } catch (error) {
      throw error;
    }
  };

  const handleViewUsers = () => {
    // Переключаемся на вкладку "Пользователи" или показываем список пользователей
    setActiveTab('users');
    setShowCreateUserModal(false);
    loadUsers();
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/auth/users', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
        setFilteredUsers(usersData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.full_name}?`)) {
      try {
        const response = await fetch(`/api/auth/users/${user.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setUsers(prev => prev.filter(u => u.id !== user.id));
          setFilteredUsers(prev => prev.filter(u => u.id !== user.id));
          alert('Пользователь успешно удален!');
        } else {
          throw new Error('Ошибка при удалении пользователя');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Ошибка при удалении пользователя');
      }
    }
  };

  const handleResetPassword = async (user) => {
    if (window.confirm(`Вы уверены, что хотите сбросить пароль для пользователя ${user.full_name}?`)) {
      try {
        const response = await fetch(`/api/auth/reset-password/${user.id}`, {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при сбросе пароля');
        }

        const result = await response.json();
        
        // Показываем модальное окно с новым паролем
        const passwordModal = document.createElement('div');
        passwordModal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        passwordModal.innerHTML = `
          <div style="
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          ">
            <h3 style="margin: 0 0 16px 0; color: #333; font-size: 18px;">
              🔑 Пароль сброшен!
            </h3>
            <p style="margin: 0 0 16px 0; color: #666; line-height: 1.5;">
              <strong>Пользователь:</strong> ${result.user.full_name || result.user.fullName || 'Не указано'}<br>
              <strong>Email:</strong> ${result.user.email}
            </p>
            <div style="
              background: #f8f9fa;
              border: 1px solid #e9ecef;
              border-radius: 8px;
              padding: 16px;
              margin: 16px 0;
            ">
              <p style="margin: 0 0 8px 0; color: #333; font-weight: 600;">
                🔑 Новый пароль:
              </p>
              <div style="
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 12px;
                font-family: monospace;
                font-size: 16px;
                font-weight: 600;
                color: #4a90e2;
                text-align: center;
                letter-spacing: 1px;
                user-select: all;
              " id="new-password-display">
                ${result.new_password}
              </div>
              <p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">
                ⚠️ Обязательно сохраните этот пароль! Он больше не будет показан.
              </p>
            </div>
            <button onclick="this.closest('.password-modal').remove();" style="
              width: 100%;
              background: #4a90e2;
              color: white;
              border: none;
              border-radius: 6px;
              padding: 12px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            " onmouseover="this.style.background='#357abd'" onmouseout="this.style.background='#4a90e2'">
              Понятно, закрыть
            </button>
          </div>
        `;
        
        passwordModal.className = 'password-modal';
        document.body.appendChild(passwordModal);
        
        // Автоматически выделяем пароль для копирования
        setTimeout(() => {
          const passwordDisplay = document.getElementById('new-password-display');
          if (passwordDisplay) {
            // Создаем временный input для выделения текста
            const tempInput = document.createElement('input');
            tempInput.value = passwordDisplay.textContent;
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            document.body.appendChild(tempInput);
            tempInput.select();
            document.body.removeChild(tempInput);
          }
        }, 100);
        
      } catch (error) {
        alert(`Ошибка при сбросе пароля: ${error.message}`);
      }
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const response = await fetch(`/api/auth/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении пользователя');
      }

      const updatedUser = await response.json();
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      setFilteredUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
      alert('Пользователь успешно обновлен!');
    } catch (error) {
      throw error;
    }
  };

  const handleUserSearch = (searchTerm) => {
    const filtered = users.filter(user => 
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUserFilter = (role) => {
    if (role === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.role === role);
      setFilteredUsers(filtered);
    }
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
            onTaskUpdate={handleTaskUpdate}
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
            onNavigateToHome={() => setActiveTab('dashboard')}
            onTaskUpdate={handleTaskUpdate}
          />
        );
      case 'settings':
        return (
          <Settings
            user={user}
            onUserUpdate={handleUserUpdate}
          />
        );
      case 'users':
        return (
          <UsersList
            users={filteredUsers}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onCreateUser={() => setShowCreateUserModal(true)}
            onSearch={handleUserSearch}
            onFilter={handleUserFilter}
            onResetPassword={handleResetPassword}
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
        <NavigationSidebar
          onProjectSelect={setSelectedProjectId}
          onAddProject={handleAddProject}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onCreateUser={() => setShowCreateUserModal(true)}
          onViewUsers={handleViewUsers}
          selectedProjectId={selectedProjectId}
          projects={projects}
          user={user}
          onLogout={handleLogout}
          onNavigateToHome={() => setActiveTab('dashboard')}
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
        
        {showCreateUserModal && (
          <CreateUserModal
            isOpen={showCreateUserModal}
            onClose={() => setShowCreateUserModal(false)}
            onSave={handleCreateUser}
            onViewUsers={handleViewUsers}
          />
        )}

        {showEditUserModal && (
          <EditUserModal
            isOpen={showEditUserModal}
            onClose={() => {
              setShowEditUserModal(false);
              setEditingUser(null);
            }}
            user={editingUser}
            onSave={handleUpdateUser}
          />
        )}
      </AppContainer>
    </TaskProvider>
  );
}

export default App;