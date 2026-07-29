import React, { useState } from 'react';
import { X, MapPin, Check, QrCode, Copy, ExternalLink } from 'lucide-react';

interface TableSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTable: string;
  tableSource: 'url' | 'manual' | 'default';
  onSelectTable: (tableNumber: string) => void;
}

const PRESET_TABLES = [
  'A01', 'A02', 'A03', 'A04', 'A05',
  'B01', 'B02', 'B03', 'B04', 'B05',
  'C01', 'C02', 'VIP-1', 'VIP-2', '外帶'
];

export const TableSelectorModal: React.FC<TableSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTable,
  tableSource,
  onSelectTable,
}) => {
  if (!isOpen) return null;

  const [inputTable, setInputTable] = useState(currentTable === '未指定桌號' ? '' : currentTable);
  const [copied, setCopied] = useState(false);

  const handleApply = (table: string) => {
    if (!table.trim()) return;
    onSelectTable(table.trim().toUpperCase());
    onClose();
  };

  const getSimulatedUrl = (table: string) => {
    const origin = window.location.origin + window.location.pathname;
    return `${origin}?table=${encodeURIComponent(table || 'A01')}`;
  };

  const handleCopyUrl = (table: string) => {
    const url = getSimulatedUrl(table);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-amber-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base">桌號設定與 QR Code 模擬</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Status info */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span>目前使用的桌號：</span>
              <span className="text-sm bg-amber-600 text-white px-2.5 py-0.5 rounded-md">
                {currentTable}
              </span>
            </div>
            <p className="text-[11px] text-amber-700">
              來源：
              {tableSource === 'url' ? '網址帶入 (URL Param ?table=)' : tableSource === 'manual' ? '手動輸入設定' : '預設狀態'}
            </p>
          </div>

          {/* Quick Select Grid */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              快速選擇桌號：
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_TABLES.map((table) => {
                const isSelected = currentTable === table;
                return (
                  <button
                    key={table}
                    onClick={() => handleApply(table)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-100 hover:border-amber-300'
                    }`}
                  >
                    {table}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              手動自訂桌號名稱：
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputTable}
                onChange={(e) => setInputTable(e.target.value)}
                placeholder="例如：T-09, 二樓戶外-01"
                className="flex-1 text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
              />
              <button
                onClick={() => handleApply(inputTable)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
              >
                套用
              </button>
            </div>
          </div>

          {/* QR Code URL Simulator Helper */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-600" />
              <span>測試顧客掃碼體驗 (?table= 網址參數)</span>
            </h4>
            <p className="text-[11px] text-gray-500">
              掃描餐桌 QR Code 時網址會帶有參數，點擊下方模擬按鈕可直接切換網址測試：
            </p>

            <div className="bg-gray-100 p-2.5 rounded-xl border border-gray-200 flex items-center justify-between text-[11px] font-mono text-gray-700 overflow-x-auto">
              <span className="truncate mr-2">{getSimulatedUrl(inputTable || currentTable)}</span>
              <button
                onClick={() => handleCopyUrl(inputTable || currentTable)}
                className="text-amber-700 hover:text-amber-900 font-sans text-xs font-bold flex items-center gap-1 shrink-0 bg-white px-2 py-1 rounded border border-gray-300 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已複製' : '複製網址'}</span>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <a
                href={`?table=A01`}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-center py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>模擬掃碼 A01</span>
              </a>
              <a
                href={`?table=B03`}
                className="flex-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-center py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>模擬掃碼 B03</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition-all"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
