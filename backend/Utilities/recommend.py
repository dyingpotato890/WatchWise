import pymongo
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class Recommend():
    user_item_matrix = joblib.load('backend/models/user_item_matrix.joblib')
    tfidf_matrix = joblib.load('backend/models/tfidf_matrix.joblib')
    df = joblib.load('backend/models/movies_dataframe.joblib')
    tfidf_vectorizer = joblib.load('backend/models/tfidf_vectorizer.joblib')

    @staticmethod
    def get_user_cf_recommendations(user_id, top_n=20):
        if user_id not in Recommend.user_item_matrix.index:
            return []
        
        user_similarities = cosine_similarity(
            Recommend.user_item_matrix.loc[[user_id]], 
            Recommend.user_item_matrix
        ).flatten()

        similar_users = np.argsort(user_similarities)[::-1][1:top_n+1]
        recommendations = set()

        for similar_user in similar_users:
            movie_ids = Recommend.user_item_matrix.iloc[similar_user].nlargest(top_n).index.tolist()
            for movie_id in movie_ids:
                movie_name = Recommend.df.loc[
                    Recommend.df['show_id'] == movie_id, 'title'
                ].values
                if movie_name.size > 0:
                    recommendations.add(movie_name[0])
                else:
                    recommendations.add(str(movie_id))  # Use ID if title is missing

        return list(recommendations)[:top_n]

    @staticmethod
    def get_item_cf_recommendations(movie_id, top_n=10, mood_filter=True):
        if movie_id not in Recommend.df['show_id'].values:
            return []

        mood_dict = Recommend.df.set_index('show_id')['mood'].to_dict()
        movie_titles_dict = Recommend.df.set_index('show_id')['title'].to_dict()
        movie_mood = mood_dict.get(movie_id, None)

        try:
            movie_idx = Recommend.df.index[Recommend.df['show_id'] == movie_id][0]
            item_similarities = cosine_similarity(
                Recommend.tfidf_matrix[movie_idx], 
                Recommend.tfidf_matrix
            ).flatten()
        except IndexError:
            return []  # Movie ID not found in index

        similar_movies = np.argsort(item_similarities)[::-1][1:top_n+1]

        if mood_filter and movie_mood:
            filtered_movies = [
                Recommend.df.iloc[idx]['show_id'] for idx in similar_movies
                if 0 <= idx < len(Recommend.df) and mood_dict.get(Recommend.df.iloc[idx]['show_id']) == movie_mood
            ]
        else:
            filtered_movies = [
                Recommend.df.iloc[idx]['show_id'] for idx in similar_movies if 0 <= idx < len(Recommend.df)
            ]

        return [movie_titles_dict.get(mid, str(mid)) for mid in filtered_movies][:top_n]

    @staticmethod
    def get_mood_based_recommendations(df, tfidf_matrix, tfidf_vectorizer, user_mood, num_recommendations = 10):
        user_input_vector = tfidf_vectorizer.transform([user_mood])
        similarity_scores = cosine_similarity(user_input_vector, tfidf_matrix).flatten()
        
        # Add similarity column
        df["similarity"] = similarity_scores
        
        # Filter shows matching the mood (case insensitive)
        user_mood_lower = user_mood.lower()
        filtered_df = df[df["mood"].str.lower().str.contains(user_mood_lower, na=False)]
        
        # Sort by similarity and return top recommendations
        recommendations = filtered_df.sort_values(by="similarity", ascending=False).head(num_recommendations)
        
        if recommendations.empty:
            return f"No shows found for the mood '{user_mood}'."
        
        return recommendations["title"].tolist()

    @staticmethod
    def hybrid_recommend(user_id, mood_input, top_n=20, weights=(0.5, 0.25, 0.25)):
        recommendations = {
            "Mood-Based": Recommend.get_mood_based_recommendations(Recommend.df, Recommend.tfidf_matrix, Recommend.tfidf_vectorizer, mood_input, top_n),
            "User-Based": [],
            "Item-Based": []
        }

        # Get User-Based CF recommendations
        if user_id in Recommend.user_item_matrix.index:
            recommendations["User-Based"] = Recommend.get_user_cf_recommendations(user_id, top_n)
        
        # Get Item-Based CF recommendations
        if user_id in Recommend.user_item_matrix.index:
            user_ratings = Recommend.user_item_matrix.loc[user_id]
            highest_rated_movie_id = user_ratings.idxmax()
        else:
            highest_rated_movie_id = None

        if highest_rated_movie_id:
            recommendations["Item-Based"] = Recommend.get_item_cf_recommendations(highest_rated_movie_id, top_n)

        return recommendations