import React from 'react';
import { Home, Target, Calendar, User, Settings, LogOut } from 'lucide-react';
import { Dock, DockIcon } from "@/components/ui/dock";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface DockNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleSignOut: () => void;
}

const DockNavigation: React.FC<DockNavigationProps> = ({ activeTab, setActiveTab, handleSignOut }) => {
  const tabs = [
    { name: 'dashboard', icon: Home, label: 'Dashboard' },
    { name: 'goals', icon: Target, label: 'Goals' },
    //{ name: 'calendar', icon: Calendar, label: 'Calendar' },
    { name: 'profile', icon: User, label: 'Profile' },
    //{ name: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 w-full py-2 z-10">
        <Dock direction="middle" className="justify-around rounded-full">
          {tabs.map((tab) => (
            <Tooltip key={tab.name}>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setActiveTab(tab.name)} 
                  className="focus:outline-none flex flex-col items-center"
                >
                  <DockIcon>
                    <tab.icon
                      className={`h-6 w-6 sm:w-8 sm:h-8 hover:text-primary ${
                        activeTab === tab.name ? 'text-primary' : 'text-gray-700'
                      }`}
                    />
                  </DockIcon>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" align="center" className="z-50">
                {tab.label}
              </TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleSignOut} 
                className="focus:outline-none flex flex-col items-center"
              >
                <DockIcon>
                  <LogOut className="h-4 w-4 sm:w-8 sm:h-8 text-gray-700 hover:text-primary" />
                </DockIcon>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" align="center" className="z-50">
              Sign Out
            </TooltipContent>
          </Tooltip>
        </Dock>
      </div>
    </TooltipProvider>
  );
};

export default DockNavigation;