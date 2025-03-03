import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask import jsonify

class Chatbot:
    def __init__(self):
        self.session_data = {}
        load_dotenv()
        gemini_api_key = os.getenv("GEMINI_API_KEY_CHATBOT")
        genai.configure(api_key = gemini_api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def process_input(self, user_id, user_input):
        if not user_input:
            return jsonify({"response": "Please provide an input."})

        # Retrieve or initialize session data
        user_session = self.session_data.setdefault(user_id, {"mood": None, "genre": None, "language": None})

        prompt = f"""
        1) You are an AI that identifies the desired emotional response a user seeks from a movie.
        2) The desired emotional response (mood) should be extracted exactly as written from the following list: relaxed, curious, tense, excited, lonely, scared, annoyed, anger, disgust, fear, joy, sadness, romantic, surprise.
        3) Do not simplify the mood—return it as mentioned by the user.
        4) Retain the previous desired movie mood unless the user specifies a new one.
        5) Current desired movie mood: {user_session['mood'] if user_session['mood'] else 'Not specified'}
        6) User's latest input: "{user_input}"
        7) Identify and update the desired movie mood if a new one is mentioned or inferred.
        8) If the user asks for movies that make them "happy," infer that the desired movie mood is "joy."
        9) Only give the mood, no other extracteed text.
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
            mood = response.text.strip()

            print("AI Response:\n", mood)
            mood_mapping = {"sad": "sadness", "angry": "anger", "romance": "romantic"}
            # mood = cleaned_response if cleaned_response else None
            mood = mood_mapping.get(mood, mood)

            return {
                "mood": mood,
                "genre": None,
                "language": None
            }

        except Exception as e:
            print(f"AI model error: {e}")
            return {"mood": None, "genre": None, "language": None, "error": "Oops! Something went wrong."}