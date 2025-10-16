from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_login import LoginManager, login_required, current_user
from flask_migrate import Migrate
from datetime import datetime
import os
import uuid
from werkzeug.utils import secure_filename
from config import Config
from models import db, Task, TaskFile, User, Project
from auth import auth_bp, admin_required, manager_or_admin_required

app = Flask(__name__)
app.config.from_object(Config)

# Увеличиваем лимит размера файла до 50MB
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
CORS(app, supports_credentials=True)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Пожалуйста, войдите в систему для доступа к этой странице.'
login_manager.session_protection = 'strong'

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
    
    column_list = ['id', 'title', 'status', 'priority', 'progress', 'due_date', 'created_at', 'assignee', 'creator']
    column_searchable_list = ['title', 'description']
    column_filters = ['status', 'priority', 'progress', 'created_at']
    form_columns = ['title', 'description', 'status', 'priority', 'progress', 'start_date', 'due_date', 
                   'git_repository', 'server_ip', 'server_password', 'ssh_key', 'technical_spec',
                   'estimated_hours', 'actual_hours', 'assignee_id', 'created_by']

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

class ProjectAdminView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.is_admin()
    
    def inaccessible_callback(self, name, **kwargs):
        return jsonify({'error': 'Требуются права администратора'}), 403
    
    column_list = ['id', 'name', 'status', 'owner', 'created_at']
    column_searchable_list = ['name', 'description']
    column_filters = ['status', 'created_at']
    form_columns = ['name', 'description', 'status', 'owner_id']

admin.add_view(TaskAdminView(Task, db.session))
admin.add_view(TaskFileAdminView(TaskFile, db.session))
admin.add_view(UserAdminView(User, db.session))
admin.add_view(ProjectAdminView(Project, db.session))

