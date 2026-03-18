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

const SPECIES_MAP = { dog: 1, cat: 0, rabbit: 0.25, guinea_pig: 0.5, hamster: 0.75, terrapin: 0.85 };
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
    { id: 'charlie', species: 'dog', size: 'medium', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'daisy', species: 'dog', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'milo', species: 'cat', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: false, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'cooper', species: 'dog', size: 'large', energy: 'high', apartment_friendly: false, good_with_kids: true, shedding: 'high', alone_tolerance: 'low' },
    { id: 'coco', species: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'high' },
    { id: 'oliver', species: 'dog', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'simba', species: 'cat', size: 'medium', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'bailey', species: 'dog', size: 'medium', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'high', alone_tolerance: 'medium' },
    { id: 'nala', species: 'cat', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'teddy', species: 'dog', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'high' },
    { id: 'cleo', species: 'cat', size: 'small', energy: 'high', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'kopi', species: 'dog', size: 'medium', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'mochi', species: 'cat', size: 'small', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'low' },
    { id: 'hoppy', species: 'rabbit', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'bao', species: 'guinea_pig', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'low' },
    { id: 'rex_snr', species: 'dog', size: 'large', energy: 'low', apartment_friendly: false, good_with_kids: true, shedding: 'high', alone_tolerance: 'high' },
    { id: 'truffle', species: 'cat', size: 'medium', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'high', alone_tolerance: 'medium' },
    { id: 'speedy', species: 'hamster', size: 'small', energy: 'high', apartment_friendly: true, good_with_kids: false, shedding: 'none', alone_tolerance: 'high' },
    { id: 'shelly', species: 'terrapin', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'none', alone_tolerance: 'high' },
    { id: 'lola', species: 'dog', size: 'medium', energy: 'medium', apartment_friendly: true, good_with_kids: false, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'shadow', species: 'cat', size: 'medium', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'brownie', species: 'dog', size: 'medium', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium' },
    { id: 'snowy', species: 'cat', size: 'medium', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'high' },
    { id: 'nibbles', species: 'rabbit', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'medium' },
    { id: 'cookie', species: 'guinea_pig', size: 'small', energy: 'medium', apartment_friendly: true, good_with_kids: true, shedding: 'low', alone_tolerance: 'low' },
    { id: 'bear', species: 'dog', size: 'large', energy: 'low', apartment_friendly: false, good_with_kids: false, shedding: 'high', alone_tolerance: 'high' },
    { id: 'ginger_kit', species: 'cat', size: 'small', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'low' },
    { id: 'flash', species: 'hamster', size: 'small', energy: 'high', apartment_friendly: true, good_with_kids: false, shedding: 'none', alone_tolerance: 'high' },
    { id: 'tank', species: 'terrapin', size: 'small', energy: 'low', apartment_friendly: true, good_with_kids: true, shedding: 'none', alone_tolerance: 'high' },
    { id: 'pepper', species: 'dog', size: 'small', energy: 'high', apartment_friendly: true, good_with_kids: true, shedding: 'medium', alone_tolerance: 'low' },
    { id: 'misty_cat', species: 'cat', size: 'medium', energy: 'low', apartment_friendly: true, good_with_kids: false, shedding: 'low', alone_tolerance: 'high' }
];

// ---------------------------------------------------------------------------
// Synthetic User‑Pattern Generation (replaces the static ARCHETYPES block)
// ---------------------------------------------------------------------------

// Number of synthetic users to generate – can be overridden via .env
const SYNTH_USER_COUNT = parseInt(process.env.SYNTH_USER_COUNT, 10) || 5000;
// Compatibility threshold for a pet to be considered "liked" by a synthetic user
const POSITIVE_THRESHOLD = parseFloat(process.env.POSITIVE_THRESHOLD) || 0.5;

/** Helper: sample a Dirichlet distribution with α = 1 (uniform) for 6 species */
function sampleSpeciesPrefs() {
    const draws = Array.from({ length: 6 }, () => Math.random());
    const sum = draws.reduce((a, b) => a + b, 0);
    return draws.map(v => v / sum);
}

/** Helper: map a numeric preference (0‑1) to a categorical value used by encodeUser */
function mapToCategory(value, low, medium, high) {
    if (value < 0.33) return low;
    if (value < 0.66) return medium;
    return high;
}

