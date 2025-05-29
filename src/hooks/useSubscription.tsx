
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SubscriptionContextType {
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  loading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  // Force premium access for testing - override all subscription checks
  const [subscribed, setSubscribed] = useState(true); // Always true for testing
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>('Pro (Testing)');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // No loading needed for testing
  const { user, session } = useAuth();

  const checkSubscription = async () => {
    // For testing, always set as subscribed
    setSubscribed(true);
    setSubscriptionTier('Pro (Testing)');
    setLoading(false);
  };

  const createCheckout = async () => {
    // Disabled for testing - no Stripe integration
    console.log('Checkout disabled - testing mode active');
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{
      subscribed,
      subscriptionTier,
      subscriptionEnd,
      loading,
      checkSubscription,
      createCheckout,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
