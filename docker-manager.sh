#!/bin/bash

# TaskManager Docker Management Script
# Этот скрипт предоставляет удобные команды для управления Docker контейнерами проекта

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка наличия Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker не установлен. Пожалуйста, установите Docker."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose не установлен. Пожалуйста, установите Docker Compose."
        exit 1
    fi
}

# Функция для запуска всех сервисов
start_all() {
    log "Запуск всех сервисов TaskManager..."
    docker-compose -f docker-compose.yml up -d
    log "Все сервисы запущены!"
    show_status
}

# Функция для остановки всех сервисов
stop_all() {
    log "Остановка всех сервисов TaskManager..."
    docker-compose -f docker-compose.yml down
    log "Все сервисы остановлены!"
}

# Функция для перезапуска сервисов
restart_all() {
    log "Перезапуск всех сервисов TaskManager..."
    docker-compose -f docker-compose.yml restart
    log "Все сервисы перезапущены!"
}

# Функция для показа статуса
show_status() {
    log "Статус контейнеров:"
    docker-compose -f docker-compose.yml ps
}

# Функция для показа логов
show_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        log "Показ логов всех сервисов (Ctrl+C для выхода):"
        docker-compose -f docker-compose.yml logs -f
    else
        log "Показ логов сервиса $service (Ctrl+C для выхода):"
        docker-compose -f docker-compose.yml logs -f "$service"
    fi
}

# Функция для сборки образов
build_all() {
    log "Сборка всех образов..."
    docker-compose -f docker-compose.yml build
    log "Все образы собраны!"
}

# Функция для очистки
clean_all() {
    warn "Это удалит все контейнеры, образы и тома проекта. Продолжить? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        log "Остановка и удаление контейнеров..."
        docker-compose -f docker-compose.yml down -v --remove-orphans
        
        log "Удаление образов..."
        docker-compose -f docker-compose.yml down --rmi all
        
        log "Очистка завершена!"
    else
        log "Очистка отменена."
    fi
}

# Функция для подключения к контейнеру
exec_service() {
    local service=${1:-"backend"}
    log "Подключение к контейнеру $service..."
    docker-compose -f docker-compose.yml exec "$service" /bin/bash
}

# Функция для показа помощи
show_help() {
    echo -e "${BLUE}TaskManager Docker Management Script${NC}"
    echo ""
    echo "Использование: $0 [КОМАНДА] [СЕРВИС]"
    echo ""
    echo "Команды:"
    echo "  start       - Запустить все сервисы"
    echo "  stop        - Остановить все сервисы"
    echo "  restart     - Перезапустить все сервисы"
    echo "  status      - Показать статус контейнеров"
    echo "  logs [сервис] - Показать логи (всех сервисов или конкретного)"
    echo "  build       - Собрать все образы"
    echo "  clean       - Очистить все контейнеры и образы"
    echo "  exec [сервис] - Подключиться к контейнеру (по умолчанию: backend)"
    echo "  help        - Показать эту справку"
    echo ""
    echo "Доступные сервисы: postgres, backend, frontend"
    echo ""
    echo "Примеры:"
    echo "  $0 start"
    echo "  $0 logs backend"
    echo "  $0 exec postgres"
}

# Основная логика
main() {
    check_docker
    
    case "${1:-help}" in
        start)
            start_all
            ;;
        stop)
            stop_all
            ;;
        restart)
            restart_all
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs "$2"
            ;;
        build)
            build_all
            ;;
        clean)
            clean_all
            ;;
        exec)
            exec_service "$2"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "Неизвестная команда: $1"
            show_help
            exit 1
            ;;
    esac
}

# Запуск основной функции
main "$@"

