import { GEMINI_API_KEY } from '../config/keys';

const BATCH_SIZE = 50;
const CONCURRENCY = 3;
const MAX_RETRIES = 5;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const PAIN_POINT_KEYWORDS = {
  "product quality": [
    "broken", "fake", "duplicate", "pathetic", "useless", "worst quality",
    "bakwas", "kharab", "nakli", "tuta hua", "bekar", "waste of money",
    "not as described", "wrong product", "cheap quality", "bad quality", "not happy", "bad"
  ],
  "delivery issue": [
    "late", "delayed", "never arrived", "not delivered", "wrong item",
    "missing", "lost", "der se aaya", "nahi aaya", "galat item"
  ],
  "packaging problem": [
    "damaged box", "crushed", "torn", "open box", "packaging broken",
    "box damaged", "packet phata", "damaged packaging"
  ],
  "customer service": [
    "no response", "rude", "unhelpful", "support bad", "no refund",
    "return rejected", "helpline", "customer care"
  ],
  "pricing": [
    "overpriced", "expensive", "not worth", "too costly", "mehnga",
    "price is high", "paisa waste"
  ]
};

const applySentimentFailsafe = (text, geminiSentiment) => {
  const lower = text.toLowerCase();
  const negativeTriggers = ['not happy', 'bad', 'worst', 'pathetic', 'useless', 'bakwas', 'fraud', 'fake', 'broken', 'disappointed', 'waste', '😡', '👎', '🤮', '🤬'];
  const positiveTriggers = ['good', 'best', 'love', 'amazing', 'superb', 'quality', '😍', '🔥', '👍'];

  if (negativeTriggers.some(t => lower.includes(t))) return 'negative';
  if (geminiSentiment && geminiSentiment !== 'neutral') return geminiSentiment;
  if (positiveTriggers.some(t => lower.includes(t))) return 'positive';
  
  return geminiSentiment || 'neutral';
};

const applyEmotionFailsafe = (sentiment, geminiEmotion) => {
  if (geminiEmotion && geminiEmotion !== 'neutral') return geminiEmotion;
  if (sentiment === 'positive') return 'joy';
  if (sentiment === 'negative') return 'anger';
  return 'neutral';
};

const applyLanguageFailsafe = (text, geminiLanguage) => {
  if (geminiLanguage && geminiLanguage !== 'english' && geminiLanguage !== 'unknown') return geminiLanguage;
  
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return 'hindi';
  
  const lower = text.toLowerCase();
  const hinglishKeywords = ['hai', 'nahi', 'kya', 'acha', 'kharab', 'bakwas', 'bekar', 'mast', 'bohot', 'bahut', 'theek', 'kaisa', 'wala', 'bhi'];
  const words = lower.split(/\W+/);
  const isHinglish = words.some(w => hinglishKeywords.includes(w));
  
  if (isHinglish) return 'hinglish';
  
  return geminiLanguage || 'english';
};

const applyKeywordFallback = (text, sentiment, geminiPainPoint) => {
  if (geminiPainPoint && geminiPainPoint !== "none") return geminiPainPoint;

  const lower = text.toLowerCase();

  for (const [painPoint, keywords] of Object.entries(PAIN_POINT_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return painPoint;
    }
  }

  return sentiment === 'negative' ? 'product quality' : 'none';
};

