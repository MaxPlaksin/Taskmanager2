from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
from functools import wraps
import os
import uuid
from models import db, User

auth_bp = Blueprint('auth', __name__)

def admin_required(f):
    """Декоратор для проверки прав администратора"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin():
            return jsonify({'error': 'Требуются права администратора'}), 403
        return f(*args, **kwargs)
    return decorated_function

def manager_or_admin_required(f):
    """Декоратор для проверки прав менеджера или администратора"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or (not current_user.is_manager() and not current_user.is_admin()):
            return jsonify({'error': 'Требуются права менеджера или администратора'}), 403
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/api/auth/login', methods=['GET'])
def login_get():
    """Обработка GET запроса на login (для избежания ошибок браузера)"""
    return jsonify({'message': 'Use POST method for login'}), 405

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """Вход в систему"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Необходимы имя пользователя и пароль'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        if not user.is_active:
            return jsonify({'error': 'Аккаунт деактивирован'}), 403
        
        # Обновляем время последнего входа
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        login_user(user, remember=data.get('remember', False))
        
        return jsonify({
            'message': 'Успешный вход в систему',
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Неверные учетные данные'}), 401

@auth_bp.route('/api/auth/logout', methods=['POST'])
@login_required
def logout():
    """Выход из системы"""
    logout_user()
    return jsonify({'message': 'Успешный выход из системы'}), 200

@auth_bp.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    """Получение информации о текущем пользователе"""
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/api/auth/profile', methods=['PUT'])
@login_required
def update_profile():
    """Обновление профиля пользователя"""
    try:
        data = request.form
        user = current_user
        
        # Обновляем основные поля
        if data.get('fullName'):
            user.full_name = data.get('fullName')
        if data.get('email'):
            user.email = data.get('email')
        if data.get('username'):
            user.username = data.get('username')
        
        # Обновляем пароль если указан
        if data.get('currentPassword') and data.get('newPassword'):
            if check_password_hash(user.password_hash, data.get('currentPassword')):
                user.password_hash = generate_password_hash(data.get('newPassword'))
            else:
                return jsonify({'error': 'Неверный текущий пароль'}), 400
        
        # Обрабатываем аватар
        if 'avatar' in request.files:
            avatar_file = request.files['avatar']
            if avatar_file.filename:
                # Сохраняем аватар
                filename = secure_filename(avatar_file.filename)
                unique_filename = f"{uuid.uuid4()}_{filename}"
                avatar_path = os.path.join('uploads', 'avatars', unique_filename)
                
                # Создаем директорию если не существует
                os.makedirs(os.path.dirname(avatar_path), exist_ok=True)
                
                # Сохраняем файл
                avatar_file.save(avatar_path)
                
                # Обновляем путь к аватару в профиле пользователя
                user.avatar_path = avatar_path
        
        db.session.commit()
        
        return jsonify({'message': 'Профиль успешно обновлен', 'user': user.to_dict()})
        
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления профиля: {e}")
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/api/auth/register', methods=['POST'])
@admin_required
def register():
    """Регистрация нового пользователя (только для администраторов)"""
    data = request.get_json()
    
    if not data or not all(k in data for k in ('username', 'email', 'password', 'full_name', 'role')):
        return jsonify({'error': 'Необходимы все поля: username, email, password, full_name, role'}), 400
    
    # Проверяем, что роль валидна
    valid_roles = ['admin', 'manager', 'developer']
    if data['role'] not in valid_roles:
        return jsonify({'error': f'Неверная роль. Допустимые роли: {", ".join(valid_roles)}'}), 400
    
    # Проверяем, что пользователь не существует
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Пользователь с таким именем уже существует'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Пользователь с таким email уже существует'}), 400
    
    # Создаем нового пользователя
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        full_name=data['full_name'],
        role=data['role']
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'message': 'Пользователь успешно создан',
        'user': user.to_dict()
    }), 201

@auth_bp.route('/api/auth/users', methods=['GET'])
@admin_required
def get_users():
    """Получение списка всех пользователей (только для администраторов)"""
    users = User.query.all()
    return jsonify({
        'users': [user.to_dict() for user in users]
    }), 200

@auth_bp.route('/api/auth/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """Обновление пользователя (только для администраторов)"""
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Необходимы данные для обновления'}), 400
    
    # Обновляем поля
    if 'username' in data:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'error': 'Пользователь с таким именем уже существует'}), 400
        user.username = data['username']
    
    if 'email' in data:
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'error': 'Пользователь с таким email уже существует'}), 400
        user.email = data['email']
    
    if 'full_name' in data:
        user.full_name = data['full_name']
    
    if 'role' in data:
        valid_roles = ['admin', 'manager', 'developer']
        if data['role'] not in valid_roles:
            return jsonify({'error': f'Неверная роль. Допустимые роли: {", ".join(valid_roles)}'}), 400
        user.role = data['role']
    
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    if 'password' in data and data['password']:
        user.password_hash = generate_password_hash(data['password'])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Пользователь успешно обновлен',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/api/auth/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Удаление пользователя (только для администраторов)"""
    user = User.query.get_or_404(user_id)
    
    # Нельзя удалить самого себя
    if user.id == current_user.id:
        return jsonify({'error': 'Нельзя удалить самого себя'}), 400
    
    db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'Пользователь успешно удален'}), 200

@auth_bp.route('/api/auth/change-password', methods=['POST'])
@login_required
def change_password():
    """Смена пароля текущего пользователя"""
    data = request.get_json()
    
    if not data or not all(k in data for k in ('current_password', 'new_password')):
        return jsonify({'error': 'Необходимы текущий и новый пароль'}), 400
    
    if not check_password_hash(current_user.password_hash, data['current_password']):
        return jsonify({'error': 'Неверный текущий пароль'}), 400
    
    current_user.password_hash = generate_password_hash(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Пароль успешно изменен'}), 200
