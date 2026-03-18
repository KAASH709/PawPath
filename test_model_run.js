// Test script to run predictions using the generated model_export.js (PawML)
// This script works in Node by requiring the exported module which attaches PawML to global.

// Load the model_export.js – it defines global.PawML
require('./ml/model_export.js');

const PawML = global.PawML;

// User preference vector (same as earlier test)
const userPrefs = {
    wants_dog: true,
    preferred_size: 'small',
    preferred_energy: 'low',
    apartment_friendly: true,
    has_kids: false,
    max_shedding: 'low',
    alone_tolerance_needed: 'high'
};

const petsList = [
    { id: 'simba', species: 'cat', size: 'medium', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'nibbles', species: 'rabbit', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'teddy', species: 'dog', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'high' },
    { id: 'luna', species: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'high' },
    { id: 'daisy', species: 'dog', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'high' }
];

petsList.forEach(pet => {
    const score = PawML.predict(userPrefs, pet);
    console.log(`${pet.id} (${pet.species}): ${score.toFixed(3)}`);
});
