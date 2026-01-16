
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface EditResult {
  imageUrl: string;
  text?: string;
}

/**
 * Interface for the AI Studio global object.
 * This needs to be defined to match the expected global type name.
 */
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    /**
     * The aistudio object is injected into the window.
     * We use 'readonly' and the 'AIStudio' type to match existing global declarations
     * and avoid modifier/type mismatch errors.
     */
    readonly aistudio: AIStudio;
  }
}

export {};
