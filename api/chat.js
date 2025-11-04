// /api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "No message provided." });
    }

    // 🌟 Replace this with your actual Gemini API key
    const GEMINI_API_KEY = "AIzaSyDGoWGkTTjjlCFXs4sf1bhiHZYVqNW_quA";

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: "Missing Gemini API key." });
    }

    // Send the request to Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are InteliHealth AI, a healthcare assistant in Mauritius. 
                Be helpful, polite, and factual when answering. 
                User said: ${message}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t generate a response at the moment.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
