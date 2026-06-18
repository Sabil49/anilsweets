import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from '../config/firebase';

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  addresses?: Address[];
  createdAt: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  signUp: (email: string, password: string, displayName: string, phoneNumber?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, phoneNumber?: string) => Promise<void>;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              id: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              phoneNumber: '',
              addresses: [],
              createdAt: Date.now(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    phoneNumber: string = ''
  ) => {
    try {
      setError(null);
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(newUser, { displayName });
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        id: newUser.uid,
        email: newUser.email || '',
        displayName,
        phoneNumber,
        addresses: [],
        createdAt: Date.now(),
      };
      
      const userDocRef = doc(db, 'users', newUser.uid);
      await setDoc(userDocRef, userProfile);
      setUserProfile(userProfile);
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUserProfile(null);
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  };

  const updateUserProfile = async (displayName: string, phoneNumber?: string) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      await updateProfile(user, { displayName });
      
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { displayName, phoneNumber }, { merge: true });
      
      setUserProfile((prev) => 
        prev ? { ...prev, displayName, phoneNumber: phoneNumber || prev.phoneNumber } : null
      );
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  };


  const handleAuthError = (err: unknown) => {
    if (err instanceof Error) {
      const message = err.message;
      if (message.includes('email-already-in-use')) {
        setError('Email already registered. Please sign in.');
      } else if (message.includes('invalid-email')) {
        setError('Invalid email address.');
      } else if (message.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else if (message.includes('user-not-found')) {
        setError('Email not found. Please sign up first.');
      } else if (message.includes('wrong-password')) {
        setError('Incorrect password.');
      } else {
        setError(message);
      }
    } else {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthenticated: !!user,
        signUp,
        signIn,
        logout,
        resetPassword,
        updateUserProfile,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
