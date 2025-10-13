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
  FiPaperclip
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
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

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
    onTaskUpdate(updatedTask);
    setShowEditForm(false);
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

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
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
                  {files.map((file, index) => (
                    <FileItem key={index}>
                      <FileIcon>
                        <FiFile />
                      </FileIcon>
                      <FileInfo>
                        <FileName>{file.name}</FileName>
                        <FileSize>{(file.size / 1024).toFixed(1)} KB</FileSize>
                      </FileInfo>
                      <FileActions>
                        <FileActionButton onClick={() => downloadFile(file)}>
                          <FiDownload />
                        </FileActionButton>
                        <FileActionButton onClick={() => removeFile(index)}>
                          <FiX />
                        </FileActionButton>
                      </FileActions>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </SectionContent>
          </Section>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskModal;
