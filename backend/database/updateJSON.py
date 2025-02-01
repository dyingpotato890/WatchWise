import json
import hashlib
import pymongo      

# Function to hash passwords
def hashPassword(password: str) -> str:
    h = hashlib.new("sha256")
    h.update(bytes(password, 'utf-8'))
    return h.hexdigest()

# Connect to the database
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]

collections = db.list_collection_names()
if "login" not in collections or "users" not in collections:
    with open("backend/database/login.json", "r") as login_file:
        login_data = json.load(login_file)["login"]

    with open("backend/database/users.json", "r") as users_file:
        users_data = json.load(users_file)["users"]

    if "login" not in collections:
        for login_record in login_data:
            if db["login"].count_documents({"user_id": login_record["user_id"]}) == 0:
                login_record["password_hash"] = hashPassword(login_record["password"])
                del login_record["password"]
                db["login"].insert_one(login_record)
                print(f"Inserted login record for user_id: {login_record['user_id']}")
            else:
                print(f"Login record for user_id: {login_record['user_id']} already exists. Skipping insertion.")

    if "users" not in collections:
        for user_record in users_data:
            if db["users"].count_documents({"user_id": user_record["user_id"]}) == 0:
                db["users"].insert_one(user_record)
                print(f"Inserted user record for user_id: {user_record['user_id']}")
            else:
                print(f"User record for user_id: {user_record['user_id']} already exists. Skipping insertion.")

else:
    print("Database and collections already exist. No action needed.")
