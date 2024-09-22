"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { User } from '@/types';

interface ProfileProps {
  user: User;
  updateProfile: (profile: { name: string; email: string }) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, updateProfile }) => {
  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            name: { value: string };
            email: { value: string };
          };
          updateProfile({
            name: target.name.value,
            email: target.email.value,
          });
        }} className="space-y-4">
          <div>
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" name="name" defaultValue={user.name} className="bg-gray-800 border-gray-700 text-gray-100" />
          </div>
          <div>
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" name="email" defaultValue={user.email} className="bg-gray-800 border-gray-700 text-gray-100" />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Update Profile</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default Profile;
