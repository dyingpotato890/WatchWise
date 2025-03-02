import pandas as pd
import json

with open("trailer_links.json", "r") as f:
    trailer_links = json.load(f)

df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv")
df['trailer_link'] = df['title'].map(trailer_links)

df.to_csv("backend/dataset/netflix_mood_recommender_test_updated.csv", index = False)
print("File Saved!")