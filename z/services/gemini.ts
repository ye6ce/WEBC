import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";

// Fixed: Correctly initialize GoogleGenAI using the environment variable directly as a named parameter
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductImage = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  const fullPrompt = `Traditional X ART oil painting style, high-end gallery aesthetic, canvas texture, dramatic lighting, rich colors, detailed brushwork: ${prompt}`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return null;
};

export const analyzeProductImage = async (base64Image: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
          { text: "Analyze this luxury product image. Describe its materials, craftsmanship, and estimate its value in a high-end market. Format as a brief, poetic gallery description." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text || "Unable to analyze image.";
  } catch (error) {
    return "Error analyzing product image.";
  }
};

export const chatWithSupport = async (message: string, history: { role: 'user' | 'model', content: string }[]) => {
  const ai = getAI();
  // Fixed: Pass context history to the chat session for continuity
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    })),
    config: {
      systemInstruction: "You are K-SHOP AI Assistant. K-SHOP is a luxury Algerian e-commerce brand. You are sophisticated, helpful, and knowledgeable about Algerian culture and modern luxury. You help customers with product inquiries, order tracking, and general luxury advice.",
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const getQuickAdvice = async (query: string): Promise<{ text: string; sources?: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      text: response.text || "",
      // Correctly extract grounding information for transparency
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    return { text: "Search service temporarily unavailable." };
  }
};