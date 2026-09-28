import React, { useState, useEffect } from 'react';
import { Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import { Wind, Sparkles, Play, Pause, RefreshCw } from 'lucide-react';

interface BreathingAndAffirmationsProps {
  language: Language;
}

export const BreathingAndAffirmations: React.FC<BreathingAndAffirmationsProps> = ({ language }) => {
  const t = translations[language];

  // 4-7-8 Breathing Timer State
  // Cycle: Inhale (4s) -> Hold (7s) -> Exhale (8s) -> repeat (total 19s per cycle)
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Affirmation State
  const affirmations = t.breathing.affirmationsList;
  const [currentAffirmationIdx, setCurrentAffirmationIdx] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (phase === 'inhale') {
              setPhase('hold');
              return 7;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 8;
            } else {
              setPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleBreathing = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('inhale');
      setSecondsLeft(4);
    } else {
      setIsActive(true);
      setPhase('inhale');
      setSecondsLeft(4);
    }
  };

  const getPhaseInstruction = () => {
    if (phase === 'inhale') return t.breathing.inhale;
    if (phase === 'hold') return t.breathing.hold;
    return t.breathing.exhale;
  };

  const nextAffirmation = () => {
    setCurrentAffirmationIdx((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <section id="breathing" className="py-20 bg-white border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {language === 'hi' ? 'शांति व विश्राम' : 'Mindful Somatic Ease'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.breathing.title}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.breathing.subtitle}
          </p>
        </div>

        {/* 2-Column Layout: Breathing Tool & Affirmation Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Left Column: 4-7-8 Breathing Circle */}
          <div className="lg:col-span-6 bg-[#FFF8F9] rounded-3xl p-8 border border-[#F8D7DF] flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8C657B]">
              4-7-8 Vagus Nerve Relaxation
            </div>

            {/* Breathing Bubble */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#E25574]/20 via-[#FCE7EC] to-[#F48B9E]/20 transition-all duration-1000 ${
                  isActive
                    ? phase === 'inhale'
                      ? 'scale-110 opacity-100'
                      : phase === 'hold'
                      ? 'scale-105 opacity-90'
                      : 'scale-90 opacity-60'
                    : 'scale-100 opacity-60'
                }`}
              />

              <div className="relative z-10 space-y-1">
                <Wind className="w-6 h-6 text-[#E25574] mx-auto animate-pulse" />
                <div className="font-display text-4xl font-bold text-[#2D1222] tabular-nums">
                  {secondsLeft}s
                </div>
                <div className="text-xs font-bold text-[#E25574] uppercase tracking-wider">
                  {phase}
                </div>
              </div>
            </div>

            {/* Instruction label */}
            <div className="text-xs sm:text-sm font-medium text-[#2D1222] min-h-[30px] flex items-center justify-center">
              {isActive ? getPhaseInstruction() : (language === 'hi' ? 'तनाव व ऐंठन को शांत करने के लिए शुरू करें।' : 'Tap start to begin the gentle cramp-easing rhythm.')}
            </div>

            {/* Start/Stop Button */}
            <button
              onClick={toggleBreathing}
              className={`px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2D1222] text-white hover:bg-[#431B33]'
                  : 'bg-gradient-to-r from-[#E25574] to-[#F48B9E] text-white hover:from-[#D13C60] hover:to-[#E25574] shadow-md shadow-[#E25574]/20'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isActive ? t.breathing.stopBtn : t.breathing.startBtn}</span>
            </button>
          </div>

          {/* Right Column: Daily Affirmation Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#FFF8F9] to-[#FCE7EC] rounded-3xl p-8 border border-[#F8D7DF] space-y-6 shadow-sm flex flex-col justify-between min-h-[340px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8C657B]">
                <span className="flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#E25574]" />
                  <span>{t.breathing.affirmationTitle}</span>
                </span>
                <span>
                  0{currentAffirmationIdx + 1} / 0{affirmations.length}
                </span>
              </div>

              <blockquote className="font-display text-xl sm:text-2xl font-bold text-[#2D1222] leading-relaxed pt-2">
                “{affirmations[currentAffirmationIdx]}”
              </blockquote>
            </div>

            <div className="pt-4 border-t border-[#F8D7DF] flex items-center justify-between">
              <span className="text-xs text-[#5A384D] italic">
                {language === 'hi' ? 'सखी दैनिक आत्म-प्रेम' : 'Sakhi mindful gentle reflection'}
              </span>

              <button
                onClick={nextAffirmation}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#FDF2F4] text-[#E25574] border border-[#F8D7DF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.breathing.newAffirmation}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
