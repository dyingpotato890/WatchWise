from flask import Flask, jsonify, redirect, request, session, send_from_directory
import os
from flask_cors import CORS
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user)
import google.generativeai as genai
from dotenv import load_dotenv
from Utilities.User import User

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config["SECRET_KEY"] = "meowmeowmeow"

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
frontend_path = os.path.join(os.getcwd(),"frontend","dist")

# Load environment variables for model
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_api_key)

@app.route("/",defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename="index.html"
    return send_from_directory(frontend_path,filename)


@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "Unauthorized"}), 401


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.get(email)

    if user and user.verify_password(password):
        login_user(user, remember=True)
        return jsonify({"message": "Login Successful"})
    else:
        return jsonify({"message": "Login Failed"}), 401


@app.route("/api/register", methods=["OPTIONS", "POST"])
def register():
    if request.method == "OPTIONS":  # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response, 200
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    if User.register_user(email, password, name):
        return jsonify({"message": "Registered successfully"}), 200
    else:
        return jsonify({"message": "Registration unsuccessful"}), 401

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("user_input", "")

    if not user_input:
        return jsonify({"response": "Please provide an input."})

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
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        if hasattr(response, "text") and response.text.strip():
            detected_mood = response.text.strip()
        else:
            detected_mood = "I'm not sure about the mood. Try describing again."

    except Exception as e:
        detected_mood = "Oops! I'm having some technical difficulties. Let's try that again!"

    return jsonify({
        "response": detected_mood + "\nAre you happy with this result? If YES then click on 'End' button, else rewrite how you are feeling.",
    })

if __name__ == "__main__":
    app.run(debug=True, port=5010)
