import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, MapPin, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  tableNumber: string;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  orderNote: string;
  setOrderNote: (note: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderNote,
  setOrderNote,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-amber-600 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <div>
                <h2 className="font-bold text-lg leading-none">我的點餐購物車</h2>
                <div className="flex items-center gap-1.5 text-xs text-amber-100 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 inline text-amber-200" />
                  <span>桌號：</span>
                  <span className="font-bold bg-amber-700/80 px-2 py-0.5 rounded text-white">
                    {tableNumber || '未指定'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 active:scale-95 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-4 text-4xl shadow-inner">
                🍽️
              </div>
              <p className="text-base font-bold text-gray-700">購物車目前是空的</p>
              <p className="text-xs text-gray-400 mt-1">請點選菜單中的餐點加入購物車</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all shadow-xs"
              >
                前往瀏覽菜單
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
              {/* Header clear */}
              <div className="flex items-center justify-between text-xs text-gray-500 pb-2">
                <span>共 {totalCount} 項餐點</span>
                <button
                  onClick={onClearCart}
                  className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>清空購物車</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-3">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem.cartItemId}
                    className="p-3 bg-amber-50/50 rounded-2xl border border-amber-100 flex gap-3 relative group"
                  >
                    {/* Image */}
                    <img
                      src={cartItem.menuItem.image}
                      alt={cartItem.menuItem.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-gray-800 text-sm truncate">
                          {cartItem.menuItem.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(cartItem.cartItemId)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="刪除"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Selected Options */}
                      {cartItem.selectedOptions.length > 0 && (
                        <p className="text-[11px] text-amber-800 mt-0.5 leading-tight">
                          {cartItem.selectedOptions.map((o) => `${o.groupName}: ${o.optionName}`).join(' | ')}
                        </p>
                      )}

                      {/* Special Instruction */}
                      {cartItem.specialInstruction && (
                        <p className="text-[10px] text-gray-500 bg-white/80 border border-gray-200 px-1.5 py-0.5 rounded mt-1 inline-block">
                          註：{cartItem.specialInstruction}
                        </p>
                      )}

                      {/* Price & Quantity stepper */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-extrabold text-amber-700 text-sm">
                          NT$ {cartItem.itemTotal}
                        </span>

                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1)}
                            className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                            className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-amber-800 hover:bg-amber-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Notes Section */}
              <div className="pt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                  <span>整單備註說明</span>
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="例如：餐點請隨時出、需要兒童座椅、醬料另外放..."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              {tableNumber === '未指定桌號' && (
                <div className="bg-amber-100 border border-amber-300 text-amber-900 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>提醒：您尚未設定桌號，將於確認時設定或切換！</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">總計金額：</span>
                <span className="text-2xl font-black text-amber-700">NT$ {totalAmount}</span>
              </div>

              <button
                id="checkout-confirm-btn"
                onClick={onCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all text-base"
              >
                <span>送出訂單確認</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
