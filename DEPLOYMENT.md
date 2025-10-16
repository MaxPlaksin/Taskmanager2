# 🚀 Инструкция по развертыванию на сервере

## Подготовка сервера

### 1. Установка Docker и Docker Compose
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагружаемся для применения изменений
sudo reboot
```

### 2. Клонирование репозитория
```bash
# Клонируем проект
git clone https://github.com/MaxPlaksin/Taskmanager2.git
cd Taskmanager2

# Делаем скрипт развертывания исполняемым
chmod +x deploy.sh
```

### 3. Настройка переменных окружения
```bash
# Создаем файл .env
cat > .env << EOF
WEBHOOK_SECRET=your-very-secret-key-here
POSTGRES_PASSWORD=your-secure-password
EOF
```

## Развертывание

### Вариант 1: Ручное развертывание
```bash
# Запускаем приложение
docker-compose up --build -d

# Проверяем статус
docker-compose ps
```

### Вариант 2: Автоматическое развертывание через webhook

#### 1. Запускаем webhook сервис
```bash
# Запускаем webhook
docker-compose -f docker-compose.webhook.yml up --build -d

# Проверяем статус
docker-compose -f docker-compose.webhook.yml ps
```

#### 2. Настраиваем GitHub Webhook
1. Переходим в настройки репозитория: `Settings` → `Webhooks`
2. Нажимаем `Add webhook`
3. Заполняем:
   - **Payload URL**: `http://your-server-ip:5002/webhook`
   - **Content type**: `application/json`
   - **Secret**: `your-very-secret-key-here` (тот же, что в .env)
   - **Events**: `Just the push event`
4. Нажимаем `Add webhook`

#### 3. Тестируем автоматическое развертывание
```bash
# Делаем изменения в коде
echo "# Test change" >> README.md
git add .
git commit -m "Test deployment"
git push origin main

# Проверяем логи webhook
docker-compose -f docker-compose.webhook.yml logs -f webhook
```

## Мониторинг

### Проверка статуса сервисов
```bash
# Статус основного приложения
docker-compose ps

# Статус webhook
docker-compose -f docker-compose.webhook.yml ps

# Логи приложения
docker-compose logs -f

# Логи webhook
docker-compose -f docker-compose.webhook.yml logs -f webhook
```

### Проверка доступности
```bash
# Основное приложение
curl http://localhost:3000

# Webhook health check
curl http://localhost:5002/health
```

## Обновление

### Ручное обновление
```bash
# Останавливаем сервисы
docker-compose down

# Получаем изменения
git pull origin main

# Перезапускаем
docker-compose up --build -d
```

### Автоматическое обновление
При каждом push в main ветку webhook автоматически:
1. Остановит контейнеры
2. Получит изменения из Git
3. Пересоберет и запустит контейнеры
4. Проверит доступность приложения

## Безопасность

### Настройка файрвола
```bash
# Разрешаем только необходимые порты
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 3000  # Приложение (если нужно)
sudo ufw allow 5002  # Webhook (только для GitHub)
sudo ufw enable
```

### Настройка Nginx (опционально)
```bash
# Устанавливаем Nginx
sudo apt install nginx

# Создаем конфигурацию
sudo nano /etc/nginx/sites-available/taskmanager

# Содержимое конфигурации:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Активируем конфигурацию
sudo ln -s /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Troubleshooting

### Проблемы с правами Docker
```bash
# Добавляем пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

### Проблемы с webhook
```bash
# Проверяем логи
docker-compose -f docker-compose.webhook.yml logs webhook

# Перезапускаем webhook
docker-compose -f docker-compose.webhook.yml restart webhook
```

### Проблемы с развертыванием
```bash
# Проверяем скрипт развертывания
bash -x deploy.sh

# Проверяем доступность Git
git remote -v
```

## Полезные команды

```bash
# Очистка неиспользуемых Docker образов
docker system prune -a

# Просмотр использования диска
docker system df

# Бэкап базы данных
docker-compose exec postgres pg_dump -U taskmanager taskmanager > backup.sql

# Восстановление базы данных
docker-compose exec -T postgres psql -U taskmanager taskmanager < backup.sql
```
