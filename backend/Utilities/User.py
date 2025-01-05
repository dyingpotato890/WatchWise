from flask_login import UserMixin
import hashlib
from connector import Connector

class User(UserMixin):
    def __init__(self, id, password):
        self.id = id
        self.password = password

    @staticmethod
    def hashPassword(password: str) -> str:
        h = hashlib.new("sha256")
        h.update(bytes(password, 'utf-8'))
        return h.hexdigest()
    
    @staticmethod
    def get(user_id):
        conn = Connector()
        users = conn.db["users"]
        user_data = users.find_one({'user':id})
        if user_data:
            return User(user_data['username'], user_data['password'])
        return None
