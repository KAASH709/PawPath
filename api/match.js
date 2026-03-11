// Vercel Serverless Function: POST /api/match
// Accepts { prompt } and returns ranked pet matches with AI compatibility scores.

const OpenAI = require('openai');

// ── Pet Database ─────────────────────────────────────────────────────────────
// Mirror of the PETS array in app.js, extended with AI-matching fields.
const PETS = [
    {
        id: 'buddy', name: 'Buddy', species: 'dog', breed: 'Golden Retriever',
        size: 'large', age: '2 years', img: 'assets/buddy.jpg',
        energy: 'medium', apartment_friendly: false,
        good_with_kids: true, shedding: 'high', alone_tolerance: 'medium',
        description: 'A gentle and loving companion who enjoys outdoor walks and cuddles. Great with kids and other pets. Fully house-trained and responds well to commands.'
    },
    {
        id: 'luna', name: 'Luna', species: 'cat', breed: 'Tabby Cat',
        size: 'small', age: '1 year', img: 'assets/luna.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: false, shedding: 'low', alone_tolerance: 'high',
        description: 'A curious and playful tabby who loves sunny window spots. Gentle, quiet and very low-maintenance — perfect for apartment living.'
    },
    {
        id: 'max', name: 'Max', species: 'dog', breed: 'Black Labrador',
        size: 'large', age: '3 years', img: 'assets/max.jpg',
        energy: 'high', apartment_friendly: false,
        good_with_kids: true, shedding: 'medium', alone_tolerance: 'low',
        description: 'A healthy, energetic Labrador who needs an active family with a yard. Fully trained and loves to swim. Currently in urgent need of a home.'
    },
    {
        id: 'bella', name: 'Bella', species: 'cat', breed: 'Persian Cat',
        size: 'small', age: '4 years', img: 'assets/bella.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: false, shedding: 'medium', alone_tolerance: 'high',
        description: 'A gorgeous white Persian with piercing blue eyes. Loves quiet homes and rewards you with head-bumps and purrs. Requires regular grooming.'
    },
    {
        id: 'charlie', name: 'Charlie', species: 'dog', breed: 'Beagle',
        size: 'medium', age: '1.5 years', img: 'assets/charlie.jpg',
        energy: 'medium', apartment_friendly: true,
        good_with_kids: true, shedding: 'low', alone_tolerance: 'medium',
        description: 'A joyful Beagle who gets along with everyone — kids, dogs and cats. Thrives with regular walks and playtime. Great personality for families.'
    }
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Deterministic hard-filter using extracted preferences
function filterPets(pets, prefs) {
    return pets.filter(pet => {
        // Species must match if specified
        if (prefs.species && prefs.species !== 'any' && pet.species !== prefs.species) return false;
        // Apartment: only exclude if user needs apartment-friendly AND pet is not
        if (prefs.apartment_friendly === true && !pet.apartment_friendly) return false;
        // Kids: only exclude if user has kids AND pet is not good with kids
        if (prefs.good_with_kids === true && !pet.good_with_kids) return false;
        return true;
    });
}

// ── Main Handler ──────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
    setCorsHeaders(res);

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
        return res.status(400).json({ error: 'Please provide a prompt describing your ideal pet.' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in Vercel environment variables.' });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        // ── Call 1: Extract structured preferences ────────────────────────────────
        const extractRes = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are a pet adoption assistant. Extract structured preferences from the user's description of their ideal pet.
Return ONLY valid JSON with these exact fields (use null if not mentioned):
{
  "species": "dog" | "cat" | "any" | null,
  "size": "small" | "medium" | "large" | "any" | null,
  "energy": "low" | "medium" | "high" | null,
  "apartment_friendly": true | false | null,
  "good_with_kids": true | false | null,
  "shedding": "low" | "medium" | "high" | null,
  "alone_tolerance": "low" | "medium" | "high" | null
}`
                },
                { role: 'user', content: prompt }
            ]
        });

        let prefs;
        try {
            prefs = JSON.parse(extractRes.choices[0].message.content);
        } catch {
            prefs = {};
        }

        // ── Deterministic Filter ──────────────────────────────────────────────────
        let candidates = filterPets(PETS, prefs);

        // If filter is too strict, fall back to all pets
        if (candidates.length === 0) candidates = PETS;

        // ── Call 2: Compatibility Scoring ─────────────────────────────────────────
        const scoreRes = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.3,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are a compassionate pet adoption officer. Given a user's lifestyle profile and a list of candidate pets, score each pet's compatibility with the user on a scale of 0–100 and write a warm, specific 1-sentence explanation.
Return ONLY valid JSON: { "results": [ { "pet_id": string, "compatibility_score": number, "reason": string } ] }
Order by compatibility_score descending.`
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        user_prompt: prompt,
                        extracted_preferences: prefs,
                        candidate_pets: candidates.map(p => ({
                            id: p.id, name: p.name, species: p.species, breed: p.breed,
                            size: p.size, age: p.age, energy: p.energy,
                            apartment_friendly: p.apartment_friendly,
                            good_with_kids: p.good_with_kids, shedding: p.shedding,
                            alone_tolerance: p.alone_tolerance, description: p.description
                        }))
                    })
                }
            ]
        });

        let scored;
        try {
            scored = JSON.parse(scoreRes.choices[0].message.content);
        } catch {
            scored = { results: [] };
        }

        // Attach full pet data to each result
        const results = (scored.results || [])
            .map(r => {
                const pet = PETS.find(p => p.id === r.pet_id);
                if (!pet) return null;
                return {
                    id: pet.id,
                    name: pet.name,
                    breed: pet.breed,
                    age: pet.age,
                    img: pet.img,
                    compatibility_score: Math.round(r.compatibility_score),
                    reason: r.reason
                };
            })
            .filter(Boolean)
            .slice(0, 5);

        return res.status(200).json({ results, preferences: prefs });

    } catch (err) {
        console.error('AI match error:', err);
        const msg = err?.message || 'An error occurred while processing your request.';
        return res.status(500).json({ error: msg });
    }
};
