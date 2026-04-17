import { generateAyurvedicRemedy } from '../services/groqService.js';
import { supabaseAdmin } from '../config/supabase.js';

/**
 * POST /api/remedy/generate
 * Generates an Ayurvedic remedy and saves it to the user's history.
 */
export async function generateRemedy(req, res) {
  try {
    const { disease, diseaseId, symptoms, otherSymptoms, severity, duration } = req.body;

    // Validate required fields
    if (!disease || !symptoms || !severity || !duration) {
      return res.status(400).json({
        error: 'Missing required fields: disease, symptoms, severity, duration.',
      });
    }

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'At least one symptom is required.' });
    }

    if (!['mild', 'moderate', 'severe'].includes(severity)) {
      return res.status(400).json({ error: 'Severity must be mild, moderate, or severe.' });
    }

    if (duration < 1 || duration > 365) {
      return res.status(400).json({ error: 'Duration must be between 1 and 365 days.' });
    }

    // Fetch user profile for personalization
    let userProfile = null;
    if (req.user) {
      const { data } = await supabaseAdmin
        .from('profiles')
        .select('age, gender, medical_history')
        .eq('id', req.user.id)
        .single();
      userProfile = data;
    }

    // Generate remedy via Groq
    const remedy = await generateAyurvedicRemedy({
      disease,
      symptoms,
      otherSymptoms,
      severity,
      duration,
      userAge: userProfile?.age,
      userGender: userProfile?.gender,
      medicalHistory: userProfile?.medical_history,
    });

    // Save to history if user is authenticated
    let historyId = null;
    if (req.user) {
      const { data: history, error: historyError } = await supabaseAdmin
        .from('histories')
        .insert({
          user_id: req.user.id,
          disease,
          disease_id: diseaseId || disease.toLowerCase().replace(/\s+/g, '-'),
          symptoms,
          other_symptoms: otherSymptoms || null,
          severity,
          duration,
          remedy,
        })
        .select('id')
        .single();

      if (!historyError && history) {
        historyId = history.id;
      }
    }

    res.json({
      success: true,
      historyId,
      remedy,
      metadata: {
        disease,
        severity,
        duration,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('Remedy generation error:', err.message);
    res.status(500).json({
      error: err.message || 'Failed to generate remedy. Please try again.',
    });
  }
}
