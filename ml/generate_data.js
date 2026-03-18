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
 * Converts a pet object into a 12-element numeric vector.
 * [is_dog, is_cat, is_rabbit, is_guinea_pig, is_hamster, is_terrapin, size, energy, apartment_friendly, good_with_kids, shedding, alone_tolerance]
 */
function encodePet(pet) {
    return [
        pet.species === 'dog' ? 1 : 0,
        pet.species === 'cat' ? 1 : 0,
        pet.species === 'rabbit' ? 1 : 0,
        pet.species === 'guinea_pig' ? 1 : 0,
        pet.species === 'hamster' ? 1 : 0,
        pet.species === 'terrapin' ? 1 : 0,
        SIZE_MAP[pet.size] ?? 0.5,
        ENERGY_MAP[pet.energy] ?? 0.5,
        pet.apartment_friendly ? 1 : 0,
        pet.good_with_kids ? 1 : 0,
        SHEDDING_MAP[pet.shedding] ?? 0.5,
        ALONE_MAP[pet.alone_tolerance] ?? 0.5,
    ];
}

/**
 * Converts a user-preference object into the same 12-element schema.
 */
function encodeUser(prefs) {
    return [
        prefs.wants_dog !== undefined ? Number(prefs.wants_dog) : 0,
        prefs.wants_cat !== undefined ? Number(prefs.wants_cat) : 0,
        prefs.wants_rabbit !== undefined ? Number(prefs.wants_rabbit) : 0,
        prefs.wants_guinea_pig !== undefined ? Number(prefs.wants_guinea_pig) : 0,
        prefs.wants_hamster !== undefined ? Number(prefs.wants_hamster) : 0,
        prefs.wants_terrapin !== undefined ? Number(prefs.wants_terrapin) : 0,
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
const SYNTH_USER_COUNT = parseInt(process.env.SYNTH_USER_COUNT, 10) || 50;
// Compatibility threshold for a pet to be considered "liked" by a synthetic user
const POSITIVE_THRESHOLD = parseFloat(process.env.POSITIVE_THRESHOLD) || 0.5;

/** Helper: sample a Dirichlet distribution with α = 1 (uniform) for 6 species */
// Array of species to pick from
const SPECIES_LIST = ['dog', 'cat', 'rabbit', 'guinea_pig', 'hamster', 'terrapin'];

/** Helper: map a numeric preference (0‑1) to a categorical value used by encodeUser */
function mapToCategory(value, low, medium, high) {
    if (value < 0.33) return low;
    if (value < 0.66) return medium;
    return high;
}

/** Generate a synthetic user preference object compatible with encodeUser */
function generateSyntheticUser() {
    // Pick a random primary species focus
    const favoredSpecies = SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)];

    // We can simulate an occasional user who "kind of" likes a second species,
    // but typically they strongly prefer the favored species.
    const secondarySpecies = (Math.random() < 0.2) ? SPECIES_LIST[Math.floor(Math.random() * SPECIES_LIST.length)] : favoredSpecies;

    const prefSizeNum = Math.random(); // 0‑1
    const prefEnergyNum = Math.random();
    const sheddingNum = Math.random();
    const aloneNum = Math.random();

    return {
        wants_dog: (favoredSpecies === 'dog' ? 1 : (secondarySpecies === 'dog' ? 0.5 : 0)),
        wants_cat: (favoredSpecies === 'cat' ? 1 : (secondarySpecies === 'cat' ? 0.5 : 0)),
        wants_rabbit: (favoredSpecies === 'rabbit' ? 1 : (secondarySpecies === 'rabbit' ? 0.5 : 0)),
        wants_guinea_pig: (favoredSpecies === 'guinea_pig' ? 1 : (secondarySpecies === 'guinea_pig' ? 0.5 : 0)),
        wants_hamster: (favoredSpecies === 'hamster' ? 1 : (secondarySpecies === 'hamster' ? 0.5 : 0)),
        wants_terrapin: (favoredSpecies === 'terrapin' ? 1 : (secondarySpecies === 'terrapin' ? 0.5 : 0)),
        favored_species_string: favoredSpecies, // Used purely for ground truth label below
        preferred_size: mapToCategory(prefSizeNum, 'small', 'medium', 'large'),
        preferred_energy: mapToCategory(prefEnergyNum, 'low', 'medium', 'high'),
        apartment_friendly: Math.random() < 0.7, // most users live in apartments
        has_kids: Math.random() < 0.4,
        max_shedding: mapToCategory(sheddingNum, 'low', 'medium', 'high'),
        alone_tolerance_needed: mapToCategory(aloneNum, 'low', 'medium', 'high')
    };
}

/** Compute a simple compatibility score between a user and a pet */
function compatibilityScore(userPrefs, pet) {
    // Exact species match gives a base 0.8
    const speciesMatch = (userPrefs.favored_species_string === pet.species) ? 0.8 : 0;
    // Boost if energy/size match user preferences
    const energyMatch = (userPrefs.preferred_energy === pet.energy) ? 0.1 : 0;
    const sizeMatch = (userPrefs.preferred_size === pet.size) ? 0.1 : 0;
    return speciesMatch + energyMatch + sizeMatch;
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
