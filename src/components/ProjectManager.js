import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ProjectManagerContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
`;

const ProjectTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 24px;
`;

const AddButton = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;

  &:hover {
    background: #45a049;
  }
`;

const ProjectList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const ProjectName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 18px;
`;

const ProjectDescription = styled.p`
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
`;

const ProjectMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 12px;
  color: #888;
`;

const ProjectStatus = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  
  ${props => {
    switch(props.status) {
      case 'active':
        return 'background: #e8f5e8; color: #2e7d32;';
      case 'completed':
        return 'background: #e3f2fd; color: #1976d2;';
      case 'archived':
        return 'background: #f3e5f5; color: #7b1fa2;';
      default:
        return 'background: #f5f5f5; color: #666;';
    }
  }}
`;

const ProjectActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &.edit {
    color: #2196F3;
    border-color: #2196F3;
    
    &:hover {
      background: #e3f2fd;
    }
  }

  &.delete {
    color: #f44336;
    border-color: #f44336;
    
    &:hover {
      background: #ffebee;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.3s;

  &.primary {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
    }
  }

  &.secondary {
    background: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    
    &:hover {
      background: #e0e0e0;
    }
  }

  &.danger {
    background: #f44336;
    color: white;
    
    &:hover {
      background: #d32f2f;
    }
  }
`;

const ProjectManager = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    loadProjects();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      status: project.status
    });
    setShowModal(true);
  };

  const handleSaveProject = async () => {
    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const projectData = await response.json();
        
        if (editingProject) {
          setProjects(projects.map(p => 
            p.id === editingProject.id ? projectData : p
          ));
        } else {
          setProjects([projectData, ...projects]);
        }
        
        setShowModal(false);
        setEditingProject(null);
      } else {
        console.error('Ошибка сохранения проекта');
      }
    } catch (error) {
      console.error('Ошибка сохранения проекта:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот проект? Все связанные задачи также будут удалены.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== projectId));
      } else {
        console.error('Ошибка удаления проекта');
      }
    } catch (error) {
      console.error('Ошибка удаления проекта:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Загрузка проектов...</div>;
  }

  return (
    <ProjectManagerContainer>
      <ProjectHeader>
        <ProjectTitle>Управление проектами</ProjectTitle>
        <AddButton onClick={handleAddProject}>
          + Добавить проект
        </AddButton>
      </ProjectHeader>

      <ProjectList>
        {projects.map(project => (
          <ProjectCard key={project.id}>
            <ProjectName>{project.name}</ProjectName>
            <ProjectDescription>
              {project.description || 'Описание не указано'}
            </ProjectDescription>
            <ProjectMeta>
              <span>Создан: {new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
              <ProjectStatus status={project.status}>
                {project.status === 'active' ? 'Активный' : 
                 project.status === 'completed' ? 'Завершен' : 'Архивный'}
              </ProjectStatus>
            </ProjectMeta>
            <ProjectActions>
              <ActionButton 
                className="edit"
                onClick={() => handleEditProject(project)}
              >
                ✏️ Редактировать
              </ActionButton>
              <ActionButton 
                className="delete"
                onClick={() => handleDeleteProject(project.id)}
              >
                🗑️ Удалить
              </ActionButton>
            </ProjectActions>
          </ProjectCard>
        ))}
      </ProjectList>

      {projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>Проекты не найдены. Создайте первый проект!</p>
        </div>
      )}

      {showModal && (
        <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingProject ? 'Редактировать проект' : 'Создать проект'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label htmlFor="name">Название проекта *</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введите название проекта"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Описание</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Введите описание проекта"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="status">Статус</Label>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Активный</option>
                <option value="completed">Завершен</option>
                <option value="archived">Архивный</option>
              </Select>
            </FormGroup>

            <ModalActions>
              <Button 
                className="secondary"
                onClick={() => setShowModal(false)}
              >
                Отмена
              </Button>
              <Button 
                className="primary"
                onClick={handleSaveProject}
                disabled={!formData.name.trim()}
              >
                {editingProject ? 'Сохранить' : 'Создать'}
              </Button>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </ProjectManagerContainer>
  );
};

export default ProjectManager;
