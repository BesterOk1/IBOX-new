import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "ваш_api_key",
  authDomain: "ваш_domain",
  projectId: "ваш_project_id",
  storageBucket: "ваш_storage",
  messagingSenderId: "ваш_sender_id",
  appId: "ваш_app_id"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
