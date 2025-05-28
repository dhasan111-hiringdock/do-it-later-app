
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from './AuthScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-dolater-mint border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dolater-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen 
        isLogin={authMode === 'login'}
        onAuth={() => {}}
        onBack={() => {}}
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
