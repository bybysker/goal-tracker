"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User as FirebaseUser } from 'firebase/auth';
import { ChevronLeft, ChevronRight, Mail, Shield, FileText, Star, Trash2 } from 'lucide-react'
import { collection, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db, storage } from '@/db/configFirebase';
import { UserProfile } from '@/types';
import { ProfileItem } from '@/components/profile-item';
import { LinkItem } from '@/components/link-item';
import { updateProfile as updateAuthProfile, deleteUser } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { ref, listAll, deleteObject } from 'firebase/storage';
import { useRouter } from 'next/navigation';


interface SettingsProps {
  user: FirebaseUser | null;
  updateProfile: (profile: { 
    name: string;
    passions?: string;
    life_goals?: string;
  }) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, updateProfile }) => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [changes, setChanges] = useState<Record<string, string>>({})
  const { toast } = useToast();
  const router = useRouter();

  const handleEdit = (field: string, value: string) => {
    setChanges(prev => ({ ...prev, [field]: value }))
  }
 
  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      // Fetch user profile data from Firestore
      const userProfileSnapshot = await getDocs(collection(db, 'users', user.uid, 'userProfile'));
      
      if (!userProfileSnapshot.empty) {
        // Get the first document since we should only have one profile per user
        const profileDoc = userProfileSnapshot.docs[0];
        const profileData = {
          ...profileDoc.data(),
        } as UserProfile;

        setProfileData(profileData);
        console.log(profileData)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Fetch profile data when component mounts or user changes
  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      // 1. Delete all Firestore data
      // Delete user profile
      const userProfileSnapshot = await getDocs(collection(db, 'users', user.uid, 'userProfile'));
      for (const doc of userProfileSnapshot.docs) {
        await deleteDoc(doc.ref);
      }

      // Delete goals and their nested collections
      const goalsSnapshot = await getDocs(collection(db, 'users', user.uid, 'goals'));
      for (const goalDoc of goalsSnapshot.docs) {
        // Delete milestones and their tasks
        const milestonesSnapshot = await getDocs(collection(db, 'users', user.uid, 'goals', goalDoc.id, 'milestones'));
        for (const milestoneDoc of milestonesSnapshot.docs) {
          // Delete tasks
          const tasksSnapshot = await getDocs(collection(db, 'users', user.uid, 'goals', goalDoc.id, 'milestones', milestoneDoc.id, 'tasks'));
          for (const taskDoc of tasksSnapshot.docs) {
            await deleteDoc(taskDoc.ref);
          }
          await deleteDoc(milestoneDoc.ref);
        }
        await deleteDoc(goalDoc.ref);
      }

      // Delete main user document
      await deleteDoc(doc(db, 'users', user.uid));

      // 2. Delete files from Storage
      const storageRef = ref(storage, `users/${user.uid}`);
      const filesList = await listAll(storageRef);
      await Promise.all(filesList.items.map(item => deleteObject(item)));

      // 3. Delete the user authentication record
      await deleteUser(user);

      // 4. Show success message and redirect
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        duration: 3000,
      });

      // 5. Redirect to login page
      router.push('/login');

    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card className="bg-gray-900 text-gray-100 border-gray-700">
        <CardContent>
          <p className="text-center">User data is not available.</p>
        </CardContent>
      </Card>
    );
  }

  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="max-h-full max-w-screen-lg mx-auto">
      <h2 className="text-lg font-bold text-center mb-2 backdrop-blur-sm">Account Settings</h2>
      <Card>
        <CardTitle>
          <h2 className="text-md font-bold p-4">User Profile:</h2>
        </CardTitle>
        <CardContent className="p-0">
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              updateProfile({
                name: changes['name'] ?? user?.displayName ?? '',
                passions: changes['passions'] ?? profileData?.passions ?? '',
                life_goals: changes['life_goals'] ?? profileData?.life_goals ?? ''
              });
              // Clear changes after successful update
              setChanges({});
            }}
            className="space-y-4"
          >
            <div className="divide-y">
              <ProfileItem label="Name" value={changes['name'] ?? user.displayName ?? ''} onEdit={(newValue) => handleEdit('name', newValue)} />
              <ProfileItem label="Passions" value={changes['passions'] ?? profileData?.passions ?? ''} onEdit={(newValue) => handleEdit('passions', newValue)} />
              <ProfileItem label="Life Goals" value={changes['life_goals'] ?? profileData?.life_goals ?? ''} onEdit={(newValue) => handleEdit('life_goals', newValue)} />
            </div>
            <Button type="submit" className="w-full bg-[#78C0E0]/40 shadow-xl hover:bg-[#78C0E0]/60" >
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardTitle>
          <h2 className="text-md font-bold p-4">Useful links:</h2>
        </CardTitle>
        <CardContent className="p-0">
          <div className="divide-y">
            <LinkItem href="/contact-us" icon={Mail} label="Contact Us" />
            <LinkItem href="/privacy-policy" icon={Shield} label="Privacy Policy" />
            <LinkItem href="/terms-of-service" icon={FileText} label="Terms of Service" />
            <LinkItem href="/rate-us" icon={Star} label="Rate Us" />
          </div>
        </CardContent>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="w-full mt-4"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    


  );
}

export default Settings;