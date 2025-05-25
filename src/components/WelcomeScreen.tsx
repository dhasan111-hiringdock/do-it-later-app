
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const WelcomeScreen = ({ onGetStarted, onLogin }: WelcomeScreenProps) => {
  const features = [
    {
      icon: '📱',
      title: 'Save From Any App',
      description: 'Share directly from Instagram, YouTube, Reddit, and more'
    },
    {
      icon: '🤖',
      title: 'AI-Powered Organization',
      description: 'Smart categorization and summaries for your saved content'
    },
    {
      icon: '✅',
      title: 'Turn Saves Into Actions',
      description: 'Create checklists, set reminders, and build habits'
    }
  ];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-dolater-mint rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="relative">
              <span className="text-3xl font-bold text-white">D</span>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-dolater-yellow rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-dolater-text-primary mb-2">Welcome to DoLater</h1>
          <p className="text-dolater-text-secondary">Don't Just Save It. Do It.</p>
        </div>

        {/* Features */}
        <div className="space-y-6 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg card-shadow">
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-dolater-text-primary mb-1">{feature.title}</h3>
                <p className="text-sm text-dolater-text-secondary">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Free Plan Benefits */}
        <div className="bg-dolater-mint-light p-4 rounded-lg mb-8">
          <h3 className="font-semibold text-dolater-mint mb-2">Free Plan Includes:</h3>
          <ul className="space-y-1 text-sm text-dolater-text-primary">
            <li>• 15 saves per month</li>
            <li>• 3 custom boards</li>
            <li>• Basic AI summaries</li>
            <li>• Simple reminders</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onGetStarted}
            className="w-full bg-dolater-mint hover:bg-dolater-mint-dark text-white py-3 text-base font-medium"
          >
            Get Started Free
          </Button>
          
          <Button 
            variant="outline"
            onClick={onLogin}
            className="w-full border-dolater-mint text-dolater-mint hover:bg-dolater-mint-light py-3 text-base font-medium"
          >
            I Already Have an Account
          </Button>
        </div>

        {/* Terms */}
        <p className="text-xs text-dolater-text-secondary text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
