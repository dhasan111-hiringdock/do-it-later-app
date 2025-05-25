
import { Home, Bell, Settings, User, List } from 'lucide-react';
import { TabType } from './MobileApp';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'add', icon: Bell, label: 'Add' },
    { id: 'assistant', icon: Settings, label: 'Assistant' },
    { id: 'boards', icon: List, label: 'Boards' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="tab-bar">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-dolater-mint bg-dolater-mint-light'
                  : 'text-dolater-text-secondary hover:text-dolater-mint'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
