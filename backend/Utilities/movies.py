import pymongo

class Movies:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")
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
            
            rating = self.fetch_rating(show_id = showid, user_id = user_id)

            temp = {"show_id": showid,
                    "title": title,
                    "poster": poster_path,
                    "rating": rating}
            
            watchList.append(temp)
        
        print(watchList)

        return watchList
        
    def filter_movies(self, movie, lanaguage, genre):
        if lanaguage != "None":
            if lanaguage.lower() not in movie['language'].lower():
                return False
        
        if genre != "None":
            if genre.lower() not in movie['genre'].lower():
                return False
            
        return True

    def fetch_movies(self, recommended_shows, filterLanguage, filterGenre):
        movie_collection = self.db["moviesDB"]
        all_movies = []
        movie_data = []

        for category, movies in recommended_shows.items():
            if isinstance(movies, list):
                all_movies.extend(movies)

        for movie in all_movies:
            poster_path = movie_collection.find_one({"show_id": movie["show_id"]})["poster_path"]
            if poster_path == "Not Found":
                poster_path = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"

            trailer_link = movie_collection.find_one({"show_id": movie["show_id"]})["trailer_link"]
            
            show_id = movie["show_id"]

            language = movie_collection.find_one({"show_id": movie["show_id"]})["languages"]
            description = movie_collection.find_one({"show_id": movie["show_id"]})["description"]
            genre = movie_collection.find_one({"show_id": movie["show_id"]})["listed_in"]
            year = movie_collection.find_one({"show_id": movie["show_id"]})["release_year"]
            duration = movie_collection.find_one({"show_id": movie["show_id"]})["duration"]
            
            temp = {"show_id": show_id,
                    "title": movie["title"],
                    "genre" : genre, 
                    "language" : language, 
                    "description" : description, 
                    "poster": poster_path, 
                    "trailer" : trailer_link,
                    "year" : str(int(year)),
                    "duration" : duration}
            
            if self.filter_movies(movie = temp, lanaguage = filterLanguage, genre = filterGenre):
                movie_data.append(temp)
        
        print(movie_data)

        return movie_data