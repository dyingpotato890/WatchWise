import pymongo
import os

class Movies:
    def __init__(self):
        self.client = pymongo.MongoClient(os.getenv("MONGO_CONN"))
        self.db = self.client["WatchWise"]
        
    def fetch_rating(self, user_id, show_id):
        users_collection = self.db['users']
        
        query = {
            "user_id": user_id,
            "watch_history.show_id": show_id
        }
        projection = {
            "_id": 0,
            "watch_history.$": 1  # Use `$` to retrieve only the matching element inside the array
        }
        user = users_collection.find_one(query, projection)
        
        if user and "watch_history" in user:
            return user["watch_history"][0].get("rating", None)
        
        return None
        
    def fetch_details(self, showsids, user_id):
        movie_collection = self.db["moviesDB"]
        watchList = []
        
        for showid in showsids:
            poster_path = movie_collection.find_one({"show_id": showid})["poster_path"]
            if poster_path == "Not Found":
                poster_path = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"

            title = movie_collection.find_one({"show_id": showid})["title"]
            genre = movie_collection.find_one({"show_id": showid})["listed_in"]
            
            rating = self.fetch_rating(show_id = showid, user_id = user_id)

            temp = {"show_id": showid,
                    "title": title,
                    "poster": poster_path,
                    "genre": genre,
                    "rating": rating}
            
            watchList.append(temp)
        
        print(watchList)

        return watchList

    def fetch_movies(self, recommended_shows, filterLanguages, filterGenres):
        movie_collection = self.db["moviesDB"]
        all_movies = []
        movie_data = []

        for category, movies in recommended_shows.items():
            if isinstance(movies, list):
                all_movies.extend(movies)

        processed_show_ids = set()
        
        filterLanguages = filterLanguages.split(", ")
        filterGenres = filterGenres.split(", ")
        
        for movie in all_movies:
            if movie["show_id"] in processed_show_ids:
                continue
                
            processed_show_ids.add(movie["show_id"])
            
            movie_doc = movie_collection.find_one({"show_id": movie["show_id"]})
            if not movie_doc:
                continue
                
            # Set default poster if not found
            poster_path = movie_doc["poster_path"]
            if poster_path == "Not Found":
                poster_path = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"

            temp = {
                "show_id": movie["show_id"],
                "title": movie["title"],
                "genre": movie_doc["listed_in"],
                "language": movie_doc["languages"],
                "description": movie_doc["description"],
                "poster": poster_path,
                "trailer": movie_doc["trailer_link"],
                "year": str(int(movie_doc["release_year"])),
                "duration": movie_doc["duration"],
                "source": movie_doc["source"]
            }
            
            langFlag = False
            genreFlag = False
            
            if filterLanguages != ['']:
                movie_languages = [lang.strip() for lang in temp['language'].split(', ')]
                
                for lang in filterLanguages:
                    if lang in movie_languages:
                        langFlag = True
                        break
            else:
                langFlag = True
                    
            if filterGenres != ['']:
                movie_genre = [lang.strip() for lang in temp['genre'].split(', ')]
                
                for gen in filterGenres:
                    if gen in movie_genre:
                        genreFlag = True
                        break
            else:
                genreFlag = True
                    
            if langFlag and genreFlag:
                movie_data.append(temp)
                
        print(movie_data)
        
        return movie_data
