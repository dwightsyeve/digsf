import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are DigiBot, the intelligent assistant for DigiSafe. 
DigiSafe is a professional-grade digital asset management and investment platform.
Key Features:
- Secure asset storage with bank-level encryption.
- Multiple investment plans (Basic, Pro, Institutional).
- Real-time portfolio analytics and performance charts.
- Secure withdrawals and deposits.
- 24/7 expert support.

Your tone should be professional, helpful, and concise. 
If a user asks about their specific balance, remind them to check their Dashboard.
If they ask how to invest, guide them to the Invest page.
If they ask about security, emphasize our institutional-grade vault technology.

Always be polite and proactive.`;

export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
  }
}
