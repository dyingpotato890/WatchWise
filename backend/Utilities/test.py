from recommend import Recommend

print("\nHybrid Recommendations:")
recommended_shows = Recommend.hybrid_recommend(mood_input="fear, surprise", top_n = 20)

for catg in recommended_shows:
  movies = list(set(recommended_shows[catg]))
  for movie in movies:
    print(f"- {movie}")