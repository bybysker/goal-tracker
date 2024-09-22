"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/db/configFirebase"
import { onAuthStateChanged, User, GoogleAuthProvider, GithubAuthProvider,
    OAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    signInWithPopup, signOut } from "firebase/auth" 
 

const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()
const appleProvider = new OAuthProvider('apple.com')

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            setUser(result.user)
            router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    const handleGithubSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider)
            setUser(result.user)
            router.push('/')
        } catch (error) {
            console.error(error)
        }
    }
    
    const handleAppleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, appleProvider)
            setUser(result.user)
            router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    const handleEmailPasswordSignIn = async (email: string, password: string) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            setUser(result.user)
            router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth)
            setUser(null)
            router.push('/login')
        } catch (error) {
            console.error(error)
        }
    }

    const registerUser = async (email: string, password: string) => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            setUser(result.user)
            router.push('/')
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user)
            setIsLoading(false)
        })
        return () => unsubscribe()
    }, []) 

    const redirectIfAuthenticated = () => {
        if (user) {
            router.push('/')
        }
    }

    

    return { user, isLoading, handleGoogleSignIn, handleGithubSignIn, handleAppleSignIn,
        handleEmailPasswordSignIn, handleSignOut, registerUser, redirectIfAuthenticated };
    }