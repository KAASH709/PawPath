const fs = require('fs');
const brain = require('brain.js');

const modelData = JSON.parse(fs.readFileSync('./ml/model.json', 'utf8'));
const net = new brain.NeuralNetwork();
net.fromJSON(modelData);

const SPECIES_MAP = { dog: 1, cat: 0 };
const SIZE_MAP = { small: 0, medium: 0.5, large: 1 };
const ENERGY_MAP = { low: 0, medium: 0.5, high: 1 };
const SHEDDING_MAP = { low: 0, medium: 0.5, high: 1 };
const ALONE_MAP = { low: 0, medium: 0.5, high: 1 };

function encodePet(pet) {
    return [
        SPECIES_MAP[pet.type || pet.species] ?? 0.5,
        SIZE_MAP[pet.size] ?? 0.5,
        ENERGY_MAP[pet.energy] ?? 0.5,
        pet.apartment_friendly ? 1 : 0,
        pet.good_with_kids ? 1 : 0,
        SHEDDING_MAP[pet.shedding] ?? 0.5,
        ALONE_MAP[pet.alone_tolerance] ?? 0.5,
    ];
}

const userVec = [
    1.0,   // wants_dog
    0,     // preferred_size (small)
    0,     // preferred_energy (low)
    1.0,   // apartment_friendly
    0.5,   // has_kids (neutral)
    0.5,   // max_shedding (neutral)
    1.0    // alone_tolerance_needed (high)
];

const petsList = [
    { id: 'simba', type: 'cat', size: 'medium', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'nibbles', type: 'rabbit', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'teddy', type: 'dog', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'high' },
    { id: 'luna', type: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'high' },
    { id: 'daisy', type: 'dog', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'high' }
];

petsList.forEach(pet => {
    const input = [...userVec, ...encodePet(pet)];
    const out = net.run(input);
    console.log(`${pet.id} (${pet.type}): ${out[0].toFixed(3)}`);
});
