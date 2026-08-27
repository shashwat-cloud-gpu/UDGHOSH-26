import { useContext, createContext, useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    getAuth,
} from 'firebase/auth';
import { auth, db, getProfile, getSports } from "../firebase";
import toast, { Toaster } from 'react-hot-toast';

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState({});
    const [registeredSports, setRegisteredSports] = useState([]);
    const [isFetched, setIsFetched] = useState(false);
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                setUser(user);

            })
            .catch((error) => {
                // Handle Errors here.
                console.log("you are in sign in error");
                // ...
            });
    };
    const googleSignOut = () => {
        signOut(auth).then(() => {
            setUser(null);
            setUserData({});
            setRegisteredSports([]);
            setIsFetched(false);
            toast.success('You successfully logged out.');
        }).catch((error) => {
            console.log("sign out error");
        });

    };
    useEffect(() => {

        if (user) {
            getProfile(user.uid).then((docRef) => {
                if (docRef.exists()) {
                    const sportsRefs = getSports(user.uid);
                    const arr = [];
                    for (const [key, value] of Object.entries(sportsRefs)) {
                        console.log(key, value);
                        arr.push({ id: key, ...value });
                    }
                    setRegisteredSports(arr);
                    setUserData(docRef.data());
                    console.log(userData, "userData")
                    console.log(registeredSports, "registeredSports");
                    setIsFetched(true);
                    toast.success('You successfully logged in.');
                } else {
                    toast.error("Please register first.");
                }
            });
        }
    }, [user]);
    return (
        <AuthContext.Provider value={{ googleSignIn, googleSignOut, isFetched, user, registeredSports }}>
            {children}
            <Toaster />
        </AuthContext.Provider>
    );
};

export const UseAuth = () => {
    return useContext(AuthContext);
};