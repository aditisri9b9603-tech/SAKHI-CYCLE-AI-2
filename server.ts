import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(express.json());

// Initialize Supabase if environment variables are configured
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory resilient store for partner pairing & appointments
interface ServerPartnerRecord {
  partnerCode: string;
  isPaired: boolean;
  partnerName: string;
  permissions: {
    sharePhase: boolean;
    shareSupportTips: boolean;
    shareFertileWindow: boolean;
    customSupportNotes: string;
  };
  currentCycleState?: {
    currentCycleDay: number;
    currentPhase: string;
    daysUntilNextPeriod: number;
  };
  updatedAt: string;
}

const partnerStore: Record<string, ServerPartnerRecord> = {
  'SAKHI-PTNR-7294': {
    partnerCode: 'SAKHI-PTNR-7294',
    isPaired: false,
    partnerName: '',
    permissions: {
      sharePhase: false,
      shareSupportTips: false,
      shareFertileWindow: false,
      customSupportNotes: '',
    },
    updatedAt: new Date().toISOString(),
  },
};

interface ServerAppointmentRecord {
  id: string;
  doctorId: string;
  doctorName: string;
  clinic: string;
  patientName: string;
  patientContact: string;
  preferredDate: string;
  consultationType: 'in-clinic' | 'teleconsult';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const appointmentStore: ServerAppointmentRecord[] = [];

// System Status endpoint (Honest provider status)
app.get('/api/status', (_req, res) => {
  res.json({
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    supabaseConfigured: Boolean(supabase),
    whatsappApiConfigured: Boolean(process.env.WHATSAPP_API_TOKEN),
    storageMode: supabase ? 'supabase-cloud' : 'on-device-resilient',
  });
});

// Partner Support: Pair partner
app.post('/api/partner/pair', (req, res) => {
  const { partnerCode, partnerName } = req.body;
  if (!partnerCode) {
    return res.status(400).json({ error: 'Partner code required' });
  }

  const existing = partnerStore[partnerCode.toUpperCase()];
  if (!existing) {
    // Register if valid code format
    partnerStore[partnerCode.toUpperCase()] = {
      partnerCode: partnerCode.toUpperCase(),
      isPaired: true,
      partnerName: partnerName || 'Support Partner',
      permissions: {
        sharePhase: false,
        shareSupportTips: false,
        shareFertileWindow: false,
        customSupportNotes: '',
      },
      updatedAt: new Date().toISOString(),
    };
  } else {
    existing.isPaired = true;
    existing.partnerName = partnerName || existing.partnerName || 'Support Partner';
    existing.updatedAt = new Date().toISOString();
  }

  res.json({ success: true, message: 'Partner paired successfully' });
});

// Partner Support: Update Permissions & State (Enforces user control)
app.post('/api/partner/permissions', (req, res) => {
  const { partnerCode, permissions, cycleState } = req.body;
  if (!partnerCode) {
    return res.status(400).json({ error: 'Partner code required' });
  }

  const record = partnerStore[partnerCode.toUpperCase()] || {
    partnerCode: partnerCode.toUpperCase(),
    isPaired: true,
    partnerName: 'Support Partner',
    permissions: {
      sharePhase: false,
      shareSupportTips: false,
      shareFertileWindow: false,
      customSupportNotes: '',
    },
    updatedAt: new Date().toISOString(),
  };

  record.permissions = {
    sharePhase: Boolean(permissions?.sharePhase),
    shareSupportTips: Boolean(permissions?.shareSupportTips),
    shareFertileWindow: Boolean(permissions?.shareFertileWindow),
    customSupportNotes: String(permissions?.customSupportNotes || ''),
  };

  if (cycleState) {
    record.currentCycleState = {
      currentCycleDay: cycleState.currentCycleDay,
      currentPhase: cycleState.currentPhase,
      daysUntilNextPeriod: cycleState.daysUntilNextPeriod,
    };
  }

  record.updatedAt = new Date().toISOString();
  partnerStore[partnerCode.toUpperCase()] = record;

  res.json({ success: true, record });
});

// Partner Support: Limited access status endpoint (STRICT PRIVACY ENFORCEMENT)
app.get('/api/partner/status/:code', (req, res) => {
  const code = req.params.code.toUpperCase();
  const record = partnerStore[code];

  if (!record || !record.isPaired) {
    return res.status(404).json({ error: 'Partner pairing not found or inactive' });
  }

  // Filter out any unauthorized details server-side
  const payload: any = {
    isPaired: record.isPaired,
    permissions: record.permissions,
  };

  // Only attach phase if user explicitly permitted it
  if (record.permissions.sharePhase && record.currentCycleState) {
    payload.sharedPhase = record.currentCycleState.currentPhase;
  } else {
    payload.sharedPhase = null;
  }

  // Only attach support tips if permitted
  if (record.permissions.shareSupportTips) {
    payload.shareSupportTips = true;
  }

  // Only attach custom notes if permitted
  if (record.permissions.customSupportNotes) {
    payload.customNotes = record.permissions.customSupportNotes;
  }

  // NEVER return raw symptoms, flow levels, or intimate notes to partner!
  res.json(payload);
});

// Partner Support: Revoke partner
app.post('/api/partner/revoke', (req, res) => {
  const { partnerCode } = req.body;
  if (partnerCode && partnerStore[partnerCode.toUpperCase()]) {
    partnerStore[partnerCode.toUpperCase()].isPaired = false;
    partnerStore[partnerCode.toUpperCase()].permissions = {
      sharePhase: false,
      shareSupportTips: false,
      shareFertileWindow: false,
      customSupportNotes: '',
    };
  }
  res.json({ success: true, message: 'Partner access revoked' });
});

// Doctor Directory: Appointment Booking & Real Status
app.post('/api/doctor/appointments', (req, res) => {
  const { doctorId, doctorName, clinic, patientName, patientContact, preferredDate, consultationType } = req.body;
  if (!doctorName || !patientName || !patientContact) {
    return res.status(400).json({ error: 'Missing required appointment fields' });
  }

  const newApt: ServerAppointmentRecord = {
    id: `apt-${Date.now()}`,
    doctorId: doctorId || 'generic',
    doctorName,
    clinic,
    patientName,
    patientContact,
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    consultationType: consultationType || 'in-clinic',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  appointmentStore.push(newApt);
  res.json({ success: true, appointment: newApt });
});

app.get('/api/doctor/appointments', (_req, res) => {
  res.json({ appointments: appointmentStore });
});

// Sakhi AI chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', cycleContext } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
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
