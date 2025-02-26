import pandas as pd
import pandas as pd
import requests
from tqdm import tqdm

def handleMissing():
    # Load dataset
    file_path = "netflix_with_posters.csv"
    df = pd.read_csv(file_path)

    # OMDb API Key (replace with your own key)
    OMDB_API_KEY = "59f55250"
    OMDB_URL = "http://www.omdbapi.com/"

    # Function to fetch poster from OMDb
    def fetch_poster(imdb_id, title):
        params = {"apikey": OMDB_API_KEY}
        
        # Use IMDb ID if available, otherwise use Title
        if pd.notna(imdb_id):
            params["i"] = imdb_id
        elif pd.notna(title):
            params["t"] = title
        else:
            return ""  # No valid search query

        response = requests.get(OMDB_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            return data.get("Poster", "")  # Return poster URL or empty string
        return ""

    # Find missing posters and update them
    for i in tqdm(range(len(df))):
        if pd.isna(df.loc[i, "poster_path"]) or df.loc[i, "poster_path"] == "":
            imdb_id = df.loc[i, "imdb_id"] if "imdb_id" in df.columns else None
            title = df.loc[i, "title"]
            df.loc[i, "poster_path"] = fetch_poster(imdb_id, title)

    # Save updated file
    output_path = "netflix_with_updated_posters.csv"
    df.to_csv(output_path, index=False)

    print(f"Updated file saved as {output_path}")

def createPoster():
    netflix_df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv")
    tmdb_df = pd.read_csv("C:/Users/niran/Downloads/archive (4)/TMDB_all_movies.csv", usecols=["title", "poster_path"])

    # Normalize titles for matching
    netflix_df["title_lower"] = netflix_df["title"].str.strip().str.lower()
    tmdb_df["title_lower"] = tmdb_df["title"].str.strip().str.lower()

    # Remove duplicates from TMDB to ensure only one match per title
    tmdb_df = tmdb_df.drop_duplicates(subset=["title_lower"], keep="first")

    # Map title_lower to poster_path
    title_to_poster = dict(zip(tmdb_df["title_lower"], tmdb_df["poster_path"]))

    # Add poster_path column to Netflix dataset (fill with blank if no match)
    base_url = "https://image.tmdb.org/t/p/w500/"
    netflix_df["poster_path"] = netflix_df["title_lower"].map(title_to_poster).apply(lambda x: base_url + x if pd.notna(x) else "")

    # Drop the helper column
    netflix_df.drop(columns=["title_lower"], inplace=True)

    netflix_df.to_csv("netflix_with_posters.csv", index=False)
    print("Updated file saved as netflix_with_posters.csv")

handleMissing()