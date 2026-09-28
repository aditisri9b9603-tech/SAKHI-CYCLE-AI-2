import React, { useState } from 'react';
import { DailyLog, Language, CycleSettings } from '../types/cycle';
import { translations } from '../i18n/translations';
import { ShieldCheck, Download, Trash2, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface PrivacyAndDataModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  settings: CycleSettings;
  logs: Record<string, DailyLog>;
  onClearAllData: () => void;
}

export const PrivacyAndDataModal: React.FC<PrivacyAndDataModalProps> = ({
  language,
  isOpen,
  onClose,
  settings,
  logs,
  onClearAllData,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleExportData = () => {
    const exportPayload = {
      app: 'Sakhi Cycle',
      exportedAt: new Date().toISOString(),
      settings,
      logs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sakhi_cycle_records_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setMessage(language === 'hi' ? 'डेटा सफलतापूर्वक डाउनलोड हो गया!' : 'Records exported successfully!');
    setTimeout(() => setMessage(null), 2500);
  };

  const handleConfirmClear = () => {
    onClearAllData();
    setConfirmClear(false);
    setMessage(t.privacy.clearedSuccess);
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D1222]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#F8D7DF] shadow-2xl space-y-6 animate-scaleUp">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-4">
          <div className="flex items-center gap-2 text-[#10B981]">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-display text-lg font-bold text-[#2D1222]">
              {t.privacy.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C657B] hover:text-[#2D1222] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-3.5 text-xs text-[#5A384D]">
          <div className="bg-[#FFF8F9] p-3.5 rounded-2xl border border-[#F8D7DF] space-y-1">
            <span className="font-bold text-[#2D1222] block">
              1. {t.privacy.principle1Title}
            </span>
            <p className="leading-relaxed">{t.privacy.principle1Desc}</p>
          </div>

          <div className="bg-[#FFF8F9] p-3.5 rounded-2xl border border-[#F8D7DF] space-y-1">
            <span className="font-bold text-[#2D1222] block">
              2. {t.privacy.principle2Title}
            </span>
            <p className="leading-relaxed">{t.privacy.principle2Desc}</p>
          </div>

          <div className="bg-[#FFF8F9] p-3.5 rounded-2xl border border-[#F8D7DF] space-y-1">
            <span className="font-bold text-[#2D1222] block">
              3. {t.privacy.principle3Title}
            </span>
            <p className="leading-relaxed">{t.privacy.principle3Desc}</p>
          </div>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-2xl text-xs text-[#065F46] flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-[#10B981]" />
            <span>{message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleExportData}
            className="w-full py-3 px-4 rounded-full bg-[#FFF8F9] hover:bg-[#FCE7EC] text-[#2D1222] border border-[#F8D7DF] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#E25574]" />
            <span>{t.privacy.exportBtn}</span>
          </button>

          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="w-full py-3 px-4 rounded-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.privacy.clearBtn}</span>
            </button>
          ) : (
            <div className="bg-[#FFF1F2] border border-[#FECDD3] p-4 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-start gap-2 text-xs text-[#9F1239]">
                <AlertTriangle className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                <p>{t.privacy.confirmClear}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleConfirmClear}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
