import React from 'react';
import { Order } from '../types';
import { CheckCircle2, Clock, ChefHat, UtensilsCrossed, Bell, History } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenOrderHistory: () => void;
  onOpenCallWaiter: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onOpenOrderHistory,
  onOpenCallWaiter,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all text-center">
        {/* Animated Success Banner */}
        <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 text-white p-6 relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner ring-4 ring-white/30 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-black">訂單已送出，請耐心等候</h2>
          <p className="text-xs text-emerald-100 mt-1">
            廚房已接收您的點餐需求，將為您現點現做！
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-left">
          {/* Order Details Badge */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-gray-500">訂單編號：</span>
              <span className="font-mono font-bold text-emerald-900">{order.orderId}</span>
            </div>
            <div>
              <span className="text-gray-500">桌號：</span>
              <span className="font-bold bg-emerald-700 text-white px-2 py-0.5 rounded">
                {order.tableNumber}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
              餐點製作進度
            </h4>
            <div className="flex items-center justify-between px-2 relative">
              {/* Line background */}
              <div className="absolute left-6 right-6 top-4 h-0.5 bg-gray-200 -z-0" />
              <div className="absolute left-6 w-1/3 top-4 h-0.5 bg-emerald-500 -z-0" />

              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 mt-1">已下單</span>
              </div>

              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs animate-pulse">
                  <ChefHat className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 mt-1">備餐中</span>
              </div>

              <div className="flex flex-col items-center z-10">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-400 mt-1">出餐中</span>
              </div>
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 max-h-40 overflow-y-auto space-y-1.5 text-xs">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="flex justify-between items-center text-gray-700">
                <span className="font-semibold truncate">
                  {item.menuItem.name} x{item.quantity}
                </span>
                <span className="font-bold text-gray-900 ml-2">NT$ {item.itemTotal}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-amber-800 text-sm">
              <span>總金額 ({order.paymentMethod})</span>
              <span>NT$ {order.totalAmount}</span>
            </div>
          </div>

          {/* GAS Status Note */}
          {order.gasSubmitted && (
            <p className="text-[11px] text-center text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 font-medium">
              ✓ 訂單已傳送至後端 Google Sheet
            </p>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenCallWaiter();
              }}
              className="p-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Bell className="w-4 h-4 text-amber-600" />
              <span>呼叫服務人員</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenOrderHistory();
              }}
              className="p-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <History className="w-4 h-4 text-gray-500" />
              <span>查看歷史紀錄</span>
            </button>
          </div>
        </div>

        {/* Footer Close */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-md"
          >
            繼續瀏覽菜單
          </button>
        </div>
      </div>
    </div>
  );
};
