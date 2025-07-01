import pandas as pd
import requests

# API Credentials
WEATHER_API_KEY = "63a2ee48a45c1793f83d420da58cf9da"
NEWS_API_KEY = "pub_61422383961c48adef93d9572e351e9b18ba8"

def fetch_weather(city, cache):
    if city in cache:
        return cache[city]
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        weather = {"main": data["weather"][0]["main"], "aqi": data.get("aqi", {}).get("value", 0)}
    else:
        weather = {"main": "unknown", "aqi": 0}
    cache[city] = weather
    return weather

def fetch_news(city, keywords, cache):
    if city in cache:
        return cache[city]
    url = f"https://newsdata.io/api/1/latest?apikey={NEWS_API_KEY}&q={city}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        articles = [
            article["title"]
            for article in data.get("results", [])
            if any(keyword in article["title"].lower() for keyword in keywords)
        ]
        cache[city] = articles
    else:
        cache[city] = []
    return cache[city]

def calculate_safety_index(weather, news):
    index = 100
    if weather.get("main", "").lower() in ["cyclone", "thunderstorm"]:
        index -= 20
    if weather.get("aqi", 0) > 150:
        index -= 15
    index -= 10 * len(news)
    return max(index, 0)

def check_safety(index):
    return "Safe" if index >= 70 else "Unsafe"

def process_cities(cities):
    results = []
    weather_cache = {}
    news_cache = {}
    
    keywords = [
        "cyclone", "floods", "earthquakes", "road blockage", "protests", "fog", "fires", "thunderstorm",
        "heavy rain", "high rain", "yellow alert", "red alert", "orange alert", "landslide", "storm surge", "hailstorm",
        "extreme heat", "drought", "severe weather"
    ]
    
    for city in cities:
        weather = fetch_weather(city, weather_cache)
        news = fetch_news(city, keywords, news_cache)
        
        safety_index = calculate_safety_index(weather, news)
        results.append({
            "City": city,
            "Safety Index": safety_index,
            "Status": check_safety(safety_index),
            "Weather Info": weather,
            "News Articles": "; ".join(news) if news else "No relevant news",
        })
    return results

# Input array of cities
cities = ['Mumbai','Hyderabad', 'Chennai']

# Process safety for each city
results = process_cities(cities)

# Save results to CSV
if results:
    results_df = pd.DataFrame(results)
    print(results_df)
    results_df.to_csv(r"C:\\Users\\Admin\\OneDrive\\Documents\\VSCode Practice\\Travelling-Postman\\public\\data\\Safety_Analysis_Routes.csv", index=False)
    print("Safety analysis saved to Safety_Analysis_Routes.csv.")
else:
    print("No safety analysis results to process.")