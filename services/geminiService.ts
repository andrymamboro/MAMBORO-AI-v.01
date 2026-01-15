import { GoogleGenAI } from "@google/genai";
import { AspectRatio, EditResult } from "../types";

export const processImageEdit = async (
  base64Image: string,
  prompt: string,
  aspectRatio: AspectRatio = "1:1",
  refImage?: string | null
): Promise<EditResult> => {
  // Always create a fresh instance right before usage to ensure current API KEY from context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Helper to extract clean base64 and mime type correctly
  const parseBase64 = (base64: string) => {
    if (!base64.includes(';base64,')) {
      return { mimeType: 'image/png', data: base64 };
    }
    const parts = base64.split(';base64,');
    const mimeType = parts[0].split(':')[1] || 'image/png';
    const data = parts[1];
    return { mimeType, data };
  };

  const sourceData = parseBase64(base64Image);

  const parts: any[] = [
    {
      inlineData: {
        data: sourceData.data,
        mimeType: sourceData.mimeType,
      },
    }
  ];

  if (refImage) {
    const refData = parseBase64(refImage);
    parts.push({
      inlineData: {
        data: refData.data,
        mimeType: refData.mimeType,
      },
    });
    
    parts.push({
      text: `TASK: PROFESSIONAL IMAGE EDITING. 
      Input 1: The subject to be edited.
      Input 2: The clothing/style reference.
      
      INSTRUCTION: ${prompt}.
      
      REQUIREMENTS:
      1. Strictly follow the clothing style/color from Input 2.
      2. Perfectly preserve the facial features, hair, and identity of the person in Input 1.
      3. Maintain natural lighting and high-quality blending.
      4. Output only the final edited image. No text commentary.`
    });
  } else {
    parts.push({
      text: `TASK: PROFESSIONAL IMAGE EDITING.
      INSTRUCTION: ${prompt}.
      
      REQUIREMENTS:
      1. High-fidelity modification based on prompt.
      2. Preserve the original subject's identity and basic features.
      3. Professional grade image blending and realistic lighting.
      4. Output only the resulting image.`
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio,
        },
      },
    });

    let resultImageUrl = '';
    let resultText = '';

    const candidates = response.candidates;
    if (candidates && candidates.length > 0 && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          resultImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          resultText = part.text;
        }
      }
    }

    if (!resultImageUrl) {
      throw new Error("AI tidak menghasilkan gambar. Ini mungkin karena filter keamanan atau instruksi yang kurang jelas.");
    }

    return { imageUrl: resultImageUrl, text: resultText };
  } catch (error: any) {
    console.error("Gemini Edit Service Error:", error);
    
    // Bubble up error to App.tsx to handle key re-selection if needed
    throw error;
  }
};