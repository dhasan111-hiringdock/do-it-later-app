
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ContentItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  category: string;
  categoryLabel: string;
  tags: string[];
  dateAdded: string;
  priority: 'low' | 'medium' | 'high';
  hasNotes: boolean;
  hasChecklist: boolean;
  reminderSet: boolean;
  platform?: string;
  actionType?: string;
  userNotes?: string;
  transcript?: string;
  isCompleted?: boolean;
}

export const useContentItems = () => {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const categoryMap: Record<string, string> = {
    'fitness': 'Fitness',
    'finance': 'Finance',
    'knowledge': 'Knowledge',
    'personal': 'Personal',
    'work': 'Work',
  };

  const fetchContentItems = async () => {
    if (!user) {
      setContentItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching content items:', error);
        toast({
          title: "Error",
          description: "Failed to load content items",
          variant: "destructive",
        });
        return;
      }

      const formattedItems: ContentItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summary || '',
        url: item.url,
        category: item.category,
        categoryLabel: categoryMap[item.category] || 'Knowledge',
        tags: item.tags || [],
        dateAdded: item.created_at,
        priority: item.priority as 'low' | 'medium' | 'high',
        hasNotes: item.has_notes || false,
        hasChecklist: item.has_checklist || false,
        reminderSet: item.reminder_set || false,
        platform: item.platform,
        actionType: item.action_type,
        userNotes: item.user_notes,
        transcript: item.transcript,
        isCompleted: item.is_completed || false,
      }));

      setContentItems(formattedItems);
    } catch (error) {
      console.error('Error fetching content items:', error);
      toast({
        title: "Error",
        description: "Failed to load content items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContentItem = async (item: Omit<ContentItem, 'id' | 'dateAdded'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('content_items')
        .insert({
          user_id: user.id,
          title: item.title,
          summary: item.summary,
          url: item.url,
          category: item.category,
          tags: item.tags,
          priority: item.priority,
          platform: item.platform,
          action_type: item.actionType,
          user_notes: item.userNotes,
          transcript: item.transcript,
          has_notes: item.hasNotes,
          has_checklist: item.hasChecklist,
          reminder_set: item.reminderSet,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding content item:', error);
        toast({
          title: "Error",
          description: "Failed to save content item",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Content saved successfully!",
      });

      fetchContentItems(); // Refresh the list
    } catch (error) {
      console.error('Error adding content item:', error);
      toast({
        title: "Error",
        description: "Failed to save content item",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchContentItems();
  }, [user]);

  return {
    contentItems,
    loading,
    addContentItem,
    refetch: fetchContentItems,
  };
};
