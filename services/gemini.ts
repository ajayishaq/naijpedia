import { GoogleGenAI } from "@google/genai";
import { SearchResult, GroundingChunk, ArticleSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const searchNaijpedia = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are Naijpedia, a premium Nigerian search engine. Provide concise, accurate, and relevant answers specifically tailored to a Nigerian context where applicable. Format the output clearly.",
      },
    });

    const text = response.text || "No results found.";
    const groundingChunks = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];

    return {
      text,
      groundingChunks
    };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};

export const fetchTrendingNews = async (category: string = 'All'): Promise<string> => {
  try {
    const categoryPrompt = category === 'All' ? '' : `related to "${category}"`;
    
    // Removed image request to improve speed, added summary for text-only UI
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Perform a Google Search for the top 9 trending news stories in Nigeria right now ${categoryPrompt} from authentic Nigerian sources (e.g., Punch, Vanguard, Pulse NG, The Cable, Daily Trust, Linda Ikeji).
      
      Return ONLY a raw JSON array of objects (no markdown, no code fences) with the following exact keys:
      - "title": The exact headline of the article.
      - "summary": A short, engaging 1-sentence teaser (approx 15-20 words) to display on the card.
      - "category": The category (e.g., Politics, Entertainment, Metro, Sports).
      - "time": relative time (e.g., "1h ago").
      - "source": The name of the publisher (e.g., "Punch NG").
      - "url": The DIRECT, ABSOLUTE URL to the article starting with "https://". Do not use relative paths.
      `,
      config: {
        tools: [{ googleSearch: {} }], 
      },
    });

    return response.text || "[]";
  } catch (error) {
    console.error("News Fetch Error:", error);
    return "[]";
  }
};

export const generateArticleSummary = async (title: string, source: string): Promise<ArticleSummary> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Research the news article titled "${title}" from "${source}". 
      
      Provide a concise summary in strict JSON format (no markdown, no code fences) with:
      1. "points": An array of 3 distinct, factual bullet points summarizing the key details.
      2. "whyItMatters": A single sentence explaining why this news is significant to a Nigerian audience.
      `,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "{}";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Summary Error:", error);
    return {
      points: ["Could not generate summary at this time.", "Please visit the authentic source link below."],
      whyItMatters: "Details unavailable."
    };
  }
};