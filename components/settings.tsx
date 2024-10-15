"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";


interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  saveSettings: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  darkMode,
  setDarkMode,
  saveSettings
}) => {
  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700 max-h-full max-w-screen-lg mx-auto p-4 sm:p-6 space-y-6 ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          
          {/* Save Settings Button */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Settings;
