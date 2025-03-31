
import pandas as pd

def update_mood(file1, output_file):
    # Load CSV file into DataFrame
    df = pd.read_csv(file1,encoding='latin-1')
    
    # Function to sort moods alphabetically
    def sort_moods(mood):
        if pd.isna(mood):
            return mood
        moods = mood.split(', ')
        return ', '.join(sorted(moods))
    
    # Apply sorting to the mood column
    df['mood'] = df['mood'].apply(sort_moods)
    
    # Save the updated DataFrame to a new CSV file
    df.to_csv(output_file, index=False)
    
    print(f"Updated CSV saved as {output_file}")

# Example usage
update_mood('netflix_mood_recommender_test.csv', 'netflix_mood_recommender_test1.csv')
