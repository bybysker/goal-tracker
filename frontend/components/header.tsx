// app/components/Header/Header.tsx
"use client";

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  SignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, SignOut }) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="goals">Goals & Challenges</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="voice-memo">Voice Memo</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
      </Tabs>
      <Button variant="ghost" onClick={SignOut}>
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    </div>
  )
}

export default Header;
