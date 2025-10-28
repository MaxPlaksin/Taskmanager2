import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiEdit3, 
  FiArchive, 
  FiTrash2, 
  FiGitBranch, 
  FiServer, 
  FiKey, 
  FiFileText, 
  FiCalendar, 
  FiFlag, 
  FiClock,
  FiUser,
  FiCopy,
  FiEye,
  FiEyeOff,
  FiPaperclip,
  FiCamera,
  FiDownload,
  FiX,
  FiSave
} from 'react-icons/fi';
import TaskForm from './TaskForm';

const PanelHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  ${props => props.variant === 'danger' && `
    border-color: #e74c3c;
    color: #e74c3c;
    
    &:hover {
      background: #fdf2f2;
    }
  `}

  ${props => props.variant === 'warning' && `
    border-color: #f39c12;
    color: #f39c12;
    
    &:hover {
      background: #fef9e7;
    }
  `}
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: 16px;
  line-height: 1.5;
`;

const TaskInfo = styled.div`
  margin-bottom: 24px;
`;

const TaskTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.3;
`;

const TaskDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const MetaIcon = styled.div`
  font-size: 16px;
  color: #4a90e2;
`;

const MetaContent = styled.div`
  flex: 1;
`;

const MetaLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const MetaValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionContent = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
`;

const CodeBlock = styled.pre`
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  overflow-x: auto;
  margin: 0;
