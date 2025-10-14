#!/usr/bin/env python3
"""
Скрипт для тестирования входа в систему
"""

import requests
import json

def test_login():
    """Тестирует вход в систему"""
    
    # URL для входа
    login_url = "http://localhost:5000/api/auth/login"
    
    # Тестовые данные
    test_users = [
        {"username": "admin", "password": "admin123"},
        {"username": "manager", "password": "manager123"},
        {"username": "developer", "password": "developer123"}
    ]
    
    for user_data in test_users:
        print(f"\nТестируем вход для пользователя: {user_data['username']}")
        
        try:
            # Отправляем POST запрос
            response = requests.post(
                login_url,
                json=user_data,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Статус ответа: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"[OK] Успешный вход!")
                print(f"Пользователь: {data.get('user', {}).get('username', 'N/A')}")
                print(f"Роль: {data.get('user', {}).get('role', 'N/A')}")
            else:
                print(f"[ERROR] Ошибка входа: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print("[ERROR] Ошибка подключения к серверу. Убедитесь, что backend запущен на порту 5000")
            break
        except Exception as e:
            print(f"[ERROR] Ошибка: {e}")

if __name__ == '__main__':
    test_login()
