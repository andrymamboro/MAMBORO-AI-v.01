
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, EditResult } from "../types";

export const processImageEdit = async (
  base64Image: string,
  prompt: string,
  aspectRatio: AspectRatio = "1:1",
  refImage?: string | null
): Promise<EditResult> => {
  // Selalu buat instance baru sebelum pemanggilan untuk memastikan menggunakan kunci API terbaru
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Helper untuk membersihkan data base64
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

  // Struktur parts
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
      text: `INSTRUCTION: ${prompt}. TASK: Use the style or content from the second image and apply it to the first image. Preserve the subject's identity.`
    });
  } else {
    parts.push({
      text: `INSTRUCTION: ${prompt}. TASK: Edit this image based on the instruction while maintaining the subject's likeness.`
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
          resultText += part.text;
        }
      }
    }

    if (!resultImageUrl) {
      if (resultText) {
        throw new Error(`AI Responded: ${resultText}`);
      }
      throw new Error("AI tidak menghasilkan gambar. Hal ini mungkin disebabkan oleh filter keamanan (Safety Filter).");
    }

    return { imageUrl: resultImageUrl, text: resultText };
  } catch (error: any) {
    console.error("Gemini Edit Service Error:", error);
    
    const errMsg = error.message || "";
    // Penanganan error spesifik untuk kuota atau kunci API
    if (errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("Quota exceeded")) {
      throw new Error("RESOURCE_EXHAUSTED: Kuota API Free Tier habis. Silakan gunakan API Key dari Project Google Cloud dengan Billing aktif.");
    }
    
    if (errMsg.includes("API key not valid") || errMsg.includes("entity was not found")) {
      throw new Error("Koneksi API bermasalah. Silakan pilih kembali Kunci API Anda di menu Pengaturan.");
    }
    
    throw error;
  }
};