const analyzeSingleBatch = async (texts, retryCount = 0) => {
  const numbered = texts.map((t, i) => `${i + 1}. ${t}`).join('\n');

  try {
    const response = await fetch(
      `/api/gemini/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
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
      }
    );

    if ((response.status === 503 || response.status === 429) && retryCount < MAX_RETRIES) {
      const waitTime = Math.pow(1.5, retryCount) * 3000;
      console.warn(`Gemini Busy (503/429). Retrying in ${Math.round(waitTime)}ms... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(waitTime);
      return analyzeSingleBatch(texts, retryCount + 1);
    }

    if (!response.ok) {
      const errBody = await response.text();
      console.error(`Gemini API Error: Status ${response.status}. Body: ${errBody}`);
      return texts.map(text => {
        const sentiment = applySentimentFailsafe(text, 'neutral');
        return {
          emotion: applyEmotionFailsafe(sentiment, 'neutral'),
          sentiment: sentiment,
          painPoint: applyKeywordFallback(text, sentiment, 'none'),
          language: applyLanguageFailsafe(text, 'english'),
          location: 'unknown',
          isBot: false
        };
      });
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
         console.error("Gemini Response Empty or Blocked:", data);
         return texts.map(text => {
             const sentiment = applySentimentFailsafe(text, 'neutral');
             return {
                 emotion: applyEmotionFailsafe(sentiment, 'neutral'), 
                 sentiment: sentiment, 
                 painPoint: applyKeywordFallback(text, sentiment, 'none'), 
                 language: applyLanguageFailsafe(text, 'english'),
                 location: 'unknown', 
                 isBot: false 
             };
         });
    }

    let raw = data.candidates[0].content.parts[0].text.trim();

    // Clean markdown blocks
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // Extract outer array
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
        raw = raw.substring(start, end + 1);
    }

    let parsed = [];
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      console.error(`JSON Parse Error. The model generated malformed JSON.`, parseError);
      return texts.map(text => {
          const sentiment = applySentimentFailsafe(text, 'neutral');
          return {
              emotion: applyEmotionFailsafe(sentiment, 'neutral'), 
              sentiment: sentiment, 
              painPoint: applyKeywordFallback(text, sentiment, 'none'), 
              language: applyLanguageFailsafe(text, 'english'),
              location: 'unknown', 
              isBot: false 
          };
      });
    }

    if (!Array.isArray(parsed)) {
      return texts.map(text => {
          const sentiment = applySentimentFailsafe(text, 'neutral');
          return {
              emotion: applyEmotionFailsafe(sentiment, 'neutral'), 
              sentiment: sentiment, 
              painPoint: applyKeywordFallback(text, sentiment, 'none'), 
              language: applyLanguageFailsafe(text, 'english'),
              location: 'unknown', 
              isBot: false 
          };
      });
    }

    return texts.map((text, idx) => {
      const result = parsed[idx] || { emotion: 'neutral', sentiment: 'neutral', painPoint: 'none', location: 'unknown', isBot: false };
      const finalSentiment = applySentimentFailsafe(text, result.sentiment);
      return {
        ...result,
        sentiment: finalSentiment,
        emotion: applyEmotionFailsafe(finalSentiment, result.emotion),
        painPoint: applyKeywordFallback(text, finalSentiment, result.painPoint),
        language: applyLanguageFailsafe(text, result.language)
      };
    });

  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      await sleep(3000);
      return analyzeSingleBatch(texts, retryCount + 1);
    }
    return texts.map(text => {
        const sentiment = applySentimentFailsafe(text, 'neutral');
        return {
            emotion: applyEmotionFailsafe(sentiment, 'neutral'), 
            sentiment: sentiment, 
            painPoint: applyKeywordFallback(text, sentiment, 'none'), 
            language: applyLanguageFailsafe(text, 'english'),
            location: 'unknown', 
            isBot: false 
        };
    });
  }
};

export const analyzeReviewsBatch = async (texts, setStatusMessage) => {
  const batches = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    batches.push({ batch: texts.slice(i, i + BATCH_SIZE), startIndex: i });
  }

  const results = new Array(texts.length);
  let completedBatches = 0;

  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    const chunk = batches.slice(i, i + CONCURRENCY);

    await Promise.all(chunk.map(async ({ batch, startIndex }) => {
      const batchResults = await analyzeSingleBatch(batch);
      batchResults.forEach((result, j) => {
        results[startIndex + j] = result;
      });
      completedBatches++;
      if (setStatusMessage) {
        const pct = Math.round((completedBatches / batches.length) * 100);
        setStatusMessage(`Analyzing reviews with Gemini... ${pct}% ${completedBatches < batches.length ? '(Managing traffic...)' : ''}`);
      }
    }));
  }

  return results;
};