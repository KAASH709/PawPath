const fs = require('fs');

const appContent = fs.readFileSync('app.js', 'utf8');
const matchContent = fs.readFileSync('api/match.js', 'utf8');

// Extract PETS array from app.js
const petsMatch = appContent.match(/const PETS = (\[[\s\S]*?\]);\n\nlet currentPet/);
if (!petsMatch) throw new Error("Could not find PETS in app.js");

// We need to carefully parse or evaluate it. It's safer to use eval since it's just a JS object.
let petsData;
// create a fake context to eval PETS
const evalStr = "petsData = " + petsMatch[1] + ";";
eval(evalStr);

const matchPets = petsData.filter(p => p.id !== 'misty_cat').map(p => ({
    id: p.id,
    name: p.name,
    species: p.type, // app uses 'type', match uses 'species'
    breed: p.breed,
    size: p.size,
    age: p.age,
    img: p.img,
    energy: p.energy,
    apartment_friendly: p.apartment_friendly,
    good_with_kids: p.good_with_kids,
    shedding: p.shedding,
    alone_tolerance: p.alone_tolerance,
    description: p.desc
}));

const newPetsStr = "const PETS = " + JSON.stringify(matchPets, null, 4).replace(/"([^"]+)":/g, '$1:') + ";";

const newMatchContent = matchContent.replace(/const PETS = (\[[\s\S]*?\]);\n\n\/\/ ── Helpers/, newPetsStr + "\n\n// ── Helpers");

fs.writeFileSync('api/match.js', newMatchContent);

// Update api/match.js prompt string
let finalContent = fs.readFileSync('api/match.js', 'utf8');
finalContent = finalContent.replace(/"species": "dog" \| "cat" \| "any" \| null,/, '"species": "dog" | "cat" | "rabbit" | "guinea_pig" | "hamster" | "terrapin" | "any" | null,');
fs.writeFileSync('api/match.js', finalContent);

console.log("Updated api/match.js successfully.");
