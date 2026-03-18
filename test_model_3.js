const fs = require('fs');

const modelExport = fs.readFileSync('ml/model_export.js', 'utf8');

// Mock a simple window/global environment for the IIFE format of model_export.js
const globalContext = {};
eval(modelExport.replace(/typeof window !== 'undefined' \? window : global/, 'globalContext'));
const PawML = globalContext.PawML;

const userPrefs = {
    wants_dog: 1.0, // Because prompt explicitly says "Active dog"
    preferred_size: 'large',
    preferred_energy: 'high',
    apartment_friendly: false,
    has_kids: false,
    max_shedding: 'medium',
    alone_tolerance_needed: 'low'
};

const appContent = fs.readFileSync('app.js', 'utf8');
const petsMatch = appContent.match(/const PETS = (\[[\s\S]*?\]);\n\nlet currentPet/);
let petsData;
eval("petsData = " + petsMatch[1] + ";");

const ranked = PawML.rankPets(userPrefs, petsData).slice(0, 5);
console.log("Recommendations for userPrefs:", userPrefs);
ranked.forEach(p => console.log(`${p.name} (${p.type}) - Score: ${p.mlScore}`));
