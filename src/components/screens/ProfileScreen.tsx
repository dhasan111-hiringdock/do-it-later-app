
const ProfileScreen = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="w-20 h-20 bg-dolater-mint rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">D</span>
        </div>
        <h1 className="text-xl font-bold text-dolater-text-primary">DoLater User</h1>
        <p className="text-sm text-dolater-text-secondary">Free Plan Member</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-dolater-text-primary">Free Plan</div>
            <div className="text-sm text-dolater-text-secondary">12 saves left this month</div>
          </div>
          <button className="bg-dolater-mint text-white px-4 py-2 rounded-lg text-sm font-medium">
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">This Month</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-dolater-text-secondary">Content Saved</span>
            <span className="text-sm font-medium">3 / 15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dolater-text-secondary">Actions Taken</span>
            <span className="text-sm font-medium">8</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-dolater-text-secondary">Reminders Set</span>
            <span className="text-sm font-medium">5</span>
          </div>
        </div>
      </div>

      {/* Pro Features */}
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
          <button className="flex-1 bg-dolater-text-primary text-white py-3 rounded-lg font-medium">
            ₹49/month
          </button>
          <button className="flex-1 bg-white text-dolater-text-primary py-3 rounded-lg font-medium">
            7-day Free Trial
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Settings</h3>
        <div className="space-y-3">
          {[
            'Notification Preferences',
            'Privacy Settings', 
            'Export Data',
            'Help & Support',
            'Terms of Service',
            'Privacy Policy'
          ].map((item, index) => (
            <button
              key={index}
              className="w-full text-left py-2 text-sm text-dolater-text-secondary hover:text-dolater-mint transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button className="w-full bg-category-urgent text-white py-3 rounded-lg font-medium">
        Sign Out
      </button>
    </div>
  );
};

export default ProfileScreen;
