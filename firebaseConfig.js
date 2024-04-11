import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyAx0WCbEAC-muD9EPNOrmDW6N-UmyskJ5Y",
  authDomain: "square-merge-game-b7496.firebaseapp.com",
  projectId: "square-merge-game-b7496",
  storageBucket: "square-merge-game-b7496.appspot.com",
  messagingSenderId: "233542903677",
  appId: "1:233542903677:web:801ce1812193436e194e14"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore();

export {
  auth,
  db
}