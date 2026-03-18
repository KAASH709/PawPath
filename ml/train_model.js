/**
 * train_model.js  (pure-JS, zero dependencies)
 * ─────────────────────────────────────────────────────────────────
 * Implements a simple Multi-Layer Perceptron (MLP) from scratch
 * and trains it on ml/training_data.json.
 *
 * Architecture:  14 → 16 → 16 → 1  (sigmoid activations)
 * Training:      SGD + Backpropagation
 *
 * Outputs:
 *   ml/model.json        – raw weights for inspection
 *   ml/model_export.js   – self-contained browser module (PawML.predict)
 *
 * Run: node ml/train_model.js
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';
const fs = require('fs');
const path = require('path');

// ── Load training data ────────────────────────────────────────────
const DATA_PATH = path.join(__dirname, 'training_data.json');
if (!fs.existsSync(DATA_PATH)) {
  console.error('❌  training_data.json not found. Run generate_data.js first.');
  process.exit(1);
}
const dataset = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
console.log(`📂  Loaded ${dataset.length} training samples.`);

// ── Math helpers ──────────────────────────────────────────────────
const sigmoid = x => 1 / (1 + Math.exp(-x));
const sigmoidDeriv = x => { const s = sigmoid(x); return s * (1 - s); };
const rand = () => (Math.random() - 0.5) * 0.5;

// ── MLP definition ────────────────────────────────────────────────
const LAYERS = [24, 16, 16, 1];

function buildNetwork() {
  const weights = [];
  const biases = [];
  for (let l = 1; l < LAYERS.length; l++) {
    const rows = LAYERS[l], cols = LAYERS[l - 1];
    weights.push(Array.from({ length: rows }, () => Array.from({ length: cols }, rand)));
    biases.push(Array.from({ length: rows }, rand));
  }
  return { weights, biases };
}

function forward(net, input) {
  const zs = [];
  const activations = [input];
  let a = input;
  for (let l = 0; l < net.weights.length; l++) {
    const W = net.weights[l];
    const b = net.biases[l];
    const z = W.map((row, i) => b[i] + row.reduce((s, w, j) => s + w * a[j], 0));
    a = z.map(sigmoid);
    zs.push(z);
    activations.push(a);
  }
  return { zs, activations };
}

function backprop(net, input, target, lr) {
  const { zs, activations } = forward(net, input);
  const L = net.weights.length;
  let delta = activations[L].map((a, i) => 2 * (a - target[i]) * sigmoidDeriv(zs[L - 1][i]));
  for (let l = L - 1; l >= 0; l--) {
    const aIn = activations[l];
    net.weights[l] = net.weights[l].map((row, i) =>
      row.map((w, j) => w - lr * delta[i] * aIn[j])
    );
    net.biases[l] = net.biases[l].map((b, i) => b - lr * delta[i]);
    if (l > 0) {
      const W = net.weights[l];
      delta = activations[l].map((_, j) =>
        W.reduce((s, row, i) => s + row[j] * delta[i], 0) * sigmoidDeriv(zs[l - 1][j])
      );
    }
  }
}

// ── Predict helper ────────────────────────────────────────────────
function predict(net, input) {
  const { activations } = forward(net, input);
  return activations[activations.length - 1][0];
}

// ── Training loop ─────────────────────────────────────────────────
const EPOCHS = 500;
const LR = 0.05;
const LOG_EVERY = 100;

const net = buildNetwork();
console.log(`🧠  Training MLP (${LAYERS.join(' → ')}) for ${EPOCHS} epochs…\n`);

for (let epoch = 1; epoch <= EPOCHS; epoch++) {
  const shuffled = [...dataset].sort(() => Math.random() - 0.5);
  let totalLoss = 0;
  for (const { input, output } of shuffled) {
    const { activations } = forward(net, input);
    const pred = activations[activations.length - 1];
    totalLoss += output.reduce((s, t, i) => s + (pred[i] - t) ** 2, 0);
    backprop(net, input, output, LR);
  }
  if (epoch % LOG_EVERY === 0 || epoch === 1) {
    process.stdout.write(`   Epoch ${String(epoch).padStart(5)} / ${EPOCHS}  |  avg loss: ${(totalLoss / shuffled.length).toFixed(5)}\n`);
  }
}

// ── Sanity checks ─────────────────────────────────────────────────
console.log('\n📊  Sanity checks:');
// 12-element: [dog, cat, rabbit, gp, ham, terr, size, energy, apt, kids, shed, alone]
const catPerson = [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
const lunaVec = [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];
const maxVec = [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0.5, 0];
const activeFam = [1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0];
const aptPerson = [1, 0, 0, 0, 0, 0, 0.5, 0.5, 1, 1, 0, 0.5];
const charlieVec = [1, 0, 0, 0, 0, 0, 0.5, 0.5, 1, 1, 0, 0.5];

console.log(`   Cat person + Luna  (expect HIGH):       ${(predict(net, [...catPerson, ...lunaVec]) * 100).toFixed(1)}%`);
console.log(`   Cat person + Max   (expect LOW):        ${(predict(net, [...catPerson, ...maxVec]) * 100).toFixed(1)}%`);
console.log(`   Active family + Max  (expect HIGH):     ${(predict(net, [...activeFam, ...maxVec]) * 100).toFixed(1)}%`);
console.log(`   Active family + Luna (expect LOW):      ${(predict(net, [...activeFam, ...lunaVec]) * 100).toFixed(1)}%`);
console.log(`   Apt person + Charlie (expect MED-HIGH): ${(predict(net, [...aptPerson, ...charlieVec]) * 100).toFixed(1)}%`);

// ── Save model.json ───────────────────────────────────────────────
const modelJson = { layers: LAYERS, weights: net.weights, biases: net.biases };
fs.writeFileSync(path.join(__dirname, 'model.json'), JSON.stringify(modelJson, null, 2));
console.log(`\n💾  Model saved → ml/model.json`);

// ── Generate browser module ───────────────────────────────────────
const exportCode = `/**
 * model_export.js  (AUTO-GENERATED — do not edit manually)
 * Regenerate: node ml/train_model.js
 *
 * Usage:  PawML.predict(userPrefs, pet)   → number [0-1]
 *         PawML.rankPets(userPrefs, pets) → sorted pet array with .mlScore
 */
