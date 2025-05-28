
import { CreditCard, Crown, Check } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const SubscriptionCard = () => {
  const { subscribed, subscriptionTier, subscriptionEnd, loading, createCheckout } = useSubscription();

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 card-shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 card-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {subscribed ? (
            <Crown className="text-dolater-yellow" size={20} />
          ) : (
            <CreditCard className="text-dolater-text-secondary" size={20} />
          )}
          <h3 className="font-semibold text-dolater-text-primary">
            {subscribed ? 'DoLater Pro' : 'DoLater Free'}
          </h3>
        </div>
        {subscribed && (
          <div className="bg-dolater-mint text-white px-2 py-1 rounded-full text-xs">
            <Check size={12} className="inline mr-1" />
            Active
          </div>
        )}
      </div>

      {subscribed ? (
        <div className="space-y-2">
          <p className="text-sm text-dolater-text-secondary">
            Plan: {subscriptionTier}
          </p>
          {subscriptionEnd && (
            <p className="text-sm text-dolater-text-secondary">
              Renews: {new Date(subscriptionEnd).toLocaleDateString()}
            </p>
          )}
          <div className="pt-2">
            <p className="text-xs text-green-600">
              ✓ Unlimited saves & boards
            </p>
            <p className="text-xs text-green-600">
              ✓ Full AI Assistant
            </p>
            <p className="text-xs text-green-600">
              ✓ Premium features
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-dolater-text-secondary">
            Unlock premium features with DoLater Pro
          </p>
          <div className="space-y-1">
            <p className="text-xs text-dolater-text-secondary">
              • Unlimited saves & boards
            </p>
            <p className="text-xs text-dolater-text-secondary">
              • Full AI Assistant
            </p>
            <p className="text-xs text-dolater-text-secondary">
              • Premium features
            </p>
          </div>
          <button
            onClick={createCheckout}
            className="w-full bg-dolater-mint text-white py-2 rounded-lg text-sm font-medium hover:bg-dolater-mint-dark transition-colors"
          >
            Upgrade to Pro - $9.99/month
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