/** Generate a synthetic user preference object compatible with encodeUser */
function generateSyntheticUser() {
    const [wDog, wCat, wRabbit, wGuinea, wHamster, wTerrapin] = sampleSpeciesPrefs();
    const prefSizeNum = Math.random(); // 0‑1
    const prefEnergyNum = Math.random();
    const sheddingNum = Math.random();
    const aloneNum = Math.random();

    return {
        wants_dog: wDog,
        wants_cat: wCat,
        wants_rabbit: wRabbit,
        wants_guinea_pig: wGuinea,
        wants_hamster: wHamster,
        wants_terrapin: wTerrapin,
        preferred_size: mapToCategory(prefSizeNum, 'small', 'medium', 'large'),
        preferred_energy: mapToCategory(prefEnergyNum, 'low', 'medium', 'high'),
        apartment_friendly: Math.random() < 0.7, // most users live in apartments
        has_kids: Math.random() < 0.4,
        max_shedding: mapToCategory(sheddingNum, 'low', 'medium', 'high'),
        alone_tolerance_needed: mapToCategory(aloneNum, 'low', 'medium', 'high')
    };
}

/** Build a one‑hot species vector for a pet */
function speciesVector(pet) {
    return [
        pet.species === 'dog' ? 1 : 0,
        pet.species === 'cat' ? 1 : 0,
        pet.species === 'rabbit' ? 1 : 0,
        pet.species === 'guinea_pig' ? 1 : 0,
        pet.species === 'hamster' ? 1 : 0,
        pet.species === 'terrapin' ? 1 : 0,
    ];
}

/** Compute a simple compatibility score between a user and a pet */
function compatibilityScore(userPrefs, pet) {
    const speciesPrefs = [
        userPrefs.wants_dog ?? 0,
        userPrefs.wants_cat ?? 0,
        userPrefs.wants_rabbit ?? 0,
        userPrefs.wants_guinea_pig ?? 0,
        userPrefs.wants_hamster ?? 0,
        userPrefs.wants_terrapin ?? 0,
    ];
    const petSpeciesVec = speciesVector(pet);
    // dot‑product of species preferences
    const dot = speciesPrefs.reduce((sum, val, i) => sum + val * petSpeciesVec[i], 0);
    // optional: add small boost if energy/size match user preferences
    const energyMatch = (userPrefs.preferred_energy === pet.energy) ? 0.1 : 0;
    const sizeMatch = (userPrefs.preferred_size === pet.size) ? 0.1 : 0;
    return dot + energyMatch + sizeMatch;
}

/** Generate synthetic users */
const SYNTHETIC_USERS = Array.from({ length: SYNTH_USER_COUNT }, generateSyntheticUser);

// ---------------------------------------------------------------------------
// Build training samples from synthetic users (replaces ARCHETYPES loop)
// ---------------------------------------------------------------------------

const trainingData = [];

SYNTHETIC_USERS.forEach(userPrefs => {
    const userVec = encodeUser(userPrefs);
    PETS.forEach(pet => {
        const score = compatibilityScore(userPrefs, pet);
        const liked = score >= POSITIVE_THRESHOLD;
        const outputVal = liked ? 0.92 : 0.08;
        trainingData.push({ input: [...userVec, ...encodePet(pet)], output: [outputVal] });
    });
});

// ---------------------------------------------------------------------------
// Light augmentation: shuffle & duplicate with small noise (unchanged)
// ---------------------------------------------------------------------------

function jitter(vec, amount = 0.05) {
    return vec.map(v => Math.min(1, Math.max(0, v + (Math.random() - 0.5) * amount)));
}

const augmented = [...trainingData];
trainingData.forEach(sample => {
    augmented.push({ input: jitter(sample.input), output: sample.output });
});

augmented.sort(() => Math.random() - 0.5);

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------

const outPath = path.join(__dirname, 'training_data.json');
fs.writeFileSync(outPath, JSON.stringify(augmented, null, 2));
console.log(`✅  Generated ${augmented.length} training samples → ${outPath}`);
console.log(`    Input vector size: ${augmented[0].input.length} (7 user features + 7 pet features)`);
