import React from 'react';
import { MenuItem } from '../types';
import { Plus, Flame, Check } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenOptions: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  cartQuantity: number;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onOpenOptions,
  onQuickAdd,
  cartQuantity,
}) => {
  const hasOptions = item.customizationGroups && item.customizationGroups.length > 0;

  const handleClick = () => {
    if (hasOptions) {
      onOpenOptions(item);
    } else {
      onQuickAdd(item);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Image Section */}
      <div className="relative h-44 w-full bg-amber-100/40 overflow-hidden cursor-pointer" onClick={handleClick}>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {item.tags.map((tag, idx) => {
              const isHot = tag.includes('熱銷') || tag.includes('招牌') || tag.includes('必點');
              return (
                <span
                  key={idx}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 ${
                    isHot
                      ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white'
                      : 'bg-amber-900/80 text-amber-100 backdrop-blur-sm'
                  }`}
                >
                  {isHot && <Flame className="w-3 h-3 text-amber-300 inline" />}
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Quantity Badge in Cart */}
        {cartQuantity > 0 && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 ring-2 ring-white">
            <Check className="w-3.5 h-3.5" />
            <span>已點 {cartQuantity}</span>
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-amber-700 transition-colors">
              {item.name}
            </h3>
          </div>
          <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-50">
          <div>
            <span className="text-xs text-amber-800 font-semibold">NT$</span>
            <span className="text-xl font-black text-amber-700 ml-0.5">{item.price}</span>
          </div>

          <button
            id={`add-btn-${item.id}`}
            onClick={handleClick}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs ${
              hasOptions
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/60'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{hasOptions ? '選擇規格' : '加入購物車'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
