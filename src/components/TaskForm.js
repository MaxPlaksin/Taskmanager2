import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiSave, FiCalendar, FiFlag, FiGitBranch, FiServer, FiKey, FiFileText } from 'react-icons/fi';

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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
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

const Form = styled.form`
  padding: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a90e2;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background: white;

  &:focus {
    border-color: #4a90e2;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background: #4a90e2;
    color: white;
    
    &:hover {
      background: #357abd;
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e0e0e0;
    }
  `}
`;

const TaskForm = ({ onSave, onCancel, task = null }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    startDate: task?.startDate ? new Date(task.startDate).toISOString().split('T')[0] : '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    gitRepository: task?.gitRepository || '',
    serverAccess: task?.serverAccess || '',
    password: task?.password || '',
    sshKey: task?.sshKey || '',
    technicalSpec: task?.technicalSpec || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      status: task?.status || 'active'
    };
    
    // Если это новая задача (task = null), используем POST
    // Если это редактирование (task.id существует), используем PUT
    if (task && task.id) {
      onSave({ ...taskData, id: task.id });
    } else {
      onSave(taskData);
    }
  };

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {task ? 'Редактировать задачу' : 'Новая задача'}
          </ModalTitle>
          <CloseButton onClick={onCancel}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Название задачи *</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите название задачи"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Описание</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Описание задачи"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>Приоритет</Label>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Дата начала</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Срок выполнения</Label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Git репозиторий</Label>
            <Input
              type="url"
              name="gitRepository"
              value={formData.gitRepository}
              onChange={handleChange}
              placeholder="https://github.com/user/repository"
            />
          </FormGroup>

          <FormGroup>
            <Label>Доступ к серверу</Label>
            <Input
              type="text"
              name="serverAccess"
              value={formData.serverAccess}
              onChange={handleChange}
              placeholder="ssh://user@server.com:22"
            />
          </FormGroup>

          <FormGroup>
            <Label>Пароль</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Пароль для доступа"
            />
          </FormGroup>

          <FormGroup>
            <Label>SSH ключ</Label>
            <TextArea
              name="sshKey"
              value={formData.sshKey}
              onChange={handleChange}
              placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC..."
              rows={3}
            />
          </FormGroup>

          <FormGroup>
            <Label>Техническое задание</Label>
            <TextArea
              name="technicalSpec"
              value={formData.technicalSpec}
              onChange={handleChange}
              placeholder="Подробное техническое задание..."
              rows={4}
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onCancel}>
              <FiX />
              Отмена
            </Button>
            <Button type="submit" variant="primary">
              <FiSave />
              {task ? 'Сохранить' : 'Создать'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskForm;