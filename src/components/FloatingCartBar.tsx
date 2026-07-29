import React from 'react';
import { CartItem } from '../types';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface FloatingCartBarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  cartItems,
  onOpenCart,
}) => {
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);

  if (totalCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-30 max-w-lg mx-auto animate-slideUp">
      <button
        id="floating-cart-bar"
        onClick={onOpenCart}
        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between transition-all active:scale-98 ring-4 ring-amber-200/50"
      >
        <div className="flex items-center gap-3">
          <div className="relative bg-white/20 p-2 rounded-xl backdrop-blur-xs">
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-600 shadow-sm">
              {totalCount}
            </span>
          </div>

          <div className="text-left">
            <span className="text-[11px] text-amber-100 font-medium block leading-none">
              已選 {totalCount} 項餐點
            </span>
            <span className="text-lg font-black text-white leading-tight">
              NT$ {totalAmount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white text-amber-900 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs">
          <span>查看購物車</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
