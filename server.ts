import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json());

// Sakhi AI chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', cycleContext } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback knowledge response if key is missing
      const isHi = language === 'hi';
      return res.json({
        reply: isHi
          ? 'नमस्ते! सखी आपकी मासिक धर्म और समग्र स्वास्थ्य यात्रा में हमेशा साथ है। ध्यान रखें कि चक्र के दिन और उर्वर खिड़की केवल अनुमान हैं, डॉक्टरी सलाह नहीं। किसी भी असामान्य दर्द या समस्या में स्त्री रोग विशेषज्ञ से परामर्श अवश्य लें।'
          : 'Hello! Sakhi is here to support your menstrual and overall wellness journey. Please remember that cycle dates and fertile windows are estimates, not medical guarantees. Always consult a certified gynaecologist for persistent pain or irregularities.',
        source: 'knowledge-base',
        configured: false,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const isHi = language === 'hi';
    const systemInstruction = `You are "Sakhi AI", a compassionate, warm, respectful, and medically accurate menstrual wellness companion for the "Sakhi Cycle" app.
Language: Respond fluently in ${isHi ? 'Hindi (हिंदी, gentle, clear, supportive tone)' : 'simple, empathetic, natural English'}.
User cycle state context: ${cycleContext ? JSON.stringify(cycleContext) : 'Not specified'}.

Guidelines:
1. Provide thoughtful, comforting, and practical cycle guidance (e.g. cramp relief methods like heat packs, chamomile or ginger tea, magnesium-rich foods, gentle pelvic stretches, hydration, tracking advice).
2. Clearly explain physiological phases (Menstrual, Follicular, Ovulation, Luteal) in simple everyday language.
3. Crucial Medical Safety: Always mention that cycle calculations and fertile windows are statistical estimates, not birth control or medical diagnoses.
4. For severe pain, heavy clotting, sudden missed periods, or symptoms of PCOS/endometriosis, gently advise visiting a licensed gynaecologist.
5. Format with short, readable paragraphs and clean bullet points. Keep responses warm and reassuring.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text || (isHi ? 'सखी आपकी सहायता के लिए सदैव उपलब्ध है।' : 'Sakhi is here to support you anytime.'),
      source: 'gemini-3.8-flash',
      configured: true,
    });
  } catch (error: any) {
    console.error('Sakhi AI error:', error);
    const isHi = req.body?.language === 'hi';
    return res.status(200).json({
      reply: isHi
        ? 'क्षमा करें, इस समय संपर्क करने में कठिनाई हुई। कृपया गर्म पानी की सिकाई करें, पर्याप्त जल पिएं और विश्राम करें। यदि समस्या बनी रहे तो डॉक्टर से संपर्क करें।'
        : 'I had trouble connecting for a moment, but please remember to stay hydrated, rest, and use gentle heat for cramp relief. Consult a healthcare provider if pain persists.',
      source: 'offline-fallback',
      error: error?.message || 'Server error',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Sakhi Cycle running at http://0.0.0.0:${port}`);
  });
}

startServer();
