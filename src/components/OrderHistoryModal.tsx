import React from 'react';
import { Order } from '../types';
import { X, History, MapPin, Receipt, CheckCircle2 } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const totalSessionSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base">本日點餐歷史紀錄</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="font-bold text-gray-600">尚無已送出之訂單</p>
              <p className="text-xs text-gray-400 mt-1">選購餐點並送出後將於此記錄明細。</p>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-600">累計訂單數：</span>
                  <span className="font-bold text-amber-900">{orders.length} 筆</span>
                </div>
                <div>
                  <span className="text-gray-600">累計消費：</span>
                  <span className="font-black text-amber-700 text-sm">NT$ {totalSessionSpent}</span>
                </div>
              </div>

              {/* Order Cards */}
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-gray-900">
                          {ord.orderId}
                        </span>
                        <span className="text-[10px] text-gray-400 block">{ord.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          <MapPin className="w-3 h-3 inline mr-0.5" />
                          {ord.tableNumber}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          已接單
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1 text-xs text-gray-700">
                      {ord.items.map((item) => (
                        <div key={item.cartItemId} className="flex justify-between items-center">
                          <span className="font-medium">
                            {item.menuItem.name} x{item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900">NT$ {item.itemTotal}</span>
                        </div>
                      ))}
                    </div>

                    {/* Note & Payment */}
                    <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium">付款方式: {ord.paymentMethod}</span>
                      <span className="font-black text-amber-700 text-sm">NT$ {ord.totalAmount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs transition-all shadow-sm"
          >
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  );
};
