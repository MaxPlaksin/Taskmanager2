import React, { useState } from 'react';

const NavigationSidebar = ({
  onProjectSelect,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onCreateUser,
  onViewUsers,
  selectedProjectId,
  projects,
  user,
  onLogout,
  onNavigateToHome
}) => {
  const [expandedSections, setExpandedSections] = useState({
    profile: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div style={{
      width: '280px',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      padding: '0',
      overflowY: 'auto',
      height: '100vh',
      borderRight: '1px solid #2d3748'
    }}>
      {/* Profile Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #2d3748' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            background: expandedSections.profile ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
          }}
          onClick={() => toggleSection('profile')}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>Мой профиль</div>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {expandedSections.profile ? '▼' : '▶'}
          </div>
        </div>
        
        {/* Expanded Profile Section */}
        {expandedSections.profile && (
          <div style={{ 
            padding: '16px 0 0 0',
            borderTop: '1px solid #2d3748',
            marginTop: '16px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                {user?.role === 'admin' ? '👑' : 
                 user?.role === 'director' ? '🎯' :
                 user?.role === 'manager' ? '👔' : 
                 user?.role === 'developer' ? '👨‍💻' : '👤'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>
                  {user?.fullName || user?.username || 'Пользователь'}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.7 }}>
                  {user?.role === 'admin' ? 'Администратор' :
                   user?.role === 'director' ? 'Директор' :
                   user?.role === 'manager' ? 'Менеджер' :
                   user?.role === 'developer' ? 'Разработчик' : 'Пользователь'}
                </div>
              </div>
            </div>
            
            {user?.role === 'admin' && (
              <>
                <button
                  onClick={onCreateUser}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '6px',
                    color: '#22c55e',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '8px'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(34, 197, 94, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(34, 197, 94, 0.1)';
                  }}
                >
                  + Создать пользователя
                </button>
                
                <button
                  onClick={onViewUsers}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    color: '#3b82f6',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  }}
                >
                  👥 Просмотр пользователей
                </button>
              </>
            )}
            
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#ef4444',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
            >
              Выйти из системы
            </button>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #2d3748' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Мои задачи</div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            fontSize: '12px', 
            fontWeight: '600',
            display: 'inline-block'
          }}>
            0
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #2d3748' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Проекты</div>
        <div style={{ fontSize: '12px', color: '#a0aec0', marginBottom: '8px' }}>
          Всего: {projects.length}
        </div>
        <button
          onClick={onNavigateToHome}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'rgba(74, 144, 226, 0.2)',
            color: '#4a90e2',
            border: '1px solid rgba(74, 144, 226, 0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            fontWeight: '500'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(74, 144, 226, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(74, 144, 226, 0.2)';
          }}
        >
          <span style={{ fontSize: '16px' }}>🏠</span>
          Главная
        </button>
        
        {(user && (user.role === 'admin' || user.role === 'manager' || user.role === 'director')) && (
          <button
            onClick={onAddProject}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px dashed rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px'
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span>
            Добавить проект
          </button>
        )}
        {projects.length > 0 ? (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {projects.map(project => (
              <div
                key={project.id}
                style={{
                  padding: '8px 12px',
                  background: selectedProjectId === project.id ? 'rgba(107, 70, 193, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  marginBottom: '4px',
                  fontSize: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => onProjectSelect(project.id)}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{project.name}</div>
                {project.description && (
                  <div style={{ color: '#a0aec0', fontSize: '11px', marginBottom: '4px' }}>
                    {project.description.length > 50 ? `${project.description.substring(0, 50)}...` : project.description}
                  </div>
                )}
                <div style={{ 
                  position: 'absolute', 
                  top: '4px', 
                  right: '4px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject(project);
                    }}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      color: '#3b82f6',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Удалить проект "${project.name}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#a0aec0', fontStyle: 'italic' }}>
            Проекты не созданы
          </div>
        )}
      </div>


    </div>
  );
};

export default NavigationSidebar;
