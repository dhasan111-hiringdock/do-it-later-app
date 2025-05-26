
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthScreenProps {
  isLogin: boolean;
  onAuth: () => void;
  onBack: () => void;
  onToggleMode: () => void;
}

const AuthScreen = ({ isLogin, onAuth, onBack, onToggleMode }: AuthScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error signing in",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          onAuth();
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: "Error creating account",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          onAuth();
        }
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={onBack}
            className="mr-4 text-dolater-text-secondary hover:text-dolater-text-primary"
          >
            ←
          </button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-dolater-text-primary">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-dolater-text-secondary">
              {isLogin ? 'Sign in to continue' : 'Join DoLater today'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="mt-2"
            />
          </div>

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-dolater-mint hover:bg-dolater-mint-dark text-white py-3"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-6">
          <p className="text-dolater-text-secondary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={onToggleMode}
              className="text-dolater-mint font-medium hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Pro Benefits for Sign Up */}
        {!isLogin && (
          <div className="mt-8 bg-gradient-to-r from-dolater-yellow to-yellow-400 p-4 rounded-lg">
            <h3 className="font-bold text-dolater-text-primary mb-2">Upgrade to Pro Later</h3>
            <ul className="text-sm text-dolater-text-primary space-y-1">
              <li>• Unlimited saves & boards</li>
              <li>• Full AI Assistant</li>
              <li>• Export as PDF</li>
              <li>• Only ₹49/month</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
