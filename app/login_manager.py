from flask_login import LoginManager
from . import database

login_manager = LoginManager()


@login_manager.user_loader
def load_user(id):
    return database.get_user(id)
