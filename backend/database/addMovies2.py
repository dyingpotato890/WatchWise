import pymongo
import pandas as pd

# MongoDB setup
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]
collection = db["moviesDB"]  # Collection name

# Load movie titles from dataset
df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv")

# Convert DataFrame to dictionary format and insert into MongoDB
data = df.to_dict(orient = "records")
collection.insert_many(data)

print("Data inserted successfully into MongoDB!")