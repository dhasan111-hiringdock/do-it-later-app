
import { useBoards } from '../../hooks/useBoards';
import { useContentItems } from '../../hooks/useContentItems';

const BoardsScreen = () => {
  const { boards, loading: boardsLoading } = useBoards();
  const { contentItems } = useContentItems();

  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-dolater-mint border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalItems = contentItems.length;
  const totalBoards = boards.length;
  const itemsWithReminders = contentItems.filter(item => item.reminderSet).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-dolater-text-primary mb-2">My Boards</h1>
        <p className="text-sm text-dolater-text-secondary">
          Organize your saved content by category
        </p>
      </div>

      {/* Overview Stats */}
      <div className="bg-white rounded-lg p-4 card-shadow">
        <h3 className="font-medium text-dolater-text-primary mb-3">Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-dolater-mint">{totalItems}</div>
            <div className="text-xs text-dolater-text-secondary">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-dolater-yellow">{totalBoards}</div>
            <div className="text-xs text-dolater-text-secondary">Active Boards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-category-urgent">{itemsWithReminders}</div>
            <div className="text-xs text-dolater-text-secondary">With Reminders</div>
          </div>
        </div>
      </div>

      {/* Boards Grid */}
      <div className="space-y-3">
        {boards.length > 0 ? (
          boards.map((board) => (
            <div key={board.id} className="bg-white rounded-lg p-4 card-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 ${board.color} rounded`}></div>
                  <div>
                    <h3 className="font-medium text-dolater-text-primary">{board.name}</h3>
                    <p className="text-xs text-dolater-text-secondary">{board.count} items</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-dolater-gray text-dolater-text-secondary px-2 py-1 rounded text-xs">
                    {board.count}
                  </span>
                  <button className="text-dolater-mint hover:text-dolater-mint-dark">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-dolater-text-secondary text-sm">
              No boards created yet. Create your first board!
            </div>
          </div>
        )}
      </div>

      {/* Add New Board */}
      <button className="w-full bg-dolater-mint-light text-dolater-mint border-2 border-dashed border-dolater-mint rounded-lg py-4 px-4 hover:bg-dolater-mint hover:text-white transition-colors">
        <div className="text-center">
          <div className="text-2xl mb-1">+</div>
          <div className="text-sm font-medium">Create New Board</div>
        </div>
      </button>

      {/* Free Plan Limitation */}
      <div className="bg-dolater-yellow rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-dolater-text-primary">Free Plan Limit</h3>
            <p className="text-sm text-dolater-text-primary opacity-90">
              You can create up to 3 boards on the free plan
            </p>
          </div>
          <button className="bg-dolater-text-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardsScreen;