`;

const TextContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const CodeContainer = styled.div`
  position: relative;
  
  &:hover ${CopyButton} {
    opacity: 1;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PasswordInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 20px auto;
  
  &:hover {
    background: #357abd;
  }
`;

const FileSection = styled.div`
  margin-bottom: 24px;
`;

const FileUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #fafafa;
  margin-bottom: 16px;
  transition: all 0.2s;
  
  &:hover {
    border-color: #4a90e2;
    background: #f0f7ff;
  }
`;

const FileUploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin: 0 auto;
  
  &:hover {
    background: #357abd;
  }
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const FileIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #f0f0f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
`;

const FileSize = styled.div`
  font-size: 12px;
  color: #666;
`;

const FileActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FileActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &.danger:hover {
    background: #fee;
    border-color: #e74c3c;
    color: #e74c3c;
  }
`;

const ScreenshotPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const ScreenshotItem = styled.div`
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

const ScreenshotImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
`;

const ScreenshotActions = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  gap: 4px;
`;

const ScreenshotButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const TaskDetails = ({ task, onTaskUpdate }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState(task?.files || []);
  const [screenshots, setScreenshots] = useState(task?.screenshots || []);
  const [isUploading, setIsUploading] = useState(false);

  if (!task) {
    return (
      <>
        <PanelHeader>
          <Title>Детали задачи</Title>
        </PanelHeader>
        <Content>
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyText>
              Выберите задачу для просмотра деталей
            </EmptyText>
          </EmptyState>
        </Content>
      </>
    );
  }

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleArchive = () => {
    if (window.confirm('Архивировать эту задачу?')) {
      onTaskUpdate({ ...task, status: 'archived' });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Удалить эту задачу? Это действие нельзя отменить.')) {
      // Здесь будет логика удаления через контекст
      console.log('Delete task:', task.id);
    }
  };

  const handleSave = (updatedTask) => {
    onTaskUpdate(updatedTask);
    setShowEditForm(false);
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setIsUploading(true);
    
    for (const file of uploadedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch(`/api/tasks/${task.id}/files`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        
        if (response.ok) {
          const uploadedFile = await response.json();
          setFiles(prev => [...prev, uploadedFile]);
        } else {
          console.error('Ошибка загрузки файла:', file.name);
          alert(`Ошибка загрузки файла: ${file.name}`);
        }
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        alert(`Ошибка загрузки файла: ${file.name}`);
      }
    }
    
    setIsUploading(false);
    event.target.value = ''; // Очищаем input
  };

  const handleScreenshotUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setIsUploading(true);
    
    for (const file of uploadedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_type', 'screenshot');
      
      try {
        const response = await fetch(`/api/tasks/${task.id}/files`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        });
        
        if (response.ok) {
          const uploadedFile = await response.json();
          setScreenshots(prev => [...prev, uploadedFile]);
        } else {
          console.error('Ошибка загрузки скриншота:', file.name);
          alert(`Ошибка загрузки скриншота: ${file.name}`);
        }
      } catch (error) {
        console.error('Ошибка загрузки скриншота:', error);
        alert(`Ошибка загрузки скриншота: ${file.name}`);
      }
    }
    
    setIsUploading(false);
    event.target.value = ''; // Очищаем input
  };

  const handleFileDelete = async (fileId) => {
    if (window.confirm('Удалить этот файл?')) {
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setFiles(prev => prev.filter(file => file.id !== fileId));
        } else {
          console.error('Ошибка удаления файла');
          alert('Ошибка удаления файла');
        }
      } catch (error) {
        console.error('Ошибка удаления файла:', error);
        alert('Ошибка удаления файла');
      }
    }
  };

  const handleScreenshotDelete = async (fileId) => {
    if (window.confirm('Удалить этот скриншот?')) {
      try {
        const response = await fetch(`/api/files/${fileId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setScreenshots(prev => prev.filter(file => file.id !== fileId));
        } else {
          console.error('Ошибка удаления скриншота');
          alert('Ошибка удаления скриншота');
        }
      } catch (error) {
        console.error('Ошибка удаления скриншота:', error);
        alert('Ошибка удаления скриншота');
      }
    }
  };

  const handleFileDownload = async (fileId, filename) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Ошибка скачивания файла');
        alert('Ошибка скачивания файла');
      }
    } catch (error) {
      console.error('Ошибка скачивания файла:', error);
      alert('Ошибка скачивания файла');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Можно добавить уведомление о копировании
  };

  const formatDate = (date) => {
    if (!date) return 'Не указан';
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return 'Не указан';
    return new Date(date).toLocaleString('ru-RU');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#bdc3c7';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
      default: return 'Не указан';
    }
  };

  if (showEditForm) {
    return (
      <TaskForm
        task={task}
        onSave={handleSave}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <>
      <PanelHeader>
        <Title>Детали задачи</Title>
        <ActionButtons>
          <ActionButton onClick={handleEdit}>
            <FiEdit3 />
            Редактировать
          </ActionButton>
          <ActionButton variant="warning" onClick={handleArchive}>
            <FiArchive />
            Архивировать
          </ActionButton>
          <ActionButton variant="danger" onClick={handleDelete}>
            <FiTrash2 />
            Удалить
          </ActionButton>
        </ActionButtons>
      </PanelHeader>

      <Content>
        <TaskInfo>
          <TaskTitle>{task.title}</TaskTitle>
          <TaskDescription>{task.description}</TaskDescription>
          
          <MetaGrid>
            <MetaItem>
              <MetaIcon>
                <FiFlag />
              </MetaIcon>
              <MetaContent>
                <MetaLabel>Приоритет</MetaLabel>
                <MetaValue style={{ color: getPriorityColor(task.priority) }}>
                  {getPriorityText(task.priority)}
                </MetaValue>
              </MetaContent>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <FiCalendar />
              </MetaIcon>
              <MetaContent>
                <MetaLabel>Срок выполнения</MetaLabel>
                <MetaValue>{formatDate(task.dueDate)}</MetaValue>
              </MetaContent>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <FiClock />
              </MetaIcon>
              <MetaContent>
                <MetaLabel>Создано</MetaLabel>
                <MetaValue>{formatDateTime(task.createdAt)}</MetaValue>
              </MetaContent>
            </MetaItem>

            <MetaItem>
              <MetaIcon>
                <FiUser />
              </MetaIcon>
              <MetaContent>
                <MetaLabel>Обновлено</MetaLabel>
                <MetaValue>{formatDateTime(task.updatedAt)}</MetaValue>
              </MetaContent>
            </MetaItem>
          </MetaGrid>
        </TaskInfo>

        {task.gitRepository && (
          <Section>
            <SectionTitle>
              <FiGitBranch />
              Git репозиторий
            </SectionTitle>
            <SectionContent>
              <CodeContainer>
                <CodeBlock>{task.gitRepository}</CodeBlock>
                <CopyButton onClick={() => copyToClipboard(task.gitRepository)}>
                  <FiCopy />
                </CopyButton>
              </CodeContainer>
            </SectionContent>
          </Section>
        )}

        {task.serverAccess && (
          <Section>
            <SectionTitle>
              <FiServer />
              Доступ к серверу
            </SectionTitle>
            <SectionContent>
              <CodeContainer>
                <CodeBlock>{task.serverAccess}</CodeBlock>
                <CopyButton onClick={() => copyToClipboard(task.serverAccess)}>
                  <FiCopy />
                </CopyButton>
              </CodeContainer>
            </SectionContent>
          </Section>
        )}

        {task.password && (
          <Section>
            <SectionTitle>
              <FiKey />
              Пароль
            </SectionTitle>
            <SectionContent>
              <PasswordContainer>
                <PasswordInput
                  type={showPassword ? 'text' : 'password'}
                  value={task.password}
                  readOnly
                />
                <ToggleButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </ToggleButton>
                <ActionButton onClick={() => copyToClipboard(task.password)}>
                  <FiCopy />
                </ActionButton>
              </PasswordContainer>
            </SectionContent>
          </Section>
        )}

        {task.sshKey && (
          <Section>
            <SectionTitle>
              <FiKey />
              SSH ключ
            </SectionTitle>
            <SectionContent>
              <CodeContainer>
                <CodeBlock>{task.sshKey}</CodeBlock>
                <CopyButton onClick={() => copyToClipboard(task.sshKey)}>
                  <FiCopy />
                </CopyButton>
              </CodeContainer>
            </SectionContent>
          </Section>
        )}

        {task.technicalSpec && (
          <Section>
            <SectionTitle>
              <FiFileText />
              Техническое задание
            </SectionTitle>
            <SectionContent>
              <TextContent>{task.technicalSpec}</TextContent>
            </SectionContent>
          </Section>
        )}

        {/* Секция прикрепленных файлов */}
        <FileSection>
          <SectionTitle>
            <FiPaperclip />
            Прикрепленные файлы
          </SectionTitle>
          <SectionContent>
            <FileUploadArea>
              <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                Перетащите файлы сюда или нажмите для выбора
              </p>
              <FileUploadButton as="label" htmlFor="file-upload">
                <FiPaperclip />
                {isUploading ? 'Загрузка...' : 'Выбрать файлы'}
              </FileUploadButton>
              <input
                id="file-upload"
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </FileUploadArea>
            
            {files.length > 0 && (
              <FileList>
                {files.map((file) => (
                  <FileItem key={file.id}>
                    <FileInfo>
                      <FileIcon>📄</FileIcon>
                      <FileDetails>
                        <FileName>{file.originalFilename}</FileName>
                        <FileSize>{formatFileSize(file.fileSize)}</FileSize>
                      </FileDetails>
                    </FileInfo>
                    <FileActions>
                      <FileActionButton
                        onClick={() => handleFileDownload(file.id, file.originalFilename)}
                        title="Скачать"
                      >
                        <FiDownload />
                      </FileActionButton>
                      <FileActionButton
                        className="danger"
                        onClick={() => handleFileDelete(file.id)}
                        title="Удалить"
                      >
                        <FiX />
                      </FileActionButton>
                    </FileActions>
                  </FileItem>
                ))}
              </FileList>
            )}
          </SectionContent>
        </FileSection>

        {/* Секция демонстрации проекта */}
        <FileSection>
          <SectionTitle>
            <FiCamera />
            Демонстрация проекта
          </SectionTitle>
          <SectionContent>
            <FileUploadArea>
              <p style={{ margin: '0 0 12px 0', color: '#666' }}>
                Покажите, как выглядит ваш проект! Добавьте скриншоты готового результата
              </p>
              <FileUploadButton as="label" htmlFor="screenshot-upload">
                <FiCamera />
                {isUploading ? 'Загрузка...' : 'Добавить демонстрацию'}
              </FileUploadButton>
              <input
                id="screenshot-upload"
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleScreenshotUpload}
                disabled={isUploading}
              />
            </FileUploadArea>
            
            {screenshots.length > 0 && (
              <ScreenshotPreview>
                {screenshots.map((screenshot) => (
                  <ScreenshotItem key={screenshot.id}>
                    <ScreenshotImage
                      src={`/api/files/${screenshot.id}/download`}
                      alt={screenshot.originalFilename}
                    />
                    <ScreenshotActions>
                      <ScreenshotButton
                        onClick={() => handleFileDownload(screenshot.id, screenshot.originalFilename)}
                        title="Скачать"
                      >
                        <FiDownload />
                      </ScreenshotButton>
                      <ScreenshotButton
                        onClick={() => handleScreenshotDelete(screenshot.id)}
                        title="Удалить"
                        style={{ background: 'rgba(231, 76, 60, 0.8)' }}
                      >
                        <FiX />
                      </ScreenshotButton>
                    </ScreenshotActions>
                  </ScreenshotItem>
                ))}
              </ScreenshotPreview>
            )}
          </SectionContent>
        </FileSection>

        {/* Кнопка сохранения */}
        <SaveButton onClick={() => onTaskUpdate(task)}>
          <FiSave />
          Сохранить изменения
        </SaveButton>
      </Content>
    </>
  );
};

export default TaskDetails;
