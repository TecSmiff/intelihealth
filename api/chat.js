export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'No message provided.' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    console.log('Sending to Gemini:', message);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are InteliHealth AI, a helpful healthcare assistant in Mauritius. Provide friendly, concise responses about healthcare services, doctors, clinics, and medical guidance. Be professional but warm.

User question: ${message}`
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data, null, 2));

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const reply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply });
    } else {
      console.error('Unexpected Gemini response structure:', data);
      return res.status(200).json({ 
        reply: "I'm here to help you find healthcare services in Mauritius. How can I assist you today?" 
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      reply: "I'm having trouble connecting right now. Please try again in a moment." 
    });
  }
}
