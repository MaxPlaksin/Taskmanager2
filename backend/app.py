from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import os
import json

app = Flask(__name__)
CORS(app)

# Конфигурация базы данных
DATABASE = 'instance/taskmanager.db'

def init_db():
    """Инициализация базы данных"""
    os.makedirs('instance', exist_ok=True)
    
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'active',
            priority TEXT DEFAULT 'medium',
            due_date TEXT,
            git_repository TEXT,
            server_access TEXT,
            password TEXT,
            ssh_key TEXT,
            technical_spec TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Получение соединения с базой данных"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def task_to_dict(task):
    """Преобразование задачи из базы в словарь"""
    return {
        'id': task['id'],
        'title': task['title'],
        'description': task['description'],
        'status': task['status'],
        'priority': task['priority'],
        'dueDate': task['due_date'],
        'gitRepository': task['git_repository'],
        'serverAccess': task['server_access'],
        'password': task['password'],
        'sshKey': task['ssh_key'],
        'technicalSpec': task['technical_spec'],
        'createdAt': task['created_at'],
        'updatedAt': task['updated_at']
    }

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Получение всех задач"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        status = request.args.get('status', 'active')
        cursor.execute('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC', (status,))
        tasks = cursor.fetchall()
        
        conn.close()
        
        return jsonify([task_to_dict(task) for task in tasks])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Получение конкретной задачи"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM tasks WHERE id = ?', (task_id,))
        task = cursor.fetchone()
        
        conn.close()
        
        if task:
            return jsonify(task_to_dict(task))
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Создание новой задачи"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO tasks (
                title, description, status, priority, due_date,
                git_repository, server_access, password, ssh_key, technical_spec
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('title'),
            data.get('description'),
            data.get('status', 'active'),
            data.get('priority', 'medium'),
            data.get('dueDate'),
            data.get('gitRepository'),
            data.get('serverAccess'),
            data.get('password'),
            data.get('sshKey'),
            data.get('technicalSpec')
        ))
        
        task_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({'id': task_id, 'message': 'Task created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Обновление задачи"""
    try:
        data = request.get_json()
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE tasks SET
                title = ?, description = ?, status = ?, priority = ?, due_date = ?,
                git_repository = ?, server_access = ?, password = ?, ssh_key = ?,
                technical_spec = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            data.get('title'),
            data.get('description'),
            data.get('status'),
            data.get('priority'),
            data.get('dueDate'),
            data.get('gitRepository'),
            data.get('serverAccess'),
            data.get('password'),
            data.get('sshKey'),
            data.get('technicalSpec'),
            task_id
        ))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Task updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Удаление задачи"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>/archive', methods=['POST'])
def archive_task(task_id):
    """Архивирование задачи"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE tasks SET status = 'archived', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (task_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Task not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Task archived successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Получение статистики задач"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Общее количество задач
        cursor.execute('SELECT COUNT(*) as total FROM tasks')
        total = cursor.fetchone()['total']
        
        # Активные задачи
        cursor.execute('SELECT COUNT(*) as active FROM tasks WHERE status = "active"')
        active = cursor.fetchone()['active']
        
        # Завершенные задачи
        cursor.execute('SELECT COUNT(*) as completed FROM tasks WHERE status = "completed"')
        completed = cursor.fetchone()['completed']
        
        # Архивированные задачи
        cursor.execute('SELECT COUNT(*) as archived FROM tasks WHERE status = "archived"')
        archived = cursor.fetchone()['archived']
        
        # Задачи по приоритету
        cursor.execute('SELECT priority, COUNT(*) as count FROM tasks WHERE status = "active" GROUP BY priority')
        priority_stats = {row['priority']: row['count'] for row in cursor.fetchall()}
        
        conn.close()
        
        return jsonify({
            'total': total,
            'active': active,
            'completed': completed,
            'archived': archived,
            'priorityStats': priority_stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка состояния API"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
