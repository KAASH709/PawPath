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
        prefs.wants_dog !== undefined ? Number(prefs.wants_dog) : 0.5,
        SIZE_MAP[prefs.preferred_size] ?? 0.5,
        ENERGY_MAP[prefs.preferred_energy] ?? 0.5,
        prefs.apartment_friendly !== undefined ? Number(prefs.apartment_friendly) : 0.5,
        prefs.has_kids !== undefined ? Number(prefs.has_kids) : 0.5,
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
    { id: 'charlie', species: 'dog', species: 'dog', size: 'medium', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'daisy', species: 'dog', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'milo', species: 'cat', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: false, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'cooper', species: 'dog', size: 'large', energy: 'high', apartment_friendly: false, good_with_kids: true, shedding: 'high', alone_tolerance: 'low' },
    { id: 'coco', species: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'high' },
    { id: 'oliver', species: 'dog', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'simba', species: 'cat', size: 'medium', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'bailey', species: 'dog', size: 'medium', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'high', alone_tolerance: 'medium' },
    { id: 'nala', species: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'teddy', species: 'dog', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'high' },
    { id: 'cleo', species: 'cat', size: 'small', energy: 'high', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'medium' }
];

// ── User-preference archetypes ────────────────────────────────────
// We define representative user-preference profiles and for each
// profile we specify which pets they would realistically like.
const ARCHETYPES = [
    // 1. HARD CAT PERSON: Only wants cats, hates dogs (Luna, Coco, Nala, Bella)
    {
        prefs: { wants_dog: 0.0, preferred_size: 'small', preferred_energy: 'low', apartment_friendly: true, has_kids: false, max_shedding: 'low', alone_tolerance_needed: 'high' },
        likes: ['luna', 'coco', 'nala', 'bella'],
        dislikes: ['buddy', 'max', 'charlie', 'daisy', 'cooper', 'oliver']
    },
    // 2. SOFT CAT PERSON: Prefers cats, but traits match Daisy/Oliver (Luna, Coco, Daisy, Oliver)
    {
        prefs: { wants_dog: 0.2, preferred_size: 'small', preferred_energy: 'low', apartment_friendly: true, has_kids: true, max_shedding: 'low', alone_tolerance_needed: 'high' },
        likes: ['luna', 'coco', 'daisy', 'oliver'],
        dislikes: ['max', 'buddy', 'cooper', 'cleo']
    },
    // 3. HARD DOG PERSON: Only wants dogs, ignores cats
    {
        prefs: { wants_dog: 1.0, preferred_size: 'large', preferred_energy: 'high', apartment_friendly: false, has_kids: true, max_shedding: 'high', alone_tolerance_needed: 'low' },
        likes: ['max', 'buddy', 'cooper'],
        dislikes: ['luna', 'bella', 'coco', 'nala', 'milo']
    },
    // 4. SOFT DOG PERSON: Wants dog, but might take a high-energy cat (Simba, Cleo)
    {
        prefs: { wants_dog: 0.8, preferred_size: 'medium', preferred_energy: 'high', apartment_friendly: true, has_kids: true, max_shedding: 'medium', alone_tolerance_needed: 'medium' },
        likes: ['charlie', 'bailey', 'simba', 'cleo'],
        dislikes: ['luna', 'bella', 'coco']
    },
    // 5. APARTMENT CALM (Cat query fallback)
    {
        prefs: { wants_dog: 0.0, preferred_size: 'small', preferred_energy: 'low', apartment_friendly: true, has_kids: false, max_shedding: 'medium', alone_tolerance_needed: 'high' },
        likes: ['bella', 'luna', 'coco', 'milo', 'nala'],
        dislikes: ['max', 'buddy', 'cooper', 'charlie']
    },
    // 6. FAMILY SMALL (Daisy/Teddy/Oliver)
    {
        prefs: { wants_dog: 1.0, preferred_size: 'small', preferred_energy: 'medium', apartment_friendly: true, has_kids: true, max_shedding: 'low', alone_tolerance_needed: 'high' },
        likes: ['daisy', 'teddy', 'oliver', 'charlie'],
        dislikes: ['max', 'buddy', 'luna', 'bella']
    },
    // 7. BALANCED MIX (Open to all)
    {
        prefs: { wants_dog: 0.5, preferred_size: 'medium', preferred_energy: 'medium', apartment_friendly: true, has_kids: true, max_shedding: 'low', alone_tolerance_needed: 'medium' },
        likes: ['charlie', 'luna', 'bailey', 'simba', 'teddy'],
        dislikes: ['max', 'cooper', 'cleo']
    }
];

// ── Build training samples ────────────────────────────────────────
const trainingData = [];

ARCHETYPES.forEach(({ prefs, likes, dislikes }) => {
    const userVec = encodeUser(prefs);

    // Liked pets → label 0.92 (smoothing prevents saturation at 1.0)
    likes.forEach(petId => {
        const pet = PETS.find(p => p.id === petId);
        if (!pet) return;
        trainingData.push({ input: [...userVec, ...encodePet(pet)], output: [0.92] });
    });

    // Disliked pets → label 0.08 (smoothing prevents saturation at 0.0)
    dislikes.forEach(petId => {
        const pet = PETS.find(p => p.id === petId);
        if (!pet) return;
        trainingData.push({ input: [...userVec, ...encodePet(pet)], output: [0.08] });
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
