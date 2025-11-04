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
      console.error('MISSING HF_TOKEN - Using fallback');
      return res.status(200).json({ 
        reply: "Hello! I'm InteliHealth, your healthcare assistant for Mauritius. I can help you find doctors, clinics, and medical services. How can I assist you today?" 
      });
    }

    console.log('Calling Hugging Face with message:', message);

    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: `You are InteliHealth, a helpful healthcare assistant in Mauritius. User: ${message}`,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7
          }
        }),
      }
    );

    console.log('Hugging Face response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Hugging Face response data:', data);

    let reply = data?.generated_text || "Hello! I'm InteliHealth. How can I help you with healthcare in Mauritius today?";
    
    // Clean up the response
    reply = reply.replace(/You are InteliHealth, a helpful healthcare assistant in Mauritius\. User:.*?InteliHealth:/gi, '');
    reply = reply.replace(/User:.*?InteliHealth:/gi, '');
    
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(200).json({ 
      reply: "Hello! I'm InteliHealth. I specialize in helping people find healthcare services in Mauritius. You can ask me about doctors, clinics, hospitals, or specific medical services." 
    });
  }
}
