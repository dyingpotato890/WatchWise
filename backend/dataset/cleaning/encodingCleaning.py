with open("backend/dataset/netflix_mood_recommender_test.csv", "r", encoding = "ISO-8859-1") as inf:
    content = inf.read()

with open("backend/dataset/netflix_mood_recommender_test_ENCODING.csv", "w", encoding = "utf-8") as of:
    of.write(content)

print("File successfully converted to UTF-8")