const fs = require('fs');
const brain = require('./node_modules/brain.js'); // Assuming local or I can use the same logic as model_export.js

// Let's just use model_export.js
const modelExport = fs.readFileSync('ml/model_export.js', 'utf8');
// Evaluate model_export.js to get PawML
let PawML;
const globalContext = {};
eval(modelExport.replace(/global\.PawML = PawML;/g, 'globalContext.PawML = PawML;'));
PawML = globalContext.PawML;

const userPrefs = {
  wants_dog: 1, // Dog
  preferred_size: 'large', // Assuming "big backyard" might yield large or any
  preferred_energy: 'high', // "active"
  apartment_friendly: false, // "big backyard"
  has_kids: false,
  max_shedding: 'medium',
  alone_tolerance_needed: 'low'
};

const appContent = fs.readFileSync('app.js', 'utf8');
const petsMatch = appContent.match(/const PETS = (\[[\s\S]*?\]);\n\nlet currentPet/);
let petsData;
eval("petsData = " + petsMatch[1] + ";");

const ranked = PawML.rankPets(userPrefs, petsData).slice(0, 5);
console.log("Recommendations for Active Dog:");
ranked.forEach(p => console.log(`${p.name} (${p.type}) - Score: ${p.mlScore}`));
