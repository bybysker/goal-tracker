import React from 'react';
import { Home, Target, Calendar, User, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, handleSignOut }) => {
  const tabs = [
    { name: 'dashboard', icon: Home, label: 'Dashboard' },
    { name: 'goals', icon: Target, label: 'Goals' },
    { name: 'calendar', icon: Calendar, label: 'Calendar' },
    { name: 'profile', icon: User, label: 'Profile' },
    { name: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <nav className="space-y-4">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center space-x-2 w-full p-2 rounded ${
              activeTab === tab.name ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;