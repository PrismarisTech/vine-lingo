import { GoogleGenAI } from "@google/genai";
import { GLOSSARY_DATA } from "../constants";

let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API Key not found");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

// Construct a context string from the glossary data to ground the AI
const glossaryContext = GLOSSARY_DATA.map(item => `${item.term}: ${item.definition}`).join('\n');

const SYSTEM_INSTRUCTION = `
You are an expert assistant for the Amazon Vine program community. 
Your goal is to help Vine Voices understand terms, rules, and strategies based on the community glossary.
Always be concise, friendly, and helpful. 

Here is the context of the glossary terms available in the app:
---
${glossaryContext}
---

If a user asks about a specific term in the glossary, define it and provide extra context if possible.
If they ask about tax (ETV), remind them you are not a tax professional but explain the general concept of Estimated Tax Value on the 1099-NEC.
If they ask about "Jail", explain the metric requirements to get out.
Keep answers relatively short (under 150 words) unless complex detailed explanation is needed.
`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const client = getAIClient();
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service. Please check your API key or try again later.";
  }
};
