import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]

collections = db.list_collection_names()
if "login" not in collections or "users" not in collections:
    print("hi")