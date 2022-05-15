import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CONFIG_measurementId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const analytics = (() => {
  if (typeof window !== 'undefined') return getAnalytics(app); // https://stackoverflow.com/a/69457158/16962686
  return null;
})();
export const db = getDatabase(app, 'https://next-auth-firebase-todo-mvc-default-rtdb.asia-southeast1.firebasedatabase.app');
