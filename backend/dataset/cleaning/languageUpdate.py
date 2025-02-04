import pandas as pd

from dict import movies
from dict import encoding

csv_file = "backend/dataset/netflix_mood_recommender_test.csv"
df = pd.read_csv(csv_file)

def clean_languages(df, movies, csv_file):
    if "title" in df.columns and "languages" in df.columns:
        df["languages"] = df["title"].map(movies).fillna(df["languages"])

        df.to_csv(csv_file, index = False)
        print("CSV file updated successfully!")
    else:
        print("Error: CSV file must contain 'Title' and 'Language' columns.")

def clean_titles(df, encoding, csv_file):
    if 'title' in df.columns:
        df["title"] = df["title"].map(encoding).fillna(df["title"])

        df.to_csv(csv_file, index=False)
        print("CSV file updated successfully!")
    else:
        print("Error: CSV file must contain 'title' column.")

clean_languages(df, movies, csv_file)
#clean_titles(df, encoding, csv_file)