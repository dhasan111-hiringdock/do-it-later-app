
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut, Settings, Download, HelpCircle, FileText, Shield } from 'lucide-react';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { subscribed, subscriptionTier, subscriptionEnd, loading: subscriptionLoading, createCheckout } = useSubscription();
  const [userStats, setUserStats] = useState({
    contentSaved: 0,
    actionsTaken: 0,
    remindersSet: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      // Fetch content items count
      const { data: contentItems, error: contentError } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', user.id);

      if (contentError) throw contentError;

      // Calculate stats
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

  const handleUpgrade = async () => {
    try {
      await createCheckout();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-dolater-mint border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const remainingSaves = subscribed ? 'Unlimited' : Math.max(0, 15 - userStats.contentSaved);

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
          {subscribed ? `${subscriptionTier} Plan Member` : 'Free Plan Member'}
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-dolater-text-primary">
              {subscribed ? `${subscriptionTier} Plan` : 'Free Plan'}
            </div>
            <div className="text-sm text-dolater-text-secondary">
              {subscribed 
                ? `Unlimited saves available` 
                : `${remainingSaves} saves left this month`
              }
            </div>
            {subscribed && subscriptionEnd && (
              <div className="text-xs text-dolater-text-secondary mt-1">
                Renews: {new Date(subscriptionEnd).toLocaleDateString()}
              </div>
            )}
          </div>
          {!subscribed && (
            <button 
              onClick={handleUpgrade}
              className="bg-dolater-mint text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dolater-mint-dark transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">This Month</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-dolater-text-secondary">Content Saved</span>
            <span className="text-sm font-medium">
              {userStats.contentSaved} {subscribed ? '' : '/ 15'}
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

      {/* Pro Features */}
      {!subscribed && (
        <div className="bg-gradient-to-r from-dolater-yellow to-yellow-400 rounded-lg p-4">
          <h3 className="font-bold text-dolater-text-primary mb-2">Upgrade to DoLater Pro</h3>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-dolater-text-primary">
              <span className="text-green-600 mr-2">✓</span>
              Unlimited saves & boards
            </div>
            <div className="flex items-center text-sm text-dolater-text-primary">
              <span className="text-green-600 mr-2">✓</span>
              Full AI Assistant with personalized plans
            </div>
            <div className="flex items-center text-sm text-dolater-text-primary">
              <span className="text-green-600 mr-2">✓</span>
              Advanced reminders & progress tracking
            </div>
            <div className="flex items-center text-sm text-dolater-text-primary">
              <span className="text-green-600 mr-2">✓</span>
              Export boards as PDF
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleUpgrade}
              className="flex-1 bg-dolater-text-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              $9.99/month
            </button>
            <button 
              onClick={handleUpgrade}
              className="flex-1 bg-white text-dolater-text-primary py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              7-day Free Trial
            </button>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Settings</h3>
        <div className="space-y-3">
          {[
            { icon: Settings, label: 'Notification Preferences', action: () => toast({ title: "Coming Soon", description: "Notification settings will be available soon." }) },
            { icon: Shield, label: 'Privacy Settings', action: () => toast({ title: "Coming Soon", description: "Privacy settings will be available soon." }) },
            { icon: Download, label: 'Export Data', action: () => toast({ title: "Coming Soon", description: "Data export will be available soon." }) },
            { icon: HelpCircle, label: 'Help & Support', action: () => toast({ title: "Coming Soon", description: "Help & support will be available soon." }) },
            { icon: FileText, label: 'Terms of Service', action: () => toast({ title: "Coming Soon", description: "Terms of service will be available soon." }) },
            { icon: Shield, label: 'Privacy Policy', action: () => toast({ title: "Coming Soon", description: "Privacy policy will be available soon." }) }
          ].map((item, index) => {
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
    </div>
  );
};

export default ProfileScreen;
