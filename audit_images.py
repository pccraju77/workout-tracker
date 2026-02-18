import csv
import re
import json

# Path to the data files
CSV_PATH = 'exercises.csv'
WORKOUTS_JS_PATH = 'src/data/workouts.js'

def extract_workouts_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple regex to find the workouts array. 
    # This assumes the structure is reasonably consistent.
    matches = re.findall(r"id:\s*'([^']*)',\s*name:\s*'([^']*)'.*?images:\s*{\s*start:\s*'https://raw\.githubusercontent\.com/omercotkd/exercises-gifs/main/assets/(\d{4})\.gif'", content, re.DOTALL)
    
    # The above regex might miss some if they have different formatting.
    # Let's try to extract the whole array and parse it more carefully if needed.
    # For now, let's see what we get.
    return matches

def audit():
    # Load CSV data into a dictionary for fast lookup
    csv_data = {}
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 4:
                # row[2] is ID, row[3] is Name, row[0] is Category/BodyPart
                csv_data[row[2].zfill(4)] = {
                    'name': row[3].lower(),
                    'body_part': row[0].lower()
                }

    workouts_exercises = extract_workouts_data(WORKOUTS_JS_PATH)
    
    print(f"{'Exercise Name (App)':<30} | {'ID':<5} | {'Exercise Name (CSV)':<30} | {'Status'}")
    print("-" * 85)
    
    for ex_id_app, ex_name_app, id_val in workouts_exercises:
        csv_entry = csv_data.get(id_val)
        status = "OK"
        csv_name = "MISSING"
        
        if not csv_entry:
            status = "INVALID ID"
        else:
            csv_name = csv_entry['name']
            # Check if name contains key parts of the app name
            clean_app_name = ex_name_app.lower().replace('-', ' ').replace('(', '').replace(')', '')
            words = clean_app_name.split()
            # If at least one distinctive word is missing, flag it
            if not any(word in csv_name for word in words if len(word) > 3):
                status = "MISMATCH?"

        print(f"{ex_name_app:<30} | {id_val:<5} | {csv_name:<30} | {status}")

if __name__ == "__main__":
    audit()
