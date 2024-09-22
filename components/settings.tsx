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
  openaiApiKey: string;
  setOpenaiApiKey: (key: string) => void;
  saveSettings: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  darkMode,
  setDarkMode,
  openaiApiKey,
  setOpenaiApiKey,
  saveSettings
}) => {
  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700">
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
          
          {/* OpenAI API Key */}
          <div className="space-y-2">
            <Label htmlFor="openai-api-key">OpenAI API Key</Label>
            <Input
              id="openai-api-key"
              type="password"
              value={openaiApiKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpenaiApiKey(e.target.value)}
              className="bg-gray-800 border-gray-700 text-gray-100"
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
