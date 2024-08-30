// src/utils/auth.js
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebase';

export const signUp = async (email, password, displayName) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the user profile with the display name
    await updateProfile(user, { displayName });

    // Save user data to Firebase Realtime Database
    await set(ref(database, 'users/' + user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      enrolledCourses: [], // Initialize with no enrolled courses
    });

    console.log('User signed up and saved to database:', user.uid);
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};
