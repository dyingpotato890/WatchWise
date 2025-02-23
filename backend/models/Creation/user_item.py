import pandas as pd
import joblib
from joblib import dump, load

# Load the ratings dataset
ratings_df = pd.read_csv("backend/dataset/Netflix_Dataset_Rating.csv")

# Ensure correct column names
ratings_df = ratings_df.rename(columns={"User_ID": "user_id", "show_id": "movie_id", "Rating": "rating"})

# Handle duplicate ratings by averaging them
ratings_df = ratings_df.groupby(["user_id", "movie_id"], as_index = False).mean()

# Create user-item matrix
user_item_matrix = ratings_df.pivot(index="user_id", columns="movie_id", values="rating").fillna(0)

# Save it with compression
dump(user_item_matrix, "backend/models/user_item_matrix.joblib", compress = 1)