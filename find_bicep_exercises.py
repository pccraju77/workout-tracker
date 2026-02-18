import csv

def find_exercises():
    keywords = ["curl", "hammer", "bicep", "ez bar", "rope", "dumbbell", "cable"]
    results = []
    
    try:
        with open('g:/my-workout-application/exercises.csv', mode='r', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                if len(row) < 4:
                    continue
                
                # row[2] is ID, row[3] is name, row[4] is target
                name = row[3].lower()
                target = row[4].lower()
                
                # Check if any keyword matches
                if any(k in name for k in keywords) and "leg" not in name:
                     results.append((row[2], row[3], row[4]))

        print(f"Found {len(results)} matches:")
        for r in results:
            print(f"ID: {r[0]}, Name: {r[1]}, Target: {r[2]}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_exercises()
