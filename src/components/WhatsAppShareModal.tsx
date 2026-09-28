import React, { useState } from 'react';
import { Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import { MessageCircle, X, ShieldCheck, ExternalLink, Info } from 'lucide-react';

interface WhatsAppShareModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  defaultText: string;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  language,
  isOpen,
  onClose,
  defaultText,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [customText, setCustomText] = useState(defaultText);

  const handleLaunchWhatsApp = () => {
    const encoded = encodeURIComponent(customText);
    const waUrl = `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D1222]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#F8D7DF] shadow-2xl space-y-5 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
          <div className="flex items-center gap-2 text-[#25D366]">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-display text-lg font-bold text-[#2D1222]">
              {t.whatsapp.modalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8C657B] hover:text-[#2D1222] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Consent & Privacy Notice */}
        <div className="bg-[#FFF8F9] p-3.5 rounded-2xl border border-[#F8D7DF] text-xs text-[#5A384D] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#075E54]">
            <ShieldCheck className="w-4 h-4 text-[#25D366]" />
            <span>User Consent & Direct Action:</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            {t.whatsapp.consentNotice}
          </p>
        </div>

        {/* Editable Message Preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#5A384D] block">
            {t.whatsapp.previewLabel}
          </label>
          <textarea
            rows={4}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full text-xs p-3 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#5A384D] hover:bg-[#FDF2F4] transition-colors cursor-pointer"
          >
            {t.whatsapp.cancelBtn}
          </button>

          <button
            type="button"
            onClick={handleLaunchWhatsApp}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1EBE5D] shadow-md shadow-[#25D366]/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.whatsapp.openWhatsAppBtn}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
