import { GoogleGenAI } from "@google/genai";
import { AspectRatio, EditResult } from "../types";

export const processImageEdit = async (
  base64Image: string,
  prompt: string,
  aspectRatio: AspectRatio = "1:1",
  refImage?: string | null
): Promise<EditResult> => {
  // Selalu buat instance baru sebelum pemanggilan untuk memastikan menggunakan kunci API terbaru
  // process.env.API_KEY akan otomatis berisi kunci yang dipilih user melalui dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Helper untuk membersihkan data base64 (menghapus prefix data:image/...)
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

  // Struktur parts: Gambar sumber harus selalu ada di urutan awal
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
          // Menemukan bagian gambar dalam respon
          resultImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        } else if (part.text) {
          // Menangkap teks penjelasan jika ada
          resultText += part.text;
        }
      }
    }

    if (!resultImageUrl) {
      // Jika tidak ada gambar, mungkin AI menolak karena kebijakan keamanan
      if (resultText) {
        throw new Error(`AI Responded: ${resultText}`);
      }
      throw new Error("AI tidak menghasilkan gambar. Hal ini mungkin disebabkan oleh filter keamanan (Safety Filter) atau instruksi yang terlalu ambigu.");
    }

    return { imageUrl: resultImageUrl, text: resultText };
  } catch (error: any) {
    console.error("Gemini Edit Service Error:", error);
    
    // Penanganan error spesifik untuk kunci API
    if (error.message?.includes("API key not valid") || error.message?.includes("entity was not found")) {
      throw new Error("Koneksi API bermasalah. Silakan pilih kembali Kunci API (Paid Project) Anda di menu Pengaturan.");
    }
    
    throw error;
  }
};