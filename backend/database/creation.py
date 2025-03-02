import json
import bcrypt
import pymongo
import pandas as pd

def hashPassword(password):
    # Generate a salt
    salt = bcrypt.gensalt()
    
    # Hash the password with the salt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

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
                login_record["password"] = hashPassword(login_record["password"])
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

    # Inserting ratings data
    if "ratings" not in collections:
        df = pd.read_csv("backend/dataset/Netflix_Dataset_Rating.csv")
        data = df.to_dict(orient="records")
        db["ratings"].insert_many(data)
        print("Inserted Ratings Into Database")

    # Inserting movies data
    if "movies" not in collections:
        df_movies = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv", encoding='latin-1')
        data_movies = df_movies.to_dict(orient="records")
        db["moviesDB"].insert_many(data_movies)
        print("Inserted Movies Into Database")
        
    print("Data inserted successfully into MongoDB!")

else:
    print("Database and collections already exist. No action needed.")


"fcf16261e5da4c913baa070a33ee125bda503021da7ddc870d5f4b3a73e2a755"