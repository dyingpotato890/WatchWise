
import google.generativeai as genai
import pandas as pd
import json
import time
import signal
import sys
import os
from dotenv import load_dotenv

load_dotenv()

api_keys = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3"),
    os.getenv("GEMINI_API_KEY_4"),
    os.getenv("GEMINI_API_KEY_5"),
    os.getenv("GEMINI_API_KEY_6"),
    os.getenv("GEMINI_API_KEY_7"),
    os.getenv("GEMINI_API_KEY_8"),
    os.getenv("GEMINI_API_KEY_9"),
    os.getenv("GEMINI_API_KEY_10"),
    os.getenv("GEMINI_API_KEY_11"),
    os.getenv("GEMINI_API_KEY_12")

]
used_keys = []  # Stores exhausted API keys to retry later


def switch_api_key():
    global current_api_key

    if api_keys:
        current_api_key = api_keys.pop(0)  # Use the first key
        genai.configure(api_key=current_api_key)
        print(f"🔄 Switched to API key: {current_api_key[:10]}******")
    elif used_keys:
        print("🔄 Retrying used API keys...")
        api_keys.extend(used_keys)  # Move used keys back to available list
        used_keys.clear()
        switch_api_key()
    else:
        print("❌ No API keys left! Exiting...")
        save_progress()
        exit()


switch_api_key()

file_path = "./backend/dataset/netflix_mood_recommender_test.csv"
df = pd.read_csv(file_path, encoding='latin-1')

# Filter rows where the source is 'Disney+' or 'Amazon Prime'
df_filtered = df[df["source"].isin(["Disney+", "Amazon Prime"]) & df["mood"].isna()].copy()
model = genai.GenerativeModel("gemini-1.5-flash")


def save_progress():
    df.to_csv(file_path, index=False)
    print(f"💾 Progress saved to '{file_path}")


def handle_interrupt(signal, frame):
    print("\n🚨 Keyboard Interrupt detected! Saving progress...")
    save_progress()
    sys.exit(0)


signal.signal(signal.SIGINT, handle_interrupt)


def get_moods_from_descriptions(descriptions):
    prompt = f"""
    Analyze the given movie descriptions and determine 2 of the most appropriate moods for each one from the following list:
    [relaxed, curious, tense, excited, lonely, scared, annoyed, anger, disgust, fear, joy, sadness, romantic, surprise].

    Your response **must** be a valid JSON object with movie indices as keys and their corresponding moods as values.

    Example format:
    {{
        "0": "joy, romantic",
        "1": "romantic, surprise",
        "2": "fear, disgust"
    }}

    Here are the descriptions:
    {json.dumps(descriptions, indent=2)}
    """
    try:
        response = model.generate_content(prompt)

        print("Raw API Response:", response.text)

        if hasattr(response, "text") and response.text.strip():
            json_text = response.text.strip()
            json_start = json_text.find("{")
            json_end = json_text.rfind("}")
            if json_start != -1 and json_end != -1:
                json_text = json_text[json_start: json_end + 1]
            return json.loads(json_text)
    except Exception as e:
        error_message = str(e).lower()
        print("⚠️ API Error:", e)

        if "quota" in error_message or "rate limit" in error_message:
            print(f"⚠️ API Key {
                  current_api_key[:10]}****** exhausted. Trying another key...")
            used_keys.append(current_api_key)
            switch_api_key()
            return get_moods_from_descriptions(descriptions)

        return {}


batch_size = 15
moods = []

try:
    for i in range(0, len(df_filtered), batch_size):
        batch_indices = df_filtered.index[i:i+batch_size]  # Get actual indices
        batch = df_filtered.loc[batch_indices, "description"].to_dict()
        mood_dict = get_moods_from_descriptions(batch)

        batch_moods = [mood_dict.get(str(idx), "unknown")
                       for idx in batch.keys()]
        moods.extend(batch_moods)

        print(f"✅ Processed batch {i//batch_size +
              1}/{(len(df_filtered) // batch_size) + 1}")

        df.loc[batch_indices, "mood"] = batch_moods  # Update original df
        save_progress()

        time.sleep(1)
except Exception as e:
    print(f"🚨 An error occurred: {e}")
    save_progress()
    sys.exit(1)

save_progress()
print("🎉 Mood analysis completed and saved to 'netflix_mood_with_predictions.csv'")
