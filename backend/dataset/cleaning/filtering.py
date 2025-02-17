import pandas as pd

def clean_dataset():
    netflix_mood_df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv")
    netflix_dataset_df = pd.read_csv("backend/dataset/Netflix_Dataset_Movie.csv")

    # Filter Netflix_Dataset_Movie.csv to keep only movies present in netflix_mood_recommender_test.csv
    filtered_netflix_dataset = netflix_dataset_df[netflix_dataset_df['Name'].isin(netflix_mood_df['title'])]

    filtered_netflix_dataset.to_csv("Netflix_Dataset_Movie_Filtered.csv", index = False)
    print("Done.")

def clean_ratings():
    netflix_rating_df = pd.read_csv("backend/dataset/Netflix_Dataset_Rating.csv")
    netflix_dataset_df = pd.read_csv("backend/dataset/Netflix_Dataset_Movie.csv")

    filtered_netflix_ratings = netflix_rating_df[netflix_rating_df['Movie_ID'].isin(netflix_dataset_df['Movie_ID'])]

    filtered_netflix_ratings.to_csv("backend/dataset/Netflix_Dataset_Rating_Cleaned.csv", index=False)
    print("Done.")

def get_stats():
    netflix_rating_df = pd.read_csv("backend/dataset/Netflix_Dataset_Rating.csv")
    netflix_rating_cleaned_df = pd.read_csv("backend/dataset/Netflix_Rating_Movie_Cleaned.csv")
    print(f"Original: {len(netflix_rating_df)}")
    print(f"Cleaned: {len(netflix_rating_cleaned_df)}")

clean_ratings()