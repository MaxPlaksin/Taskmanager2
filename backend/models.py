from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

# Промежуточная таблица для связи многие-ко-многим между задачами и исполнителями
task_assignees = db.Table('task_assignees',
    db.Column('task_id', db.Integer, db.ForeignKey('tasks.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='developer')  # admin, manager, developer
    full_name = db.Column(db.String(120), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    avatar_path = db.Column(db.String(500))  # Путь к аватару
    
    # Связь с задачами
    assigned_tasks = db.relationship('Task', backref='assignee', lazy=True, foreign_keys='Task.assignee_id')
    created_tasks = db.relationship('Task', backref='creator', lazy=True, foreign_keys='Task.created_by')
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'fullName': self.full_name,
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat(),
            'lastLogin': self.last_login.isoformat() if self.last_login else None,
            'avatarPath': self.avatar_path
        }
    
    def has_role(self, role):
        """Проверяет, есть ли у пользователя определенная роль"""
        return self.role == role
    
    def is_admin(self):
        """Проверяет, является ли пользователь администратором"""
        return self.role == 'admin'
    
    def is_manager(self):
        """Проверяет, является ли пользователь менеджером"""
        return self.role == 'manager'
    
    def is_developer(self):
        """Проверяет, является ли пользователь разработчиком"""
        return self.role == 'developer'
    
    def is_director(self):
        """Проверяет, является ли пользователь директором"""
        return self.role == 'director'
    
    def can_view_analytics(self):
        """Проверяет, может ли пользователь просматривать аналитику"""
        return self.is_admin() or self.is_director()
    
    def __repr__(self):
        return f'<User {self.username}>'

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')
    priority = db.Column(db.String(20), default='medium')
    progress = db.Column(db.String(20), default='not_started')  # not_started, in_progress, testing, completed
    start_date = db.Column(db.DateTime)
    due_date = db.Column(db.DateTime)
    git_repository = db.Column(db.String(500))
    server_ip = db.Column(db.String(100))  # IP адрес сервера
    server_password = db.Column(db.String(200))  # Пароль для SSH
    ssh_key = db.Column(db.Text)
    technical_spec = db.Column(db.Text)
    estimated_hours = db.Column(db.Float)  # Оценка времени в часах
    actual_hours = db.Column(db.Float, default=0)  # Фактическое время в часах
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи с пользователями
    assignee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Связь с проектом
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    project = db.relationship('Project', backref=db.backref('tasks', lazy=True))
    
    # Связь многие-ко-многим с исполнителями
    assignees = db.relationship('User', secondary=task_assignees, backref=db.backref('tasks_as_assignee', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'progress': self.progress,
            'startDate': self.start_date.isoformat() if self.start_date else None,
            'dueDate': self.due_date.isoformat() if self.due_date else None,
            'gitRepository': self.git_repository,
            'serverIp': self.server_ip,
            'serverPassword': self.server_password,
            'sshKey': self.ssh_key,
            'technicalSpec': self.technical_spec,
            'estimatedHours': self.estimated_hours,
            'actualHours': self.actual_hours,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
            'assigneeId': self.assignee_id,
            'assigneeName': self.assignee.full_name if self.assignee else None,
            'assignees': [{'id': user.id, 'fullName': user.full_name, 'username': user.username} for user in self.assignees],
            'createdBy': self.created_by,
            'creatorName': self.creator.full_name if self.creator else None,
            'projectId': self.project_id,
            'projectName': self.project.name if self.project else None,
            'files': [file.to_dict() for file in self.files if file.file_type == 'attachment'],
            'screenshots': [file.to_dict() for file in self.files if file.file_type == 'screenshot']
        }
    
    def __repr__(self):
        return f'<Task {self.title}>'

class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')  # active, completed, archived
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Связи с пользователями
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('owned_projects', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
            'ownerId': self.owner_id,
            'ownerName': self.owner.full_name if self.owner else None
        }
    
    def __repr__(self):
        return f'<Project {self.name}>'

class TaskFile(db.Model):
    __tablename__ = 'task_files'
    
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)
    mime_type = db.Column(db.String(100))
    file_type = db.Column(db.String(50), default='attachment')  # attachment, screenshot
    description = db.Column(db.Text)  # Описание для скриншотов
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    task = db.relationship('Task', backref=db.backref('files', lazy=True, cascade="all, delete-orphan"))
    
    def to_dict(self):
        return {
            'id': self.id,
            'taskId': self.task_id,
            'filename': self.filename,
            'originalFilename': self.original_filename,
            'fileSize': self.file_size,
            'mimeType': self.mime_type,
            'fileType': self.file_type,
            'description': self.description,
            'uploadedAt': self.uploaded_at.isoformat()
        }
    
    def __repr__(self):
        return f'<TaskFile {self.original_filename}>'
