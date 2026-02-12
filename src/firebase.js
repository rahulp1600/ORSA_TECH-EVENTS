// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaoCvajqwfB3o65UBNo477mDlDNod7Fpo",
    authDomain: "orsa-technical.firebaseapp.com",
    projectId: "orsa-technical",
    storageBucket: "orsa-technical.firebasestorage.app",
    messagingSenderId: "1015206352678",
    appId: "1:1015206352678:web:7356063c203989434613e7",
    measurementId: "G-MSQ1B8FP33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Analytics might fail in some environments (e.g. strict CSP), wrap in try-catch or check window
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}
const db = getFirestore(app);

// Collection References
// We'll store results in collections named after the event (e.g., 'tech_picto_results', 'code_rush_results')

/**
 * Save a game result to Firebase
 * @param {string} eventName - 'techpicto', 'coderush', 'wordhunt', 'codedebugging'
 * @param {object} resultData - The data to save (name, rollNo, score, time, etc.)
 */
export const saveGameResult = async (eventName, resultData) => {
    try {
        const collectionName = `${eventName}_results`;
        await addDoc(collection(db, collectionName), {
            ...resultData,
            timestamp: serverTimestamp() // Server-side timestamp for ordering
        });
        console.log(`Result saved to ${collectionName}`);
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
};

/**
 * Fetch leaderboard data for an event (One-time fetch)
 * @param {string} eventName - 'techpicto', 'coderush', 'wordhunt', 'codedebugging'
 */
export const getLeaderboardData = async (eventName) => {
    try {
        const collectionName = `${eventName}_results`;
        // Fetch all documents without server-side sorting to avoid index errors
        // The AdminDashboard already handles client-side sorting
        const q = query(collection(db, collectionName));

        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });
        return results;
    } catch (e) {
        console.error("Error fetching leaderboard: ", e);
        return [];
    }
};

/**
 * Subscribe to leaderboard updates (Real-time listener)
 * @param {string} eventName - 'techpicto', 'coderush', 'wordhunt', 'codedebugging'
 * @param {function} callback - Function to call with new data
 * @returns {function} Unsubscribe function
 */
export const subscribeToLeaderboard = (eventName, callback) => {
    try {
        const collectionName = `${eventName}_results`;
        const q = query(collection(db, collectionName));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            callback(results);
        }, (error) => {
            console.error("Error listening to leaderboard: ", error);
            callback([]); // Return empty on error or handle differently
        });

        return unsubscribe;
    } catch (e) {
        console.error("Error setting up listener: ", e);
        return () => { }; // Return no-op unsubscribe
    }
};

export { db };
