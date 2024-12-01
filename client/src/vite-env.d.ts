/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HERE_API_KEY: string;
    readonly BACKEND_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
