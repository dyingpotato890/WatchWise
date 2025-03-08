# from transformers import AutoTokenizer
# from transformers import AutoModelForSequenceClassification

# import warnings
# warnings.simplefilter("ignore", category=FutureWarning)

# def moodIdentifier(text):
#     encoded_text = tokenizer(text, return_tensors="pt")
#     output = model(**encoded_text)
#     scores = output[0][0].detach().numpy()

#     sc_label = {"anger": scores[0],
#                 "disgust" : scores[1],
#                 "fear": scores[2],
#                 "joy": scores[3],
#                 "neutral": scores[4],
#                 "sadness": scores[5],
#                 "surprise": scores[6]
#     }
#     sorted_scores = sorted(sc_label.items(), key= lambda item: item[1], reverse=True)

#     top_moods = []
#     for mood, score in sorted_scores:
#         if mood != "neutral":
#           top_moods.append(mood)
#           break

#     return top_moods

# MODEL = f"j-hartmann/emotion-english-distilroberta-base"
# tokenizer = AutoTokenizer.from_pretrained(MODEL)
# model = AutoModelForSequenceClassification.from_pretrained(MODEL)

# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# import torch

# model_name = "j-hartmann/emotion-english-distilroberta-base"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSequenceClassification.from_pretrained(model_name)

# input_question = input("Enter The Mood You Want To Watch: ")
# predicted_emotion = moodIdentifier(input_question)
# predicted_emotion = ", ".join(predicted_emotion)

from recommend import Recommend

predicted_emotion = input("Enter A Mood: ")
print(f"Predicted Mood: {predicted_emotion}")

recommended_shows = Recommend.hybrid_recommend(user_id = 2473170, mood_input = predicted_emotion, top_n = 20) #"fear, surprise"
print(recommended_shows)

print("\nHybrid Recommendations:")
for catg in recommended_shows:
  movies = {}
  for movie in recommended_shows[catg]:
    movies[movie["show_id"]] = movie

  movies = movies.values()

  for movie in movies:
    print(f"- {movie}")