import React, { useState } from 'react';
import { DailyLog, Language, CycleSettings } from '../types/cycle';
import { translations } from '../i18n/translations';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react';

interface CycleCalendarProps {
  language: Language;
  settings: CycleSettings;
  logs: Record<string, DailyLog>;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const CycleCalendar: React.FC<CycleCalendarProps> = ({
  language,
  settings,
  logs,
  selectedDate,
  onSelectDate,
}) => {
  const t = translations[language];
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Determine cycle phase predictions for any given date
  const lastStart = new Date(settings.lastPeriodDate);
  const cycleLen = settings.cycleLength || 28;
  const periodLen = settings.periodLength || 5;
  const ovulationDay = Math.max(periodLen + 2, cycleLen - 14);
  const fertileStart = Math.max(periodLen + 1, ovulationDay - 4);
  const fertileEnd = Math.min(cycleLen - 1, ovulationDay + 1);

  const getDayInfo = (dayNum: number) => {
    const d = new Date(year, month, dayNum);
    const dateStr = d.toISOString().split('T')[0];

    // Days diff
    const diffTime = d.getTime() - lastStart.getTime();
    const daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let isPeriod = false;
    let isFertile = false;
    let isOvulation = false;

    if (daysDiff >= 0) {
      const cycleDay = (daysDiff % cycleLen) + 1;
      if (cycleDay <= periodLen) isPeriod = true;
      else if (cycleDay === ovulationDay) isOvulation = true;
      else if (cycleDay >= fertileStart && cycleDay <= fertileEnd) isFertile = true;
    }

    const hasLog = Boolean(logs[dateStr]);
    const isSelected = selectedDate === dateStr;
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    return { dateStr, isPeriod, isFertile, isOvulation, hasLog, isSelected, isToday };
  };

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthNamesHi = [
    'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
  ];
  const currentMonthName = language === 'hi' ? monthNamesHi[month] : monthNamesEn[month];

  const weekdayHeadersEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayHeadersHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const weekdays = language === 'hi' ? weekdayHeadersHi : weekdayHeadersEn;

  return (
    <section id="calendar" className="py-20 bg-[#FFF8F9] border-b border-[#FCE7EC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.nav.calendar}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.calendar.title}
          </h2>
          <p className="text-sm sm:text-base text-[#5A384D]">
            {t.calendar.subtitle}
          </p>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F8D7DF] shadow-lg shadow-[#FCE7EC]/40 space-y-6">
          
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-4">
            <h3 className="font-display text-xl font-bold text-[#2D1222]">
              {currentMonthName} {year}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-[#FFF8F9] hover:bg-[#FCE7EC] text-[#5A384D] transition-colors cursor-pointer"
                aria-label={t.calendar.prevMonth}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-[#FFF8F9] hover:bg-[#FCE7EC] text-[#5A384D] transition-colors cursor-pointer"
                aria-label={t.calendar.nextMonth}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-semibold text-[#8C657B]">
            {weekdays.map((wd, i) => (
              <div key={i} className="py-1">
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2 sm:p-3" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const info = getDayInfo(dayNum);

              let bgClass = 'bg-white hover:bg-[#FFF8F9] text-[#2D1222] border-[#F8D7DF]';
              if (info.isPeriod) {
                bgClass = 'bg-[#FCE7EC] text-[#9B1D48] border-[#F48B9E] font-bold';
              } else if (info.isOvulation) {
                bgClass = 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B] font-bold ring-2 ring-[#F59E0B]/40';
              } else if (info.isFertile) {
                bgClass = 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
              }

              if (info.isSelected) {
                bgClass += ' ring-2 ring-[#E25574] shadow-sm';
              }

              return (
                <button
                  key={dayNum}
                  onClick={() => onSelectDate(info.dateStr)}
                  className={`relative p-2 sm:p-3 rounded-2xl border transition-all flex flex-col items-center justify-center cursor-pointer min-h-[50px] sm:min-h-[58px] ${bgClass}`}
                >
                  <span className="tabular-nums font-semibold">{dayNum}</span>

                  {/* Dot status indicators */}
                  <div className="flex items-center gap-1 mt-1">
                    {info.hasLog && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" title="Logged" />
                    )}
                    {info.isPeriod && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E25574]" title="Period" />
                    )}
                    {info.isOvulation && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" title="Ovulation" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Legend (Unboxed, accessible) */}
          <div className="pt-4 border-t border-[#FCE7EC] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A384D]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FCE7EC] border border-[#F48B9E]" />
              <span>{t.calendar.legendPeriod}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FFFBEB] border border-[#FDE68A]" />
              <span>{t.calendar.legendFertile}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FEF3C7] border border-[#F59E0B]" />
              <span>{t.calendar.legendOvulation}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span>{t.calendar.legendLogged}</span>
            </div>
          </div>

          {/* Selected Date Action Box */}
          <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#F8D7DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#2D1222]">
              <CalendarIcon className="w-4 h-4 text-[#E25574]" />
              <span>
                <strong>{t.calendar.selectedDateDetails}:</strong> {selectedDate}
              </span>
            </div>
            <span className="text-[#8C657B]">
              {t.calendar.tapToLog}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
