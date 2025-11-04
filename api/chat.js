export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'No message provided' });

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('Missing Groq API key');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Calling Groq API with message:', message);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Free, fast model
        messages: [
          {
            role: 'system',
            content: `You are InteliHealth AI, an expert healthcare concierge for Mauritius. You help people find doctors, clinics, hospitals, dentists, and medical services across Mauritius including Port Louis, Curepipe, Grand Baie, Moka, Quatre Bornes, and other locations.

Provide detailed, accurate, and helpful information about healthcare options. Be conversational but professional. Include specific recommendations when possible.

Key knowledge:
- Mauritius healthcare system
- Locations: Port Louis, Curepipe, Grand Baie, Moka, Quatre Bornes, etc.
- Medical specialties: dental, cardiac, eye care, emergency, etc.
- Emergency contacts: 114 for ambulance

Always be helpful and provide actionable information.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: false
      })
    });

    console.log('Groq response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Groq response received');

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Groq API call failed:', error.message);
    // Fallback to smart responses
    return res.status(200).json({ 
      reply: generateSmartFallback(message)
    });
  }
}

function generateSmartFallback(input) {
  input = input.toLowerCase();
  
  if (input.includes('dentist') && input.includes('port louis')) {
    return "I'd be happy to help you find dental care in Port Louis! There are several excellent dental clinics in the area including Port Louis Dental Centre (210 7788) and specialized practices for different needs. Could you tell me more about what specific dental service you're looking for?";
  }
  
  if (input.includes('emergency')) {
    return "For emergency medical care in Mauritius: 🚨\n• Call 114 for ambulance\n• Go to nearest hospital emergency department\n• Victoria Hospital, Jeetoo Hospital, and Wellkin Hospital have 24/7 emergency services";
  }
  
  if (input.includes('heart') || input.includes('cardiac')) {
    return "For cardiac care in Mauritius: ❤️\n• Apollo Bramwell Hospital has an excellent cardiac center (605 1000)\n• SSR National Hospital has cardiology services\n• Use our search to find cardiologists near you!";
  }
  
  if (input.includes('eye') || input.includes('vision')) {
    return "For eye care in Mauritius: 👁️\n• VisionCare Clinic in Quatre Bornes (427 4500)\n• Many hospitals have ophthalmology departments\n• Search 'eye' on our Find Care page for more options!";
  }
  
  return "Hello! I'm InteliHealth, your healthcare assistant for Mauritius. I can help you find doctors, clinics, hospitals, and medical services. What specific healthcare service are you looking for today?";
}
