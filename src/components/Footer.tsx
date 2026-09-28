import React from 'react';
import { Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import { Heart, ShieldCheck, AlertCircle } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigateTo: (sectionId: string) => void;
  onOpenPrivacyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigateTo,
  onOpenPrivacyModal,
}) => {
  const t = translations[language];

  return (
    <footer className="bg-[#2D1222] text-[#F8D7DF] pt-16 pb-12 border-t border-[#431B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & Purpose (col-span-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E25574] via-[#F48B9E] to-[#FCE7EC] flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                {t.brand.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F8D7DF]/80 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#10B981] pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% On-Device Storage · Zero Ads</span>
            </div>
          </div>

          {/* Quick Links (col-span-3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-[#F8D7DF]/80">
              <li>
                <button
                  onClick={() => onNavigateTo('tour')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.tour}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('tracker')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.tracker}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('calendar')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.calendar}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('log')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.log}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('wellness')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.wellness}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTo('sakhi-ai')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.sakhiAi}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.privacy}
                </button>
              </li>
            </ul>
          </div>

          {/* Medical Disclaimer Panel (col-span-4) */}
          <div className="md:col-span-4 space-y-3 bg-[#3B1832] p-5 rounded-2xl border border-[#4E2343]">
            <div className="flex items-center gap-2 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <h4 className="font-display text-xs font-bold uppercase tracking-wider">
                {t.footer.medicalDisclaimerTitle}
              </h4>
            </div>
            <p className="text-[11px] text-[#F8D7DF]/75 leading-relaxed">
              {t.footer.medicalDisclaimerText}
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Subtle Trust */}
        <div className="pt-8 border-t border-[#431B33] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8D7DF]/60">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-3">
            <span>Made with empathy for menstruating bodies everywhere</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
