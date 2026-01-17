import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase App as a singleton
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Fallback if config is missing but trying to avoid a hard crash
  app = getApps().length ? getApp() : null;
}

// Initialize Auth explicitly from the registered app
export const auth = app ? getAuth(app) : ({} as any);
export const googleProvider = new GoogleAuthProvider();

// Custom parameters to ensure account selection popup
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup, signOut, onAuthStateChanged };
export { GoogleAuthProvider };