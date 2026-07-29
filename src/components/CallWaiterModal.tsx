import React, { useState } from 'react';
import { X, Bell, GlassWater, Sparkles, Receipt, HelpCircle, CheckCircle2 } from 'lucide-react';

interface CallWaiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableNumber: string;
}

const SERVICE_OPTIONS = [
  { id: 'water', label: '送上冰/溫水', icon: GlassWater },
  { id: 'napkin', label: '需要餐巾紙/濕紙巾', icon: Sparkles },
  { id: 'soup', label: '加高湯/醬料', icon: Sparkles },
  { id: 'clean', label: '清理桌面/空盤', icon: Sparkles },
  { id: 'bill', label: '專人桌邊結帳', icon: Receipt },
  { id: 'other', label: '其他服務諮詢', icon: HelpCircle },
];

export const CallWaiterModal: React.FC<CallWaiterModalProps> = ({
  isOpen,
  onClose,
  tableNumber,
}) => {
  if (!isOpen) return null;

  const [selectedService, setSelectedService] = useState('water');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-amber-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base">呼叫服務人員</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-center font-semibold text-amber-900">
            目前桌號：<span className="font-bold text-amber-700 text-sm">{tableNumber}</span>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="font-bold text-gray-800 text-base">已發送服務請求！</h4>
              <p className="text-xs text-gray-500">服務人員將儘速為桌號 {tableNumber} 服務。</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-600 font-medium">請選擇您需要的服務項目：</p>

              <div className="grid grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedService === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedService(opt.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-amber-100'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full mt-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
              >
                立即呼叫服務
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
