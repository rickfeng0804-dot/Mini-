import React from 'react';
import { CATEGORIES } from '../data/menuData';
import { Utensils, Flame, ChefHat, Popcorn, Leaf, Soup } from 'lucide-react';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  ChefHat: <ChefHat className="w-4 h-4" />,
  Popcorn: <Popcorn className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
  Soup: <Soup className="w-4 h-4" />,
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="sticky top-[100px] z-20 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/60 py-2 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white text-gray-700 hover:bg-amber-100/70 border border-amber-200/50 shadow-xs'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-amber-600'}>
                {ICON_MAP[cat.icon]}
              </span>
              <span>{cat.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-amber-700/60 text-amber-100' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
