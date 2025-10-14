import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://taskmanager:taskmanager123@localhost:5435/taskmanager'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Flask-Admin settings
    FLASK_ADMIN_SWATCH = 'cerulean'
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
