from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, login_required, current_user
from datetime import datetime
import os
from config import Config
from models import db, Task, TaskFile, User
from auth import auth_bp, admin_required, manager_or_admin_required

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
CORS(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Пожалуйста, войдите в систему для доступа к этой странице.'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register auth blueprint
app.register_blueprint(auth_bp)

# Initialize Flask-Admin
admin = Admin(app, name='Task Manager Admin', template_mode='bootstrap3')

# Admin views with authentication
class TaskAdminView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin()
    
    def inaccessible_callback(self, name, **kwargs):
        return jsonify({'error': 'Требуются права администратора'}), 403
    
    column_list = ['id', 'title', 'status', 'priority', 'due_date', 'created_at', 'assignee', 'creator']
    column_searchable_list = ['title', 'description']
    column_filters = ['status', 'priority', 'created_at']
    form_columns = ['title', 'description', 'status', 'priority', 'due_date', 
                   'git_repository', 'server_access', 'password', 'ssh_key', 'technical_spec',
                   'assignee_id', 'created_by']

class TaskFileAdminView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin()
    
    def inaccessible_callback(self, name, **kwargs):
        return jsonify({'error': 'Требуются права администратора'}), 403
    
    column_list = ['id', 'original_filename', 'file_size', 'uploaded_at', 'task_id']
    column_searchable_list = ['original_filename']
    column_filters = ['uploaded_at', 'mime_type']

class UserAdminView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin()
    
    def inaccessible_callback(self, name, **kwargs):
        return jsonify({'error': 'Требуются права администратора'}), 403
    
    column_list = ['id', 'username', 'email', 'role', 'full_name', 'is_active', 'created_at']
    column_searchable_list = ['username', 'email', 'full_name']
    column_filters = ['role', 'is_active', 'created_at']
    form_columns = ['username', 'email', 'password_hash', 'role', 'full_name', 'is_active']

admin.add_view(TaskAdminView(Task, db.session))
admin.add_view(TaskFileAdminView(TaskFile, db.session))
admin.add_view(UserAdminView(User, db.session))

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Получение всех задач"""
    try:
        status = request.args.get('status', 'active')
        tasks = Task.query.filter_by(status=status).order_by(Task.created_at.desc()).all()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    """Получение конкретной задачи"""
    try:
        task = Task.query.get_or_404(task_id)
        return jsonify(task.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
@manager_or_admin_required
def create_task():
    """Создание новой задачи (только для менеджеров и администраторов)"""
    try:
        data = request.get_json()
        
        task = Task(
            title=data.get('title'),
            description=data.get('description'),
            status=data.get('status', 'active'),
            priority=data.get('priority', 'medium'),
            due_date=datetime.fromisoformat(data.get('dueDate')) if data.get('dueDate') else None,
            git_repository=data.get('gitRepository'),
            server_access=data.get('serverAccess'),
            password=data.get('password'),
            ssh_key=data.get('sshKey'),
            technical_spec=data.get('technicalSpec'),
            created_by=current_user.id,
            assignee_id=data.get('assigneeId')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify({'id': task.id, 'message': 'Task created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Обновление задачи"""
    try:
        data = request.get_json()
        task = Task.query.get_or_404(task_id)
        
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.status = data.get('status', task.status)
        task.priority = data.get('priority', task.priority)
        task.due_date = datetime.fromisoformat(data.get('dueDate')) if data.get('dueDate') else task.due_date
        task.git_repository = data.get('gitRepository', task.git_repository)
        task.server_access = data.get('serverAccess', task.server_access)
        task.password = data.get('password', task.password)
        task.ssh_key = data.get('sshKey', task.ssh_key)
        task.technical_spec = data.get('technicalSpec', task.technical_spec)
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({'message': 'Task updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Удаление задачи"""
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>/archive', methods=['POST'])
def archive_task(task_id):
    """Архивирование задачи"""
    try:
        task = Task.query.get_or_404(task_id)
        task.status = 'archived'
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Task archived successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка состояния API"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/stats', methods=['GET'])
@admin_required
def get_stats():
    """Получение статистики задач (только для администраторов)"""
    try:
        # Общее количество задач
        total = Task.query.count()
        
        # Активные задачи
        active = Task.query.filter_by(status='active').count()
        
        # Завершенные задачи
        completed = Task.query.filter_by(status='completed').count()
        
        # Архивированные задачи
        archived = Task.query.filter_by(status='archived').count()
        
        # Задачи по приоритету
        priority_stats = {}
        for priority in ['high', 'medium', 'low']:
            count = Task.query.filter_by(status='active', priority=priority).count()
            priority_stats[priority] = count
        
        return jsonify({
            'total': total,
            'active': active,
            'completed': completed,
            'archived': archived,
            'priorityStats': priority_stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# File upload endpoints
@app.route('/api/tasks/<int:task_id>/files', methods=['POST'])
def upload_file(task_id):
    """Загрузка файла для задачи"""
    try:
        task = Task.query.get_or_404(task_id)
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join('uploads', str(task_id))
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
        file_path = os.path.join(upload_dir, filename)
        file.save(file_path)
        
        # Save file info to database
        task_file = TaskFile(
            task_id=task_id,
            filename=filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=os.path.getsize(file_path),
            mime_type=file.content_type
        )
        
        db.session.add(task_file)
        db.session.commit()
        
        return jsonify(task_file.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>/files', methods=['GET'])
def get_task_files(task_id):
    """Получение файлов задачи"""
    try:
        task = Task.query.get_or_404(task_id)
        files = TaskFile.query.filter_by(task_id=task_id).all()
        return jsonify([file.to_dict() for file in files])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/<int:file_id>/download', methods=['GET'])
def download_file(file_id):
    """Скачивание файла"""
    try:
        task_file = TaskFile.query.get_or_404(file_id)
        
        if not os.path.exists(task_file.file_path):
            return jsonify({'error': 'File not found'}), 404
        
        from flask import send_file
        return send_file(
            task_file.file_path,
            as_attachment=True,
            download_name=task_file.original_filename
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    """Удаление файла"""
    try:
        task_file = TaskFile.query.get_or_404(file_id)
        
        # Delete physical file
        if os.path.exists(task_file.file_path):
            os.remove(task_file.file_path)
        
        # Delete from database
        db.session.delete(task_file)
        db.session.commit()
        
        return jsonify({'message': 'File deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