(function (global) {
  'use strict';

  const SPECIES_MAP = { dog: 1, cat: 0, rabbit: 0.25, guinea_pig: 0.5, hamster: 0.75, terrapin: 0.85 };
  const SIZE_MAP     = { small: 0, medium: 0.5, large: 1 };
  const ENERGY_MAP   = { low: 0, medium: 0.5, high: 1 };
  const SHEDDING_MAP = { low: 0, medium: 0.5, high: 1 };
  const ALONE_MAP    = { low: 0, medium: 0.5, high: 1 };

  function encodeUser(p) {
    return [
      p.wants_dog !== undefined ? Number(p.wants_dog) : 0,
      p.wants_cat !== undefined ? Number(p.wants_cat) : 0,
      p.wants_rabbit !== undefined ? Number(p.wants_rabbit) : 0,
      p.wants_guinea_pig !== undefined ? Number(p.wants_guinea_pig) : 0,
      p.wants_hamster !== undefined ? Number(p.wants_hamster) : 0,
      p.wants_terrapin !== undefined ? Number(p.wants_terrapin) : 0,
      SIZE_MAP[p.preferred_size]          ?? 0.5,
      ENERGY_MAP[p.preferred_energy]      ?? 0.5,
      p.apartment_friendly !== undefined ? Number(p.apartment_friendly) : 0.5,
      p.has_kids !== undefined ? Number(p.has_kids) : 0.5,
      SHEDDING_MAP[p.max_shedding]        ?? 0.5,
      ALONE_MAP[p.alone_tolerance_needed] ?? 0.5,
    ];
  }

  function encodePet(pet) {
    const s = pet.species ?? pet.type ?? '';
    return [
      s === 'dog' ? 1 : 0,
      s === 'cat' ? 1 : 0,
      s === 'rabbit' ? 1 : 0,
      s === 'guinea_pig' ? 1 : 0,
      s === 'hamster' ? 1 : 0,
      s === 'terrapin' ? 1 : 0,
      SIZE_MAP[pet.size]                   ?? 0.5,
      ENERGY_MAP[pet.energy]               ?? 0.5,
      pet.apartment_friendly ? 1 : 0,
      pet.good_with_kids     ? 1 : 0,
      SHEDDING_MAP[pet.shedding]           ?? 0.5,
      ALONE_MAP[pet.alone_tolerance]       ?? 0.5,
    ];
  }

  const MODEL = ${JSON.stringify(modelJson)};

  function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

  function runNet(input) {
    let a = input;
    for (let l = 0; l < MODEL.weights.length; l++) {
      const W = MODEL.weights[l];
      const b = MODEL.biases[l];
      a = W.map((row, i) => sigmoid(b[i] + row.reduce((s, w, j) => s + w * a[j], 0)));
    }
    return a[0];
  }

  const PawML = {
    /**
     * @param {object} userPrefs  { preferred_species, preferred_size, preferred_energy,
     *                              apartment_friendly, has_kids, max_shedding,
     *                              alone_tolerance_needed }
     *                              apartment_friendly, has_kids, max_shedding,
     *                              alone_tolerance_needed }
     * @param {object} pet        pet object from app.js PETS array
     * @returns {number}          match score 0–1
     */
    predict(userPrefs, pet) {
      return runNet([...encodeUser(userPrefs), ...encodePet(pet)]);
    },

    /**
     * @param {object}   userPrefs
     * @param {object[]} pets
     * @returns {object[]} pets sorted desc by .mlScore
     */
    rankPets(userPrefs, pets) {
      return pets
        .map(p => ({ ...p, mlScore: this.predict(userPrefs, p) }))
        .sort((a, b) => b.mlScore - a.mlScore);
    },
  };

  global.PawML = PawML;
})(typeof window !== 'undefined' ? window : global);
`;

fs.writeFileSync(path.join(__dirname, 'model_export.js'), exportCode);
console.log(`📦  Browser module saved → ml/model_export.js`);
console.log('\n🚀  Done! Add to index.html:\n    <script src="ml/model_export.js"></script>');
