import pandas as pd

from dict import movies
from dict import encoding
csv_file = "backend/dataset/netflix_mood_recommender_test.csv"
df = pd.read_csv(csv_file)
# def clean_titles(df, encoding, csv_file):
#     if 'title' in df.columns:
#         print("Original Titles: ", df["title"].head())  # Check original titles
#         df["title"] = df["title"].map(lambda x: encoding.get(x,None)).fillna(df["title"])
#         print("Mapped Titles: ", df["title"].head())  # Check mapped titles
#
#         df.to_csv(csv_file, index=False)
#         print("CSV file updated successfully!")
#     else:
#         print("Error: CSV file must contain 'title' column.")
#
# def clean_languages(df, movies, csv_file):
#     if "title" in df.columns and "languages" in df.columns:
#         print("Original Languages: ", df["languages"].head())  # Check original languages
#         df["languages"] = df["title"].map(movies).fillna(df["languages"]print)
#         print("Mapped Languages: ", df["languages"].head())  # Check mapped languages
#
#         df.to_csv(csv_file, index=False)
#         print("CSV file updated successfully!")
#     else:
#         print("Error: CSV file must contain 'Title' and 'Language' columns.")
#
#
# clean_titles(df, encoding, csv_file)
# clean_languages(df, movies, csv_file)
for index, row in df.iterrows():
    title = row['title']
    df.at[index, 'title'] = encoding.get(title,title)
    print(f"Updated title",title)

missing_langs = df[ (df['languages'].isna()) |
    (df['languages']=='not found')
] 
for index, row in missing_langs.iterrows():
    title = row['title']
    updatelang = movies.get(title,"not found")
    
    df.at[index,'language']=updatelang
    print("Update language of", title,"to",updatelang)

df.to_csv(csv_file,index=False)


