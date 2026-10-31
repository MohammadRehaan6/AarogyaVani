import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Parse JSON request bodies up to 25MB for report images
app.use(express.json({ limit: '25mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint to analyze medical report image or text via Gemini 3.8 Flash
app.post('/api/analyze-report', async (req, res) => {
  try {
    const { imageBase64, mimeType, rawText, languageCode, languageName } = req.body;

    if (!imageBase64 && !rawText) {
      return res.status(400).json({ error: 'Please provide a medical report image or text.' });
    }

    const targetLang = languageName || 'Hindi';
    const targetCode = languageCode || 'hi';

    const systemInstruction = `
You are AarogyaVani, an expert Clinical Discharge & Medical Report Assistant specializing in Indian healthcare and patient plain-language education.
Analyze the provided medical report (blood test, urine test, discharge summary, or prescription).

You MUST output valid, parseable JSON conforming to this structure:
{
  "reportId": "REP-XXXX",
  "reportType": "Blood Test (CBC)" | "Diabetic & Metabolic Profile" | "Cardiovascular & BP" | "Urine & Renal Function" | "Discharge Summary & Prescription" | "Custom Scan",
  "patientName": "Extracted name or Patient",
  "age": 45,
  "gender": "Male" or "Female",
  "scanTimestamp": "string date",
  "summaryInPlainLanguage": "Clear 2-3 sentence overview in English plain language",
  "summaryInChosenLanguage": "Clear 2-3 sentence overview in the user's chosen language (${targetLang})",
  "overallHealthScore": 60, // 0 to 100 benchmark
  "metrics": [
    {
      "id": "metric_id",
      "name": "Parameter Name (e.g. Red Blood Cells, Hemoglobin, Fasting Sugar)",
      "category": "Blood & Hematology" | "Metabolic & Sugar" | "Cardiovascular & Vitals" | "Kidney & Renal",
      "patientValue": 80,
      "unit": "million/mcL or mg/dL or mmHg",
      "healthyNormalMin": 100,
      "healthyNormalMax": 150,
      "healthyIdealBaseline": 120, // baseline for a healthy normal person
      "healthyBaselineNote": "Healthy normal benchmark note",
      "status": "low" | "normal" | "high" | "critical-low" | "critical-high",
      "percentageVariance": -33, // compare with healthy baseline
      "plainExplanation": "Simple English explanation of what this means in the body",
      "translatedExplanation": "Simple explanation in ${targetLang}",
      "organAffected": "Target organ"
    }
  ],
  "diagnosis": {
    "name": "Clinical condition name in English",
    "translatedName": "Condition name in ${targetLang}",
    "category": "Medical Category",
    "stageName": "Specific Stage (e.g. Stage 2 Moderate, Grade 1 Mild, Uncontrolled)",
    "stageLevel": 1 | 2 | 3 | 4,
    "totalStages": 3 or 4,
    "severity": "Mild" | "Moderate" | "Severe" | "Critical",
    "stageDescription": "Clinical meaning of this stage in English",
    "translatedStageDescription": "Meaning of this stage in ${targetLang}",
    "whatItMeansForYou": "Everyday plain language explanation for the patient",
    "translatedWhatItMeans": "Everyday explanation in ${targetLang}",
    "warningSigns": ["Emergency red flag 1", "Emergency red flag 2"],
    "translatedWarningSigns": ["Red flag in ${targetLang}"],
    "followUpDays": 7 or 14,
    "followUpNote": "Follow up consultation timing"
  },
  "dietPlan": {
    "vegProteins": [
      { "name": "e.g. Sprouted Moong, Paneer, Lentils", "translatedName": "in ${targetLang}", "portion": "Daily portion", "benefit": "Why it repairs cells", "icon": "🌱" }
    ],
    "nonVegProteins": [
      { "name": "e.g. Boiled Egg Whites, Lean Chicken, Fish", "translatedName": "in ${targetLang}", "portion": "Portion", "benefit": "Why it repairs", "icon": "🥚" }
    ],
    "healingVeggies": [
      { "name": "Vegetable Name", "translatedName": "in ${targetLang}", "whyItHelps": "Reason", "preparationTip": "Cooking tip" }
    ],
    "superfoodsAndSeeds": [
      { "name": "e.g. Chia Seeds, Flaxseeds, Amla", "translatedName": "in ${targetLang}", "dosage": "Dose", "benefit": "Benefit" }
    ],
    "foodsToStrictlyAvoid": [
      { "name": "Food to avoid", "translatedName": "in ${targetLang}", "reason": "Reason" }
    ]
  },
  "exercisePlan": {
    "dailyWalkingMinutes": 30,
    "walkingTip": "Pacing tip",
    "suryaNamaskarRounds": 4,
    "suryaNamaskarGuidance": "Sun salutation guidance",
    "pranayama": [
      { "name": "Anulom Vilom / Kapalbhati / Bhramari", "translatedName": "in ${targetLang}", "durationMinutes": 10, "howToPerform": "Step by step breath", "healingFocus": "Health focus" }
    ],
    "conditionSafeExercises": [
      { "name": "Safe exercise", "translatedName": "in ${targetLang}", "frequency": "Frequency", "caution": "Safety precaution" }
    ]
  },
  "medicines": [
    {
      "id": "med-1",
      "medicineName": "Full brand & generic (e.g. Pantoprazole P40, Metformin 500mg, Eye Drops)",
      "genericName": "Generic molecule",
      "dosageStrength": "Exact strength (e.g. 40 mg, 500 mg)",
      "dosageStrengthReason": "Explain WHY this specific dose (e.g. P40 vs P20 vs P60) for this stage",
      "timingSlot": { "morning": true, "afternoon": false, "evening": false, "night": false },
      "mealRelation": "before-breakfast-empty-stomach" | "after-breakfast" | "before-lunch" | "after-lunch" | "before-dinner" | "after-dinner" | "bedtime" | "as-needed",
      "mealRelationLabel": "Exact timing (e.g. Morning 30 mins BEFORE Breakfast)",
      "mealRelationTranslated": "Exact timing in ${targetLang}",
      "shelfLifeAndExpiry": {
        "unopenedShelfLife": "e.g. 24-36 months from manufacturing",
        "afterOpeningRule": "CRITICAL: For eye drops, strictly discard 28 days (4 weeks) after seal opened. For syrups 7-10 days. For tablets discard if foil broken.",
        "storageCondition": "Cool dry place",
        "isSpecialExpiryWarning": true or false
      },
      "administrationMode": {
        "type": "swallow-water" | "dissolve-water" | "chew-tablet" | "sublingual-tongue" | "tonic-shake" | "eye-drops",
        "title": "e.g. Swallow whole with 1 glass water / Dissolve in glass of water / Chew thoroughly / Sublingual under tongue",
        "translatedTitle": "How to take in ${targetLang}",
        "stepByStepInstructions": ["Step 1", "Step 2", "Step 3"],
        "criticalCaution": "e.g. Do not crush enteric coating / Do not swallow whole / Discard after 28 days"
      }
    }
  ],
  "clinicianVerification": {
    "isVerified": false,
    "checklistPassed": {
      "medicineNamesPreserved": true,
      "timingAccurate": true,
      "warningSignsClear": true,
      "followUpDatePreserved": true
    }
  }
}
Do NOT wrap in markdown backticks if possible, return strictly valid JSON.
`;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }
    if (rawText) {
      parts.push({
        text: `Medical Report Document Text:\n${rawText}\n\nPatient target language: ${targetLang} (Language Code: ${targetCode})`,
      });
    } else {
      parts.push({
        text: `Analyze this medical document image in high clinical detail. Translate discharge instructions into plain language in ${targetLang} while strictly preserving medical brand names, dosage strengths, timings, and shelf-life rules.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(outputText);
    } catch (parseError) {
      const match = outputText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Failed to parse model JSON output');
      }
    }

    return res.json(parsed);
  } catch (err: any) {
    console.error('Gemini Analysis Error:', err?.message || err);
    return res.status(500).json({
      error: 'Could not process report with AI model. Please verify report image clarity or choose a sample report.',
      details: err?.message,
    });
  }
});

async function startServer() {
  // Mount Vite dev middleware in development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AarogyaVani Health Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
