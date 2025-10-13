from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='active')
    priority = db.Column(db.String(20), default='medium')
    due_date = db.Column(db.DateTime)
    git_repository = db.Column(db.String(500))
    server_access = db.Column(db.String(500))
    password = db.Column(db.String(200))
    ssh_key = db.Column(db.Text)
    technical_spec = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'dueDate': self.due_date.isoformat() if self.due_date else None,
            'gitRepository': self.git_repository,
            'serverAccess': self.server_access,
            'password': self.password,
            'sshKey': self.ssh_key,
            'technicalSpec': self.technical_spec,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat()
        }
    
    def __repr__(self):
        return f'<Task {self.title}>'

class TaskFile(db.Model):
    __tablename__ = 'task_files'
    
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)
    mime_type = db.Column(db.String(100))
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    task = db.relationship('Task', backref=db.backref('files', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'taskId': self.task_id,
            'filename': self.filename,
            'originalFilename': self.original_filename,
            'fileSize': self.file_size,
            'mimeType': self.mime_type,
            'uploadedAt': self.uploaded_at.isoformat()
        }
    
    def __repr__(self):
        return f'<TaskFile {self.original_filename}>'
