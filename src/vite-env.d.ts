/// <reference types="vite/client" />

declare global {
  interface Window {
    liff?: {
      closeWindow: () => void;
      ready?: Promise<void>;
      init: (config: any) => Promise<void>;
      getProfile: () => Promise<any>;
      isLoggedIn: () => boolean;
      login: () => void;
      logout: () => void;
    };
  }
}
