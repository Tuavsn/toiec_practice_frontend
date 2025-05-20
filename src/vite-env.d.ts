/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TOXIC_CLASSIFIER_API_URL: string;
  readonly VITE_PEXELS_API_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_GEMINI_TEXT_MODEL:string;
  readonly VITE_GEMINI_MULTIMODAL_MODEL:string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}