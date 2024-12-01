"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User as FirebaseUser } from 'firebase/auth';
import { ChevronLeft, ChevronRight, Mail, Shield, FileText, Star, Trash2 } from 'lucide-react'

interface ProfileProps {
  user: FirebaseUser | null; // Updated to allow null
  updateProfile: (profile: { name: string; email: string }) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, updateProfile }) => {
  // If user is null, display a fallback UI
  if (!user) {
    return (
      <Card className="bg-gray-900 text-gray-100 border-gray-700">
        <CardContent>
          <p className="text-center">User data is not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-h-full max-w-screen-lg mx-auto">
      <Card className="bg-[#150578]/70 backdrop-blur-sm text-foreground shadow-xl border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-20 h-20">
              {user.photoURL ? (
                <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
              ) : (
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0) : 'U'}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {user.displayName ?? 'No Name Provided'}
              </h2>
              <p className="text-gray-400 text-xs break-all">{user.email ?? 'No Email Provided'}</p>
            </div>
          </div>
          <form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const target = e.target as typeof e.target & {
                name: { value: string };
                email: { value: string };
              };
              updateProfile({
                name: target.name.value,
                email: target.email.value,
              });
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                name="name"
                defaultValue={user.displayName ?? ''}
                className=" text-lg bg-[#78C0E0]/10 border-none shadow-md text-white placeholder-white/50"
                required
              />
            </div>
            <div>
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                name="email"
                type="email"
                defaultValue={user.email ?? ''}
                className=" text-lg bg-[#78C0E0]/10 border-none shadow-md text-white placeholder-white/50"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#78C0E0]/40 shadow-xl hover:bg-[#78C0E0]/60">
              Update Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <ProfileItem label="Name" value={user.displayName ?? ''} />
            <ProfileItem label="Openness to Experience" value={userProfile.openness} />
            <ProfileItem label="Conscientiousness" value={userProfile.conscientiousness} />
            <ProfileItem label="Extraversion" value={userProfile.extraversion} />
            <ProfileItem label="Agreeableness" value={userProfile.agreeableness} />
            <ProfileItem label="Emotional Stability" value={userProfile.neuroticism} />
            <ProfileItem label="Passions" value={userProfile.passions} />
            <ProfileItem label="Life Goals" value={userProfile.lifeGoals} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-blue-50/50 transition-colors">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{value}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

export default Profile;
