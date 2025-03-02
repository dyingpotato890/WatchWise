import pandas as pd
import requests
import time

# Load the CSV file
file_path = 'netflix_with_posters.csv'  # Replace with your file path
df = pd.read_csv(file_path)
apikeys = ['7d520892','ddb1fde0','6bbd9d0b','59f55250','d8596c61','caaa7186','32894225','827fcd19']
apikeys=apikeys[::-1]
count = 0
# Add a 'languages' column if it doesn't exist
if 'languages' not in df.columns:
    df['languages'] = None

# Filter titles without directors or languages
titles_to_fetch = df[
    (df['poster_path'].isna()) 
]
# OMDB API details
OMDB_API_KEY = apikeys[0]  # Replace with your OMDB API key
OMDB_URL = 'http://www.omdbapi.com/'

# Function to fetch data from OMDB
def fetch_data_from_omdb(title):
    try:
        params = {
            't': title,
            'apikey': OMDB_API_KEY
        }
        response = requests.get(OMDB_URL, params=params)
        data = response.json()

        # Check for API response
        if data.get('Response') == 'True':
            poster_link = data.get('Poster',None) 
            return poster_link
        elif data.get('Error') == 'Request limit reached!':
            print("OMDB API request limit reached. Stopping execution.")
            return 'limit_reached'
        else:
            print(f"OMDB API Error for title '{title}': {data.get('Error')}")
            return 'not found', 'not found'
    except Exception as e:
        print(f"Error fetching data for title '{title}': {e}")
        return 'not found', 'not found'

# Fetch data and update the DataFrame
for index, row in titles_to_fetch.iterrows():
    title = row['title']
    print(f"Fetching data for: {title}")
    poster_link= fetch_data_from_omdb(title)

    # Check if API limit is reached
    if poster_link == 'limit_reached': 
        if count < 8:
            count+=1
            OMDB_API_KEY = apikeys[count]  
            poster_link= fetch_data_from_omdb(title)
        else:
            break

    # Update the DataFrame
    df.at[index, 'poster_path'] = poster_link

    # Pause to avoid overwhelming the API
    # time.sleep(1)

# Save the updated DataFrame back to the CSV
df.to_csv(file_path, index=False)
print("CSV file updated successfully!")
