from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from config import config
from flask_cors import CORS

db = SQLAlchemy()
ma = Marshmallow()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    CORS(app)

    # Initialize extensions
    db.init_app(app)
    ma.init_app(app)

    # Register blueprints
    from app.routes.users import users_bp
    from app.routes.rooms import rooms_bp
    from app.routes.matching import matching_bp
    from app.routes.admin import admin_bp
    from app.routes.omnidim import omnidim_bp

    app.register_blueprint(users_bp, url_prefix='/api/v1/users')
    app.register_blueprint(rooms_bp, url_prefix='/api/v1/rooms')
    app.register_blueprint(matching_bp, url_prefix='/api/v1/matching')
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')
    app.register_blueprint(omnidim_bp, url_prefix='/api/v1/omnidim')

    # Create database tables
    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return {'message': 'AI-Powered Roommate Matching Backend is running'}

    return app
