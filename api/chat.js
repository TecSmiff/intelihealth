export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' });

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'No message provided' });

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      console.error('Missing Hugging Face token');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Sending to Hugging Face:', message);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: message,
          parameters: {
            max_length: 200,
            temperature: 0.7
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      throw new Error(`Hugging Face API responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('Hugging Face response:', data);

    let reply = "Hello! I'm InteliHealth, your healthcare assistant in Mauritius. How can I help you find doctors or clinics today?";
    
    if (data && data.generated_text) {
      reply = data.generated_text;
    }

    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(200).json({ 
      reply: "Hello! I'm InteliHealth. I can help you find healthcare services, doctors, and clinics in Mauritius. What do you need help with today?" 
    });
  }
}
