import React from 'react';
import { Home, Target, Calendar, User, Settings, LogOut } from 'lucide-react';
import { Dock, DockIcon } from "@/components/ui/dock";

interface DockNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
}

const DockNavigation: React.FC<DockNavigationProps> = ({ activeTab, setActiveTab, handleSignOut }) => {
  const tabs = [
    { name: 'dashboard', icon: Home, label: 'Dashboard' },
    { name: 'goals', icon: Target, label: 'Goals' },
    { name: 'calendar', icon: Calendar, label: 'Calendar' },
    { name: 'profile', icon: User, label: 'Profile' },
    { name: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-gray-800">
      <Dock direction="middle">
        {tabs.map((tab) => (
          <button 
            key={tab.name} 
            onClick={() => setActiveTab(tab.name)} 
            className="focus:outline-none"
          >
            <DockIcon>
              <tab.icon
                className={`size-6 ${
                  activeTab === tab.name ? 'text-white' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-xs ${
                  activeTab === tab.name ? 'text-white' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </DockIcon>
          </button>
        ))}
        <button 
          onClick={handleSignOut} 
          className="focus:outline-none"
        >
          <DockIcon>
            <LogOut className="size-6 text-gray-400 hover:text-white" />
            <span className="text-xs text-gray-400">Sign Out</span>
          </DockIcon>
        </button>
      </Dock>
    </div>
  );
};

export default DockNavigation;
