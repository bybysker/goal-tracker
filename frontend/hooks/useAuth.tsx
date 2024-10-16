"use client"

import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/db/configFirebase";
import {
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Initialize Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Define the shape of our AuthContext
interface AuthContextType {
  user: FirebaseUser | null;
  isLoading: boolean;
  handleGoogleSignIn: () => Promise<void>;
  handleGithubSignIn: () => Promise<void>;
  handleAppleSignIn: () => Promise<void>;
  handleEmailPasswordSignIn: (email: string, password: string) => Promise<void>;
  handleSignOut: () => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
  redirectIfAuthenticated: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkFirstLogin = async (user: FirebaseUser) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // First login
      await setDoc(userDocRef, {
        email: user.email,
        firstLogin: true,
        // Add any other initial user data you want to store
      });
      router.push('/onboarding');
    } else {
      const userData = userDoc.data();
      if (userData.firstLogin) {
        // User hasn't completed onboarding
        router.push('/onboarding');
      } else {
        // Regular login
        router.push('/');
      }
    }
  };

  // Authentication Functions
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      await checkFirstLogin(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
      await checkFirstLogin(result.user);
    } catch (error) {
      console.error("Github Sign-In Error:", error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, appleProvider);
      setUser(result.user);
      await checkFirstLogin(result.user);
    } catch (error) {
      console.error("Apple Sign-In Error:", error);
    }
  };

  const handleEmailPasswordSignIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      await checkFirstLogin(result.user);
    } catch (error) {
      console.error("Email/Password Sign-In Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  const registerUser = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      await checkFirstLogin(result.user);
    } catch (error) {
      console.error("User Registration Error:", error);
    }
  };

  const redirectIfAuthenticated = () => {
    if (user) {
      checkFirstLogin(user);
    }
  };

  // Listen for Authentication State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
      if (firebaseUser) {
        await checkFirstLogin(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, []);

  // Provide the authentication context to children components
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        handleGoogleSignIn,
        handleGithubSignIn,
        handleAppleSignIn,
        handleEmailPasswordSignIn,
        handleSignOut,
        registerUser,
        redirectIfAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
