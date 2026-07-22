const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { studentOnly } = require('../middleware/roleCheck');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Subject = require('../models/Subject');
const Syllabus = require('../models/Syllabus');
const StudyMaterial = require('../models/StudyMaterial');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const systemContext = `You are an expert academic tutor for the subject "${subject.name}" (Code: ${subjectCode}) at KR Mangalam University, School of Engineering & Technology (SOET), Gurugram, India.

Subject Details:
- Name: ${subject.name}
- Code: ${subjectCode}
- Semester: ${subject.semester}
- Credits: ${subject.credits}
- Type: ${subject.type}

Available Study Materials in this subject:
${materialContext}

Your role:
- Answer questions related to ${subject.name} clearly and accurately
- Explain concepts in simple terms suitable for B.Tech students
- Give examples relevant to engineering and computer science
- If asked about topics outside this subject, politely redirect to ${subject.name}
- Format answers clearly with bullet points or numbered lists when helpful
- Keep answers concise but complete
- You can suggest which unit a topic belongs to based on the materials listed above`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemContext
    });

    const chatHistory = [];
    if (Array.isArray(history) && history.length > 0) {
      history.slice(-6).forEach((h) => {
        if (!h || !h.role || !h.content) return;
        chatHistory.push({
          role: h.role,
          parts: [{ text: h.content }]
        });
      });
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7
      }
    });

    const result = await chat.sendMessage(message.trim());
    const response = await result.response;
    const text = response.text();

    return res.json({
      success: true,
      reply: text,
      subjectCode
    });
  } catch (err) {
    console.error('Gemini API error full:', err.message, err.status, err.errorDetails)

    if (err.message && err.message.includes('429')) {
      return res.json({
        success: false,
        error: 'AI is busy right now. Please wait a moment and try again.'
      });
    }

    return res.json({
      success: false,
      error: 'Failed to get AI response. Please try again.'
    });
  }
});

module.exports = router;
