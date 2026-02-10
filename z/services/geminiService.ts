
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a compelling, professional e-commerce product description for a product named "${name}" in the "${category}" category. Keep it around 3 sentences.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text?.trim() || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const generateDarijaReviews = async (productName: string): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 high-quality, realistic user reviews for a product named "${productName}" in Algerian Darija (Arabic script). Each review should have a user name, a rating (between 4 and 5), and a comment. The tone should be natural and positive.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              userName: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              comment: { type: Type.STRING }
            },
            required: ["userName", "rating", "comment"]
          }
        }
      }
    });
    const parsed = JSON.parse(response.text || "[]");
    return parsed.map((r: any) => ({
      ...r,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const suggestStoreBranding = async (niche: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a store name, a primary brand color (hex code), and a hero slogan for a store specializing in ${niche}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storeName: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            heroSlogan: { type: Type.STRING }
          },
          required: ["storeName", "primaryColor", "heroSlogan"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const suggestDeliveryRates = async (niche: string, userProvidedList?: string) => {
  try {
    const prompt = userProvidedList 
      ? `Parse this delivery price list for Algeria. Input text: "${userProvidedList}". 
         The user is providing data in the format: "[wilaya_number] [domicile_price] [bureau_price]".
         Example: "1 1400 800" means Wilaya 01 (Adrar) gets 1400 DZD for Domicile and 800 DZD for Bureau.
         Return a JSON array of objects, each containing: wilayaCode (number), domicile (number), and bureau (number).
         If the input is natural language, try to infer the specific wilayas and prices.`
      : `Provide competitive e-commerce delivery rates for a store selling ${niche} in Algeria. 
         Provide a JSON array for all 58 wilayas (wilayaCode 1 to 58) with reasonable domicile and bureau prices.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              wilayaCode: { type: Type.NUMBER },
              domicile: { type: Type.NUMBER },
              bureau: { type: Type.NUMBER }
            },
            required: ["wilayaCode", "domicile", "bureau"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
