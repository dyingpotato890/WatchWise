import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]
users_collection = db["users"]
login_collection = db["login"]

class Profile:
    @staticmethod
    def fetchUserInfo(user_id):
        try:
            user_data = users_collection.find_one({ "user_id": str(user_id) },
                                              { "created_at": 1, "bio": 1, "name": 1, "avatar": 1, "_id": 0 })

            # Fetch email from the 'login' collection
            login_data = login_collection.find_one({ "user_id": str(user_id) },
                                               { "email": 1, "_id": 0 })

            # Apply default values if user data is missing
            if not user_data:
                user_data = {
                    "name": "Unknown User",
                    "avatar": "https://i.pravatar.cc/150?img=1",
                    "bio": "No bio available",
                    "created_at": None
                }

            # Apply default email if not found
            email = login_data["email"] if login_data else "No email provided"

            # Combine and return the final response
            user_data["email"] = email
            
            print("User Data: ", user_data)
            
            return {"status": "success", "data": user_data}

        except Exception as e:
            return {"status": "error", "message": str(e)}
