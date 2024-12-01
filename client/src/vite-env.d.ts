/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HERE_API_KEY: string;
    readonly BACKEND_URL: string;
    readonly VITE_WEATHER_API_KEY:string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
