const fs = require('fs');

const CSV_PATH = 'exercises.csv';

function search() {
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const csvLines = csvContent.split('\n');

    const terms = ['face pull', 'spider', 'close grip', 'press', 'shrug', 'curl', 'squat'];

    console.log(`ID | Name | Category`);
    console.log('-'.repeat(50));

    csvLines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 4) {
            const name = parts[3].trim().toLowerCase();
            const id = parts[2].trim().padStart(4, '0');
            const category = parts[0].trim().toLowerCase();

            if (name.includes('face pull') || (name.includes('rope') && name.includes('pull') && category.includes('shoulder'))) {
                console.log(`${id} | ${name} | ${category}`);
            }

            if (name.includes('spider crawl push up')) {
                console.log(`${id} | ${name} | ${category}`);
            }
        }
    });

    // Also look for "cable pull" in shoulders
    csvLines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 4) {
            const name = parts[3].trim().toLowerCase();
            const id = parts[2].trim().padStart(4, '0');
            const category = parts[0].trim().toLowerCase();

            if (category.includes('shoulders') && name.includes('rope')) {
                console.log(`${id} | ${name} | ${category}`);
            }
        }
    });
}

search();
