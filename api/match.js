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
        description: 'A gentle and loving companion who enjoys outdoor walks and cuddles. Great with kids and other pets. Fully house-trained.'
    },
    {
        id: 'luna', name: 'Luna', species: 'cat', breed: 'Tabby Cat',
        size: 'small', age: '1 year', img: 'assets/luna.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: false, shedding: 'low', alone_tolerance: 'high',
        description: 'A curious and playful tabby who loves sunny window spots. Gentle and perfect for apartment living.'
    },
    {
        id: 'max', name: 'Max', species: 'dog', breed: 'Black Labrador',
        size: 'large', age: '3 years', img: 'assets/max.jpg',
        energy: 'high', apartment_friendly: false,
        good_with_kids: true, shedding: 'medium', alone_tolerance: 'low',
        description: 'An energetic Labrador who needs an active family with a yard. Fully trained and loves to swim.'
    },
    {
        id: 'bella', name: 'Bella', species: 'cat', breed: 'Persian Cat',
        size: 'small', age: '4 years', img: 'assets/bella.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: false, shedding: 'medium', alone_tolerance: 'high',
        description: 'A gorgeous Persian who loves quiet homes. Rewards you with head-bumps and purrs.'
    },
    {
        id: 'charlie', name: 'Charlie', species: 'dog', breed: 'Beagle',
        size: 'medium', age: '1.5 years', img: 'assets/charlie.jpg',
        energy: 'medium', apartment_friendly: true,
        good_with_kids: true, shedding: 'low', alone_tolerance: 'medium',
        description: 'A joyful Beagle who gets along with everyone. Thrives with regular walks and playtime.'
    },
    {
        id: 'daisy', name: 'Daisy', species: 'dog', breed: 'Pembroke Welsh Corgi',
        size: 'small', age: '1 year', img: 'assets/daisy.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: true, shedding: 'medium', alone_tolerance: 'high',
        description: 'A spirited Corgi who loves attention and short walks. Perfect for a loving family home.'
    },
    {
        id: 'milo', name: 'Milo', species: 'cat', breed: 'Orange Tabby',
        size: 'small', age: '2 years', img: 'assets/milo.jpg',
        energy: 'medium', apartment_friendly: true,
        good_with_kids: false, shedding: 'medium', alone_tolerance: 'high',
        description: 'A classic orange tabby with a heart of gold. Loves human company and head scratches.'
    },
    {
        id: 'cooper', name: 'Cooper', species: 'dog', breed: 'Border Collie',
        size: 'large', age: '2.5 years', img: 'assets/cooper.jpg',
        energy: 'high', apartment_friendly: false,
        good_with_kids: true, shedding: 'high', alone_tolerance: 'low',
        description: 'Highly intelligent and needs a job to do. Ideal for an active owner.'
    },
    {
        id: 'coco', name: 'Coco', species: 'cat', breed: 'Siamese',
        size: 'small', age: '3 years', img: 'assets/coco.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: false, shedding: 'low', alone_tolerance: 'high',
        description: 'A beautiful Siamese who loves attention. Very vocal and loyal.'
    },
    {
        id: 'oliver', name: 'Oliver', species: 'dog', breed: 'French Bulldog',
        size: 'small', age: '4 years', img: 'assets/oliver.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: true, shedding: 'low', alone_tolerance: 'medium',
        description: 'A typical Frenchie who loves napping. Low maintenance and great with kids.'
    },
    {
        id: 'simba', name: 'Simba', species: 'cat', breed: 'Maine Coon Mix',
        size: 'medium', age: '5 years', img: 'assets/simba.jpg',
        energy: 'high', apartment_friendly: true,
        good_with_kids: true, shedding: 'medium', alone_tolerance: 'medium',
        description: 'A large, fluffy ginger cat. True gentle giant who loves lounging.'
    },
    {
        id: 'bailey', name: 'Bailey', species: 'dog', breed: 'Cocker Spaniel',
        size: 'medium', age: '2 years', img: 'assets/bailey.jpg',
        energy: 'medium', apartment_friendly: true,
        good_with_kids: true, shedding: 'high', alone_tolerance: 'medium',
        description: 'A sweet and happy Cocker Spaniel who loves everyone she meets.'
    },
    {
        id: 'nala', name: 'Nala', species: 'cat', breed: 'Calico',
        size: 'small', age: '1.5 years', img: 'assets/nala.jpg',
        energy: 'low', apartment_friendly: true,
        good_with_kids: false, shedding: 'medium', alone_tolerance: 'high',
        description: 'Independent and quiet. Enjoys watching the world from a high bookshelf.'
    },
    {
        id: 'teddy', name: 'Teddy', species: 'dog', breed: 'Toy Poodle',
        size: 'small', age: '3 years', img: 'assets/teddy.jpg',
        energy: 'medium', apartment_friendly: true,
        good_with_kids: true, shedding: 'low', alone_tolerance: 'high',
        description: 'Charming and clever. Hypoallergenic and learns tricks quickly.'
    },
    {
        id: 'cleo', name: 'Cleo', species: 'cat', breed: 'Abyssinian',
        size: 'small', age: '2 years', img: 'assets/cleo.jpg',
        energy: 'high', apartment_friendly: true,
        good_with_kids: false, shedding: 'low', alone_tolerance: 'medium',
        description: 'Sleek and active. Loves to climb and explore. Very inquisitive.'
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
        // Species filter: removed hard exclusion to allow discovery of similar pets 
        // across species if characteristics match (as requested by user).

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

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL || 'https://api.apiyi.com/v1'
    });


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
                    content: `You are a holistic pet adoption officer. Given a user's lifestyle profile and candidates, score each pet's compatibility (0–100).
DISTRUBUTION RULES:
- 95-100%: Perfect alignment (Rare).
- 85-94%: Strong match with minor trade-offs.
- 70-84%: Good match, results in a positive adoption experience.
- <70%: Significant misalignments.
GOAL: Prioritize the user's requested species, but if a pet of another species matches the 'vibe' and traits (e.g. a calm indoor dog for a cat person), give them a fair score (75-85%) for discovery!
Return ONLY valid JSON: { "results": [ { "pet_id": string, "compatibility_score": number, "reason": string } ] }`
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
