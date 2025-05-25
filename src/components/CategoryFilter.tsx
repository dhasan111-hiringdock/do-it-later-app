
interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const categories = [
    { id: 'all', label: 'All', color: 'bg-gray-500' },
    { id: 'fitness', label: 'Fitness', color: 'bg-category-fitness' },
    { id: 'finance', label: 'Finance', color: 'bg-category-finance' },
    { id: 'knowledge', label: 'Knowledge', color: 'bg-category-knowledge' },
    { id: 'personal', label: 'Personal', color: 'bg-category-personal' },
    { id: 'work', label: 'Work', color: 'bg-category-work' },
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selectedCategory === category.id
              ? `${category.color} text-white`
              : 'bg-white text-dolater-text-secondary border border-gray-200 hover:border-dolater-mint'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
