
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import SplashScreen from "./components/SplashScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import AuthScreen from "./components/AuthScreen";
import AppConnectScreen from "./components/AppConnectScreen";
import MobileApp from "./components/MobileApp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type AppState = 'splash' | 'welcome' | 'login' | 'signup' | 'connect' | 'app';

const AppContent = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const { user, loading } = useAuth();

  const handleSplashComplete = () => {
    setAppState('welcome');
  };

  const handleGetStarted = () => {
    setAppState('signup');
  };

  const handleLogin = () => {
    setAppState('login');
  };

  const handleAuth = () => {
    setAppState('app');
  };

  const handleBackToWelcome = () => {
    setAppState('welcome');
  };

  const handleToggleAuthMode = () => {
    setAppState(appState === 'login' ? 'signup' : 'login');
  };

  const handleConnectComplete = () => {
    setAppState('app');
  };

  const handleConnectSkip = () => {
    setAppState('app');
  };

  // Show loading while auth is initializing
  if (loading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  // If user is authenticated, go directly to app
  if (user && appState !== 'app') {
    setAppState('app');
  }

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      
      case 'welcome':
        return (
          <WelcomeScreen 
            onGetStarted={handleGetStarted} 
            onLogin={handleLogin} 
          />
        );
      
      case 'login':
      case 'signup':
        return (
          <AuthScreen 
            isLogin={appState === 'login'}
            onAuth={handleAuth}
            onBack={handleBackToWelcome}
            onToggleMode={handleToggleAuthMode}
          />
        );
      
      case 'connect':
        return (
          <AppConnectScreen 
            onComplete={handleConnectComplete}
            onSkip={handleConnectSkip}
          />
        );
      
      case 'app':
        return <MobileApp />;
      
      default:
        return <WelcomeScreen onGetStarted={handleGetStarted} onLogin={handleLogin} />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={renderCurrentScreen()} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
