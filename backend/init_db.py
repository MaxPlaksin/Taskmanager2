#!/usr/bin/env python3
"""
Скрипт для инициализации базы данных и создания первого администратора
"""

from app import app, db
from models import User, Task, TaskFile
from werkzeug.security import generate_password_hash
from datetime import datetime

def init_db():
    """Инициализация базы данных"""
    with app.app_context():
        # Создаем все таблицы
        db.create_all()
        
        # Проверяем, есть ли уже пользователи
        if User.query.count() == 0:
            print("Создание первого администратора...")
            
            # Создаем администратора по умолчанию
            admin = User(
                username='admin',
                email='admin@taskmanager.com',
                password_hash=generate_password_hash('admin123'),
                full_name='Системный администратор',
                role='admin',
                is_active=True
            )
            
            db.session.add(admin)
            
            # Создаем тестового менеджера
            manager = User(
                username='manager',
                email='manager@taskmanager.com',
                password_hash=generate_password_hash('manager123'),
                full_name='Менеджер проекта',
                role='manager',
                is_active=True
            )
            
            db.session.add(manager)
            
            # Создаем тестового разработчика
            developer = User(
                username='developer',
                email='developer@taskmanager.com',
                password_hash=generate_password_hash('developer123'),
                full_name='Разработчик',
                role='developer',
                is_active=True
            )
            
            db.session.add(developer)
            
            db.session.commit()
            
            print("✅ Пользователи созданы:")
            print("   Администратор: admin / admin123")
            print("   Менеджер: manager / manager123")
            print("   Разработчик: developer / developer123")
            
            # Создаем тестовые задачи
            print("Создание тестовых задач...")
            
            task1 = Task(
                title='Настройка системы авторизации',
                description='Реализовать систему ролей и авторизации для Task Manager',
                status='completed',
                priority='high',
                due_date=datetime.now(),
                created_by=admin.id,
                assignee_id=developer.id
            )
            
            task2 = Task(
                title='Создание интерфейса входа',
                description='Разработать форму входа в систему с валидацией',
                status='active',
                priority='medium',
                due_date=datetime(2024, 12, 31),
                created_by=manager.id,
                assignee_id=developer.id
            )
            
            task3 = Task(
                title='Тестирование системы',
                description='Провести полное тестирование всех функций приложения',
                status='active',
                priority='low',
                due_date=datetime(2025, 1, 15),
                created_by=admin.id,
                assignee_id=developer.id
            )
            
            db.session.add(task1)
            db.session.add(task2)
            db.session.add(task3)
            db.session.commit()
            
            print("✅ Тестовые задачи созданы")
            
        else:
            print("База данных уже инициализирована")
        
        print("🎉 Инициализация завершена!")

if __name__ == '__main__':
    init_db()
