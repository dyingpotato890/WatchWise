import pymongo
import requests
import itertools
import time
import pandas as pd
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# MongoDB setup
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]

# Load movie titles from dataset
df = pd.read_csv("backend/dataset/netflix_mood_recommender_test.csv")
MOVIE_TITLES = df['title'].tolist()

# Check if the collection exists
collections = db.list_collection_names()
if "movies" not in collections:
    print("Creating 'movies' collection...")
    movies_collection = db["movies"]
else:
    movies_collection = db["movies"]
    print("'movies' collection already exists.")

# OMDB API setup
API_KEYS = ['7d520892', 'ddb1fde0', '6bbd9d0b', '59f55250', 'd8596c61', 'caaa7186', '32894225', '827fcd19']
BASE_URL = "http://www.omdbapi.com/"
api_key_cycle = itertools.cycle(API_KEYS)  # Rotate API keys automatically

# Configure request retries
session = requests.Session()
retries = Retry(total=5, backoff_factor=2, status_forcelist=[500, 502, 503, 504])
session.mount("http://", HTTPAdapter(max_retries=5))

movies_data = []
failed_requests = []  # Store failed requests for retrying later

for title in MOVIE_TITLES:
    # Skip if movie already exists in the database
    if movies_collection.find_one({"Title": title}):
        print(f"{title} already exists in database, skipping...")
        continue

    api_key = next(api_key_cycle)  # Get next API key
    params = {"t": title, "apikey": api_key}

    try:
        response = session.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()  # Raise exception for HTTP errors

        movie_info = response.json()
        if movie_info.get("Response") == "True":
            movies_data.append(movie_info)
            print(f"Added: {title}")
        else:
            print(f"Movie not found: {title}")
            failed_requests.append(title)

    except requests.exceptions.RequestException as e:
        print(f"Request failed for {title}: {e}")
        failed_requests.append(title)

    time.sleep(1)  # Slight delay to avoid hitting rate limits

# Insert fetched data into MongoDB
if movies_data:
    movies_collection.insert_many(movies_data)
    print(f"Inserted {len(movies_data)} movies into the database.")
else:
    print("No valid movie data to insert.")

# Retry failed requests after waiting for API limit reset
if failed_requests:
    print(f"Retrying {len(failed_requests)} failed requests after a delay...")
    time.sleep(60)  # Wait before retrying

    for title in failed_requests:
        api_key = next(api_key_cycle)
        params = {"t": title, "apikey": api_key}

        try:
            response = session.get(BASE_URL, params=params, timeout=10)
            response.raise_for_status()

            movie_info = response.json()
            if movie_info.get("Response") == "True":
                movies_collection.insert_one(movie_info)
                print(f"Retried and added: {title}")
            else:
                print(f"Still not found: {title}")

        except requests.exceptions.RequestException as e:
            print(f"Retry failed for {title}: {e}")

print("Data fetching complete!")