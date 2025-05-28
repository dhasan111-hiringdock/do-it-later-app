
import { useState } from 'react';
import { Plus, Grid3X3, List, Search, MoreVertical } from 'lucide-react';
import { useBoards } from '@/hooks/useBoards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const BoardsScreen = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-category-knowledge');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { boards, loading, createBoard } = useBoards();
  const { toast } = useToast();

  const boardColors = [
    { value: 'bg-category-knowledge', label: 'Purple' },
    { value: 'bg-category-fitness', label: 'Green' },
    { value: 'bg-category-finance', label: 'Blue' },
    { value: 'bg-category-work', label: 'Gray' },
    { value: 'bg-category-personal', label: 'Orange' },
    { value: 'bg-dolater-mint', label: 'Mint' },
    { value: 'bg-dolater-yellow', label: 'Yellow' },
    { value: 'bg-red-500', label: 'Red' },
  ];

  const handleCreateBoard = async () => {
    if (!boardName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a board name",
        variant: "destructive",
      });
      return;
    }

    await createBoard(boardName.trim(), boardDescription.trim(), selectedColor);
    
    // Reset form
    setBoardName('');
    setBoardDescription('');
    setSelectedColor('bg-category-knowledge');
    setShowCreateForm(false);
  };

  const filteredBoards = boards.filter(board =>
    board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    board.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-dolater-mint border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-dolater-text-primary">Boards</h1>
            <p className="text-xs text-dolater-text-secondary">Organize your content</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {viewMode === 'grid' ? <List size={16} /> : <Grid3X3 size={16} />}
            </button>
            <Button
              onClick={() => setShowCreateForm(true)}
              size="sm"
              className="bg-dolater-mint hover:bg-dolater-mint-dark"
            >
              <Plus size={16} className="mr-1" />
              New Board
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dolater-text-secondary" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search boards..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Create Board Form */}
      {showCreateForm && (
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-dolater-text-primary">Create New Board</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-dolater-text-secondary hover:text-dolater-text-primary"
            >
              ×
            </button>
          </div>

          <Input
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="Board name"
          />

          <Input
            value={boardDescription}
            onChange={(e) => setBoardDescription(e.target.value)}
            placeholder="Description (optional)"
          />

          <div>
            <div className="text-sm font-medium text-dolater-text-primary mb-2">Color</div>
            <div className="flex flex-wrap gap-2">
              {boardColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full ${color.value} ${
                    selectedColor === color.value ? 'ring-2 ring-offset-2 ring-dolater-mint' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleCreateBoard}
              className="flex-1 bg-dolater-mint hover:bg-dolater-mint-dark"
            >
              Create Board
            </Button>
            <Button
              onClick={() => setShowCreateForm(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Boards Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredBoards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dolater-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 size={24} className="text-dolater-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-dolater-text-primary mb-2">
              {boards.length === 0 ? 'No boards yet' : 'No boards found'}
            </h3>
            <p className="text-dolater-text-secondary mb-4">
              {boards.length === 0 
                ? 'Create your first board to organize your content'
                : 'Try adjusting your search terms'
              }
            </p>
            {boards.length === 0 && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-dolater-mint hover:bg-dolater-mint-dark"
              >
                <Plus size={16} className="mr-1" />
                Create First Board
              </Button>
            )}
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-2 gap-4' 
              : 'space-y-3'
          }`}>
            {filteredBoards.map((board) => (
              <div
                key={board.id}
                className={`${board.color} rounded-lg p-4 text-white cursor-pointer hover:opacity-90 transition-opacity ${
                  viewMode === 'list' ? 'flex items-center justify-between' : ''
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{board.name}</h3>
                  {board.description && (
                    <p className="text-sm text-white/80 mb-2">{board.description}</p>
                  )}
                  <div className="text-xs text-white/70">
                    {board.count} items
                  </div>
                </div>
                {viewMode === 'list' && (
                  <button className="p-1 hover:bg-white/20 rounded">
                    <MoreVertical size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-dolater-text-primary">{boards.length}</div>
          <div className="text-xs text-dolater-text-secondary">Total Boards</div>
        </div>
      </div>
    </div>
  );
};

export default BoardsScreen;
