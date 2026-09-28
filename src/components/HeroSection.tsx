import React from 'react';
import { Language } from '../types/cycle';
import { CalculatedCycleState } from '../utils/cycleCalculations';
import { translations } from '../i18n/translations';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Compass } from 'lucide-react';
import heroImage from '../assets/images/hero_wellness_cycle_1790625152760.jpg';

interface HeroSectionProps {
  language: Language;
  cycleState: CalculatedCycleState;
  onTrackClick: () => void;
  onTourClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  cycleState,
  onTrackClick,
  onTourClick,
}) => {
  const t = translations[language];
  const phaseInfo = t.phases[cycleState.currentPhase];

  return (
    <section id="hero" className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
      {/* Background Image with soft gradient scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Mindful young woman enjoying peaceful wellness and morning sunlight with fresh peonies"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.92]"
        />
        {/* Soft pastel blush & deep plum gradient scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D1222]/90 via-[#2D1222]/70 to-[#2D1222]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F9] via-transparent to-transparent opacity-90" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Glass-Style Headline & Value Proposition Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Subtle editorial kicker (Clean text, no static pill capsule) */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#FCE7EC]">
              <Sparkles className="w-4 h-4 text-[#F48B9E]" />
              <span>{t.hero.kicker}</span>
              <span aria-hidden="true" className="text-[#F48B9E]">·</span>
              <span>100% Private</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] text-balance">
              {t.hero.title}
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#F8D7DF] leading-relaxed max-w-2xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onTrackClick}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-lg shadow-[#E25574]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTourClick}
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 rounded-full transition-all flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#FCE7EC]" />
                <span>{t.hero.secondaryCta}</span>
              </button>
            </div>

            {/* Proof & Privacy Trust Indicators (Clean metadata, zero pills) */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-[#FCE7EC]/90 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#10B981]" />
                <span>{t.hero.dataNotice}</span>
              </div>
              <span aria-hidden="true" className="text-white/30">·</span>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#F48B9E]" />
                <span>{t.brand.disclaimerShort}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Cycle Snapshot Card (Glass-panel preview) */}
          <div className="lg:col-span-5">
            <div className="glass-card bg-white/92 backdrop-blur-xl p-6 sm:p-7 rounded-3xl shadow-xl shadow-[#2D1222]/10 border border-white/80 space-y-5">
              
              {/* Card Header with Cycle Day */}
              <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C657B]">
                    {t.hero.cycleDayBadge}
                  </span>
                  <div className="text-3xl font-display font-bold text-[#2D1222] tabular-nums">
                    {cycleState.currentCycleDay}
                    <span className="text-sm font-normal text-[#8C657B] ml-1.5">
                      / 28 {language === 'hi' ? 'दिन' : 'days'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C657B]">
                    {t.hero.phaseEstimate}
                  </span>
                  <div className="text-sm font-bold text-[#E25574]">
                    {phaseInfo.status}
                  </div>
                </div>
              </div>

              {/* Phase summary and biological advice */}
              <div className="space-y-2">
                <h2 className="text-base font-bold text-[#2D1222] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E25574] animate-pulse" />
                  {phaseInfo.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A384D] leading-relaxed">
                  {phaseInfo.summary}
                </p>
                <div className="bg-[#FFF8F9] p-3 rounded-2xl border border-[#F8D7DF] text-xs text-[#5A384D] italic">
                  💡 {phaseInfo.advice}
                </div>
              </div>

              {/* Progress Bar & Next Period Counter */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-medium text-[#8C657B]">
                  <span>Cycle Progress</span>
                  <span className="tabular-nums font-semibold text-[#2D1222]">{cycleState.cycleProgressPercent}%</span>
                </div>
                <div className="w-full bg-[#FCE7EC] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#E25574] via-[#F48B9E] to-[#FB7185] h-full rounded-full transition-all duration-500"
                    style={{ width: `${cycleState.cycleProgressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-[#8C657B] pt-1 flex items-center justify-between">
                  <span>{t.hero.nextPeriodEstimate}</span>
                  <strong className="text-[#2D1222] font-semibold tabular-nums">
                    {cycleState.daysUntilNextPeriod} {t.hero.days}
                  </strong>
                </p>
              </div>

              {/* Direct Quick Log CTA */}
              <button
                onClick={onTrackClick}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-[#9B1D48] bg-[#FCE7EC] hover:bg-[#F8D7DF] rounded-xl transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'आज का चक्र विवरण देखें →' : 'View Full Interactive Cycle Dial →'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