@app.route('/api/tasks', methods=['GET'])
@login_required
def get_tasks():
    """Получение задач с фильтрацией по ролям"""
    try:
        status = request.args.get('status', 'active')
        query = Task.query.filter_by(status=status)
        
        # Фильтрация по ролям
        if current_user.role == 'admin':
            # Админ видит все задачи
            pass
        elif current_user.role == 'manager':
            # Менеджер видит только свои задачи
            query = query.filter(Task.creator_id == current_user.id)
        elif current_user.role == 'developer':
            # Разработчик видит только свои задачи
            query = query.filter(Task.creator_id == current_user.id)
        elif current_user.role == 'director':
            # Директор видит все задачи
            pass
        
        tasks = query.order_by(Task.created_at.desc()).all()
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
        
        # Проверяем, что пользователь авторизован
        if not current_user.is_authenticated:
            return jsonify({'error': 'Пользователь не авторизован'}), 401
            
        task = Task(
            title=data.get('title'),
            description=data.get('description'),
            status=data.get('status', 'active'),
            priority=data.get('priority', 'medium'),
            progress=data.get('progress', 'not_started'),
            start_date=datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00')) if data.get('startDate') else None,
            due_date=datetime.fromisoformat(data.get('dueDate').replace('Z', '+00:00')) if data.get('dueDate') else None,
            git_repository=data.get('gitRepository'),
            server_ip=data.get('serverIp'),
            server_password=data.get('serverPassword'),
            ssh_key=data.get('sshKey'),
            technical_spec=data.get('technicalSpec'),
            estimated_hours=float(data.get('estimatedHours')) if data.get('estimatedHours') and data.get('estimatedHours') != '' else None,
            actual_hours=float(data.get('actualHours')) if data.get('actualHours') and data.get('actualHours') != '' else 0,
            created_by=current_user.id,
            assignee_id=data.get('assigneeId'),
            project_id=data.get('projectId')
        )
        
        db.session.add(task)
        db.session.flush()  # Получаем ID задачи
        
        # Добавляем исполнителей
        assignee_ids = data.get('assigneeIds', [])
        if assignee_ids:
            assignees = User.query.filter(User.id.in_(assignee_ids)).all()
            task.assignees = assignees
        
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка создания задачи: {e}")
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
        task.progress = data.get('progress', task.progress)
        
        # Обработка дат с улучшенной обработкой ошибок
        if data.get('startDate'):
            try:
                task.start_date = datetime.fromisoformat(data.get('startDate').replace('Z', '+00:00'))
            except ValueError:
                print(f"Ошибка парсинга startDate: {data.get('startDate')}")
                task.start_date = task.start_date
        
        if data.get('dueDate'):
            try:
                task.due_date = datetime.fromisoformat(data.get('dueDate').replace('Z', '+00:00'))
            except ValueError:
                print(f"Ошибка парсинга dueDate: {data.get('dueDate')}")
                task.due_date = task.due_date
                
        task.git_repository = data.get('gitRepository', task.git_repository)
        task.server_ip = data.get('serverIp', task.server_ip)
        task.server_password = data.get('serverPassword', task.server_password)
        task.ssh_key = data.get('sshKey', task.ssh_key)
        task.technical_spec = data.get('technicalSpec', task.technical_spec)
        task.estimated_hours = float(data.get('estimatedHours')) if data.get('estimatedHours') and data.get('estimatedHours') != '' else task.estimated_hours
        task.actual_hours = float(data.get('actualHours')) if data.get('actualHours') and data.get('actualHours') != '' else task.actual_hours
        task.assignee_id = data.get('assigneeId', task.assignee_id)
        task.project_id = data.get('projectId', task.project_id)
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(task.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления задачи {task_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Удаление задачи"""
    try:
        task = Task.query.get(task_id)
        if not task:
            return jsonify({'error': 'Task not found'}), 404
            
        # Удаляем связанные файлы
        for file in task.files:
            try:
                import os
                if os.path.exists(file.file_path):
                    os.remove(file.file_path)
            except Exception as e:
                print(f"Ошибка удаления файла {file.file_path}: {e}")
        
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка удаления задачи {task_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>/files', methods=['POST'])
@login_required
def upload_file(task_id):
    """Загрузка файла к задаче"""
    try:
        task = Task.query.get_or_404(task_id)
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        if file:
            # Создаем уникальное имя файла
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join('uploads', unique_filename)
            
            # Создаем директорию если не существует
            os.makedirs('uploads', exist_ok=True)
            
            # Сохраняем файл
            file.save(file_path)
            
            # Получаем тип файла и описание из запроса
            file_type = request.form.get('type', 'attachment')
            description = request.form.get('description', '')
            
            # Создаем запись в базе данных
            task_file = TaskFile(
                task_id=task_id,
                filename=unique_filename,
                original_filename=filename,
                file_path=file_path,
                file_size=os.path.getsize(file_path),
                mime_type=file.content_type,
                file_type=file_type,
                description=description
            )
            
            db.session.add(task_file)
            db.session.commit()
            
            return jsonify(task_file.to_dict()), 201
            
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка загрузки файла: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/<int:file_id>', methods=['DELETE'])
@login_required
def delete_file(file_id):
    """Удаление файла"""
    try:
        file = TaskFile.query.get_or_404(file_id)
        
        # Удаляем файл с диска
        if os.path.exists(file.file_path):
            os.remove(file.file_path)
            
        # Удаляем запись из базы данных
        db.session.delete(file)
        db.session.commit()
        
        return jsonify({'message': 'File deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка удаления файла: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/<int:file_id>/download', methods=['GET'])
@login_required
def download_file_duplicate(file_id):
    """Скачивание файла"""
    try:
        file = TaskFile.query.get_or_404(file_id)
        
        if not os.path.exists(file.file_path):
            return jsonify({'error': 'File not found'}), 404
            
        return send_file(file.file_path, as_attachment=True, download_name=file.original_filename)
        
    except Exception as e:
        print(f"Ошибка скачивания файла: {e}")
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
def upload_file_duplicate(task_id):
    """Загрузка файла для задачи"""
    pass  # Duplicate endpoint removed

@app.route('/api/tasks/<int:task_id>/files', methods=['GET'])
def get_task_files(task_id):
    """Получение файлов задачи"""
    try:
        task = Task.query.get_or_404(task_id)
        files = TaskFile.query.filter_by(task_id=task_id).all()
        return jsonify([file.to_dict() for file in files])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/upload', methods=['POST'])
@login_required
def upload_file_general():
    """Общая загрузка файлов"""
    try:
        print(f"Upload request from user: {current_user.username if current_user.is_authenticated else 'Not authenticated'}")
        print(f"Request files: {list(request.files.keys())}")
        print(f"Request form: {dict(request.form)}")
        
        if 'file' not in request.files:
            print("No file in request")
            return jsonify({'error': 'No file provided'}), 400
            
        file = request.files['file']
        if file.filename == '':
            print("Empty filename")
            return jsonify({'error': 'No file selected'}), 400
            
        task_id = request.form.get('taskId')
        file_type = request.form.get('type', 'attachment')
        description = request.form.get('description', '')
        
        print(f"Task ID: {task_id}, File type: {file_type}, Description: {description}")
        
        if not task_id:
            print("No task ID provided")
            return jsonify({'error': 'Task ID is required'}), 400
            
        task = Task.query.get_or_404(task_id)
        print(f"Found task: {task.title}")
        
        if file:
            print(f"Processing file: {file.filename}, size: {file.content_length}")
            # Создаем уникальное имя файла
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4()}_{filename}"
            file_path = os.path.join('uploads', unique_filename)
            
            print(f"Saving file to: {file_path}")
            
            # Создаем директорию если не существует
            os.makedirs('uploads', exist_ok=True)
            
            # Сохраняем файл
            file.save(file_path)
            print(f"File saved successfully, size: {os.path.getsize(file_path)}")
            
            # Создаем запись в базе данных
            task_file = TaskFile(
                task_id=task_id,
                filename=unique_filename,
                original_filename=filename,
                file_path=file_path,
                file_size=os.path.getsize(file_path),
                mime_type=file.content_type,
                file_type=file_type,
                description=description
            )
            
            print(f"Creating database record: {task_file.original_filename}")
            db.session.add(task_file)
            db.session.commit()
            print(f"File uploaded successfully: {task_file.id}")
            
            return jsonify(task_file.to_dict()), 201
        else:
            print("No file to process")
            return jsonify({'error': 'No file to process'}), 400
            
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка загрузки файла: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/files/<int:file_id>', methods=['DELETE'])
def delete_file_duplicate(file_id):
    """Удаление файла"""
    pass  # Duplicate endpoint removed

# Project API endpoints
@app.route('/api/projects', methods=['GET'])
@login_required
def get_projects():
    """Получение проектов с фильтрацией по ролям"""
    try:
        if current_user.role in ['admin', 'director']:
            # Админ и директор видят все проекты
            projects = Project.query.order_by(Project.created_at.desc()).all()
        else:
            # Менеджер и разработчик видят только свои проекты
            projects = Project.query.filter_by(owner_id=current_user.id).order_by(Project.created_at.desc()).all()
        
        return jsonify([project.to_dict() for project in projects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
@login_required
def get_users():
    """Получение всех пользователей"""
    try:
        users = User.query.all()
        return jsonify([{
            'id': user.id,
            'username': user.username,
            'fullName': user.full_name,
            'email': user.email,
            'role': user.role
        } for user in users])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/developers', methods=['GET'])
@login_required
def get_developers():
    """Получение всех разработчиков"""
    try:
        developers = User.query.filter_by(role='developer').all()
        return jsonify([{
            'id': user.id,
            'username': user.username,
            'fullName': user.full_name,
            'email': user.email
        } for user in developers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['GET'])
@login_required
def get_project(project_id):
    """Получение конкретного проекта"""
    try:
        project = Project.query.filter_by(id=project_id, owner_id=current_user.id).first()
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        return jsonify(project.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['POST'])
@login_required
def create_project():
    """Создание нового проекта"""
    try:
        data = request.get_json()
        
        project = Project(
            name=data.get('name'),
            description=data.get('description'),
            status=data.get('status', 'active'),
            owner_id=current_user.id
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify(project.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка создания проекта: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['PUT'])
@login_required
def update_project(project_id):
    """Обновление проекта"""
    try:
        data = request.get_json()
        project = Project.query.filter_by(id=project_id, owner_id=current_user.id).first()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        project.name = data.get('name', project.name)
        project.description = data.get('description', project.description)
        project.status = data.get('status', project.status)
        project.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(project.to_dict())
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка обновления проекта {project_id}: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<int:project_id>', methods=['DELETE'])
@login_required
def delete_project(project_id):
    """Удаление проекта"""
    try:
        project = Project.query.filter_by(id=project_id, owner_id=current_user.id).first()
        
        if not project:
            return jsonify({'error': 'Project not found'}), 404
        
        # Удаляем все задачи проекта
        for task in project.tasks:
            # Удаляем связанные файлы
            for file in task.files:
                try:
                    if os.path.exists(file.file_path):
                        os.remove(file.file_path)
                except Exception as e:
                    print(f"Ошибка удаления файла {file.file_path}: {e}")
        
        db.session.delete(project)
        db.session.commit()
        
        return jsonify({'message': 'Project deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"Ошибка удаления проекта {project_id}: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
