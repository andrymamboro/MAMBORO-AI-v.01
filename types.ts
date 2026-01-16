
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

export {};