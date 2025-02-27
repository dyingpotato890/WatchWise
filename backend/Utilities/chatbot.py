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

        # Check for pending corrections
        if user_id in self.session_data and self.session_data[user_id].get("pending_confirmation", False):
            return self.confirm_corrections(user_id, user_input)

        # Generate AI prompt
        prompt = f"""
        1) You are an AI that analyzes a user's input to extract details about their current mood, genre preference, and language preference.
        2) The mood should be one from the following: relaxed, curious, tense, excited, lonely, scared, annoyed, anger, disgust, fear, joy, sadness, romantic, surprise.
        3) Identify only one genre preference if mentioned (e.g., romance, horror, comedy, action, drama, sci-fi, fantasy, etc.).
        Now, analyze the following user input and return the response as a multiline string: {user_input}
        """

        extracted_data = self.get_extracted_data(prompt)

        # Store extracted data
        self.session_data.setdefault(user_id, {})
        self.session_data[user_id].update(extracted_data)
        self.session_data[user_id]["pending_confirmation"] = True

        return jsonify({
            "mood": self.session_data[user_id]["mood"],
            "genre": self.session_data[user_id]["genre"],
            "language": self.session_data[user_id]["language"],
            "message": "Does this look correct? If yes, click 'End'. If not, please specify corrections."
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
            
            mood_match = re.search(r"(?i)^Mood\s*:\s*(.+)", cleaned_response, re.MULTILINE)
            genre_match = re.search(r"(?i)^Genre Preference\s*:\s*(.+)", cleaned_response, re.MULTILINE)
            language_match = re.search(r"(?i)^Language Preference\s*:\s*(.+)", cleaned_response, re.MULTILINE)
            
            return {
                "mood": mood_match.group(1).strip() if mood_match else None,
                "genre": genre_match.group(1).strip() if genre_match else None,
                "language": language_match.group(1).strip() if language_match else None
            }
        except Exception as e:
            print(f"AI model error: {e}")
            return {"mood": None, "genre": None, "language": None, "error": "Oops! Something went wrong."}