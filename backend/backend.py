import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Enable CORS for your frontend domain
CORS(app)

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing")

genai.configure(api_key=API_KEY)
print("✅ Gemini API configured")

# Note: Use 'gemini-1.5-flash' for stable production
model = genai.GenerativeModel("gemini-2.5-flash")

@app.route("/", methods=["GET"])
def home():
    return "PathFinder AI Backend running", 200

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        msg = data.get("message", "").strip()

        if not msg:
            return jsonify({"reply": "Please provide the career context."}), 400

        # System instructions embedded in the prompt for the specific career
        response = model.generate_content(msg)
        return jsonify({"reply": response.text}), 200

    except Exception as e:
        print("❌ Gemini Error:", e)
        return jsonify({"reply": "Broo, the AI is a bit tired. Try again later."}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)