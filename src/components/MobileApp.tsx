
import { useState } from 'react';
import TabNavigation from './TabNavigation';
import HomeScreen from './screens/HomeScreen';
import AddScreen from './screens/AddScreen';
import AssistantScreen from './screens/AssistantScreen';
import BoardsScreen from './screens/BoardsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShareReceiver from './ShareReceiver';

export type TabType = 'home' | 'add' | 'assistant' | 'boards' | 'profile';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'add':
        return <AddScreen />;
      case 'assistant':
        return <AssistantScreen />;
      case 'boards':
        return <BoardsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="mobile-container">
      <ShareReceiver />
      <div className="content-area">
        {renderScreen()}
      </div>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MobileApp;
