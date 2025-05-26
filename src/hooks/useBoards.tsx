
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Board {
  id: string;
  name: string;
  description?: string;
  color: string;
  count: number;
  created_at: string;
}

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBoards = async () => {
    if (!user) {
      setBoards([]);
      setLoading(false);
      return;
    }

    try {
      // Fetch boards with item counts
      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select(`
          *,
          board_items(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (boardsError) {
        console.error('Error fetching boards:', boardsError);
        toast({
          title: "Error",
          description: "Failed to load boards",
          variant: "destructive",
        });
        return;
      }

      const formattedBoards: Board[] = boardsData.map(board => ({
        id: board.id,
        name: board.name,
        description: board.description,
        color: board.color,
        count: board.board_items?.length || 0,
        created_at: board.created_at,
      }));

      setBoards(formattedBoards);
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast({
        title: "Error",
        description: "Failed to load boards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (name: string, description?: string, color?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('boards')
        .insert({
          user_id: user.id,
          name,
          description,
          color: color || 'bg-category-knowledge',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating board:', error);
        toast({
          title: "Error",
          description: "Failed to create board",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Board created successfully!",
      });

      fetchBoards(); // Refresh the list
    } catch (error) {
      console.error('Error creating board:', error);
      toast({
        title: "Error",
        description: "Failed to create board",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [user]);

  return {
    boards,
    loading,
    createBoard,
    refetch: fetchBoards,
  };
};
