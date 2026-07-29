import React from 'react';
import { QrCode, BellRing, Settings, History, MapPin, Search } from 'lucide-react';

interface HeaderProps {
  tableNumber: string;
  tableSource: 'url' | 'manual' | 'default';
  onOpenTableSelector: () => void;
  onOpenCallWaiter: () => void;
  onOpenGasSettings: () => void;
  onOpenOrderHistory: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  orderCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  tableNumber,
  tableSource,
  onOpenTableSelector,
  onOpenCallWaiter,
  onOpenGasSettings,
  onOpenOrderHistory,
  searchQuery,
  setSearchQuery,
  orderCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-amber-500/95 backdrop-blur-md text-white shadow-md transition-all">
      {/* Top Main Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Brand & Table Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
            <span className="text-xl">🍱</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-wide flex items-center gap-1.5">
              饗味食堂
              <span className="text-xs bg-amber-700/60 px-2 py-0.5 rounded-full font-normal">掃碼點餐</span>
            </h1>
            
            {/* Table Number Pill */}
            <button
              id="table-number-badge"
              onClick={onOpenTableSelector}
              className={`mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all active:scale-95 ${
                tableSource === 'url'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300/40'
                  : tableSource === 'manual'
                  ? 'bg-amber-700 text-white'
                  : 'bg-rose-600 text-white animate-pulse'
              }`}
            >
              <MapPin className="w-3 h-3 inline" />
              <span>目前桌號：{tableNumber}</span>
              <span className="text-[10px] underline opacity-90 ml-0.5">(切換)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Header Group */}
        <div className="flex items-center gap-1.5">
          {/* Call Waiter */}
          <button
            id="call-waiter-btn"
            onClick={onOpenCallWaiter}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white flex flex-col items-center justify-center transition-all relative"
            title="呼叫服務員"
          >
            <BellRing className="w-5 h-5 text-amber-100" />
            <span className="text-[10px] font-medium mt-0.5 leading-none">呼叫服務</span>
          </button>

          {/* Table QR Switcher */}
          <button
            id="qr-switcher-btn"
            onClick={onOpenTableSelector}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white flex flex-col items-center justify-center transition-all"
            title="桌號與 QR Code 模擬"
          >
            <QrCode className="w-5 h-5 text-amber-100" />
            <span className="text-[10px] font-medium mt-0.5 leading-none">桌號QR</span>
          </button>

          {/* Order History */}
          <button
            id="order-history-btn"
            onClick={onOpenOrderHistory}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white flex flex-col items-center justify-center transition-all relative"
            title="點餐紀錄"
          >
            <History className="w-5 h-5 text-amber-100" />
            <span className="text-[10px] font-medium mt-0.5 leading-none">歷史訂單</span>
            {orderCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-amber-500">
                {orderCount}
              </span>
            )}
          </button>

          {/* GAS Sync Settings */}
          <button
            id="gas-settings-btn"
            onClick={onOpenGasSettings}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:scale-95 text-white flex flex-col items-center justify-center transition-all"
            title="Google Sheet 同步設定"
          >
            <Settings className="w-5 h-5 text-amber-100" />
            <span className="text-[10px] font-medium mt-0.5 leading-none">GAS設定</span>
          </button>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="max-w-4xl mx-auto px-4 pb-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-700/60" />
          <input
            id="menu-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋餐點名稱或關鍵字 (例如：牛肉麵、薯條、珍珠奶茶)..."
            className="w-full bg-white text-gray-800 placeholder-gray-400 text-sm pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
