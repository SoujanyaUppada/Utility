from flask import Flask, jsonify
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Backend is LIVE!",
        "endpoints": [
            "/api/weather/<city>",
            "/api/convert/<amount>/<USD|EUR>",
            "/api/quote"
        ]
    })


# -------------------------------------------------
# ... WEATHER ...
# -------------------------------------------------
@app.route("/api/weather/<city>", methods=["GET"])
def weather(city):
    city = city.strip()
    if not city or not city.replace(" ", "").replace("-", "").isalpha():
        return jsonify({"error": "Invalid city name"}), 400

    
    try:
        r = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={"q": city, "appid": "", "units": "metric"},
            timeout=5
        )
        if r.status_code == 200:
            d = r.json()
            return jsonify({
                "city": d["name"],
                "temp": round(d["main"]["temp"], 1),
                "description": d["weather"][0]["description"].title(),
                "humidity": d["main"]["humidity"]
            })
    except:
        pass  

    
    mock = {
        "Delhi": 29, "Mumbai": 32, "London": 14, "Paris": 16,
        "New York": 22, "Tokyo": 20, "Sydney": 25
    }
    temp = mock.get(city.title(), round(random.uniform(15, 35), 1))
    desc = random.choice(["Sunny", "Cloudy", "Rainy", "Clear", "Partly Cloudy"])
    return jsonify({
        "city": city.title(),
        "temp": temp,
        "description": desc,
        "humidity": random.randint(40, 90)
    })


# -------------------------------------------------
# .. CURRENCY ..
# -------------------------------------------------
@app.route("/api/convert/<amount>/<to_cur>", methods=["GET"])
def convert(amount, to_cur):
   
    try:
        amt = float(amount)
        if amt <= 0:
            raise ValueError
    except:
        return jsonify({"error": "Amount must be a positive number"}), 400

   
    to_cur = to_cur.upper()
    if to_cur not in ("USD", "EUR"):
        return jsonify({"error": "Only USD or EUR"}), 400

   
    try:
        url = "https://api.exchangerate.host/latest?base=INR"
        data = requests.get(url, timeout=5).json()
        if "rates" not in data or to_cur not in data["rates"]:
            raise ValueError
        rate = data["rates"][to_cur]
    except:
        
        rate = 0.012 if to_cur == "USD" else 0.011

    return jsonify({
        "from": "INR",
        "to": to_cur,
        "amount": amt,
        "converted": round(amt * rate, 2),
        "rate": round(rate, 5)
    })


# -------------------------------------------------
# .. QUOTE ..
# -------------------------------------------------
MOCK_QUOTES = [
    {"q": "The best way to predict the future is to create it.", "a": "Peter Drucker"},
    {"q": "Stay hungry, stay foolish.", "a": "Steve Jobs"},
    {"q": "Code is like humor. When you have to explain it, it’s bad.", "a": "Cory House"},
]

@app.route("/api/quote", methods=["GET"])
def quote():
    try:
        data = requests.get("https://zenquotes.io/api/random", timeout=5).json()
        return jsonify({"quote": data[0]["q"], "author": data[0]["a"]})
    except:
        q = random.choice(MOCK_QUOTES)
        return jsonify({"quote": q["q"], "author": q["a"]})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)