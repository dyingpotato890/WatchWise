import pandas as pd

from dict import movies
from dict import encoding

csv_file = "backend/dataset/netflix_mood_recommender_test.csv"
df = pd.read_csv(csv_file)

def clean_titles(df, encoding, csv_file):
    if 'title' in df.columns:
        print("Original Titles: ", df["title"].head())  # Check original titles
        df["title"] = df["title"].map(encoding).fillna(df["title"])
        print("Mapped Titles: ", df["title"].head())  # Check mapped titles

        df.to_csv(csv_file, index=False)
        print("CSV file updated successfully!")
    else:
        print("Error: CSV file must contain 'title' column.")

def clean_languages(df, movies, csv_file):
    if "title" in df.columns and "languages" in df.columns:
        print("Original Languages: ", df["languages"].head())  # Check original languages
        df["languages"] = df["title"].map(movies).fillna(df["languages"])
        print("Mapped Languages: ", df["languages"].head())  # Check mapped languages

        df.to_csv(csv_file, index=False)
        print("CSV file updated successfully!")
    else:
        print("Error: CSV file must contain 'Title' and 'Language' columns.")


clean_titles(df, encoding, csv_file)
clean_languages(df, movies, csv_file)