import os
from dotenv import load_dotenv
import re
import google.generativeai as genai
from flask import jsonify

class Chatbot:
    def __init__(self):
        self.session_data = {}
        load_dotenv()
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key = gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def process_input(self, user_id, user_input):
        if not user_input:
            return jsonify({"response": "Please provide an input."})

        # Retrieve or initialize session data
        user_session = self.session_data.setdefault(user_id, {"mood": None, "genre": None, "language": None})

        prompt = f"""
        1) You are an AI that extracts a user's mood, genre preference, and language preference.
        2) The mood should be one from the following: relaxed, curious, tense, excited, lonely, scared, annoyed, anger, disgust, fear, joy, sadness, romantic, surprise.
        3) Identify only one genre preference if mentioned (e.g., romance, horror, comedy, action, drama, sci-fi, fantasy, etc.).
        4) Retain previously extracted values unless the user changes them.
        5) Current preferences:
        - Mood: {user_session['mood'] if user_session['mood'] else 'Not specified'}
        - Genre: {user_session['genre'] if user_session['genre'] else 'Not specified'}
        - Language: {user_session['language'] if user_session['language'] else 'Not specified'}
        6) User's latest input: "{user_input}"
        7) Identify changes and update only the relevant fields.
        """

        extracted_data = self.get_extracted_data(prompt)
        print("Extracted Data: ", extracted_data)

        # Update only the fields that are detected in the new input
        user_session["mood"] = extracted_data["mood"] or user_session["mood"]
        user_session["genre"] = extracted_data["genre"] or user_session["genre"]
        user_session["language"] = extracted_data["language"] or user_session["language"]

        self.session_data[user_id] = user_session

        return jsonify({
            "mood": user_session["mood"],
            "genre": user_session["genre"],
            "language": user_session["language"],
            "message": "Does this look correct? If yes, click 'End'. If not, specify corrections."
        })

    def confirm_corrections(self, user_id, corrections):
        if not isinstance(corrections, dict):
            return jsonify({"error": "Invalid input format. Please provide corrections as a dictionary."})
        
        self.session_data[user_id]["mood"] = corrections.get("mood", self.session_data[user_id].get("mood"))
        self.session_data[user_id]["genre"] = corrections.get("genre", self.session_data[user_id].get("genre"))
        self.session_data[user_id]["language"] = corrections.get("language", self.session_data[user_id].get("language"))

        self.session_data[user_id]["pending_confirmation"] = False
        return jsonify({
            "mood": self.session_data[user_id]["mood"],
            "genre": self.session_data[user_id]["genre"],
            "language": self.session_data[user_id]["language"],
            "message": "Final selection confirmed. Click 'End' to finish or type a new request."
        })

    def get_extracted_data(self, prompt):
        try:
            response = self.model.generate_content(prompt)
            cleaned_response = response.text.strip()

            print("AI Response:\n", cleaned_response)

            # Improved regex to match variations in AI response
            mood_match = re.search(r"(?i)Mood\s*:\s*(.+)", cleaned_response)
            genre_match = re.search(r"(?i)Genre\s*:\s*(.+)|Genre Preference\s*:\s*(.+)", cleaned_response)
            language_match = re.search(r"(?i)Language\s*:\s*(.+)|Language Preference\s*:\s*(.+)", cleaned_response)

            return {
                "mood": mood_match.group(1).strip() if mood_match else None,
                "genre": (genre_match.group(1) or genre_match.group(2)).strip() if genre_match else None,
                "language": (language_match.group(1) or language_match.group(2)).strip() if language_match else None
            }

        except Exception as e:
            print(f"AI model error: {e}")
            return {"mood": None, "genre": None, "language": None, "error": "Oops! Something went wrong."}