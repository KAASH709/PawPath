// Vercel Serverless Function: POST /api/match
// Accepts { prompt } and returns ranked pet matches with AI compatibility scores.

const OpenAI = require('openai');

// ── Pet Database ─────────────────────────────────────────────────────────────
// Mirror of the PETS array in app.js, extended with AI-matching fields.
const PETS = [
    {
        id: "buddy",
        name: "Buddy",
        species: "dog",
        breed: "Golden Retriever",
        size: "large",
        age: "2 years",
        img: "assets/buddy.jpg",
        energy: "medium",
        apartment_friendly: false,
        good_with_kids: true,
        shedding: "high",
        alone_tolerance: "medium",
        description: "A gentle and loving companion who enjoys outdoor walks and cuddles. Great with kids and other pets. Buddy is housebroken and responds well to basic commands. He loves playing fetch and swimming."
    },
    {
        id: "luna",
        name: "Luna",
        species: "cat",
        breed: "Tabby Cat",
        size: "small",
        age: "1 year",
        img: "assets/luna.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "low",
        alone_tolerance: "high",
        description: "Luna is a curious and playful tabby who loves sunny window spots and interactive toys. She is gentle, quiet and low-maintenance — perfect for apartment living."
    },
    {
        id: "max",
        name: "Max",
        species: "dog",
        breed: "Black Labrador",
        size: "large",
        age: "3 years",
        img: "assets/max.jpg",
        energy: "high",
        apartment_friendly: false,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "low",
        description: "Max is a healthy, energetic Labrador who needs an active family with a yard. He is fully trained and loves to swim. Currently in urgent need of a home."
    },
    {
        id: "bella",
        name: "Bella",
        species: "cat",
        breed: "Persian Cat",
        size: "small",
        age: "4 years",
        img: "assets/bella.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "medium",
        alone_tolerance: "high",
        description: "Bella is a gorgeous white Persian with piercing blue eyes. She loves quiet homes and will reward you with head-bumps and purrs. Requires regular grooming."
    },
    {
        id: "charlie",
        name: "Charlie",
        species: "dog",
        breed: "Beagle",
        size: "medium",
        age: "1.5 years",
        img: "assets/charlie.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "low",
        alone_tolerance: "medium",
        description: "Charlie is a joyful Beagle with a wonderful personality. He gets along with everyone — kids, dogs and cats. He thrives with regular walks and playtime."
    },
    {
        id: "daisy",
        name: "Daisy",
        species: "dog",
        breed: "Pembroke Welsh Corgi",
        size: "small",
        age: "1 year",
        img: "assets/daisy.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "high",
        description: "Daisy is a spiritful Corgi who loves attention and short walks. She is very affectionate and gets along well with children. Perfect for a loving family home."
    },
    {
        id: "milo",
        name: "Milo",
        species: "cat",
        breed: "Orange Tabby",
        size: "small",
        age: "2 years",
        img: "assets/milo.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "medium",
        alone_tolerance: "high",
        description: "Milo is a classic orange tabby with a heart of gold. He loves human company and will follow you around the house for some head scratches."
    },
    {
        id: "cooper",
        name: "Cooper",
        species: "dog",
        breed: "Border Collie",
        size: "large",
        age: "2.5 years",
        img: "assets/cooper.jpg",
        energy: "high",
        apartment_friendly: false,
        good_with_kids: true,
        shedding: "high",
        alone_tolerance: "low",
        description: "Cooper is a highly intelligent Border Collie who needs a job to do. Ideal for an active owner who loves training and outdoor activities."
    },
    {
        id: "coco",
        name: "Coco",
        species: "cat",
        breed: "Siamese",
        size: "small",
        age: "3 years",
        img: "assets/coco.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "low",
        alone_tolerance: "high",
        description: "Coco is a beautiful Siamese who loves to be the center of attention. She is very vocal and will let you know when she wants playtime or treats."
    },
    {
        id: "oliver",
        name: "Oliver",
        species: "dog",
        breed: "French Bulldog",
        size: "small",
        age: "4 years",
        img: "assets/oliver.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "low",
        alone_tolerance: "medium",
        description: "Oliver is a typical Frenchie who loves napping as much as he loves short play sessions. He is great with kids and very low maintenance."
    },
    {
        id: "simba",
        name: "Simba",
        species: "cat",
        breed: "Ginger Maine Coon Mix",
        size: "medium",
        age: "5 years",
        img: "assets/simba.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "medium",
        description: "Simba is a large, fluffy ginger cat who is a true gentle giant. He loves lounging in the sun and is surprisingly active for his size."
    },
    {
        id: "bailey",
        name: "Bailey",
        species: "dog",
        breed: "Cocker Spaniel",
        size: "medium",
        age: "2 years",
        img: "assets/bailey.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "high",
        alone_tolerance: "medium",
        description: "Bailey is a sweet and happy Cocker Spaniel who loves everyone she meets. She thrives on companionship and gentle walks."
    },
    {
        id: "nala",
        name: "Nala",
        species: "cat",
        breed: "Calico",
        size: "small",
        age: "1.5 years",
        img: "assets/nala.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "medium",
        alone_tolerance: "high",
        description: "Nala is a beautiful calico cat who enjoys watching the world from a high bookshelf. She is independent but appreciates a good scratching session."
    },
    {
        id: "teddy",
        name: "Teddy",
        species: "dog",
        breed: "Toy Poodle",
        size: "small",
        age: "3 years",
        img: "assets/teddy.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "low",
        alone_tolerance: "high",
        description: "Teddy is a charming little poodle who is always ready for a walk. He is very clever and learns tricks quickly. Currently in urgent need of rehoming."
    },
    {
        id: "cleo",
        name: "Cleo",
        species: "cat",
        breed: "Abyssinian",
        size: "small",
        age: "2 years",
        img: "assets/cleo.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "low",
        alone_tolerance: "medium",
        description: "Cleo is a sleek and active Abyssinian who loves to climb and explore. She is very intelligent and needs interactive toys to keep her busy."
    },
    {
        id: "kopi",
        name: "Kopi",
        species: "dog",
        breed: "Singapore Special",
        size: "medium",
        age: "2 years",
        img: "assets/kopi.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "medium",
        description: "Kopi is a classic Singapore Special—intelligent, resilient, and incredibly loyal. He loves long walks and will be your best friend for life."
    },
    {
        id: "mochi",
        name: "Mochi",
        species: "cat",
        breed: "Local Kitten",
        size: "small",
        age: "4 months",
        img: "assets/mochi.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "low",
        alone_tolerance: "low",
        description: "Mochi is a bundle of joy! This tiny kitten loves chasing yarn and climbing everything she can find. She will need a family that can keep up with her energy."
    },
    {
        id: "hoppy",
        name: "Hoppy",
        species: "rabbit",
        breed: "Mixed Breed Rabbit",
        size: "small",
        age: "1 year",
        img: "assets/hoppy.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "medium",
        description: "Hoppy is a gentle rabbit who enjoys a quiet environment and plenty of fresh hay. He can be a bit shy at first but warms up with gentle handling."
    },
    {
        id: "bao",
        name: "Bao",
        species: "guinea_pig",
        breed: "Smooth-haired Guinea Pig",
        size: "small",
        age: "8 months",
        img: "assets/bao.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "low",
        alone_tolerance: "low",
        description: "Bao is a very social guinea pig who will squeak loudly whenever he hears the fridge open! He loves his leafy greens and enjoys being around people."
    },
    {
        id: "rex_snr",
        name: "Rex",
        species: "dog",
        breed: "German Shepherd Mix",
        size: "large",
        age: "9 years",
        img: "assets/rex.jpg",
        energy: "low",
        apartment_friendly: false,
        good_with_kids: true,
        shedding: "high",
        alone_tolerance: "high",
        description: "Rex is a mature gentleman who just wants a quiet spot to nap. He is very calm on the leash and loves gentle head scratches. Perfect for a relaxed household."
    },
    {
        id: "truffle",
        name: "Truffle",
        species: "cat",
        breed: "Long-haired Cross",
        size: "medium",
        age: "3 years",
        img: "assets/truffle.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "high",
        alone_tolerance: "medium",
        description: "Truffle is a beautiful long-haired cat with a very affectionate personality. She loves being brushed and will reward you with constant purring."
    },
    {
        id: "speedy",
        name: "Speedy",
        species: "hamster",
        breed: "Dwarf Hamster",
        size: "small",
        age: "6 months",
        img: "assets/speedy.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "none",
        alone_tolerance: "high",
        description: "Speedy lives up to his name! He is incredibly active at night and loves running on his wheel or digging in his sand bath."
    },
    {
        id: "shelly",
        name: "Shelly",
        species: "terrapin",
        breed: "Red-eared Slider",
        size: "small",
        age: "5 years",
        img: "assets/shelly.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "none",
        alone_tolerance: "high",
        description: "Shelly is a low-maintenance companion who enjoys basking under her heat lamp and swimming in her tank. She is very independent and quiet."
    },
    {
        id: "lola",
        name: "Lola",
        species: "dog",
        breed: "Singapore Special",
        size: "medium",
        age: "4 years",
        img: "assets/lola.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "medium",
        alone_tolerance: "medium",
        description: "Lola is a shy Singapore Special who needs a patient owner to help her come out of her shell. Once she trusts you, she is the sweetest dog you will ever meet."
    },
    {
        id: "shadow",
        name: "Shadow",
        species: "cat",
        breed: "Local Tabby",
        size: "medium",
        age: "12 years",
        img: "assets/shadow.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "high",
        description: "Shadow is a wise old tabby who has seen it all. He is very quiet and spends most of his day napping in the sun. He is perfect for someone looking for a low-energy companion."
    },
    {
        id: "brownie",
        name: "Brownie",
        species: "dog",
        breed: "Singapore Special",
        size: "medium",
        age: "3 years",
        img: "assets/brownie.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "medium",
        description: "Brownie is an active Singapore Special who never tires of playing fetch. He is super sociable and gets along great with other dogs."
    },
    {
        id: "snowy",
        name: "Snowy",
        species: "cat",
        breed: "Local White Cat",
        size: "medium",
        age: "2 years",
        img: "assets/snowy.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "high",
        description: "Snowy is a beautiful all-white cat who loves nothing more than lounging in a sunny spot all day. She is very gentle and perfect for a quiet home."
    },
    {
        id: "nibbles",
        name: "Nibbles",
        species: "rabbit",
        breed: "Netherland Dwarf Mix",
        size: "small",
        age: "1.5 years",
        img: "assets/nibbles.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "low",
        alone_tolerance: "medium",
        description: "Nibbles is a tiny bundle of energy! Despite his size, he has a big personality and loves exploring his surroundings. He is very fond of Timothy hay."
    },
    {
        id: "cookie",
        name: "Cookie",
        species: "guinea_pig",
        breed: "Rex Guinea Pig",
        size: "small",
        age: "1 year",
        img: "assets/cookie.jpg",
        energy: "medium",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "low",
        alone_tolerance: "low",
        description: "Cookie has the softest curly fur you have ever felt. She is a very vocal girl who will wheek loudly the moment she hears vegetables being prepared!"
    },
    {
        id: "bear",
        name: "Bear",
        species: "dog",
        breed: "Chow Chow Mix",
        size: "large",
        age: "5 years",
        img: "assets/bear.jpg",
        energy: "low",
        apartment_friendly: false,
        good_with_kids: false,
        shedding: "high",
        alone_tolerance: "high",
        description: "Bear is a majestic Chow Chow mix with a thick, fluffy coat. He is somewhat independent but fiercely loyal to those he trusts. Best in an experienced home."
    },
    {
        id: "ginger_kit",
        name: "Ginger",
        species: "cat",
        breed: "Local Orange Tabby",
        size: "small",
        age: "5 months",
        img: "assets/ginger_kit.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "low",
        description: "Ginger is a classic orange tabby kitten with a mischievous streak. She loves climbing to the highest point in the room to survey her kingdom."
    },
    {
        id: "flash",
        name: "Flash",
        species: "hamster",
        breed: "Roborovski Hamster",
        size: "small",
        age: "4 months",
        img: "assets/flash.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: false,
        shedding: "none",
        alone_tolerance: "high",
        description: "Flash is a tiny Robo hamster known for his incredible speed. He is very active at night and is fascinating to watch as he scurries through tunnels."
    },
    {
        id: "tank",
        name: "Tank",
        species: "terrapin",
        breed: "Malayan Box Turtle",
        size: "small",
        age: "8 years",
        img: "assets/tank.jpg",
        energy: "low",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "none",
        alone_tolerance: "high",
        description: "Tank is a Malayan Box Turtle who lives up to his name. He is very steady and quiet, spending his days between the water and his favorite basking spot."
    },
    {
        id: "pepper",
        name: "Pepper",
        species: "dog",
        breed: "Singapore Special Puppy",
        size: "small",
        age: "6 months",
        img: "assets/pepper_pup.jpg",
        energy: "high",
        apartment_friendly: true,
        good_with_kids: true,
        shedding: "medium",
        alone_tolerance: "low",
        description: "Pepper is a smart and bouncy puppy who is eager to learn. She needs a family that can provide consistent training and plenty of socialization."
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
  "species": "dog" | "cat" | "rabbit" | "guinea_pig" | "hamster" | "terrapin" | "any" | null,
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
