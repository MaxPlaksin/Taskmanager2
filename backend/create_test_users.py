#!/usr/bin/env python3
"""
Скрипт для создания тестовых пользователей
"""

from app import app, db
from models import User
from werkzeug.security import generate_password_hash

def create_test_users():
    """Создает тестовых пользователей для разработки"""
    
    with app.app_context():
        # Проверяем, есть ли уже пользователи
        existing_users = User.query.count()
        if existing_users > 0:
            print(f"В базе уже есть {existing_users} пользователей")
            return
        
        # Создаем тестовых пользователей
        test_users = [
            {
                'username': 'admin',
                'email': 'admin@example.com',
                'password': 'admin123',
                'role': 'admin',
                'full_name': 'Администратор'
            },
            {
                'username': 'manager',
                'email': 'manager@example.com',
                'password': 'manager123',
                'role': 'manager',
                'full_name': 'Менеджер'
            },
            {
                'username': 'developer',
                'email': 'developer@example.com',
                'password': 'developer123',
                'role': 'developer',
                'full_name': 'Разработчик'
            }
        ]
        
        for user_data in test_users:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                password_hash=generate_password_hash(user_data['password']),
                role=user_data['role'],
                full_name=user_data['full_name'],
                is_active=True
            )
            db.session.add(user)
            print(f"Создан пользователь: {user_data['username']} ({user_data['role']})")
        
        db.session.commit()
        print("Все тестовые пользователи созданы успешно!")

if __name__ == '__main__':
    create_test_users()
