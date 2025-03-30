import pandas as pd

df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv", encoding = "latin-1")

counter = 1
for i in range(len(df)):
    if pd.isna(df.loc[i, 'show_id']) or df.loc[i, 'show_id'] == "":
        df.loc[i, 'show_id'] = f's{counter}'
        counter += 1
        
df.to_csv("temp.csv", index = False)
print("Show ID Added!")