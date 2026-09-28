import React, { useState } from 'react';
import { Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import { Menu, X, Sparkles, ShieldCheck, Heart } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPrivacyModal: () => void;
  onNavigateTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenPrivacyModal,
  onNavigateTo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const handleNavClick = (id: string) => {
    onNavigateTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FFF8F9]/90 backdrop-blur-md border-b border-[#F8D7DF]/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element with lotus emblem) */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('hero');
          }}
          className="flex items-center gap-2.5 text-[#2D1222] hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E25574] via-[#F48B9E] to-[#FCE7EC] flex items-center justify-center text-white shadow-sm ring-2 ring-[#FCE7EC]">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[#2D1222]">
            {t.brand.name}
          </span>
        </a>

        {/* Zone 2: Navigation Links (Clean text links with hover styling) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#5A384D]">
          <button
            onClick={() => handleNavClick('tour')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.nav.tour}
          </button>
          <button
            onClick={() => handleNavClick('tracker')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.nav.tracker}
          </button>
          <button
            onClick={() => handleNavClick('calendar')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.nav.calendar}
          </button>
          <button
            onClick={() => handleNavClick('log')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.nav.log}
          </button>
          <button
            onClick={() => handleNavClick('insights')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.nav.insights}
          </button>
          <button
            onClick={() => handleNavClick('wellness')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.nav.wellness}
          </button>
          <button
            onClick={() => handleNavClick('sakhi-ai')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E25574]" />
            {t.nav.sakhiAi}
          </button>
          <button
            onClick={() => handleNavClick('care')}
            className="hover:text-[#E25574] transition-colors whitespace-nowrap cursor-pointer"
          >
            {t.nav.care}
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Language toggle + CTA) */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-[#FCE7EC] p-0.5 rounded-full border border-[#F8D7DF]">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white text-[#2D1222] shadow-xs'
                  : 'text-[#5A384D] hover:text-[#2D1222]'
              }`}
              title="Switch to English"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-white text-[#2D1222] shadow-xs'
                  : 'text-[#5A384D] hover:text-[#2D1222]'
              }`}
              title="हिंदी में बदलें"
            >
              हिंदी
            </button>
          </div>

          {/* Privacy button */}
          <button
            onClick={onOpenPrivacyModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A384D] hover:text-[#2D1222] hover:bg-[#FCE7EC]/60 rounded-full transition-colors cursor-pointer"
            title={t.nav.privacy}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{t.nav.privacy}</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => handleNavClick('tracker')}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-sm shadow-[#F48B9E]/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            {t.nav.trackCta}
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#5A384D] hover:text-[#2D1222] rounded-lg cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-[#F8D7DF] px-4 pt-3 pb-6 space-y-2.5 animate-fadeIn">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#5A384D]">
            <button
              onClick={() => handleNavClick('tour')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.nav.tour}
            </button>
            <button
              onClick={() => handleNavClick('tracker')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.nav.tracker}
            </button>
            <button
              onClick={() => handleNavClick('calendar')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.nav.calendar}
            </button>
            <button
              onClick={() => handleNavClick('log')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.nav.log}
            </button>
            <button
              onClick={() => handleNavClick('insights')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.nav.insights}
            </button>
            <button
              onClick={() => handleNavClick('wellness')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.nav.wellness}
            </button>
            <button
              onClick={() => handleNavClick('sakhi-ai')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#E25574]" />
              {t.nav.sakhiAi}
            </button>
            <button
              onClick={() => handleNavClick('care')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.nav.care}
            </button>
            <button
              onClick={() => handleNavClick('community')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#E25574] transition-colors"
            >
              {t.community.title}
            </button>
            <button
              onClick={() => {
                onOpenPrivacyModal();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#FDF2F4] hover:text-[#10B981] transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              {t.nav.privacy}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
