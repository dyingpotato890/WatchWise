import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key = gemini_api_key)

user_input = input("Describe How You're Feeling Right Now: ")

prompt = f"""
You are an AI that analyzes a user's input to determine the most fitting mood combination based on predefined pairs. Your task is to:

1) Identify whether the user's input is mood-based or genre-based.
2) If genre-based, infer the underlying mood from common associations (e.g., horror → fear, jazz → joy, etc.).
3) Select the most appropriate mood pair from the following predefined combinations:

Joy, Sadness
Disgust, Fear
Anger, Disgust
Disgust, Joy
Fear, Joy
Anger, Joy
Disgust, Sadness
Joy, Surprise
Fear, Sadness
Anger, Fear
Fear, Surprise
Sadness, Surprise
Anger, Sadness
Anger, Surprise
Disgust, Surprise

4) Your response should consist only of the two selected moods, separated by a comma and a space (", ") without any additional text.

Example Inputs & Outputs:

Input: 'I want a movie that makes me feel excited and cheerful.' → Output: 'joy, surprise'
Input: 'Recommend a horror film.' → Output: 'disgust, fear'
Input: 'Find me a movie that expresses anger and frustration.' → Output: 'anger, disgust'
Now, analyze the following user prompt and return the most fitting mood combination: {user_input}
"""

try:
    model = genai.GenerativeModel("gemini-1.5-flash")  # Updated to the latest known version
    response = model.generate_content(prompt)
    
    # Extract response text safely
    if hasattr(response, "text") and response.text.strip():
        bot_response = response.text.strip()
    elif hasattr(response, "candidates") and response.candidates:
        bot_response = response.candidates[0].text.strip()
    else:
        raise ValueError("Invalid or empty response from Gemini API")

except Exception as e:
    bot_response = "Oops! I'm having some technical difficulties. Let's try that again!"

# Print the detected mood
print("Detected Mood:", bot_response)