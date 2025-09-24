// THIS IS A DEVELOPMENT-ONLY SCRIPT
// It checks if there are any questions in Firestore. If not, it populates them
// from the mock data file. This ensures the app has data to work with on first run.
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { mockQuestions } from './mock-data';

let isInitialized = false;

export async function initializeDatabase() {
    if (process.env.NODE_ENV !== 'development' || isInitialized) {
        if (isInitialized) {
            console.log("Database initialization already attempted in this session.");
        }
        return;
    }

    console.log("Checking database initialization...");
    isInitialized = true; // Mark as attempted for this session

    try {
        const questionsCollection = collection(db, "questions");
        const snapshot = await getDocs(questionsCollection);

        if (snapshot.empty) {
            console.log("No questions found in Firestore. Populating from mock data...");
            const promises = mockQuestions.map(q => addDoc(questionsCollection, q));
            await Promise.all(promises);
            console.log(`Successfully added ${mockQuestions.length} questions to Firestore.`);
        } else {
            console.log("Questions already exist in Firestore. Skipping population.");
        }
    } catch (error) {
        console.error("Error initializing database:", error);
        isInitialized = false; // Allow re-attempt if it failed
    }
}
