/**
 * generate_data.js
 * ─────────────────────────────────────────────────────────────────
 * Generates a synthetic training dataset for the PawPath pet
 * recommender.  Each training sample represents a (user, pet) pair
 * with a normalised "liked" score as the label (0 = disliked, 1 = liked).
 *
 * We encode BOTH the user's preference profile AND the pet's traits
 * as a flat numeric vector – that combined feature vector is the
 * network input that Brain.js will train on.
 *
 * Run: node ml/generate_data.js
 * Output: ml/training_data.json
 * ─────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

// ── Feature encoding ──────────────────────────────────────────────
// Every categorical value is mapped to a number in [0, 1].

const SPECIES_MAP = { dog: 1, cat: 0 };
const SIZE_MAP = { small: 0, medium: 0.5, large: 1 };
const ENERGY_MAP = { low: 0, medium: 0.5, high: 1 };
const SHEDDING_MAP = { low: 0, medium: 0.5, high: 1 };
const ALONE_MAP = { low: 0, medium: 0.5, high: 1 };

/**
 * Converts a pet object into a 9-element numeric vector.
 * [species, size, energy, apartment_friendly, good_with_kids, shedding, alone_tolerance]
 */
function encodePet(pet) {
    return [
        SPECIES_MAP[pet.species] ?? 0.5,
        SIZE_MAP[pet.size] ?? 0.5,
        ENERGY_MAP[pet.energy] ?? 0.5,
        pet.apartment_friendly ? 1 : 0,
        pet.good_with_kids ? 1 : 0,
        SHEDDING_MAP[pet.shedding] ?? 0.5,
        ALONE_MAP[pet.alone_tolerance] ?? 0.5,
    ];
}

/**
 * Converts a user-preference object into the same 7-element schema.
 * Any unknown/null field defaults to 0.5 (neutral).
 */
function encodeUser(prefs) {
    return [
        prefs.wants_dog !== undefined ? (prefs.wants_dog ? 1 : 0) : 0.5,
        SIZE_MAP[prefs.preferred_size] ?? 0.5,
        ENERGY_MAP[prefs.preferred_energy] ?? 0.5,
        prefs.apartment_friendly ? 1 : 0,
        prefs.has_kids ? 1 : 0,
        SHEDDING_MAP[prefs.max_shedding] ?? 0.5,
        ALONE_MAP[prefs.alone_tolerance_needed] ?? 0.5,
    ];
}

