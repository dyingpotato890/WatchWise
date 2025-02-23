import datetime
import random

import bcrypt
import pymongo
from flask_login import UserMixin

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]

users_collection = db["users"] # For user_id generation

class User(UserMixin):
    def __init__(self, user_id, password):
        self.id = user_id  # Flask-Login requires .id
        self.password = password

    @staticmethod
    def hashPassword(password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed_password

    @staticmethod
    def get(email):
        login_collection = db["login"]
        user_data = login_collection.find_one({"email": email})

        if user_data:
            return User(user_data["user_id"], user_data["password"])
        return None

    def verify_password(self, enteredPassword):
        if isinstance(self.password, str):
            stored_hash = self.password.encode("utf-8")
        else:
            stored_hash = self.password

        if bcrypt.checkpw(enteredPassword.encode("utf-8"), stored_hash):
            print("Password matches!")
            return True
        else:
            print("Incorrect password!")
            return False
    
    @staticmethod
    def is_user_id_exists(user_id):
        return users_collection.find_one({"user_id": user_id}) is not None

    @staticmethod
    def generate_user_id():
        while True:
            new_id = str(random.randint(100000, 2999999))
            if not User.is_user_id_exists(new_id):  # Check uniqueness in MongoDB
                return new_id

    @staticmethod
    def register_user(email, password, name):
        user_id = User.generate_user_id()
        hashed_pwd = User.hashPassword(password)
        login_collection = db["login"]
        user_collection = db["users"]
        login_data = {"user_id": user_id,
                      "password": hashed_pwd,
                      "email": email}

        current_time = datetime.datetime.now()
        isotime = current_time.isoformat()
        user_data = {
            "user_id": user_id,
            "name": name,
            "created_at": isotime,
            "watch_history": [],
        }
        try:
            login_collection.insert_one(login_data)
            user_collection.insert_one(user_data)
            return True
        except:
            print("Error occurred in insertion")
            return False