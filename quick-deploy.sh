#!/bin/bash

# Быстрый скрипт развертывания для разработки
# Используйте deploy.sh для продакшена

echo "🚀 Быстрое развертывание TaskManager..."

# Останавливаем контейнеры
echo "⏹️ Останавливаем контейнеры..."
docker-compose down

# Пересобираем и запускаем
echo "🔨 Пересобираем и запускаем..."
docker-compose up --build -d

# Ждем запуска
echo "⏳ Ждем запуска сервисов..."
sleep 5

# Проверяем статус
echo "✅ Статус контейнеров:"
docker-compose ps

echo "🌐 Приложение доступно по адресу:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Admin:    http://localhost:5000/admin"

echo "🎉 Развертывание завершено!"
