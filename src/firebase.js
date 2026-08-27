// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";

export const EVENTSConfig = {
    apiKey: "AIzaSyBaXF__tQjnCJbglVaR6NWt5lZJgilGo2c",
    authDomain: "events23-ac039.firebaseapp.com",
    projectId: "events23-ac039",
    storageBucket: "events23-ac039.appspot.com",
    messagingSenderId: "158615554504",
    appId: "1:158615554504:web:1e5ae8be25f92583af98fd",
    measurementId: "G-60LTRKWX3L"
};

const app = initializeApp(EVENTSConfig);
// const authapp = initializeApp(firebaseConfig,'second');
export const db = getFirestore(app);
const profileRef = collection(db, "NewPeople");

// export const auth = getAuth(authapp);
export const auth = getAuth(app)
auth.languageCode = 'it';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export const signInWithpopup = () => signInWithPopup(auth, provider);

export const getProfile = async (id) => {
    const docRef = doc(db, "NewPeople", id);
    try {
    const docSnap = await getDoc(docRef);
    return docSnap;
  } catch (error) {
    console.log(error);
  }
};

export const getSports = async (id) => {
    const collRef = doc(db, "NewPeople", id);
    try {
      const tempdocSnaps = await getDoc(collRef);
      const docSnaps = tempdocSnaps.data().sports;
      return docSnaps;
    } catch (error) {
      console.log(error);
    }
  };





