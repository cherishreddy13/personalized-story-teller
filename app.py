import cohere
import os
from flask import Flask, render_template, request, jsonify
from textblob import TextBlob

app = Flask(__name__)

# Load the Cohere API key from environment variables for security
API_KEY = ('dSe5i608cTtTQli1JJ15e9N60zmY8uFI8sHRFmau')  # Set your API key in the environment variable COHERE_API_KEY
co = cohere.Client(API_KEY)

# Define the story generation function
def generate_story(mood, char_name, gender):
    prompt = f"Tell a complete story according to the mood '{mood}', with the character '{char_name}' and gender '{gender}'in 300 words."
    response = co.generate(
        model='command-xlarge-nightly',  # Example model, change if necessary
        prompt=prompt,
        max_tokens=300,
        temperature=0.7
    )
    story = response.generations[0].text.strip()
    return story

# Define a basic sentiment analysis function
def get_sentiment(text):
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    if polarity > 0.1:
        return "happy"
    elif polarity < -0.1:
        return "sad"
    else:
        return "neutral"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_story', methods=['POST'])
def generate_story_api():
    user_input = request.json.get('user_input')
    char_name = request.json.get('char_name')
    gender = request.json.get('gender') 
    mood = get_sentiment(user_input)
    story = generate_story(mood, char_name, gender)  
    return jsonify({'story': story, 'mood': mood, 'gender': gender})

if __name__ == '__main__':
    app.run(debug=True)