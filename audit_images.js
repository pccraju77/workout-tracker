const fs = require('fs');
const path = require('path');

const CSV_PATH = 'exercises.csv';
const WORKOUTS_JS_PATH = 'src/data/workouts.js';

function audit() {
    // Load CSV
    const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const csvLines = csvContent.split('\n');
    const csvData = {};

    csvLines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 4) {
            const id = parts[2].trim().padStart(4, '0');
            csvData[id] = {
                name: parts[3].trim().toLowerCase(),
                bodyPart: parts[0].trim().toLowerCase()
            };
        }
    });

    // Load JS
    const jsContent = fs.readFileSync(WORKOUTS_JS_PATH, 'utf-8');

    // Regex to match exercise objects
    // Extract name and first image ID
    const exerciseRegex = /name:\s*'([^']*)'.*?images:\s*{\s*start:\s*'https:\/\/raw\.githubusercontent\.com\/omercotkd\/exercises-gifs\/main\/assets\/(\d{4})\.gif'/gs;

    let match;
    console.log(`${'App Name'.padEnd(35)} | ${'ID'.padEnd(5)} | ${'CSV Name'.padEnd(35)} | Status`);
    console.log('-'.repeat(85));

    while ((match = exerciseRegex.exec(jsContent)) !== null) {
        const appName = match[1];
        const id = match[2];
        const csvEntry = csvData[id];

        let status = 'OK';
        let csvName = 'MISSING';

        if (!csvEntry) {
            status = 'INVALID ID';
        } else {
            csvName = csvEntry.name;
            const appWords = appName.toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter(w => w.length > 3);
            const isMatch = appWords.some(word => csvName.includes(word));

            if (!isMatch) {
                status = 'MISMATCH?';
            }
        }

        console.log(`${appName.padEnd(35)} | ${id.padEnd(5)} | ${csvName.padEnd(35)} | ${status}`);
    }
}

audit();
