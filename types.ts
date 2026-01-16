
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
 * Moved into declare global to allow for proper interface merging and prevent 
 * shadowing conflicts between local and global scope.
 */
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    /**
     * The aistudio object is injected into the window.
     * // Fix: Removed 'readonly' to match the existing environment declaration and prevent modifier mismatch.
     */
    aistudio: AIStudio;
  }
}

export {};
