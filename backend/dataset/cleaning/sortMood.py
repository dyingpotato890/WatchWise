import pandas as pd

df = pd.read_csv("netflix_mood_with_predictions.csv")

df['mood'] = df['mood'].apply(lambda x: ", ".join(sorted(x.split(", "))))

df.to_csv("new.csv", index = False)