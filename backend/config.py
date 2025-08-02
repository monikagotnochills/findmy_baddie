import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Omnidim Integration
    OMNIDIM_API_KEY = os.environ.get('OMNIDIM_API_KEY')
    OMNIDIM_WEBHOOK_SECRET = os.environ.get('OMNIDIM_WEBHOOK_SECRET')
    OMNIDIM_BASE_URL = os.environ.get('OMNIDIM_BASE_URL') or 'https://api.omnidim.io'

    # Application Settings
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    HOST = os.environ.get('HOST') or '127.0.0.1'
    PORT = int(os.environ.get('PORT') or 8000)

    # Matching Algorithm Settings
    DEFAULT_COMPATIBILITY_THRESHOLD = float(os.environ.get('DEFAULT_COMPATIBILITY_THRESHOLD') or 65.0)
    MAX_MATCH_CANDIDATES = int(os.environ.get('MAX_MATCH_CANDIDATES') or 10)

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
