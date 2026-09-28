import React, { useState, useEffect } from 'react';
import { DailyLog, EnergyLevel, FlowLevel, Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import {
  Droplet,
  Heart,
  Smile,
  Zap,
  Coffee,
  Moon,
  FileText,
  CheckCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface DailyLoggerProps {
  language: Language;
  selectedDate: string;
  onDateChange: (date: string) => void;
  logs: Record<string, DailyLog>;
  onSaveLog: (log: DailyLog) => void;
}

export const DailyLogger: React.FC<DailyLoggerProps> = ({
  language,
  selectedDate,
  onDateChange,
  logs,
  onSaveLog,
}) => {
  const t = translations[language];

  // Current log state
  const existing = logs[selectedDate];

  const [flow, setFlow] = useState<FlowLevel>(existing?.flow || 'none');
  const [symptoms, setSymptoms] = useState<string[]>(existing?.symptoms || []);
  const [moods, setMoods] = useState<string[]>(existing?.moods || []);
  const [energy, setEnergy] = useState<EnergyLevel>(existing?.energy || 'medium');
  const [waterGlasses, setWaterGlasses] = useState<number>(existing?.waterGlasses || 4);
  const [sleepHours, setSleepHours] = useState<number>(existing?.sleepHours || 7.5);
  const [notes, setNotes] = useState<string>(existing?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state whenever selected date changes
  useEffect(() => {
    const current = logs[selectedDate];
    if (current) {
      setFlow(current.flow || 'none');
      setSymptoms(current.symptoms || []);
      setMoods(current.moods || []);
      setEnergy(current.energy || 'medium');
      setWaterGlasses(current.waterGlasses || 4);
      setSleepHours(current.sleepHours || 7.5);
      setNotes(current.notes || '');
    } else {
      setFlow('none');
      setSymptoms([]);
      setMoods([]);
      setEnergy('medium');
      setWaterGlasses(4);
      setSleepHours(7.5);
      setNotes('');
    }
    setSavedSuccess(false);
  }, [selectedDate, logs]);

  const toggleSymptom = (symKey: string) => {
    setSymptoms((prev) =>
      prev.includes(symKey) ? prev.filter((s) => s !== symKey) : [...prev, symKey]
    );
  };

  const toggleMood = (moodKey: string) => {
    setMoods((prev) =>
      prev.includes(moodKey) ? prev.filter((m) => m !== moodKey) : [...prev, moodKey]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: DailyLog = {
      date: selectedDate,
      flow,
      symptoms,
      moods,
      energy,
      waterGlasses,
      sleepHours,
      notes,
      updatedAt: new Date().toISOString(),
    };
    onSaveLog(newLog);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const symptomList = [
    { key: 'cramps', label: t.symptoms.cramps },
    { key: 'headache', label: t.symptoms.headache },
    { key: 'bloating', label: t.symptoms.bloating },
    { key: 'tenderBreasts', label: t.symptoms.tenderBreasts },
    { key: 'backache', label: t.symptoms.backache },
    { key: 'fatigue', label: t.symptoms.fatigue },
    { key: 'acne', label: t.symptoms.acne },
    { key: 'nausea', label: t.symptoms.nausea },
    { key: 'insomnia', label: t.symptoms.insomnia },
    { key: 'cravings', label: t.symptoms.cravings },
  ];

  const moodList = [
    { key: 'calm', label: t.moods.calm },
    { key: 'happy', label: t.moods.happy },
    { key: 'sensitive', label: t.moods.sensitive },
    { key: 'irritable', label: t.moods.irritable },
    { key: 'anxious', label: t.moods.anxious },
    { key: 'foggy', label: t.moods.foggy },
    { key: 'romantic', label: t.moods.romantic },
    { key: 'exhausted', label: t.moods.exhausted },
    { key: 'creative', label: t.moods.creative },
  ];

  return (
    <section id="log" className="py-20 bg-white border-b border-[#FCE7EC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.nav.log}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.logger.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5A384D]">
            {t.logger.subtitle}
          </p>
        </div>

        {/* Date Selector Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF] mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#2D1222]">
            <Calendar className="w-4 h-4 text-[#E25574]" />
            <span>{t.logger.dateSelect}</span>
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-white border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
          />
        </div>

        {/* Main Logging Form */}
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* 1. Period Flow Intensity */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-3">
            <label className="text-sm font-bold text-[#2D1222] flex items-center gap-2">
              <Droplet className="w-4 h-4 text-[#E25574]" />
              <span>{t.logger.flowTitle}</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(
                [
                  { level: 'none', label: t.logger.flowNone, drops: 0 },
                  { level: 'spotting', label: t.logger.flowSpotting, drops: 1 },
                  { level: 'light', label: t.logger.flowLight, drops: 2 },
                  { level: 'medium', label: t.logger.flowMedium, drops: 3 },
                  { level: 'heavy', label: t.logger.flowHeavy, drops: 4 },
                ] as const
              ).map((item) => {
                const isSelected = flow === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setFlow(item.level)}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E25574] text-white border-[#E25574] shadow-sm'
                        : 'bg-white text-[#5A384D] border-[#F8D7DF] hover:border-[#F48B9E]'
                    }`}
                  >
                    <span className="text-sm">
                      {item.drops === 0 ? '⚪' : '💧'.repeat(item.drops)}
                    </span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Physical Symptoms Selector */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-3">
            <label className="text-sm font-bold text-[#2D1222] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#E25574]" />
              <span>{t.logger.symptomsTitle}</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {symptomList.map((item) => {
                const isChecked = symptoms.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleSymptom(item.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-[#FCE7EC] text-[#9B1D48] border-[#F48B9E] font-semibold'
                        : 'bg-white text-[#5A384D] border-[#F8D7DF] hover:bg-[#FDF2F4]'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Mood & Emotional Landscape */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-3">
            <label className="text-sm font-bold text-[#2D1222] flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#F59E0B]" />
              <span>{t.logger.moodsTitle}</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {moodList.map((item) => {
                const isChecked = moods.includes(item.key);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleMood(item.key)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B] font-semibold'
                        : 'bg-white text-[#5A384D] border-[#F8D7DF] hover:bg-[#FFFBEB]'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Energy & Habits Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Energy Level */}
            <div className="bg-[#FFF8F9] p-5 rounded-3xl border border-[#F8D7DF] space-y-3">
              <label className="text-xs font-bold text-[#2D1222] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#E25574]" />
                <span>{t.logger.energyTitle}</span>
              </label>

              <div className="grid grid-cols-3 gap-1.5">
                {(['low', 'medium', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergy(lvl)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      energy === lvl
                        ? 'bg-[#E25574] text-white border-[#E25574]'
                        : 'bg-white text-[#5A384D] border-[#F8D7DF]'
                    }`}
                  >
                    {lvl === 'low'
                      ? t.logger.energyLow.split('/')[0]
                      : lvl === 'medium'
                      ? t.logger.energyMedium
                      : t.logger.energyHigh.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Water Tracker */}
            <div className="bg-[#FFF8F9] p-5 rounded-3xl border border-[#F8D7DF] space-y-3">
              <label className="text-xs font-bold text-[#2D1222] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#0284C7]" />
                  <span>{t.logger.waterTitle}</span>
                </span>
                <span className="text-xs font-semibold text-[#0284C7] tabular-nums">
                  {waterGlasses} {language === 'hi' ? 'गिलास' : 'glasses'}
                </span>
              </label>

              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#F8D7DF]">
                <button
                  type="button"
                  onClick={() => setWaterGlasses((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0284C7] font-bold text-sm hover:bg-[#E0F2FE] cursor-pointer"
                >
                  -
                </button>
                <div className="text-xs text-[#5A384D] tabular-nums font-semibold">
                  {(waterGlasses * 0.25).toFixed(1)} L
                </div>
                <button
                  type="button"
                  onClick={() => setWaterGlasses((prev) => Math.min(16, prev + 1))}
                  className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0284C7] font-bold text-sm hover:bg-[#E0F2FE] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sleep Hours Tracker */}
            <div className="bg-[#FFF8F9] p-5 rounded-3xl border border-[#F8D7DF] space-y-3">
              <label className="text-xs font-bold text-[#2D1222] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-[#8B5CF6]" />
                  <span>{t.logger.sleepTitle}</span>
                </span>
                <span className="text-xs font-semibold text-[#8B5CF6] tabular-nums">
                  {sleepHours} {t.logger.hours}
                </span>
              </label>

              <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#F8D7DF]">
                <button
                  type="button"
                  onClick={() => setSleepHours((prev) => Math.max(3, prev - 0.5))}
                  className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] font-bold text-sm hover:bg-[#EDE9FE] cursor-pointer"
                >
                  -
                </button>
                <div className="text-xs text-[#5A384D] tabular-nums font-semibold">
                  {sleepHours} {language === 'hi' ? 'घंटे' : 'hrs'}
                </div>
                <button
                  type="button"
                  onClick={() => setSleepHours((prev) => Math.min(14, prev + 0.5))}
                  className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#8B5CF6] font-bold text-sm hover:bg-[#EDE9FE] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* 5. Notes / Reflections */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-2">
            <label className="text-sm font-bold text-[#2D1222] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#5A384D]" />
              <span>{t.logger.notesTitle}</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.logger.notesPlaceholder}
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-white border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574] leading-relaxed"
            />
          </div>

          {/* Save Action & Feedback */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-md shadow-[#E25574]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{t.logger.saveLog}</span>
            </button>

            {savedSuccess && (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981] animate-fadeIn">
                <CheckCircle className="w-4 h-4" />
                <span>{t.logger.logSavedSuccess}</span>
              </div>
            )}
          </div>

        </form>

      </div>
    </section>
  );
};
