/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_FEATURE_REAL_TIME_UPDATES: string
  readonly VITE_FEATURE_3D_MODEL_VIEWER: string
  readonly VITE_FEATURE_MOCK_DATA_BUTTON: string
  readonly VITE_MOCK_DATA_UPDATE_INTERVAL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  
  // Built-in Vite environment variables
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Made with Bob
