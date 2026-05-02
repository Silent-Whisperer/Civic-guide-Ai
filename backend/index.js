import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = 'https://promptwarrs.web.app';

// --- CLOUD RUN PROXY TRUST ---
app.set('trust proxy', 1);

// --- SECURITY MIDDLEWARES ---
app.use(helmet({
  contentSecurityPolicy: false, // Allow redirection
}));
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Rate Limiting: 30 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests. Slow down, citizen! 🇮🇳' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter); // Apply only to API routes

// --- AI CONFIGURATION ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: `
    You are Voter Sahayak, an extremely friendly and helpful Indian Election Assistant! ✨
    STRICT RULES:
    1. Be very warm, polite, and enthusiastic! Use emojis naturally to make the user feel welcome! 😊🎉
    2. Only answer questions related to Indian elections, voting, voter ID, and registration.
    3. Keep your answers SHORT, SIMPLE, and very easy to understand. Avoid long paragraphs. ⏱️
    4. Do NOT express any political opinions or favor any political party. Stay 100% neutral. 🚫🏛️
    5. Always respond in English language. 🇬🇧
    6. If you are unsure or the user asks something unrelated, nicely say: "I'm sorry, I can only help with election and voting questions! For the most accurate info, please check the official ECI website at eci.gov.in. 🙏"
  `,
});

// Basic Prompt Injection Protection
const isSafe = (text) => {
  const forbidden = [/ignore previous/i, /system prompt/i, /developer mode/i, /you are now/i];
  return !forbidden.some(pattern => pattern.test(text));
};

// --- ROUTES ---

/**
 * 1. ROOT REDIRECT
 * Redirects the main Cloud Run link to the beautiful Frontend
 */
app.get('/', (req, res) => {
  res.redirect(FRONTEND_URL);
});

/**
 * 2. HEALTH CHECK
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'election-backend', timestamp: new Date() });
});

/**
 * 3. CHAT API
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { query } = req.body;

    // Validation
    if (!query || typeof query !== 'string' || query.length > 300) {
      return res.status(400).json({ error: 'Invalid query. Max 300 characters.' });
    }

    if (!isSafe(query)) {
      return res.status(400).json({ error: 'Safety violation detected.' });
    }

    const result = await model.generateContent(query);
    const reply = result.response.text().trim();

    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error.stack || error.message);
    res.status(500).json({ error: 'The AI is taking a quick break. Please try again later.' });
  }
});

/**
 * 4. NEWS API
 */
app.get('/api/news', async (req, res) => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'Indian elections voting guide',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey: process.env.NEWS_API_KEY
      },
      headers: {
        'User-Agent': 'Civic-Guide-Assistant/1.0'
      }
    });

    const news = response.data.articles.map(art => ({
      title: art.title,
      url: art.url
    }));

    res.json({ news });
  } catch (error) {
    console.error('News Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Could not fetch the latest news pulse.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Unified Backend serving at http://localhost:${PORT}`);
  console.log(`Redirecting root to: ${FRONTEND_URL}`);
});
