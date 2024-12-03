/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HERE_API_KEY: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_WEATHER_API_KEY:string;
    readonly VITE_SAFE_PLACES_API_KEY:string;
    readonly VITE_SAFE_PLACES_API_SECRETE:string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
