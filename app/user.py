from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.name = username

    def get_id(self):
        return str(self.id)
