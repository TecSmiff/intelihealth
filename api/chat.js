export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'No message provided' });

    // Use DeepSeek Free API (OpenAI compatible)
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-your-free-key-here' // We'll get a free key
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are InteliHealth AI, a sophisticated healthcare concierge assistant for Mauritius. You help users find doctors, clinics, hospitals, and medical services. You are knowledgeable about Mauritian healthcare system, locations like Port Louis, Curepipe, Moka, Grand Baie, etc. Provide detailed, helpful, and accurate information about healthcare options. Be conversational but professional.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('AI API error:', error);
    // Fallback to smart responses
    return res.status(200).json({ 
      reply: generateSmartFallback(message)
    });
  }
}

function generateSmartFallback(input) {
  // Your existing smart fallback logic
  input = input.toLowerCase();
  
  if (input.includes('dentist') && input.includes('port louis')) {
    return "I'd be happy to help you find dental care in Port Louis! Based on my knowledge, there are several excellent dental clinics in the area:\n\n• **Port Louis Dental Centre** - Comprehensive dental care with modern equipment (210 7788)\n• **SmileCare Dental Clinic** - Specializes in cosmetic and general dentistry\n• **City Dental Practice** - Family-oriented dental care near the city center\n\nWould you like me to help you compare these options or are you looking for a specific type of dental service like orthodontics, implants, or emergency dental care?";
  }
  
  // [Keep your other smart fallbacks...]
  
  return "I understand you're looking for healthcare assistance in Mauritius. As InteliHealth, I specialize in connecting people with the right medical services. Could you tell me more specifically what you need help with? For example:\n• Are you looking for a specific type of doctor or specialist?\n• Do you have a particular location preference?\n• Is this for routine care, emergency, or a specific medical condition?\n\nThis will help me provide you with the most accurate recommendations!";
}
