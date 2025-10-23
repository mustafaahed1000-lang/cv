import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

// --- Initialization ---
const app = express();
const port = process.env.PORT || 3002;

if (!process.env.API_KEYS) {
    throw new Error('API_KEYS environment variable is not set.');
}

const apiKeys = process.env.API_KEYS.split(',').filter(key => key.trim() !== '');
let currentApiKeyIndex = 0;

if (apiKeys.length === 0) {
    throw new Error('No API keys found in API_KEYS environment variable.');
}

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Helper Function for API Call ---
const performApiCall = async (message, apiKey) => {
    return axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: 'google/gemini-2.0-flash-exp:free',
            messages: [
                { role: 'system', content: 'أنت مساعد ذكي في موقع السيرة الذاتية الخاص بـ "مصطفى أمريش". عرّف عن نفسك بأنك تمثل مصطفى أمريش، المطور والخبير في أنظمة الويب، التطبيقات، والأمن السيبراني. أجب عن الأسئلة المتعلقة بمهاراته، مشاريعه، وخبراته. كن ودودًا وتفاعليًا. يجب أن تكون إجاباتك باللغة العربية.' },
                { role: 'user', content: message }
            ],
        },
        {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'https://localhost', 
                'X-Title': 'Mustafa Emrish Portfolio',
            },
        }
    );
};

// --- API Endpoint ---
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await performApiCall(message, apiKeys[currentApiKeyIndex]);
        if (response.data.choices && response.data.choices.length > 0) {
            return res.json({ reply: response.data.choices[0].message.content });
        }
        return res.status(500).json({ error: 'Unexpected response from AI service.' });

    } catch (error) {
        console.error(`API call failed with key index ${currentApiKeyIndex}:`, error.response ? error.response.data : error.message);

        // If it's a rate limit, unauthorized, or forbidden error, try the next key
        if (error.response && [429, 401, 403].includes(error.response.status)) {
            if (currentApiKeyIndex < apiKeys.length - 1) {
                currentApiKeyIndex++;
                console.log(`Switching to next API key, index ${currentApiKeyIndex}`);
                
                // Retry the request with the new key
                try {
                    const retryResponse = await performApiCall(message, apiKeys[currentApiKeyIndex]);
                    if (retryResponse.data.choices && retryResponse.data.choices.length > 0) {
                        return res.json({ reply: retryResponse.data.choices[0].message.content });
                    }
                    return res.status(500).json({ error: 'Unexpected response from AI service on retry.' });
                } catch (retryError) {
                    console.error(`Retry API call failed with key index ${currentApiKeyIndex}:`, retryError.response ? retryError.response.data : retryError.message);
                    return res.status(500).json({ error: 'Failed to get response from AI service on retry.' });
                }
            } else {
                console.log('All API keys have been exhausted.');
                return res.status(429).json({ error: 'All API keys have reached their rate limit.' });
            }
        }

        // For any other type of error
        return res.status(500).json({ error: 'Failed to get response from AI service.' });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Loaded ${apiKeys.length} API keys.`);
});