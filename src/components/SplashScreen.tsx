
import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dolater-mint to-dolater-mint-dark flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="relative">
            <span className="text-4xl font-bold text-dolater-mint">D</span>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-dolater-yellow rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-3xl font-bold text-white mb-2">DoLater</h1>
        
        {/* Tagline */}
        <p className="text-white/90 text-lg font-medium">Don't Just Save It. Do It.</p>
        
        {/* Loading dots */}
        <div className="flex space-x-1 justify-center mt-8">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
