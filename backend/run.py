import os
from app import create_app

config_name = os.getenv('FLASK_CONFIG') or 'default'
app = create_app(config_name)

if __name__ == '__main__':
    host = app.config.get('HOST', '127.0.0.1')
    port = app.config.get('PORT', 8000)
    debug = app.config.get('DEBUG', True)

    app.run(host=host, port=port, debug=debug)
