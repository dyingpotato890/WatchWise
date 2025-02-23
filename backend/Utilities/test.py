from recommend import Recommend

# Test Hybrid Recommendations
print("\nHybrid Recommendations:")
hybrid_recommendations = Recommend.hybrid_recommend(mood_input="fear, surprise", top_n = 20)
print(hybrid_recommendations)