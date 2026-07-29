import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, CheckCircle2, CreditCard, DollarSign, Smartphone, Loader2, MapPin } from 'lucide-react';

interface OrderConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  tableNumber: string;
  orderNote: string;
  onConfirmOrder: (paymentMethod: string) => Promise<void>;
  isSubmitting: boolean;
}

export const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  tableNumber,
  orderNote,
  onConfirmOrder,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('現場結帳');

  const totalAmount = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);

  const handleConfirm = async () => {
    await onConfirmOrder(paymentMethod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-amber-200" />
            <h3 className="font-bold text-lg">確認送出訂單</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Table Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-semibold">用餐桌號</span>
            </div>
            <span className="text-base font-black bg-amber-600 text-white px-3 py-0.5 rounded-lg shadow-xs">
              {tableNumber}
            </span>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              點餐明細 ({cartItems.reduce((a, b) => a + b.quantity, 0)} 品項)
            </h4>
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-2 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-start text-xs text-gray-800">
                  <div>
                    <span className="font-bold">{item.menuItem.name}</span>
                    <span className="text-gray-500 ml-1">x{item.quantity}</span>
                    {item.selectedOptions.length > 0 && (
                      <p className="text-[10px] text-gray-500">
                        {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">NT$ {item.itemTotal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          {orderNote && (
            <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-100 text-xs">
              <span className="font-bold text-amber-900">整單備註：</span>
              <span className="text-amber-800 ml-1">{orderNote}</span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              選擇結帳付款方式
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: '現場結帳', label: '櫃檯/桌邊結帳', icon: DollarSign },
                { id: 'LINE Pay', label: 'LINE Pay (掃碼)', icon: Smartphone },
                { id: '街口支付', label: '街口支付', icon: CreditCard },
                { id: '現金付款', label: '現場現金', icon: DollarSign },
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/30 font-bold'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-gray-400'}`} />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Total Amount */}
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="font-bold text-gray-700 text-sm">應付總金額</span>
            <span className="text-2xl font-black text-amber-600">NT$ {totalAmount}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-1/3 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-all"
          >
            返回修改
          </button>
          <button
            id="final-send-order-btn"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>發送至 GAS 中...</span>
              </>
            ) : (
              <>
                <span>確定送出 (發送 GAS)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
