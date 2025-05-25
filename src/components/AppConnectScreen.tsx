
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface AppConnectScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const AppConnectScreen = ({ onComplete, onSkip }: AppConnectScreenProps) => {
  const [connectedApps, setConnectedApps] = useState<string[]>([]);

  const apps = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      description: 'Save reels and posts',
      connected: false
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: '▶️',
      description: 'Save videos and shorts',
      connected: false
    },
    {
      id: 'reddit',
      name: 'Reddit',
      icon: '🤖',
      description: 'Save posts and comments',
      connected: false
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '👥',
      description: 'Save posts and articles',
      connected: false
    }
  ];

  const handleConnect = (appId: string) => {
    if (connectedApps.includes(appId)) {
      setConnectedApps(connectedApps.filter(id => id !== appId));
    } else {
      setConnectedApps([...connectedApps, appId]);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-dolater-mint rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔗</span>
          </div>
          <h1 className="text-2xl font-bold text-dolater-text-primary mb-2">
            Connect Your Apps
          </h1>
          <p className="text-dolater-text-secondary">
            Share content directly from your favorite platforms to DoLater
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-dolater-mint-light p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-dolater-mint mb-2">How it works:</h3>
          <ol className="space-y-1 text-sm text-dolater-text-primary">
            <li>1. Open Instagram, YouTube, etc.</li>
            <li>2. Tap the Share button on any content</li>
            <li>3. Select "DoLater" from the share menu</li>
            <li>4. Content is automatically saved & organized</li>
          </ol>
        </div>

        {/* Apps List */}
        <div className="space-y-3 mb-8">
          {apps.map((app) => {
            const isConnected = connectedApps.includes(app.id);
            return (
              <div 
                key={app.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg card-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{app.icon}</div>
                  <div>
                    <h3 className="font-medium text-dolater-text-primary">{app.name}</h3>
                    <p className="text-sm text-dolater-text-secondary">{app.description}</p>
                  </div>
                </div>
                
                <Button
                  variant={isConnected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleConnect(app.id)}
                  className={isConnected ? "bg-dolater-mint hover:bg-dolater-mint-dark text-white" : "border-dolater-mint text-dolater-mint hover:bg-dolater-mint-light"}
                >
                  {isConnected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Manual Option */}
        <div className="bg-white p-4 rounded-lg card-shadow mb-8">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🔗</div>
            <div>
              <h3 className="font-medium text-dolater-text-primary">Manual Paste</h3>
              <p className="text-sm text-dolater-text-secondary">
                Copy and paste any URL directly into DoLater
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onComplete}
            className="w-full bg-dolater-mint hover:bg-dolater-mint-dark text-white py-3"
          >
            Continue to App
          </Button>
          
          <Button 
            variant="ghost"
            onClick={onSkip}
            className="w-full text-dolater-text-secondary hover:text-dolater-text-primary"
          >
            Skip for Now
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-dolater-text-secondary text-center mt-6">
          You can always connect apps later from Settings
        </p>
      </div>
    </div>
  );
};

export default AppConnectScreen;
