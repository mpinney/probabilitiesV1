from flask import Flask, request, jsonify, render_template
import json
import os

app = Flask(__name__)

# Load the database from a JSON file
def load_database():
    with open('database.json', 'r') as file:
        return json.load(file)

# Find the entry with the closest probability
def find_closest_entry(target_prob, database):
    closest_entry = None
    min_diff = float('inf')
    for entry in database:
        diff = abs(entry['probability'] - target_prob)
        if diff < min_diff:
            min_diff = diff
            closest_entry = entry
    return closest_entry

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/find', methods=['POST'])
def find():
    data = request.json
    target_prob = data.get('probability')
    database = load_database()
    closest_entry = find_closest_entry(target_prob, database)
    return jsonify(closest_entry)

if __name__ == '__main__':
    # For local development
    app.run(debug=True)
else:
    # For production
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000))) 