import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let ai;
try {
  let key = process.env.GEMINI_API_KEY;
  if (key) {
    key = key.replace(/['"]/g, '').trim();
  }
  ai = new GoogleGenAI({ apiKey: key });
} catch (e) {
  console.warn("WARNING: GEMINI_API_KEY is not set or invalid. AI features will fail.");
}

const getPersona = (currentStatus) => {
  if (currentStatus === 'Diajukan') {
    return {
      role: 'Atasan (Head of IT)',
      instruction: `Anda adalah Kepala Departemen IT (Atasan). Tugas Anda adalah menyetujui Purchase Request (PR) dari tim IT Support.
      Evaluasi 'reason' dan 'items'. Jika alasan valid dan terkait IT, setujui. Jika tidak, tolak.
      Berikan respon dalam bentuk JSON dengan skema:
      {
        "decision": "Approved" | "Rejected",
        "notes": "Alasan singkat mengapa disetujui/ditolak"
      }`,
      nextStatus: 'Disetujui Atasan',
      rejectStatus: 'Ditolak'
    };
  } else if (currentStatus === 'Disetujui Atasan') {
    return {
      role: 'Finance Manager',
      instruction: `Anda adalah Finance Manager. Tugas Anda adalah menyetujui Purchase Request (PR) yang sudah disetujui Atasan IT.
      Evaluasi 'totalPrice'. Jika masuk akal untuk operasional IT rumah sakit (di bawah 100 juta), setujui. Jika di atas 100 juta, tolak.
      Berikan respon dalam bentuk JSON dengan skema:
      {
        "decision": "Approved" | "Rejected",
        "notes": "Alasan persetujuan/penolakan dana"
      }`,
      nextStatus: 'Disetujui Finance',
      rejectStatus: 'Ditolak'
    };
  } else if (currentStatus === 'Disetujui Finance') {
    return {
      role: 'Direktur Rumah Sakit',
      instruction: `Anda adalah Direktur Rumah Sakit. Tugas Anda adalah memberikan final approval pada PR yang sudah melewati Finance.
      Selalu setujui dengan pesan bijak kecuali ada barang yang sangat aneh.
      Berikan respon dalam bentuk JSON dengan skema:
      {
        "decision": "Approved" | "Rejected",
        "notes": "Pesan direktur"
      }`,
      nextStatus: 'Disetujui Direktur',
      rejectStatus: 'Ditolak'
    };
  }
  return null;
};

app.post('/api/procurement/approve', async (req, res) => {
  try {
    const { pr } = req.body;
    
    if (!pr) {
      return res.status(400).json({ error: 'PR data is required' });
    }

    const persona = getPersona(pr.status);
    if (!persona) {
      return res.status(400).json({ error: `Cannot process approval for status: ${pr.status}` });
    }

    const prompt = `Silakan evaluasi Purchase Request berikut:
    ID: ${pr.id}
    Total Harga: Rp ${pr.totalPrice.toLocaleString('id-ID')}
    Alasan: ${pr.reason}
    Daftar Barang:
    ${pr.items.map(i => `- ${i.qty}x ${i.name} (Rp ${i.price})`).join('\n')}
    `;

    if (!ai) {
      return res.status(500).json({ error: 'AI Client is not initialized. Please set GEMINI_API_KEY.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: persona.instruction,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            decision: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
          required: ["decision", "notes"]
        }
      }
    });

    const result = JSON.parse(response.text);
    
    if (result.decision === 'Approved') {
      res.json({
        nextStatus: persona.nextStatus,
        notes: `[${persona.role}]: ${result.notes}`,
        decision: 'Approved'
      });
    } else {
      res.json({
        nextStatus: persona.rejectStatus,
        notes: `[${persona.role}]: ${result.notes}`,
        decision: 'Rejected'
      });
    }

  } catch (error) {
    console.error('Error in AI Approval:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Serve static files from Vite build
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Use PORT 8080 as standard for Cloud Run, fallback to 3001 for local dev
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Vibe Procurement Backend listening on port ${PORT}`);
});
