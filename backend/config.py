import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MySQL Database
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_NAME = os.getenv('DB_NAME', 'aetherlearn')
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
    JWT_EXPIRATION_HOURS = 24
    
    # Flask
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
