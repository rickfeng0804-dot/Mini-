import React, { useState } from 'react';
import { SAMPLE_GAS_CODE } from '../utils/gasHelper';
import { X, Code, Copy, Check, Link, Save, ExternalLink } from 'lucide-react';

interface GasGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  gasUrl: string;
  onSaveGasUrl: (newUrl: string) => void;
}

export const GasGuideModal: React.FC<GasGuideModalProps> = ({
  isOpen,
  onClose,
  gasUrl,
  onSaveGasUrl,
}) => {
  if (!isOpen) return null;

  const [inputUrl, setInputUrl] = useState(gasUrl);
  const [copied, setCopied] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    onSaveGasUrl(inputUrl.trim());
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(SAMPLE_GAS_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Google Sheet (GAS) 訂單同步設定</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* API URL Config Box */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
            <label className="block font-bold text-amber-900 flex items-center gap-1.5 text-xs">
              <Link className="w-4 h-4 text-amber-600" />
              <span>Google Apps Script 網路應用程式 URL (API_URL)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 text-xs p-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                onClick={handleSave}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1 shadow-xs transition-all"
              >
                <Save className="w-4 h-4" />
                <span>儲存</span>
              </button>
            </div>
            {saveToast && (
              <p className="text-[11px] font-bold text-emerald-700 animate-fadeIn">
                ✓ 已成功儲存 API_URL！
              </p>
            )}
            <p className="text-[11px] text-amber-800/80 leading-relaxed">
              * 若留空，點餐時將會自動使用展示「模擬同步模式」，不影響本機操作體驗與紀錄。
            </p>
          </div>

          {/* Quick Setup Instructions */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-800 text-sm">💡 4 步驟快速設定您自己的 Google 試算表：</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-gray-600 leading-relaxed pl-1">
              <li>
                建立一份新的 <strong>Google Sheet (試算表)</strong>。
              </li>
              <li>
                點選選單「<strong>擴充功能</strong>」 ➔ 「<strong>Apps Script</strong>」。
              </li>
              <li>
                貼上下方的腳本程式碼，點選「<strong>部署</strong>」 ➔ 「<strong>新增部署</strong>」 ➔ 選擇「<strong>網路應用程式</strong>」。
              </li>
              <li>
                將「<strong>誰有存取權限</strong>」設為：「<strong>所有人 (Anyone)</strong>」，並複製產生的 Web App URL 貼至上方欄位即可！
              </li>
            </ol>
          </div>

          {/* Code Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800">Google Apps Script 程式碼範本：</h4>
              <button
                onClick={handleCopyCode}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1 rounded-lg flex items-center gap-1 border border-slate-300 transition-all text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '已複製程式碼' : '一鍵複製程式碼'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-48 border border-slate-800 shadow-inner">
              {SAMPLE_GAS_CODE}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all shadow-md"
          >
            完成並返回
          </button>
        </div>
      </div>
    </div>
  );
};
