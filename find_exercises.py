
import csv

def search_exercises():
    keywords = {
        "ez_bar": ["ez", "bar", "curl"],
        "hammer": ["hammer", "curl"],
        "machine_curl": ["machine", "curl"],
        "cable_curl": ["cable", "curl"],
        "dumbbell_curl": ["dumbbell", "curl"],
        "incline_curl": ["incline", "curl"],
        "rope_curl": ["rope", "curl"],
        "wrist_curl": ["wrist", "curl"],
        "reverse_curl": ["reverse", "curl"],
        "standing_curl": ["standing", "curl"]
    }

    try:
        with open('exercises.csv', 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) < 4:
                    continue
                
                name = row[3].lower()
                eid = row[2]
                equipment = row[1] if len(row) > 1 else ""

                for key, terms in keywords.items():
                    if all(term in name for term in terms):
                        print(f"MATCH {key}: {eid} - {name} ({equipment})")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_exercises()
