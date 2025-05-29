
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Settings, Download, HelpCircle, FileText, Shield, X } from 'lucide-react';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { subscribed, subscriptionTier, subscriptionEnd, loading: subscriptionLoading } = useSubscription();
  const [userStats, setUserStats] = useState({
    contentSaved: 0,
    actionsTaken: 0,
    remindersSet: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const { toast } = useToast();

  // Override subscription for testing - always return true for premium access
  const isProUser = true; // Force premium access for testing

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const { data: contentItems, error: contentError } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', user.id);

      if (contentError) throw contentError;

      const stats = {
        contentSaved: contentItems?.length || 0,
        actionsTaken: contentItems?.filter(item => item.is_completed).length || 0,
        remindersSet: contentItems?.filter(item => item.reminder_set).length || 0
      };

      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    try {
      const { data: contentItems, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const exportData = {
        user: {
          email: user?.email,
          created_at: user?.created_at
        },
        stats: userStats,
        content_items: contentItems
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dolater-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Your data has been downloaded as a JSON file.",
      });
      setActiveModal(null);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const settingsActions = [
    { 
      icon: Settings, 
      label: 'Notification Preferences', 
      action: () => setActiveModal('notifications')
    },
    { 
      icon: Shield, 
      label: 'Privacy Settings', 
      action: () => setActiveModal('privacy')
    },
    { 
      icon: Download, 
      label: 'Export Data', 
      action: () => setActiveModal('export')
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      action: () => setActiveModal('help')
    },
    { 
      icon: FileText, 
      label: 'Terms of Service', 
      action: () => setActiveModal('terms')
    },
    { 
      icon: Shield, 
      label: 'Privacy Policy', 
      action: () => setActiveModal('privacy-policy')
    }
  ];

  const renderModal = () => {
    if (!activeModal) return null;

    const modalContent = {
      notifications: {
        title: "Notification Preferences",
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email notifications</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span>Push notifications</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span>Reminder notifications</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <button 
              onClick={() => {
                toast({ title: "Settings saved", description: "Your notification preferences have been updated." });
                setActiveModal(null);
              }}
              className="w-full bg-dolater-mint text-white py-2 rounded-lg"
            >
              Save Preferences
            </button>
          </div>
        )
      },
      privacy: {
        title: "Privacy Settings",
        content: (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Make profile public</span>
              <input type="checkbox" className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <span>Allow data analytics</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <button 
              onClick={() => {
                toast({ title: "Privacy settings updated", description: "Your privacy preferences have been saved." });
                setActiveModal(null);
              }}
              className="w-full bg-dolater-mint text-white py-2 rounded-lg"
            >
              Save Settings
            </button>
          </div>
        )
      },
      export: {
        title: "Export Data",
        content: (
          <div className="space-y-4">
            <p className="text-sm text-dolater-text-secondary">
              Export all your saved content, boards, and user data as a JSON file.
            </p>
            <div className="bg-dolater-gray p-3 rounded-lg">
              <p className="text-xs text-dolater-text-secondary">
                Export includes: {userStats.contentSaved} content items, user profile, and usage statistics.
              </p>
            </div>
            <button 
              onClick={handleExportData}
              className="w-full bg-dolater-mint text-white py-2 rounded-lg"
            >
              Download Export
            </button>
          </div>
        )
      },
      help: {
        title: "Help & Support",
        content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Frequently Asked Questions</h4>
              <div className="text-sm text-dolater-text-secondary space-y-1">
                <p>• How do I save content? - Use the + button or share from other apps</p>
                <p>• How do I organize content? - Create boards and use tags</p>
                <p>• How do I set reminders? - Tap on any content item and set a reminder</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Contact Support</h4>
              <p className="text-sm text-dolater-text-secondary">Email: support@dolater.app</p>
            </div>
          </div>
        )
      },
      terms: {
        title: "Terms of Service",
        content: (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <div className="text-sm text-dolater-text-secondary space-y-2">
              <h4 className="font-medium text-dolater-text-primary">DoLater Terms of Service</h4>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>By using DoLater, you agree to these terms...</p>
              <p>1. You may use DoLater to save and organize content for personal use.</p>
              <p>2. You are responsible for the content you save and share.</p>
              <p>3. We respect your privacy and will not share your data without consent.</p>
              <p>4. These terms may be updated from time to time.</p>
            </div>
          </div>
        )
      },
      "privacy-policy": {
        title: "Privacy Policy",
        content: (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <div className="text-sm text-dolater-text-secondary space-y-2">
              <h4 className="font-medium text-dolater-text-primary">DoLater Privacy Policy</h4>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p>We collect and use your information to provide DoLater services...</p>
              <p>• We collect content you save and metadata</p>
              <p>• We use analytics to improve our service</p>
              <p>• We never sell your personal data</p>
              <p>• You can export or delete your data at any time</p>
            </div>
          </div>
        )
      }
    };

    const modal = modalContent[activeModal as keyof typeof modalContent];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-dolater-text-primary">{modal.title}</h3>
            <button 
              onClick={() => setActiveModal(null)}
              className="text-dolater-text-secondary hover:text-dolater-text-primary"
            >
              <X size={20} />
            </button>
          </div>
          {modal.content}
        </div>
      </div>
    );
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-dolater-mint border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="w-20 h-20 bg-dolater-mint rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-dolater-text-primary">
          {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'DoLater User'}
        </h1>
        <p className="text-sm text-dolater-text-secondary">
          {isProUser ? 'Pro Plan Member (Testing)' : 'Free Plan Member'}
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-dolater-text-primary">
              {isProUser ? 'Pro Plan (Testing)' : 'Free Plan'}
            </div>
            <div className="text-sm text-dolater-text-secondary">
              {isProUser 
                ? 'Unlimited saves available (Testing mode)' 
                : `${Math.max(0, 15 - userStats.contentSaved)} saves left this month`
              }
            </div>
            {isProUser && (
              <div className="text-xs text-green-600 mt-1">
                ✓ Testing access enabled - All premium features unlocked
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">This Month</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-dolater-text-secondary">Content Saved</span>
            <span className="text-sm font-medium">
              {userStats.contentSaved} {isProUser ? '' : '/ 15'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dolater-text-secondary">Actions Taken</span>
            <span className="text-sm font-medium">{userStats.actionsTaken}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dolater-text-secondary">Reminders Set</span>
            <span className="text-sm font-medium">{userStats.remindersSet}</span>
          </div>
        </div>
      </div>

      {/* Testing Status */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4">
        <h3 className="font-bold text-white mb-2">Testing Mode Active</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-white">
            <span className="text-green-200 mr-2">✓</span>
            Premium AI Assistant unlocked
          </div>
          <div className="flex items-center text-sm text-white">
            <span className="text-green-200 mr-2">✓</span>
            Unlimited saves & boards
          </div>
          <div className="flex items-center text-sm text-white">
            <span className="text-green-200 mr-2">✓</span>
            All features enabled for testing
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Settings</h3>
        <div className="space-y-3">
          {settingsActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center text-left py-2 text-sm text-dolater-text-secondary hover:text-dolater-mint transition-colors"
              >
                <Icon size={16} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sign Out */}
      <button 
        onClick={handleSignOut}
        className="w-full bg-category-urgent text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
      >
        <LogOut size={16} className="mr-2" />
        Sign Out
      </button>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default ProfileScreen;
