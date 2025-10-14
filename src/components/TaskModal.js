import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FiX, 
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
  FiUpload,
  FiDownload,
  FiFile,
  FiPaperclip,
  FiActivity,
  FiTrendingUp,
  FiCamera,
  FiImage
} from 'react-icons/fi';
import TaskForm from './TaskForm';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
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

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;

  &:hover {
    color: #333;
  }
`;

const FileUploadSection = styled.div`
  margin-top: 16px;
`;

const FileUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #fafafa;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #4a90e2;
    background: #f0f7ff;
  }

  &.dragover {
    border-color: #4a90e2;
    background: #e3f2fd;
  }
`;

const FileUploadText = styled.div`
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
`;

const FileUploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #357abd;
  }
`;

const FileList = styled.div`
  margin-top: 16px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 8px;
`;

const FileIcon = styled.div`
  font-size: 20px;
  color: #4a90e2;
`;

const FileInfo = styled.div`
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

const TaskModal = ({ task, onClose, onTaskUpdate, onTaskDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState(task?.files || []);
  const [isDragOver, setIsDragOver] = useState(false);
  const [screenshots, setScreenshots] = useState(task?.screenshots || []);
  const [isScreenshotDragOver, setIsScreenshotDragOver] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [showScreenshotForm, setShowScreenshotForm] = useState(false);
  const [screenshotForm, setScreenshotForm] = useState({
    title: '',
    description: '',
    file: null
  });

  if (!task) {
    return null;
  }

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleArchive = async () => {
    if (window.confirm('Архивировать эту задачу?')) {
      onTaskUpdate({ ...task, status: 'archived' });
      onClose();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить эту задачу? Это действие нельзя отменить.')) {
      onTaskDelete(task.id);
      onClose();
    }
  };

  const handleSave = async (updatedTask) => {
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
        const savedTask = await response.json();
        onTaskUpdate({
          ...savedTask,
          startDate: savedTask.startDate ? new Date(savedTask.startDate) : null,
          dueDate: savedTask.dueDate ? new Date(savedTask.dueDate) : null,
          createdAt: new Date(savedTask.createdAt),
          updatedAt: new Date(savedTask.updatedAt)
        });
        setShowEditForm(false);
      } else {
        console.error('Ошибка сохранения задачи');
        alert('Ошибка сохранения задачи');
      }
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error);
      alert('Ошибка сохранения задачи');
    }
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

  const getProgressColor = (progress) => {
    switch (progress) {
      case 'not_started': return '#6c757d';
      case 'in_progress': return '#007bff';
      case 'testing': return '#ffc107';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getProgressText = (progress) => {
    switch (progress) {
      case 'not_started': return 'Не начато';
      case 'in_progress': return 'В работе';
      case 'testing': return 'Тестирование';
      case 'completed': return 'Завершено';
      default: return 'Не указано';
    }
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

  // Функции для скриншотов
  const handleScreenshotUpload = async (files) => {
    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert('Пожалуйста, выберите только изображения');
      return;
    }

    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskId', task.id);
      formData.append('type', 'screenshot');

      try {
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        if (response.ok) {
          const newScreenshot = await response.json();
          setScreenshots(prev => [...prev, newScreenshot]);
        } else {
          console.error('Ошибка при загрузке скриншота');
        }
      } catch (error) {
        console.error('Ошибка при загрузке скриншота:', error);
      }
    }
  };

  const handleScreenshotDragOver = (e) => {
    e.preventDefault();
    setIsScreenshotDragOver(true);
  };

  const handleScreenshotDragLeave = (e) => {
    e.preventDefault();
    setIsScreenshotDragOver(false);
  };

  const handleScreenshotDrop = (e) => {
    e.preventDefault();
    setIsScreenshotDragOver(false);
    const files = e.dataTransfer.files;
    handleScreenshotUpload(files);
  };

  const handleScreenshotDelete = async (screenshotId) => {
    if (window.confirm('Удалить этот скриншот?')) {
      try {
        const response = await fetch(`/api/files/${screenshotId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (response.ok) {
          setScreenshots(prev => prev.filter(screenshot => screenshot.id !== screenshotId));
        } else {
          console.error('Ошибка при удалении скриншота');
        }
      } catch (error) {
        console.error('Ошибка при удалении скриншота:', error);
      }
    }
  };

  // Новые функции для улучшенного интерфейса
  const handleScreenshotClick = (screenshot) => {
    setSelectedScreenshot(screenshot);
    setShowScreenshotModal(true);
  };

  const handleCloseScreenshotModal = () => {
    setShowScreenshotModal(false);
    setSelectedScreenshot(null);
  };

  const handleShowScreenshotForm = () => {
    setShowScreenshotForm(true);
    setScreenshotForm({ title: '', description: '', file: null });
  };

  const handleCloseScreenshotForm = () => {
    setShowScreenshotForm(false);
    setScreenshotForm({ title: '', description: '', file: null });
  };

  const handleScreenshotFormChange = (field, value) => {
    setScreenshotForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScreenshotFormSubmit = async () => {
    if (!screenshotForm.file) {
      alert('Пожалуйста, выберите файл');
      return;
    }

    console.log('Начинаем загрузку скриншота...');
    console.log('Файл:', screenshotForm.file);
    console.log('Task ID:', task.id);
    console.log('Title:', screenshotForm.title);
    console.log('Description:', screenshotForm.description);

    const formData = new FormData();
    formData.append('file', screenshotForm.file);
    formData.append('taskId', task.id);
    formData.append('type', 'screenshot');
    formData.append('description', `${screenshotForm.title}|${screenshotForm.description}`);

    console.log('FormData создан, отправляем запрос...');

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      console.log('Ответ получен:', response.status, response.statusText);

      if (response.ok) {
        const newScreenshot = await response.json();
        console.log('Скриншот загружен успешно:', newScreenshot);
        setScreenshots(prev => [...prev, newScreenshot]);
        handleCloseScreenshotForm();
      } else {
        const errorText = await response.text();
        console.error('Ошибка при загрузке скриншота:', response.status, errorText);
        alert(`Ошибка при загрузке скриншота: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Ошибка при загрузке скриншота:', error);
      alert(`Ошибка при загрузке скриншота: ${error.message}`);
    }
  };

  const handleScreenshotFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshotForm(prev => ({
        ...prev,
        file: file
      }));
    } else {
      alert('Пожалуйста, выберите изображение');
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
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Ошибка скачивания файла');
        alert('Ошибка скачивания файла');
      }
    } catch (error) {
      console.error('Ошибка скачивания файла:', error);
      alert('Ошибка скачивания файла');
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    
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
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const downloadFile = (file) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Детали задачи</ModalTitle>
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
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </ActionButtons>
        </ModalHeader>

        <ModalBody>
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
                  <FiTrendingUp />
                </MetaIcon>
                <MetaContent>
                  <MetaLabel>Степень готовности</MetaLabel>
                  <MetaValue style={{ color: getProgressColor(task.progress) }}>
                    {getProgressText(task.progress)}
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
                  <MetaLabel>Оценка времени</MetaLabel>
                  <MetaValue>{task.estimatedHours ? `${task.estimatedHours} ч` : 'Не указано'}</MetaValue>
                </MetaContent>
              </MetaItem>

              <MetaItem>
                <MetaIcon>
                  <FiActivity />
                </MetaIcon>
                <MetaContent>
                  <MetaLabel>Фактическое время</MetaLabel>
                  <MetaValue>{task.actualHours ? `${task.actualHours} ч` : '0 ч'}</MetaValue>
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

          {(task.serverIp || task.serverPassword) && (
            <Section>
              <SectionTitle>
                <FiServer />
                Данные сервера
              </SectionTitle>
              <SectionContent>
                {task.serverIp && (
                  <CodeContainer>
                    <CodeBlock>IP: {task.serverIp}</CodeBlock>
                    <CopyButton onClick={() => copyToClipboard(task.serverIp)}>
                      <FiCopy />
                    </CopyButton>
                  </CodeContainer>
                )}
                {task.serverPassword && (
                  <CodeContainer style={{ marginTop: '10px' }}>
                    <CodeBlock>Пароль SSH: {showPassword ? task.serverPassword : '••••••••'}</CodeBlock>
                    <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                    <CopyButton onClick={() => copyToClipboard(task.serverPassword)}>
                      <FiCopy />
                    </CopyButton>
                  </CodeContainer>
                )}
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

          <Section>
            <SectionTitle>
              <FiPaperclip />
              Прикрепленные файлы
            </SectionTitle>
            <SectionContent>
              <FileUploadArea
                className={isDragOver ? 'dragover' : ''}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <FileUploadText>
                  Перетащите файлы сюда или нажмите для выбора
                </FileUploadText>
                <FileUploadButton>
                  <FiUpload />
                  Выбрать файлы
                </FileUploadButton>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </FileUploadArea>

              {files.length > 0 && (
                <FileList>
                  {files.map((file) => (
                    <FileItem key={file.id}>
                      <FileIcon>
                        <FiFile />
                      </FileIcon>
                      <FileInfo>
                        <FileName>{file.originalFilename}</FileName>
                        <FileSize>{(file.fileSize / 1024).toFixed(1)} KB</FileSize>
                      </FileInfo>
                      <FileActions>
                        <FileActionButton onClick={() => handleFileDownload(file.id, file.originalFilename)}>
                          <FiDownload />
                        </FileActionButton>
                        <FileActionButton onClick={() => handleFileDelete(file.id)}>
                          <FiTrash2 />
                        </FileActionButton>
                      </FileActions>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </SectionContent>
          </Section>

          <ScreenshotSection>
            <Section>
              <SectionTitle>
                <FiCamera />
                Демонстрация проекта
              </SectionTitle>
              <SectionContent>
                {!showScreenshotForm ? (
                  <ScreenshotUploadArea
                    className={isScreenshotDragOver ? 'dragover' : ''}
                    onDragOver={handleScreenshotDragOver}
                    onDragLeave={handleScreenshotDragLeave}
                    onDrop={handleScreenshotDrop}
                    onClick={handleShowScreenshotForm}
                  >
                    <ScreenshotUploadText>
                      Покажите, как выглядит ваш проект! Добавьте скриншоты готового результата
                    </ScreenshotUploadText>
                    <ScreenshotUploadButton>
                      <FiCamera />
                      Добавить демонстрацию
                    </ScreenshotUploadButton>
                  </ScreenshotUploadArea>
                ) : (
                  <ScreenshotForm>
                    <ScreenshotFormTitle>
                      <FiCamera />
                      Добавить демонстрацию проекта
                    </ScreenshotFormTitle>
                    
                    <ScreenshotFormInput
                      type="text"
                      placeholder="Название (например: Главная страница, Форма входа, Дашборд)"
                      value={screenshotForm.title}
                      onChange={(e) => handleScreenshotFormChange('title', e.target.value)}
                    />
                    
                    <ScreenshotFormTextarea
                      placeholder="Описание того, что показано на скриншоте..."
                      value={screenshotForm.description}
                      onChange={(e) => handleScreenshotFormChange('description', e.target.value)}
                    />
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotFileSelect}
                      style={{ marginBottom: '12px' }}
                    />
                    
                    {screenshotForm.file && (
                      <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>
                        Выбран файл: {screenshotForm.file.name}
                      </div>
                    )}
                    
                    <ScreenshotFormButtons>
                      <ScreenshotFormButton 
                        className="secondary"
                        onClick={handleCloseScreenshotForm}
                      >
                        Отмена
                      </ScreenshotFormButton>
                      <ScreenshotFormButton 
                        className="primary"
                        onClick={handleScreenshotFormSubmit}
                      >
                        Загрузить
                      </ScreenshotFormButton>
                    </ScreenshotFormButtons>
                  </ScreenshotForm>
                )}
                
                {screenshots.length > 0 && (
                  <ScreenshotGrid>
                    {screenshots.map((screenshot) => {
                      const [title, description] = screenshot.description ? screenshot.description.split('|') : ['', ''];
                      return (
                        <ScreenshotItem 
                          key={screenshot.id} 
                          className="has-image"
                          onClick={() => handleScreenshotClick(screenshot)}
                        >
                          <ScreenshotImage 
                            src={`/api/files/${screenshot.id}/download`}
                            alt={title || 'Скриншот'}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <ScreenshotPlaceholder style={{ display: 'none' }}>
                            <FiImage />
                            <span>Ошибка загрузки</span>
                          </ScreenshotPlaceholder>
                          
                          {(title || description) && (
                            <ScreenshotDescription>
                              {title && <ScreenshotTitle>{title}</ScreenshotTitle>}
                              {description && <ScreenshotText>{description}</ScreenshotText>}
                            </ScreenshotDescription>
                          )}
                          
                          <ScreenshotActions>
                            <ScreenshotActionButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScreenshotClick(screenshot);
                              }}
                              title="Просмотр"
                            >
                              <FiEye />
                            </ScreenshotActionButton>
                            <ScreenshotActionButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleScreenshotDelete(screenshot.id);
                              }}
                              title="Удалить"
                            >
                              <FiTrash2 />
                            </ScreenshotActionButton>
                          </ScreenshotActions>
                        </ScreenshotItem>
                      );
                    })}
                  </ScreenshotGrid>
                )}
              </SectionContent>
            </Section>
          </ScreenshotSection>
        </ModalBody>
      </ModalContent>
      
      {/* Модальное окно для просмотра скриншотов */}
      {showScreenshotModal && selectedScreenshot && (
        <ScreenshotModal onClick={handleCloseScreenshotModal}>
          <ScreenshotModalContent onClick={(e) => e.stopPropagation()}>
            <ScreenshotModalClose onClick={handleCloseScreenshotModal}>
              <FiX />
            </ScreenshotModalClose>
            
            <ScreenshotModalImage 
              src={`/api/files/${selectedScreenshot.id}/download`}
              alt={selectedScreenshot.originalFilename}
            />
            
            <ScreenshotModalInfo>
              <ScreenshotModalTitle>
                {selectedScreenshot.originalFilename}
              </ScreenshotModalTitle>
              {selectedScreenshot.description && (
                <ScreenshotModalDescription>
                  {selectedScreenshot.description}
                </ScreenshotModalDescription>
              )}
            </ScreenshotModalInfo>
          </ScreenshotModalContent>
        </ScreenshotModal>
      )}
    </ModalOverlay>
  );
};

// Стили для секции скриншотов
const ScreenshotSection = styled.div`
  margin-top: 24px;
`;

const ScreenshotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const ScreenshotItem = styled.div`
  position: relative;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  background: #f9f9f9;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #4a90e2;
    background: #f0f7ff;
  }

  &.has-image {
    border: 2px solid #4a90e2;
    background: white;
    padding: 0;
    overflow: hidden;
  }
`;

const ScreenshotImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
`;

const ScreenshotPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #666;
`;

const ScreenshotActions = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;

  ${ScreenshotItem}:hover & {
    opacity: 1;
  }
`;

const ScreenshotActionButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 12px;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const ScreenshotUploadArea = styled.div`
  border: 2px dashed #4a90e2;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  background: #f0f7ff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e3f2fd;
    border-color: #357abd;
  }

  &.dragover {
    background: #e3f2fd;
    border-color: #357abd;
    transform: scale(1.02);
  }
`;

const ScreenshotUploadText = styled.div`
  color: #4a90e2;
  font-size: 14px;
  margin-bottom: 12px;
  font-weight: 500;
`;

const ScreenshotUploadButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #357abd;
  }
`;

// Новые стили для улучшенного интерфейса
const ScreenshotDescription = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 12px 8px 8px;
  font-size: 12px;
  line-height: 1.3;
  opacity: 0;
  transition: opacity 0.2s;

  ${ScreenshotItem}:hover & {
    opacity: 1;
  }
`;

const ScreenshotTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ScreenshotText = styled.div`
  font-size: 11px;
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ScreenshotModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ScreenshotModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const ScreenshotModalImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
`;

const ScreenshotModalInfo = styled.div`
  padding: 16px;
  background: white;
`;

const ScreenshotModalTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ScreenshotModalDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const ScreenshotModalClose = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const ScreenshotForm = styled.div`
  background: #f8f9fa;
  border: 2px dashed #4a90e2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
`;

const ScreenshotFormTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ScreenshotFormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const ScreenshotFormTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 60px;
  resize: vertical;
  margin-bottom: 12px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

const ScreenshotFormButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const ScreenshotFormButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: #4a90e2;
    color: white;
    
    &:hover {
      background: #357abd;
    }
  }
  
  &.secondary {
    background: #f5f5f5;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background: #e9e9e9;
    }
  }
`;

export default TaskModal;
