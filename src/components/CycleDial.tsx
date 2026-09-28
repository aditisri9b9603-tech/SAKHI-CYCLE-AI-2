import React, { useState } from 'react';
import { CycleSettings, Language } from '../types/cycle';
import { CalculatedCycleState } from '../utils/cycleCalculations';
import { translations } from '../i18n/translations';
import { Sliders, Calendar as CalendarIcon, Info, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface CycleDialProps {
  language: Language;
  settings: CycleSettings;
  cycleState: CalculatedCycleState;
  onUpdateSettings: (newSettings: CycleSettings) => void;
  onQuickLogClick: () => void;
}

export const CycleDial: React.FC<CycleDialProps> = ({
  language,
  settings,
  cycleState,
  onUpdateSettings,
  onQuickLogClick,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [tempLastPeriod, setTempLastPeriod] = useState(settings.lastPeriodDate);
  const [tempCycleLength, setTempCycleLength] = useState(settings.cycleLength);
  const [tempPeriodLength, setTempPeriodLength] = useState(settings.periodLength);
  const [savedNotice, setSavedNotice] = useState(false);

  const t = translations[language];
  const phaseInfo = t.phases[cycleState.currentPhase];

  // SVG Dial Calculations
  const radius = 120;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, (cycleState.currentCycleDay - 1) / settings.cycleLength));
  const strokeDashoffset = circumference - progressRatio * circumference;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      lastPeriodDate: tempLastPeriod,
      cycleLength: Number(tempCycleLength),
      periodLength: Number(tempPeriodLength),
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setShowSettings(false);
    }, 1200);
  };

  const handleResetDefaults = () => {
    const today = new Date();
    today.setDate(today.getDate() - 13);
    const dateStr = today.toISOString().split('T')[0];
    setTempLastPeriod(dateStr);
    setTempCycleLength(28);
    setTempPeriodLength(5);
  };

  return (
    <section id="tracker" className="py-20 bg-[#FFF8F9] border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.nav.tracker}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.dial.cycleDialTitle}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.dial.nextPeriodIn} <span className="font-bold text-[#2D1222] tabular-nums">{cycleState.daysUntilNextPeriod}</span> {t.hero.days}.
          </p>
        </div>

        {/* Dial & Info Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left/Center Column: Interactive Circular Dial */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
              
              {/* Outer Decorative Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FCE7EC] via-white to-[#FDF2F4] filter blur-xl opacity-70 -z-10" />

              {/* Circular SVG Ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 300 300">
                {/* Background Ring Track */}
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  stroke="#FCE7EC"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />

                {/* Phase Arcs (Subtle guides) */}
                {/* 1. Menstrual segment */}
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  stroke="#E25574"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${(settings.periodLength / settings.cycleLength) * circumference} ${circumference}`}
                  strokeDashoffset="0"
                  fill="transparent"
                  className="opacity-40"
                />

                {/* Active Progress Ring */}
                <circle
                  cx="150"
                  cy="150"
                  r={radius}
                  stroke="url(#cycleProgressGradient)"
                  strokeWidth={strokeWidth + 2}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />

                {/* SVG Gradient Definition */}
                <defs>
                  <linearGradient id="cycleProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E25574" />
                    <stop offset="50%" stopColor="#F48B9E" />
                    <stop offset="100%" stopColor="#FB7185" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central Information Hub */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#8C657B]">
                  {t.dial.dayLabel}
                </span>

                <div className="font-display text-5xl sm:text-6xl font-extrabold text-[#2D1222] tabular-nums tracking-tight">
                  {cycleState.currentCycleDay}
                </div>

                <div className="text-xs text-[#8C657B] font-medium">
                  {t.dial.of} {settings.cycleLength} {t.dial.cycleDays}
                </div>

                {/* Current Phase Badge */}
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE7EC] text-[#9B1D48] border border-[#F8D7DF]">
                    {phaseInfo.status}
                  </span>
                </div>

                {/* Quick Log button inside Dial */}
                <div className="pt-3">
                  <button
                    onClick={onQuickLogClick}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    + {t.logger.title.split(' ')[0]} {language === 'hi' ? 'लॉग करें' : 'Log'}
                  </button>
                </div>
              </div>

            </div>

            {/* Phase Legend below Dial */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6 text-xs text-[#5A384D]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#E25574]" />
                <span>{language === 'hi' ? 'पीरियड (दिन १-५)' : 'Menstrual (Days 1-5)'}</span>
              </div>
              <span aria-hidden="true" className="text-[#8C657B]">·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F48B9E]" />
                <span>{language === 'hi' ? 'फॉलिक्युलर (दिन ६-११)' : 'Follicular (Days 6-11)'}</span>
              </div>
              <span aria-hidden="true" className="text-[#8C657B]">·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span>{language === 'hi' ? 'उर्वर खिड़की (दिन १२-१६ अनुमान)' : 'Fertile Window (Days 12-16 est.)'}</span>
              </div>
              <span aria-hidden="true" className="text-[#8C657B]">·</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                <span>{language === 'hi' ? 'ल्यूटियल (दिन १७-२८)' : 'Luteal (Days 17-28)'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Biological Details & Settings Adjustment */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phase Guidance Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F8D7DF] shadow-md shadow-[#FCE7EC]/50 space-y-4">
              <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
                <h3 className="font-display text-xl font-bold text-[#2D1222]">
                  {phaseInfo.name}
                </h3>
                <span className="text-xs font-semibold text-[#E25574] bg-[#FFF8F9] px-2.5 py-1 rounded-lg border border-[#FCE7EC]">
                  Day {cycleState.currentCycleDay} of {settings.cycleLength}
                </span>
              </div>

              <p className="text-sm text-[#5A384D] leading-relaxed">
                {phaseInfo.summary}
              </p>

              <div className="bg-[#FFF8F9] p-3.5 rounded-2xl border border-[#F8D7DF] text-xs sm:text-sm text-[#2D1222] space-y-1">
                <span className="font-semibold block text-[#E25574]">
                  {language === 'hi' ? 'हार्मोनल मार्गदर्शन:' : 'Biological Guidance:'}
                </span>
                <p className="text-[#5A384D] leading-relaxed">
                  {phaseInfo.advice}
                </p>
              </div>

              {/* Key Estimates Card */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#FFF8F9] rounded-2xl border border-[#F8D7DF]">
                  <span className="text-[11px] text-[#8C657B] block">
                    {language === 'hi' ? 'अगला अनुमानित पीरियड' : 'Next Estimated Period'}
                  </span>
                  <span className="text-sm font-bold text-[#2D1222]">
                    {cycleState.nextPeriodDate}
                  </span>
                </div>
                <div className="p-3 bg-[#FFF8F9] rounded-2xl border border-[#F8D7DF]">
                  <span className="text-[11px] text-[#8C657B] block">
                    {language === 'hi' ? 'अनुमानित ओव्यूलेशन' : 'Estimated Ovulation'}
                  </span>
                  <span className="text-sm font-bold text-[#2D1222]">
                    Day {cycleState.estimatedOvulationDay} ({cycleState.estimatedOvulationDate})
                  </span>
                </div>
              </div>

              {/* Toggle Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#5A384D] hover:text-[#2D1222] bg-[#FCE7EC]/50 hover:bg-[#FCE7EC] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showSettings ? (language === 'hi' ? 'सेटिंग्स छुपाएं' : 'Hide Settings') : t.dial.editSettings}</span>
              </button>
            </div>

            {/* Editable Settings Drawer / Accordion */}
            {showSettings && (
              <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-[#F8D7DF] shadow-md space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-2">
                  <h4 className="font-display text-sm font-bold text-[#2D1222]">
                    {t.dial.editSettings}
                  </h4>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-xs text-[#8C657B] hover:text-[#E25574] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.dial.resetDefaults}</span>
                  </button>
                </div>

                {/* Last Period Start Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#5A384D] flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#E25574]" />
                    <span>{t.dial.lastPeriodStart}</span>
                  </label>
                  <input
                    type="date"
                    value={tempLastPeriod}
                    onChange={(e) => setTempLastPeriod(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                    required
                  />
                </div>

                {/* Average Cycle Length */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#5A384D]">
                      {t.dial.averageCycleLength}
                    </label>
                    <input
                      type="number"
                      min={21}
                      max={45}
                      value={tempCycleLength}
                      onChange={(e) => setTempCycleLength(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#5A384D]">
                      {t.dial.periodDuration}
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={tempPeriodLength}
                      onChange={(e) => setTempPeriodLength(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {savedNotice ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>{t.dial.saveSettings}</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Medical Estimate Disclaimer Box */}
            <div className="bg-[#FFF1F2] border border-[#FECDD3] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#9F1239]">
              <AlertCircle className="w-5 h-5 text-[#E11D48] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t.dial.estimateDisclaimer}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
