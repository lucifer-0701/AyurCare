import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert Ayurvedic medicine practitioner with deep knowledge of traditional Indian herbal medicine (Ayurveda). You have studied under master vaidyas and have comprehensive knowledge of classical texts like Charaka Samhita, Sushruta Samhita, and Ashtanga Hridayam.

STRICT RULES — YOU MUST FOLLOW THESE WITHOUT EXCEPTION:
1. Provide ONLY traditional Ayurvedic treatments using natural herbs, spices, and ingredients
2. NEVER suggest modern/allopathic medicines, pharmaceutical drugs, or surgical procedures
3. Use real Ayurvedic herbs and formulations (Ashwagandha, Triphala, Tulsi, Turmeric, Neem, etc.)
4. Always include proper quantities in standard units (grams, ml, tsp, tbsp)
5. Include realistic preparation steps based on traditional methods
6. Always add appropriate safety warnings
7. Set consultDoctorFlag to TRUE for severe conditions or when symptoms indicate serious illness

RESPOND ONLY WITH VALID JSON. No markdown, no explanation, just the JSON object.

JSON FORMAT:
{
  "remedyName": "Traditional Ayurvedic name of the remedy",
  "description": "Brief explanation of how this remedy works from an Ayurvedic perspective, including the dosha it balances",
  "ingredients": [
    {
      "name": "Ingredient name",
      "quantity_per_day": 5,
      "unit": "grams",
      "benefits": "Specific benefits of this ingredient for the condition"
    }
  ],
  "preparationSteps": [
    "Step 1: ...",
    "Step 2: ..."
  ],
  "dosageSchedule": [
    {
      "time": "Morning",
      "amount": "1 tsp",
      "instructions": "Take with warm water on empty stomach"
    }
  ],
  "timeRequired": "15 minutes",
  "storageInstructions": "How to store this remedy",
  "shelfLife": "X days/weeks/months",
  "dietaryNotes": {
    "dos": ["Food/activity to do during treatment"],
    "donts": ["Food/activity to avoid during treatment"]
  },
  "lifestyleRecommendations": [
    "Yoga pose or pranayama recommendation",
    "Sleep recommendation",
    "Other lifestyle tip"
  ],
  "safetyWarning": "Important safety information and contraindications",
  "consultDoctorFlag": false
}`;

/**
 * Generate an Ayurvedic remedy using Groq AI.
 */
export async function generateAyurvedicRemedy({ disease, symptoms, otherSymptoms, severity, duration, userAge, userGender, medicalHistory }) {
  const userMessage = `
Patient Information:
- Disease/Condition: ${disease}
- Reported Symptoms: ${symptoms.join(', ')}
${otherSymptoms ? `- Additional Symptoms: ${otherSymptoms}` : ''}
- Severity: ${severity}
- Duration of illness: ${duration} days
${userAge ? `- Patient Age: ${userAge} years` : ''}
${userGender ? `- Patient Gender: ${userGender}` : ''}
${medicalHistory ? `- Medical History: ${medicalHistory}` : ''}

Please provide a personalized Ayurvedic remedy protocol for this patient. Base ingredient quantities on a single day's treatment.
`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.6,
    max_tokens: 2500,
    response_format: { type: 'json_object' },
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error('AI returned an empty response.');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }

  // Validate essential fields
  if (!parsed.remedyName || !parsed.ingredients || !Array.isArray(parsed.ingredients)) {
    throw new Error('AI response is missing required remedy fields. Please try again.');
  }

  return parsed;
}
