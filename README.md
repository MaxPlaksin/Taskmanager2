# Task Manager v2

Современный менеджер задач с календарем, интеграцией с Git и возможностью загрузки файлов.

## 🚀 Быстрый запуск

### Запуск одной командой (Docker)

```bash
docker-compose up --build
```

После запуска приложение будет доступно по адресам:
- **Фронтенд**: http://localhost:3000
- **Бэкенд API**: http://localhost:5000
- **Админка**: http://localhost:5000/admin
- **PostgreSQL**: localhost:5435

### Остановка

```bash
docker-compose down
```

### Остановка с удалением данных

```bash
docker-compose down -v
```

## 📋 Функциональность

### Основные возможности:
- ✅ **Дашборд** с календарем и последними задачами
- ✅ **Проекты** - полный список задач с фильтрацией
- ✅ **Модальные окна** для детального просмотра задач
- ✅ **Загрузка файлов** с drag & drop интерфейсом
- ✅ **Админка** для управления задачами
- ✅ **PostgreSQL** база данных
- ✅ **Docker** контейнеризация

### Технические детали:
- **Фронтенд**: React 18, Styled Components, React Big Calendar
- **Бэкенд**: Flask, SQLAlchemy, Flask-Admin
- **База данных**: PostgreSQL 15
- **Контейнеризация**: Docker & Docker Compose

## 🛠 Разработка

### Локальная разработка

1. **Установка зависимостей**:
   ```bash
   # Фронтенд
   npm install
   
   # Бэкенд
   cd backend
   pip install -r requirements.txt
   ```

2. **Настройка базы данных**:
   ```bash
   # Запуск PostgreSQL
   docker run -d --name postgres \
     -e POSTGRES_DB=taskmanager \
     -e POSTGRES_USER=taskmanager \
     -e POSTGRES_PASSWORD=taskmanager123 \
     -p 5432:5432 \
     postgres:15-alpine
   ```

3. **Запуск приложения**:
   ```bash
   # В одном терминале - бэкенд
   cd backend && python app.py
   
   # В другом терминале - фронтенд
   npm run dev
   ```

## 📁 Структура проекта

```
Taskmanager/
├── src/                    # React фронтенд
│   ├── components/         # Компоненты
│   │   ├── Sidebar.js     # Боковое меню
│   │   ├── Dashboard.js   # Дашборд
│   │   ├── Projects.js    # Проекты
│   │   └── TaskModal.js   # Модальное окно задач
│   └── App.js             # Главный компонент
├── backend/               # Flask бэкенд
│   ├── app.py            # Основное приложение
│   ├── models.py         # Модели базы данных
│   ├── config.py         # Конфигурация
│   └── requirements.txt  # Python зависимости
├── docker-compose.yml    # Docker Compose конфигурация
├── Dockerfile.frontend   # Dockerfile для фронтенда
├── Dockerfile.backend    # Dockerfile для бэкенда
└── package.json          # Node.js зависимости
```

## 🔧 API Endpoints

### Задачи
- `GET /api/tasks` - Получить все задачи
- `GET /api/tasks/<id>` - Получить задачу по ID
- `POST /api/tasks` - Создать новую задачу
- `PUT /api/tasks/<id>` - Обновить задачу
- `DELETE /api/tasks/<id>` - Удалить задачу
- `POST /api/tasks/<id>/archive` - Архивировать задачу

### Файлы
- `POST /api/tasks/<id>/files` - Загрузить файл
- `GET /api/tasks/<id>/files` - Получить файлы задачи
- `GET /api/files/<id>/download` - Скачать файл
- `DELETE /api/files/<id>` - Удалить файл

### Статистика
- `GET /api/stats` - Получить статистику задач
- `GET /api/health` - Проверка состояния API

## 🎨 Дизайн

Приложение использует современный дизайн с:
- Боковым меню для навигации
- Адаптивной сеткой для дашборда
- Цветовой индикацией приоритетов
- Drag & Drop интерфейсом для файлов
- Модальными окнами для деталей

## 📊 База данных

### Таблицы:
- **tasks** - Основная таблица задач
- **task_files** - Файлы, прикрепленные к задачам

### Связи:
- Один ко многим между tasks и task_files

## 🔐 Безопасность

- Все пароли и SSH ключи хранятся в базе данных
- Возможность скрытия/показа паролей
- Копирование в буфер обмена
- Админка для управления данными

## 🚀 Продакшн

Для продакшн развертывания:

1. Измените `SECRET_KEY` в конфигурации
2. Используйте внешнюю PostgreSQL базу
3. Настройте reverse proxy (nginx)
4. Используйте WSGI сервер (gunicorn)

```bash
# Продакшн запуск
docker-compose -f docker-compose.prod.yml up -d
```