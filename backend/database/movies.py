# # show_id title description mood language

# import pandas as pd
# import pymongo

# client = pymongo.MongoClient("mongodb://localhost:27017/")
# db = client["WatchWise"]

# df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv")
# df = df['show_id', 'title', 'description', 'mood', 'language']

# for i in df:


import pandas as pd

df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv")

df.value_counts('languages')
