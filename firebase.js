// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyChbZMTDJjDRonF2fYB32NNx2EnHCaoXSU",
  authDomain: "yachay-social-network.firebaseapp.com",
  projectId: "yachay-social-network",
  storageBucket: "yachay-social-network.appspot.com",
  messagingSenderId: "1067143889084",
  appId: "1:1067143889084:android:8b3f9f2cf5a6b4d37490b9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
