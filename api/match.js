const { OpenAI } = require('openai');
const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { prompt } = req.body || {};
        if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

        // Clean env vars (handles quotes/spaces from Vercel dash)
        const SUPABASE_URL = (process.env.SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '');
        const SUPABASE_KEY = (process.env.SUPABASE_ANON_KEY || '').trim().replace(/^["']|["']$/g, '');
        const OPENAI_KEY = (process.env.OPENAI_API_KEY || '').trim().replace(/^["']|["']$/g, '');

        if (!OPENAI_KEY || !SUPABASE_URL) {
            return res.status(500).json({ error: 'Server configuration missing' });
        }

        // 2. Initialize Clients
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const openai = new OpenAI({
            apiKey: OPENAI_KEY,
            baseURL: process.env.OPENAI_BASE_URL || 'https://api.apiyi.com/v1'
        });

        // 3. Fetch Pets
        const { data: dbPets, error: dbError } = await supabase.from('pets').select('*');
        if (dbError) throw new Error(`Database fetch failed: ${dbError.message}`);

        // 4. OpenAI Processing
        const extractRes = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'Extract pet preferences as JSON: { species, size, energy, apartment_friendly, good_with_kids, shedding, alone_tolerance }' },
                { role: 'user', content: prompt }
            ]
        });
        const prefs = JSON.parse(extractRes.choices[0].message.content);

        const scoreRes = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.3,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: 'Score matches (0-100). Return JSON { results: [{ id, compatibility_score, reason }] }' },
                { role: 'user', content: JSON.stringify({ prompt, candidates: dbPets.slice(0, 15) }) }
            ]
        });
        const scored = JSON.parse(scoreRes.choices[0].message.content);

        // 5. Final Response
        const results = (scored.results || []).map(r => {
            const pet = dbPets.find(p => p.id === r.id);
            if (!pet) return null;
            return {
                id: pet.id,
                name: pet.name,
                breed: pet.breed,
                age: pet.age,
                img: pet.img,
                compatibility_score: r.compatibility_score,
                reason: r.reason
            };
        }).filter(Boolean).slice(0, 5);

        return res.status(200).json({ results, preferences: prefs });

    } catch (err) {
        console.error('AI match error:', err);
        return res.status(500).json({ error: 'Failed to process match', message: err.message });
    }
};
