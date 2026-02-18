const fs = require('fs');

const CSV_PATH = 'exercises.csv';

const repairs = [
    { name: 'Tricep Kickbacks', search: 'kickback' },
    { name: 'Overhead Extension', search: 'overhead.*extension' },
    { name: 'Tricep Dips', search: 'dip' },
    { name: 'Cross Body Hammer Curls', search: 'cross.*hammer|hammer.*curl' },
    { name: 'Incline Dumbbell Curls', search: 'incline.*curl' },
    { name: 'Ez-Bar Curls', search: 'ez.*curl' },
    { name: 'Seated Dumbbell Press', search: 'seated.*press' },
    { name: 'Face Pulls', search: 'face.*pull' },
    { name: 'Wall Walks', search: 'wall.*walk' },
    { name: 'Push Press', search: 'push.*press' },
    { name: 'Arm Circles', search: 'arm.*circle' },
    { name: 'Upright Rows', search: 'upright.*row' },
    { name: 'Plate Curls', search: 'plate.*curl' },
    { name: 'T-Bar Rows', search: 't-bar.*row|t.*bar.*row' },
    { name: 'Arnold Press', search: 'arnold' },
    { name: 'Bodyweight Rows', search: 'bodyweight.*row|inverted.*row' }
];

function audit() {
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = csvContent.split('\n');

    console.log('--- REPAIR AUDIT RESULTS ---');

    repairs.forEach(repair => {
        console.log(`\nSearching for: ${repair.name}`);
        const regex = new RegExp(repair.search, 'i');
        let foundCount = 0;

        lines.forEach(line => {
            const parts = line.split(',');
            if (parts.length > 3) {
                const id = parts[2];
                const exerciseName = parts[3];
                const category = parts[0];
                const equipment = parts[1];

                if (regex.test(exerciseName)) {
                    console.log(`  [Match] ID: ${id.padStart(4, '0')} | ${exerciseName} | ${category} | ${equipment}`);
                    foundCount++;
                }
            }
        });

        if (foundCount === 0) {
            console.log(`  [NO MATCHES FOUND]`);
        }
    });
}

audit();
