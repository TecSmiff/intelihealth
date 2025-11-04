export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'No message provided' });

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      console.error('Missing Gemini API key');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Calling Gemini API with key:', GEMINI_API_KEY.substring(0, 10) + '...');

    // CORRECT Gemini API endpoint and format
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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
                  text: `You are InteliHealth AI, a helpful and knowledgeable healthcare concierge for Mauritius. You help people find doctors, clinics, hospitals, dentists, and medical services across Mauritius including Port Louis, Curepipe, Grand Baie, Moka, Quatre Bornes, and other locations.

Provide detailed, accurate, and helpful information about healthcare options. Be conversational but professional. Include specific recommendations when possible.

User question: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    console.log('Gemini response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini full response:', JSON.stringify(data, null, 2));

    // CORRECT response parsing for Gemini
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const reply = data.candidates[0].content.parts[0].text;
      console.log('Successfully extracted reply:', reply.substring(0, 100) + '...');
      return res.status(200).json({ reply });
    } else {
      console.error('Unexpected Gemini response structure:', data);
      throw new Error('Unexpected response format from Gemini');
    }

  } catch (error) {
    console.error('Gemini API call failed:', error.message);
    // Fallback to smart responses
    return res.status(200).json({ 
      reply: generateSmartFallback(message)
    });
  }
}

function generateSmartFallback(input) {
  input = input.toLowerCase();
  
  if (input.includes('dentist') && input.includes('port louis')) {
    return "I'd be happy to help you find dental care in Port Louis! There are several excellent dental clinics in the area including Port Louis Dental Centre and specialized practices for different needs. Could you tell me more about what specific dental service you're looking for?";
  }
  
  if (input.includes('emergency')) {
    return "For emergency medical care in Mauritius, I recommend going directly to the nearest hospital emergency department. Major emergency departments are at Victoria Hospital, Jeetoo Hospital, and Wellkin Hospital. For immediate ambulance service, call 114.";
  }
  
  if (input.includes('heart') || input.includes('cardiac')) {
    return "For cardiac care in Mauritius, Apollo Bramwell Hospital has an excellent heart center with comprehensive services. There are also cardiology departments at several major hospitals. Would you like me to help you find a cardiologist in a specific area?";
  }
  
  return "I understand you're looking for healthcare assistance in Mauritius. As InteliHealth, I specialize in connecting people with the right medical services. Could you tell me more specifically what type of healthcare provider or service you need, and in which area of Mauritius?";
}
