require('dotenv').config({ path: './fronted/.env' });

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || 'AIzaSyBbJVhwct_UchdPNEbBS0jG9roAwHK22e8';

const texts = [
  "Not happy with product 😡",
  "Acha item hai",
  "Worst product ever. The display broke in 2 days. 0/10.",
  "Good but delivery took 15 days which is frustrating.",
  "Mera item theek hai, nice quality"
];

const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');

async function testGemini() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    console.log("Hitting URL:", url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
        contents: [{
          parts: [{
            text: `You are a world-class sentiment analyst. Analyze these reviews (English, Hindi, Hinglish). 
Return a JSON array of exactly ${texts.length} objects. 

CRITICAL GUIDELINES:
1. "Worst product 😡" MUST be [negative, anger]
2. "I love this 😍" MUST be [positive, joy]
3. "Acha item hai" MUST be [positive, joy]
4. "Bakwas quality" MUST be [negative, disgust]
5. DO NOT DEFAULT TO NEUTRAL. Words like "best", "superb", "defective", "bad", "wore out", "small", "worst" carry VERY strong sentiment.
6. If a customer is unhappy about build quality, durability, or utility, "painPoint" MUST be "product quality".
7. Be strict: If a review expresses ANY dissatisfaction, it is NEGATIVE, not neutral.

Fields:
- "emotion": joy, anger, disgust, fear, sadness, surprise, neutral
- "sentiment": positive, negative, neutral
- "language": English, Hindi, Hinglish, or Emoji
- "painPoint": product quality, delivery issue, packaging problem, customer service, pricing, none
- "location": city/country OR "unknown"
- "isBot": boolean

CRITICAL RULES:
1. Mixed reviews (e.g. "Good but...") = negative.
2. Sarcasm or emojis like 😡/🗑️ = negative.
3. If no specific issue, painPoint = none.
4. Return ONLY the JSON array. Do not explain.

Analyze these ${texts.length} reviews:
${numbered} `
          }]
        }]
      })
    });

    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Raw Response JSON:");
    console.log(JSON.stringify(data, null, 2));

    let raw = data.candidates[0].content.parts[0].text.trim();
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
        raw = raw.substring(start, end + 1);
    }
    
    console.log("Cleaned string for parsing:");
    console.log(raw);

    const parsed = JSON.parse(raw);
    console.log("Parsed Array:");
    console.log(parsed);

  } catch (err) {
    console.error("Test failed:", err);
  }
}

testGemini();
