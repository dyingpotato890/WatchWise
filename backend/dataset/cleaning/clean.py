import pandas as pd

# File paths
mood_recommender_path = "/mnt/data/netflix_mood_recommender_test.csv"
movies_path = "/mnt/data/Netflix_Dataset_Movie.csv"
ratings_path = "/mnt/data/Netflix_Dataset_Rating.csv"

# Load the datasets
mood_recommender_df = pd.read_csv(mood_recommender_path)
movies_df = pd.read_csv(movies_path)
ratings_df = pd.read_csv(ratings_path)

# Create a mapping from title to show_id from mood_recommender_df
title_to_show_id = dict(zip(mood_recommender_df["title"], mood_recommender_df["show_id"]))

# Map show_id to movies_df based on the title
movies_df["show_id"] = movies_df["Name"].map(title_to_show_id)

# Drop rows where there was no match (to keep only relevant movies)
movies_df = movies_df.dropna(subset=["show_id"])

# Convert show_id to string for consistency
movies_df["show_id"] = movies_df["show_id"].astype(str)

# Create a mapping from original Movie_ID to new show_id
movie_id_to_show_id = dict(zip(movies_df["Movie_ID"], movies_df["show_id"]))

# Replace Movie_ID in ratings_df with show_id
ratings_df["show_id"] = ratings_df["Movie_ID"].map(movie_id_to_show_id)

# Drop rows with no matching show_id
ratings_df = ratings_df.dropna(subset=["show_id"])

# Convert show_id to string and drop the old Movie_ID column
ratings_df["show_id"] = ratings_df["show_id"].astype(str)
ratings_df = ratings_df.drop(columns=["Movie_ID"])

# Save the updated files
updated_movies_path = "/mnt/data/Updated_Netflix_Dataset_Movie.csv"
updated_ratings_path = "/mnt/data/Updated_Netflix_Dataset_Rating.csv"

movies_df.to_csv(updated_movies_path, index=False)
ratings_df.to_csv(updated_ratings_path, index=False)

updated_movies_path, updated_ratings_path