from flask_login import UserMixin
import uuid
import time
import hashlib
import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]

class User(UserMixin):
    def __init__(self, user_id, password_hash):
        self.id = user_id  # Flask-Login requires .id
        self.password_hash = password_hash

    @staticmethod
    def hashPassword(password: str) -> str:
        h = hashlib.new("sha256")
        h.update(bytes(password, 'utf-8'))
        return h.hexdigest()

    @staticmethod
    def get(username):
        login_collection = db['login']
        user_data = login_collection.find_one({'username': username})

        if user_data:
            return User(user_data['user_id'], user_data['password_hash'])
        return None  

    def verify_password(self, username, enteredPassword):
        login = db['login']
        dbPass = login.find_one({'username': username})

        if dbPass == self.hashPassword(enteredPassword):
            return True
        
        return False

    @staticmethod
    def generate_user_id():
        timestamp = int(time.time())
        unique_id = uuid.uuid4().hex[:6]
        return f"{timestamp}_{unique_id}"