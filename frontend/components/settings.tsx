"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";


interface SettingsProps {
  saveSettings: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  saveSettings
}) => {
  return (
    <Card className="bg-gray-900 text-gray-100 border-gray-700 max-h-full max-w-screen-lg mx-auto p-4 sm:p-6 space-y-6 ">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
