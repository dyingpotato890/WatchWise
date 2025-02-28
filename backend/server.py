import json
import os
import re

import google.generativeai as genai
from dotenv import load_dotenv
from flask import (Flask, jsonify, redirect, request, send_from_directory,
                   session)
from flask_session import Session
from flask_cors import CORS
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user)
from Utilities.chatbot import Chatbot
from Utilities.User import User

# Initialize AI Extractor
chatbot = Chatbot()

# Flask App
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "meowmeowmeow")
app.config["SESSION_TYPE"] = "filesystem"  # Store session on disk, not cookies
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
Session(app)


# Flask-Login Setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"
frontend_path = os.path.join(os.getcwd(), "frontend", "dist")

# Load environment variables for model
load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=gemini_api_key)


@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(frontend_path, filename)


@login_manager.user_loader
def load_user(user_id):
    print(f"Loading user: {user_id}")
    return User.get(int(user_id))


@login_manager.unauthorized_handler
def unauthorize():
    return jsonify({"message": "Unauthorize"}), 401


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.get_user(email)

    if user and user.verify_password(password):
        session["user_id"] = user.id
        login_user(user, remember=True)
        print(f"User {user.id} logged in")
        print(dict(session))
        return jsonify({"message": "Login Successful"})
    else:
        return jsonify({"message": "Login Failed"}), 401


@app.route("/api/check", methods=["GET","POST"])
def check_login():
    print(dict(session))
    return "User is logged in"


@app.route("/api/register", methods=["OPTIONS", "POST"])
def register():
    if request.method == "OPTIONS":  # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        return response, 200
    data = requestGEMINI_API_KEY = AIzaSyCsT22Fxkipg8V7kH_I4EuTGlgpUEGIags.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    if User.register_user(email, password, name):
        return jsonify({"message": "Registered successfully"}), 200
    else:
        return jsonify({"message": "Registration unsuccessful"}), 401


chat_history = {}


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id", "default_user")
    user_input = data.get("user_input", "")

    return chatbot.process_input(user_id, user_input)


if __name__ == "__main__":
    app.run(debug=True, port=5010)
