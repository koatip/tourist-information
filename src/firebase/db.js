import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from './config';

initializeApp(firebaseConfig);
const db = getFirestore();

export default db;
