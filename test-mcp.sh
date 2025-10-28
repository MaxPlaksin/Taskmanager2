#!/bin/bash

# Тест MCP Docker Manager сервера
echo "🧪 Тестирование MCP Docker Manager сервера..."

# Функция для отправки JSON-RPC сообщения
send_message() {
    local message="$1"
    echo "$message" | node /Users/maxim/Project/Taskmanager2/docker-mcp-server.js
}

echo ""
echo "1️⃣ Инициализация сервера..."
send_message '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}'

echo ""
echo "2️⃣ Получение списка инструментов..."
send_message '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

echo ""
echo "3️⃣ Тест docker_status..."
send_message '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"docker_status","arguments":{}}}'

echo ""
echo "4️⃣ Тест docker_logs (без параметров)..."
send_message '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"docker_logs","arguments":{}}}'

echo ""
echo "✅ Тестирование завершено!"
