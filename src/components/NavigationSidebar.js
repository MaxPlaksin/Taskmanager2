import React, { useState } from 'react';

const NavigationSidebar = ({
  onProjectSelect,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onChatSelect,
  selectedProjectId,
  selectedChatId,
  projects,
  user
}) => {
  const [expandedSections, setExpandedSections] = useState({
    profile: false,
    personalChats: true,
    groupChats: false
  });

  const personalChats = [
    { id: 'ivan', name: 'Иван Петров', unread: 7, avatar: '👨‍💻' },
    { id: 'vasily', name: 'Василий Егоров', unread: 2, avatar: '👨‍🎨' }
  ];

  const groupChats = [
    { id: 'designers', name: 'Чат дизайнеров', unread: 330, avatar: '🎨' },
    { id: 'general', name: 'Общий чат', unread: 4, avatar: '💬' }
  ];

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
            <div style={{ fontSize: '12px', opacity: 0.7 }}>Компания YouGile</div>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {expandedSections.profile ? '▼' : '▶'}
          </div>
        </div>
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
        {(user && (user.role === 'admin' || user.role === 'manager')) && (
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

      {/* Personal Chats Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #2d3748' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
          onClick={() => toggleSection('personalChats')}
        >
          <div style={{ fontSize: '14px', fontWeight: '600' }}>Личные чаты</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {expandedSections.personalChats ? '▼' : '▶'}
          </div>
        </div>
        
        {expandedSections.personalChats && (
          <div>
            {personalChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedChatId === chat.id ? 'rgba(107, 70, 193, 0.3)' : 'transparent',
                  marginBottom: '4px'
                }}
              >
                <div style={{ fontSize: '16px' }}>{chat.avatar}</div>
                <div style={{ flex: 1, fontSize: '14px' }}>{chat.name}</div>
                {chat.unread > 0 && (
                  <div style={{
                    background: '#e53e3e',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Group Chats Section */}
      <div style={{ padding: '20px', borderBottom: '1px solid #2d3748' }}>
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
          onClick={() => toggleSection('groupChats')}
        >
          <div style={{ fontSize: '14px', fontWeight: '600' }}>Групповые чаты</div>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>
            {expandedSections.groupChats ? '▼' : '▶'}
          </div>
        </div>
        
        {expandedSections.groupChats && (
          <div>
            {groupChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: selectedChatId === chat.id ? 'rgba(107, 70, 193, 0.3)' : 'transparent',
                  marginBottom: '4px'
                }}
              >
                <div style={{ fontSize: '16px' }}>{chat.avatar}</div>
                <div style={{ flex: 1, fontSize: '14px' }}>{chat.name}</div>
                {chat.unread > 0 && (
                  <div style={{
                    background: '#e53e3e',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
            <button
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '8px'
              }}
            >
              + Создать групповой чат
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div style={{ padding: '20px' }}>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px', cursor: 'pointer' }}>
          Лента событий
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px', cursor: 'pointer' }}>
          Отчеты
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '8px', cursor: 'pointer' }}>
          Лицензия и оплаты
        </div>
        <div style={{ fontSize: '14px', opacity: 0.7, cursor: 'pointer' }}>
          Поддержка, Новости
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
