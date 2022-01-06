import {initializeApp} from 'firebase/app';
import {getDatabase, onValue, ref, set} from 'firebase/database';
import {useEffect, useState} from 'react';
import {getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut} from 'firebase/auth';

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNurY68Zq_1UN1Qu7iwlnhglV4lmDKSeo",
    authDomain: "react-tutorial-8b56e.firebaseapp.com",
    databaseURL: "https://react-tutorial-8b56e-default-rtdb.firebaseio.com",
    projectId: "react-tutorial-8b56e",
    storageBucket: "react-tutorial-8b56e.appspot.com",
    messagingSenderId: "973026448505",
    appId: "1:973026448505:web:d95022b4eb2631b4ea30a8",
    measurementId: "G-ZYD9HWECCN"
};

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const dbRef = ref(database, path);
        const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        if (devMode) {
            console.log(`loading ${path}`);
        }
        return onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (devMode) {
                console.log(val);
            }
            setData(transform ? transform(val) : val);
            setLoading(false);
            setError(null);
        }, (error) => {
            setData(null);
            setLoading(false);
            setError(error);
        });
    }, [path, transform]);

    return [data, loading, error];
};

export const useUserState = () => {
    const [user, setUser] = useState();

    useEffect(() => {
        onIdTokenChanged(getAuth(firebase), setUser);
    }, []);

    return [user];
};

const firebaseSignOut = () => signOut(getAuth(firebase));

export {firebaseSignOut as signOut};

export const setData = (path, value) => (
    set(ref(database, path), value)
);

export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
};

const firebase = initializeApp(firebaseConfig);

const database = getDatabase(firebase);