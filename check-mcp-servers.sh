#!/bin/bash

# Полная проверка всех MCP серверов
echo "🔍 Проверка всех MCP серверов TaskManager..."

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Функция для проверки сервера
check_server() {
    local server_name="$1"
    local command="$2"
    local args="$3"
    
    echo -e "${BLUE}Проверка сервера: $server_name${NC}"
    
    if timeout 5s $command $args > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $server_name - работает${NC}"
        return 0
    else
        echo -e "${RED}❌ $server_name - не работает${NC}"
        return 1
    fi
}

echo ""
echo "📦 Проверка установленных пакетов..."

# Проверяем установленные пакеты
packages=(
    "@modelcontextprotocol/server-filesystem"
    "@modelcontextprotocol/server-memory"
    "@modelcontextprotocol/server-sequential-thinking"
    "@modelcontextprotocol/server-everything"
    "enhanced-postgres-mcp-server"
    "puppeteer-mcp-server"
)

for package in "${packages[@]}"; do
    if npm list -g "$package" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $package - установлен${NC}"
    else
        echo -e "${RED}❌ $package - не установлен${NC}"
    fi
done

echo ""
echo "🧪 Тестирование серверов..."

# Тестируем каждый сервер
check_server "filesystem" "npx" "-y @modelcontextprotocol/server-filesystem --help"
check_server "memory" "npx" "-y @modelcontextprotocol/server-memory --help"
check_server "sequential-thinking" "npx" "-y @modelcontextprotocol/server-sequential-thinking --help"
check_server "everything" "npx" "-y @modelcontextprotocol/server-everything --help"
check_server "postgres" "npx" "-y enhanced-postgres-mcp-server --help"
check_server "puppeteer" "npx" "-y puppeteer-mcp-server --help"

echo ""
echo "🐳 Проверка Docker..."
if docker --version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker - установлен${NC}"
    if docker-compose --version > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker Compose - установлен${NC}"
    else
        echo -e "${RED}❌ Docker Compose - не установлен${NC}"
    fi
else
    echo -e "${RED}❌ Docker - не установлен${NC}"
fi

echo ""
echo "🗄️ Проверка PostgreSQL..."
if psql --version > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL - установлен${NC}"
else
    echo -e "${RED}❌ PostgreSQL - не установлен${NC}"
fi

echo ""
echo "📁 Проверка конфигурации MCP..."
if [ -f "/Users/maxim/Project/Taskmanager2/.cursor/mcp.json" ]; then
    echo -e "${GREEN}✅ Файл mcp.json - существует${NC}"
    
    # Подсчитываем количество серверов
    server_count=$(grep -o '"command"' /Users/maxim/Project/Taskmanager2/.cursor/mcp.json | wc -l)
    echo -e "${BLUE}📊 Настроено серверов: $server_count${NC}"
else
    echo -e "${RED}❌ Файл mcp.json - не найден${NC}"
fi

echo ""
echo "🎯 Рекомендации:"
echo "1. Перезапустите Cursor для активации всех серверов"
echo "2. Проверьте раздел 'Tools & MCP' в настройках Cursor"
echo "3. Убедитесь, что все серверы показывают инструменты"
echo "4. При проблемах проверьте логи в консоли Cursor"

echo ""
echo -e "${GREEN}✅ Проверка завершена!${NC}"
