# Task Manager v2

Современный таск-менеджер с календарем и интеграцией Git/SSH.

## Возможности

- **Трехпанельный интерфейс**: список задач, календарь, детали задачи
- **Управление задачами**: создание, редактирование, архивирование
- **Календарное представление**: просмотр задач по датам
- **Git интеграция**: хранение ссылок на репозитории
- **SSH доступ**: управление доступом к серверам
- **Технические задания**: детальное описание задач
- **Приоритеты**: высокий, средний, низкий
- **Архив задач**: хранение завершенных задач

## Структура проекта

```
├── src/                    # React приложение
│   ├── components/        # Компоненты UI
│   ├── contexts/         # React контексты
│   └── App.js            # Главный компонент
├── backend/              # Flask API
│   ├── app.py           # Основное приложение
│   └── requirements.txt # Python зависимости
├── public/              # Статические файлы
└── package.json         # Node.js зависимости
```

## Установка и запуск

### 1. Установка зависимостей

```bash
# Установка Node.js зависимостей
npm install

# Установка Python зависимостей
cd backend
pip install -r requirements.txt
```

### 2. Запуск приложения

```bash
# Запуск в режиме разработки (одновременно frontend и backend)
npm run dev

# Или запуск по отдельности:
# Frontend (React)
npm start

# Backend (Flask)
npm run server
```

### 3. Доступ к приложению

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/tasks` - Получение списка задач
- `POST /api/tasks` - Создание новой задачи
- `GET /api/tasks/:id` - Получение конкретной задачи
- `PUT /api/tasks/:id` - Обновление задачи
- `DELETE /api/tasks/:id` - Удаление задачи
- `POST /api/tasks/:id/archive` - Архивирование задачи
- `GET /api/stats` - Статистика задач

## Структура задачи

```json
{
  "id": 1,
  "title": "Название задачи",
  "description": "Описание задачи",
  "status": "active|completed|archived",
  "priority": "high|medium|low",
  "dueDate": "2024-01-15",
  "gitRepository": "https://github.com/user/repo",
  "serverAccess": "ssh://user@server.com:22",
  "password": "encrypted_password",
  "sshKey": "ssh-rsa AAAAB3NzaC1yc2E...",
  "technicalSpec": "Техническое задание...",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-10T00:00:00Z"
}
```

## Технологии

- **Frontend**: React 18, Styled Components, React Big Calendar
- **Backend**: Flask, SQLite
- **Стили**: CSS-in-JS, современный дизайн
- **Иконки**: React Icons