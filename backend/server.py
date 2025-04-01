import os
import pymongo
from flask import (Flask, jsonify, request, send_from_directory, make_response)
from flask_cors import CORS
import random

from Utilities.chatbot import Chatbot
from Utilities.recommend import Recommend
from Utilities.User import User
from Utilities.movies import Movies
from Utilities.profile import Profile

from functools import wraps
import jwt
import datetime

conn=os.getenv("MONGO_CONN")
client = pymongo.MongoClient(conn)
db = client["WatchWise"]

# Initialize AI Extractor
chatbot = Chatbot()
moviesObj = Movies()

# Flask App
app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "meowmeowmeow")
# app.config["SESSION_TYPE"] = "filesystem"  # Store session on disk, not cookies
# app.config["SESSION_COOKIE_SAMESITE"] = "None"
# Session(app)
#

# Flask-Login Setup
frontend_path = os.path.join(os.getcwd(), "frontend", "dist")

@app.before_request
def handle_preflight():
    """Automatically respond to OPTIONS requests for CORS"""
    if request.method == "OPTIONS":
        return '', 200  # Empty response with 200 status for preflight requests

@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(frontend_path, filename)



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            print(token)
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
  
        try:
            # decoding the payload to fetch the stored details
            print(token)
            data = jwt.decode(token,app.config['SECRET_KEY'],verify=True,algorithms=["HS256"])
            print(data)
            current_user = User.get(data['user_id'])
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users context to the routes
        return  f(current_user, *args, **kwargs)
  
    return decorated

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.get_user(email)

    if user and user.verify_password(password):
        token = jwt.encode({
            'user_id': user.id,
            'exp' : datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes = 60)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        print(token)
  
        return make_response(jsonify({'token' : token}), 201)
    else:
        return jsonify({"message": "Login Failed"}), 401


@app.route("/api/check", methods=["GET", "POST"])
@token_required
def check_login(user):
    if request.method == "OPTIONS" or request.method == "POST":  # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        return response, 200
    return jsonify({'user':user.id}), 200


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
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    bio = data.get("bio")
    
    if User.register_user(email, password, name, bio):
        return jsonify({"message": "Registered successfully"}), 200
    else:
        return jsonify({"message": "Registration unsuccessful"}), 401


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id", "default_user")
    user_input = data.get("user_input", "")

    return chatbot.process_input(user_id, user_input)

user_preferences = {}

@app.route("/api/movies", methods=["GET"])
@token_required
def movies(user):
    recommended_shows = Recommend.hybrid_recommend(
        user_id = user.id,
        mood_input = user_preferences.get("mood", "fear").lower(),
        top_n = 50
    )
    print(f"\nMovies Fetched for mood: {user_preferences['mood']}\n")

    all_movies = moviesObj.fetch_movies(
        recommended_shows = recommended_shows,
        filterLanguages = user_preferences["language"],
        filterGenres = user_preferences["genre"]
    )

    if not all_movies:
        return jsonify({"error": "No recommendations found"}), 204
    
    shuffled_movie = random.sample(all_movies, len(all_movies))

    return jsonify({"movies": shuffled_movie}), 200
        
    
@app.route("/api/preference", methods=["POST"])
def preference():
    global user_preferences
    
    user_preferences = request.get_json()
    if not user_preferences:
        return jsonify({"error": "Invalid or missing JSON data"}), 400
        
    print("User Mood: ", user_preferences["mood"])
    print("User Language: ", user_preferences["language"].split(", "))
    print("User Genre: ", user_preferences["genre"].split(", "))
            
    return jsonify({"message": "Data received successfully", "data": user_preferences}), 200

@app.route("/api/watchlater", methods=["POST"])
@token_required
def add_to_watchlist(user):
    try:
        data = request.json
        user_id = user.id
        show_id = data.get("show_id")
        title = data.get("title")

        if not user_id or not show_id or not title:
            return jsonify({"error": "Missing required fields"}), 400

        user.addToWatchlist(show_id)

        return jsonify({"message": f"Added '{title}' to watchlist"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/fetchWatchlater", methods=["GET"])
@token_required
def fetch_watchlist(user):
    try:
        user_id = user.id
        if not user_id:
            return jsonify({"error": "Missing required fields"}), 400

        watchList = user.fetchWatchList()

        return jsonify({"watchlist": watchList}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/fetchHistory", methods=["GET"])
@token_required
def fetch_history(user):
    try:
        user_id = user.id
        print("Getting User ID")
        if not user_id:
            return jsonify({"error": "Missing required fields"}), 400

        history = user.fetchHistory()
        print(history)

        return jsonify({"history": history}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/addRating", methods=["POST"])
@token_required
def add_rating(user):
    try:
        data = request.json
        print(data)
        show_id = data.get("show_id")
        rating = data.get("rating")
        
        print(show_id)

        if not show_id:
            return jsonify({"error": "Missing required fields"}), 400

        user.addRating(show_id, rating)

        return jsonify({"message": f"Removed Movie from watchlist"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route("/api/profile", methods=["GET"])
@token_required
def profile(user):
    try:     
        data = Profile.fetchUserInfo(user.id)
        
        # If an error occurred, return the error
        if isinstance(data, dict) and data.get("status") == "error":
            return jsonify({"error": data.get("message", "Unknown error")}), 500

        # Prepare response data with fallback values
        response_data = {
            "name": data['data'].get("name", "Unknown User"),
            "email": data['data'].get("email", "No email provided"),
            "avatar": data['data'].get("avatar", "https://i.pravatar.cc/150?img=1"),
            "bio": data['data'].get("bio", "No bio available"),
        }

        print("Response Data:", response_data)

        return jsonify({"data": response_data}), 200

    except Exception as e:
        print(f"Error in profile route: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/count", methods=["GET"])
@token_required
def count(user):
    try:
        counts = Profile.fetchCount(user.id)
        print(counts)

        return jsonify({"message": f"Got Count", "data": counts}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port="0.0.0.0")
