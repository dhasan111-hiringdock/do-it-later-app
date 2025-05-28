
import { useEffect } from 'react';
import { useContentItems } from '@/hooks/useContentItems';
import { useToast } from '@/hooks/use-toast';

const ShareReceiver = () => {
  const { addContentItem } = useContentItems();
  const { toast } = useToast();

  useEffect(() => {
    // Handle shared content from other apps
    const handleShare = (event: any) => {
      if (event.data && event.data.type === 'share') {
        const { url, title, text } = event.data;
        
        if (url || title || text) {
          addContentItem({
            title: title || 'Shared Content',
            summary: text || '',
            url: url || '#',
            category: 'knowledge',
            categoryLabel: 'Knowledge',
            tags: ['shared'],
            priority: 'medium',
            hasNotes: !!text,
            hasChecklist: false,
            reminderSet: false,
            platform: 'Shared',
            actionType: 'read',
            userNotes: text || '',
          });

          toast({
            title: "Content Shared Successfully!",
            description: "The shared content has been saved to your DoLater app",
          });
        }
      }
    };

    // Listen for shared content
    window.addEventListener('message', handleShare);

    // URL scheme handling for deep links
    const urlParams = new URLSearchParams(window.location.search);
    const sharedUrl = urlParams.get('url');
    const sharedTitle = urlParams.get('title');
    const sharedText = urlParams.get('text');

    if (sharedUrl || sharedTitle || sharedText) {
      addContentItem({
        title: sharedTitle || 'Shared Link',
        summary: sharedText || '',
        url: sharedUrl || '#',
        category: 'knowledge',
        categoryLabel: 'Knowledge',
        tags: ['shared'],
        priority: 'medium',
        hasNotes: !!sharedText,
        hasChecklist: false,
        reminderSet: false,
        platform: 'Shared',
        actionType: 'read',
        userNotes: sharedText || '',
      });

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      window.removeEventListener('message', handleShare);
    };
  }, [addContentItem, toast]);

  return null; // This component doesn't render anything
};

export default ShareReceiver;
