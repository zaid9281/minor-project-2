const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { studentOnly } = require('../middleware/roleCheck');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Subject = require('../models/Subject');
const Syllabus = require('../models/Syllabus');
const StudyMaterial = require('../models/StudyMaterial');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Simple per-user cooldown to prevent rate limit hits
const userLastRequest = new Map();

// GET /ai/assistant/:subjectCode — Chat page
router.get('/assistant/:subjectCode', protect, studentOnly, async (req, res) => {
  try {
    const { subjectCode } = req.params;

    const subject = await Subject.findOne({ subjectCode }).lean();
    if (!subject) {
      return res.render('error', {
        message: 'Subject not found.',
        user: req.user
      });
    }

    const syllabus = await Syllabus.findOne({ subjectCode }).lean();
    const materials = await StudyMaterial.find({ subjectCode })
      .select('title unit')
      .sort({ unit: 1 })
      .lean();

    res.render('student/ai-assistant', {
      subject,
      syllabus,
      materials,
      user: req.user
    });
  } catch (err) {
    console.error('AI assistant page error:', err);
    res.render('error', {
      message: 'Failed to load AI assistant.',
      user: req.user
    });
  }
});

// POST /ai/chat — Send message to Gemini
router.post('/chat', protect, studentOnly, async (req, res) => {
  const userId = req.user.id.toString();
  const now = Date.now();
  const lastReq = userLastRequest.get(userId) || 0;

  if (now - lastReq < 3000) {
    return res.json({
      success: false,
      error: 'Please wait a moment before sending another message.'
    });
  }
  userLastRequest.set(userId, now);

  const { message, subjectCode, history } = req.body;

  if (!message || !message.trim()) {
    return res.json({ success: false, error: 'Message cannot be empty.' });
  }

  if (!subjectCode) {
    return res.json({ success: false, error: 'Subject code required.' });
  }

  try {
    const subject = await Subject.findOne({ subjectCode }).lean();
    if (!subject) {
      return res.json({ success: false, error: 'Subject not found.' });
    }

    const materials = await StudyMaterial.find({ subjectCode })
      .select('title unit description')
      .lean();

    const materialContext = materials.length > 0
      ? materials.map((m) => `Unit ${m.unit}: ${m.title}`).join('\n')
      : 'No materials uploaded yet.';

    const systemContext = `You are an expert academic tutor for "${subject.name}" (${subjectCode}) at KR Mangalam University, India. Answer questions clearly for B.Tech students. Keep answers concise and helpful. Available topics:\n${materialContext}`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: systemContext
    });

    const chatHistory = [];
    if (history && Array.isArray(history) && history.length > 0) {
      history.slice(-4).forEach(h => {
        chatHistory.push({
          role: h.role,
          parts: [{ text: h.content }]
        });
      });
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7
      }
    });

    const result = await chat.sendMessage(message.trim());
    const response = await result.response;
    const text = response.text();

    return res.json({ success: true, reply: text, subjectCode });
  } catch (err) {
    console.error('Gemini API error full:', err.message, err.status, err.errorDetails)

    if (err.message && err.message.includes('429')) {
      // Wait 10 seconds and retry once
      await new Promise(r => setTimeout(r, 10000));
      try {
        const model2 = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const result2 = await model2.generateContent(message.trim());
        const text2 = result2.response.text();
        return res.json({ success: true, reply: text2, subjectCode });
      } catch (retryErr) {
        return res.json({
          success: false,
          error: 'AI is temporarily overloaded. Please try again in a minute.'
        });
      }
    }

    return res.json({
      success: false,
      error: 'Failed to get AI response. Please try again.'
    });
  }
});

module.exports = router;
