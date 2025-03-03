import pymongo

class Movies:
    def __init__(self):
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")
        self.db = self.client["WatchWise"]

    def fetch_movies(self, recommended_shows):
        movie_collection = self.db["moviesDB"]
        all_movies = []
        movie_data = []

        for category, movies in recommended_shows.items():
            if isinstance(movies, list):
                all_movies.extend(set(movies))

        for movie in all_movies:
            poster_path = movie_collection.find_one({"title": movie})["poster_path"]
            if poster_path == "Not Found":
                poster_path = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"
            movie_data.append({"title": movie, "poster": poster_path})

        return movie_data