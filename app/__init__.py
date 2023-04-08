from flask import Flask
from .api import api
from .pages import pages
from .login_manager import login_manager


def create():
    app = Flask(__name__, static_folder='../static',
                template_folder='../templates')
    app.templates_auto_reload = True
    with open('app/config/secret_key') as secret_key_file:
        app.secret_key = secret_key_file.read()

    app.register_blueprint(pages, url_prefix='/')
    app.register_blueprint(api, url_prefix='/api')
    login_manager.init_app(app)

    return app
