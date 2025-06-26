import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGdQ2wU3pLhTTXl9pmrwYKLbK9FBaEqzM",
  authDomain: "growhive-b5f5a.firebaseapp.com",
  projectId: "growhive-b5f5a",
  storageBucket: "growhive-b5f5a.appspot.com",
  messagingSenderId: "985644905706",
  appId: "1:985644905706:web:6d2c964f5a7210e3241393"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