// ── Pet catalogue (mirrors app.js / api/match.js) ─────────────────
const PETS = [
    { id: 'buddy', species: 'dog', size: 'large', energy: 'medium', apartment_friendly: false, good_with_kids: true, shedding: 'high', alone_tolerance: 'medium' },
    { id: 'luna', species: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'high' },
    { id: 'max', species: 'dog', size: 'large', energy: 'high', apartment_friendly: false, good_with_kids: true, shedding: 'medium', alone_tolerance: 'low' },
    { id: 'bella', species: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'charlie', species: 'dog', size: 'medium', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
];

// ── User-preference archetypes ────────────────────────────────────
// We define representative user-preference profiles and for each
// profile we specify which pets they would realistically like.
const ARCHETYPES = [
    // Apartment cat person, works long hours
    { prefs: { wants_dog: false, preferred_size: 'small', preferred_energy: 'low', apartment_friendly: true, has_kids: false, max_shedding: 'low', alone_tolerance_needed: 'high' }, likes: ['luna', 'bella'], dislikes: ['buddy', 'max', 'charlie'] },
    // Active family with a yard, kids
    { prefs: { wants_dog: true, preferred_size: 'large', preferred_energy: 'high', apartment_friendly: false, has_kids: true, max_shedding: 'high', alone_tolerance_needed: 'low' }, likes: ['max', 'buddy'], dislikes: ['luna', 'bella'] },
    // Apartment dweller who wants a small dog
    { prefs: { wants_dog: true, preferred_size: 'medium', preferred_energy: 'medium', apartment_friendly: true, has_kids: true, max_shedding: 'low', alone_tolerance_needed: 'medium' }, likes: ['charlie'], dislikes: ['luna', 'bella', 'max'] },
    // Quiet home, no kids, wants calm cat
    { prefs: { wants_dog: false, preferred_size: 'small', preferred_energy: 'low', apartment_friendly: true, has_kids: false, max_shedding: 'medium', alone_tolerance_needed: 'high' }, likes: ['bella', 'luna'], dislikes: ['buddy', 'max', 'charlie'] },
    // Outdoorsy jogger who wants high-energy dog
    { prefs: { wants_dog: true, preferred_size: 'large', preferred_energy: 'high', apartment_friendly: false, has_kids: false, max_shedding: 'medium', alone_tolerance_needed: 'low' }, likes: ['max'], dislikes: ['luna', 'bella', 'charlie'] },
    // Family looking for friendly medium dog
    { prefs: { wants_dog: true, preferred_size: 'medium', preferred_energy: 'medium', apartment_friendly: true, has_kids: true, max_shedding: 'low', alone_tolerance_needed: 'medium' }, likes: ['charlie', 'buddy'], dislikes: ['luna', 'bella'] },
    // Senior person, wants calm small pet
    { prefs: { wants_dog: false, preferred_size: 'small', preferred_energy: 'low', apartment_friendly: true, has_kids: false, max_shedding: 'low', alone_tolerance_needed: 'high' }, likes: ['luna'], dislikes: ['max', 'buddy', 'charlie'] },
    // Young professional, apartment, gentle dog
    { prefs: { wants_dog: true, preferred_size: 'large', preferred_energy: 'medium', apartment_friendly: false, has_kids: false, max_shedding: 'high', alone_tolerance_needed: 'medium' }, likes: ['buddy'], dislikes: ['luna', 'bella'] },
    // Mixed family, open to either species
    { prefs: { wants_dog: true, preferred_size: 'medium', preferred_energy: 'medium', apartment_friendly: true, has_kids: true, max_shedding: 'low', alone_tolerance_needed: 'medium' }, likes: ['charlie', 'luna'], dislikes: ['bella', 'max'] },
    // Remote worker who wants a dog companion
    { prefs: { wants_dog: true, preferred_size: 'large', preferred_energy: 'medium', apartment_friendly: false, has_kids: false, max_shedding: 'medium', alone_tolerance_needed: 'low' }, likes: ['buddy', 'max'], dislikes: ['luna', 'bella'] },
];

// ── Build training samples ────────────────────────────────────────
const trainingData = [];

ARCHETYPES.forEach(({ prefs, likes, dislikes }) => {
    const userVec = encodeUser(prefs);

    // Liked pets → label 1
    likes.forEach(petId => {
        const pet = PETS.find(p => p.id === petId);
        if (!pet) return;
        trainingData.push({ input: [...userVec, ...encodePet(pet)], output: [1] });
    });

    // Disliked pets → label 0
    dislikes.forEach(petId => {
        const pet = PETS.find(p => p.id === petId);
        if (!pet) return;
        trainingData.push({ input: [...userVec, ...encodePet(pet)], output: [0] });
    });
});

// ── Light augmentation: shuffle & duplicate with small noise ──────
function jitter(vec, amount = 0.05) {
    return vec.map(v => Math.min(1, Math.max(0, v + (Math.random() - 0.5) * amount)));
}

const augmented = [...trainingData];
trainingData.forEach(sample => {
    augmented.push({ input: jitter(sample.input), output: sample.output });
});

// Shuffle
augmented.sort(() => Math.random() - 0.5);

// ── Save ──────────────────────────────────────────────────────────
const outPath = path.join(__dirname, 'training_data.json');
fs.writeFileSync(outPath, JSON.stringify(augmented, null, 2));
console.log(`✅  Generated ${augmented.length} training samples → ${outPath}`);
console.log(`    Input vector size: ${augmented[0].input.length} (7 user features + 7 pet features)`);
