
import { GoogleGenAI } from "@google/genai";
import { AdPerformanceData } from "../types";

export const getAdInsights = async (data: AdPerformanceData[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const dataString = JSON.stringify(data, null, 2);

  const prompt = `
    Analyze the following banner advertisement performance data. 
    Explain which banner locations are performing the best in terms of ROI (Cost efficiency vs reach).
    Provide 3 concrete recommendations for optimizing the ad spend based on these metrics.
    Keep the response professional, concise, and in Korean.
    
    Data:
    ${dataString}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });
    return response.text || "No insights could be generated at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI 분석을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
