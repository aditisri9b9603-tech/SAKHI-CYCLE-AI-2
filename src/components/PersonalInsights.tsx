import React from 'react';
import { DailyLog, Language, CycleSettings } from '../types/cycle';
import { translations } from '../i18n/translations';
import { Sparkles, Calendar, TrendingUp, Heart, CheckCircle2, Clock } from 'lucide-react';

interface PersonalInsightsProps {
  language: Language;
  settings: CycleSettings;
  logs: Record<string, DailyLog>;
  onSelectDate: (date: string) => void;
}

export const PersonalInsights: React.FC<PersonalInsightsProps> = ({
  language,
  settings,
  logs,
  onSelectDate,
}) => {
  const t = translations[language];

  // Aggregate stats from logs
  const logEntries = Object.values(logs);
  const totalLogs = logEntries.length;

  // Symptom counts
  const symptomCounts: Record<string, number> = {};
  const moodCounts: Record<string, number> = {};

  logEntries.forEach((log) => {
    log.symptoms?.forEach((sym) => {
      symptomCounts[sym] = (symptomCounts[sym] || 0) + 1;
    });
    log.moods?.forEach((m) => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
  });

  const sortedSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const sortedMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const getSymptomLabel = (key: string) => {
    return (t.symptoms as any)[key] || key;
  };

  const getMoodLabel = (key: string) => {
    return (t.moods as any)[key] || key;
  };

  return (
    <section id="insights" className="py-20 bg-white border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.nav.insights}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.insights.title}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.insights.subtitle}
          </p>
        </div>

        {/* 4 Key Metrics Bento Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* 1. Average Cycle Length */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-2">
            <div className="flex items-center justify-between text-[#8C657B]">
              <span className="text-xs font-semibold uppercase tracking-wider">{t.insights.avgCycleLength}</span>
              <Calendar className="w-4 h-4 text-[#E25574]" />
            </div>
            <div className="text-3xl font-display font-bold text-[#2D1222] tabular-nums">
              {settings.cycleLength} <span className="text-sm font-normal text-[#8C657B]">{language === 'hi' ? 'दिन' : 'days'}</span>
            </div>
            <p className="text-xs text-[#5A384D]">
              {language === 'hi' ? 'स्वस्थ सामान्य सीमा (२१-३५ दिन)' : 'Healthy normal range (21-35 days)'}
            </p>
          </div>

          {/* 2. Cycle Regularity */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-2">
            <div className="flex items-center justify-between text-[#8C657B]">
              <span className="text-xs font-semibold uppercase tracking-wider">{t.insights.cycleRegularity}</span>
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="text-xl font-display font-bold text-[#10B981]">
              {t.insights.regular}
            </div>
            <p className="text-xs text-[#5A384D]">
              {language === 'hi' ? '±२ दिनों का स्वाभाविक उतार-चढ़ाव' : 'Natural ±2 day monthly variation'}
            </p>
          </div>

          {/* 3. Period Duration */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-2">
            <div className="flex items-center justify-between text-[#8C657B]">
              <span className="text-xs font-semibold uppercase tracking-wider">{t.insights.periodDurationAvg}</span>
              <Heart className="w-4 h-4 text-[#E25574]" />
            </div>
            <div className="text-3xl font-display font-bold text-[#2D1222] tabular-nums">
              {settings.periodLength} <span className="text-sm font-normal text-[#8C657B]">{language === 'hi' ? 'दिन' : 'days'}</span>
            </div>
            <p className="text-xs text-[#5A384D]">
              {language === 'hi' ? 'सामान्य मासिक स्राव समय' : 'Typical shedding duration'}
            </p>
          </div>

          {/* 4. Logging Consistency */}
          <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-2">
            <div className="flex items-center justify-between text-[#8C657B]">
              <span className="text-xs font-semibold uppercase tracking-wider">{t.insights.logStreak}</span>
              <CheckCircle2 className="w-4 h-4 text-[#E25574]" />
            </div>
            <div className="text-3xl font-display font-bold text-[#2D1222] tabular-nums">
              {totalLogs} <span className="text-sm font-normal text-[#8C657B]">{language === 'hi' ? 'प्रविष्टियां' : 'logged'}</span>
            </div>
            <p className="text-xs text-[#5A384D]">
              {totalLogs >= 3
                ? (language === 'hi' ? 'उत्कृष्ट संगति! रुझान स्पष्ट हैं।' : 'Great consistency! Insights are clear.')
                : (language === 'hi' ? 'अधिक प्रविष्टियां बेहतर सटीकता देंगी।' : 'More check-ins refine predictions.')}
            </p>
          </div>

        </div>

        {/* Breakdown Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Top Symptoms & Moods */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Phase Proportion Bar */}
            <div className="bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-4">
              <h3 className="font-display text-base font-bold text-[#2D1222]">
                {t.insights.phaseDistribution}
              </h3>
              
              <div className="h-4 w-full bg-[#FCE7EC] rounded-full flex overflow-hidden shadow-inner">
                <div
                  className="bg-[#E25574] h-full"
                  style={{ width: `${(settings.periodLength / settings.cycleLength) * 100}%` }}
                  title="Menstrual"
                />
                <div
                  className="bg-[#F48B9E] h-full"
                  style={{ width: `${(8 / settings.cycleLength) * 100}%` }}
                  title="Follicular"
                />
                <div
                  className="bg-[#F59E0B] h-full"
                  style={{ width: `${(5 / settings.cycleLength) * 100}%` }}
                  title="Ovulation"
                />
                <div
                  className="bg-[#8B5CF6] h-full"
                  style={{ width: `${((settings.cycleLength - settings.periodLength - 13) / settings.cycleLength) * 100}%` }}
                  title="Luteal"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#5A384D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E25574]" />
                  <span>{language === 'hi' ? 'पीरियड' : 'Menstrual'} ({settings.periodLength}d)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5A384D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F48B9E]" />
                  <span>{language === 'hi' ? 'फॉलिक्युलर' : 'Follicular'} (~8d)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5A384D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span>{language === 'hi' ? 'उर्वर' : 'Fertile'} (~5d)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5A384D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span>{language === 'hi' ? 'ल्यूटियल' : 'Luteal'} (~10d)</span>
                </div>
              </div>
            </div>

            {/* Top Symptoms & Moods Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Top Symptoms */}
              <div className="bg-[#FFF8F9] p-5 rounded-3xl border border-[#F8D7DF] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C657B]">
                  {t.insights.topSymptoms}
                </h4>
                {sortedSymptoms.length > 0 ? (
                  <div className="space-y-2">
                    {sortedSymptoms.map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between text-xs text-[#2D1222] bg-white p-2.5 rounded-xl border border-[#F8D7DF]">
                        <span className="font-medium">{getSymptomLabel(key)}</span>
                        <span className="font-bold text-[#E25574] tabular-nums">{count} {language === 'hi' ? 'बार' : 'times'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8C657B] italic">
                    {t.insights.noDataYet}
                  </p>
                )}
              </div>

              {/* Top Moods */}
              <div className="bg-[#FFF8F9] p-5 rounded-3xl border border-[#F8D7DF] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C657B]">
                  {t.insights.topMoods}
                </h4>
                {sortedMoods.length > 0 ? (
                  <div className="space-y-2">
                    {sortedMoods.map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between text-xs text-[#2D1222] bg-white p-2.5 rounded-xl border border-[#F8D7DF]">
                        <span className="font-medium">{getMoodLabel(key)}</span>
                        <span className="font-bold text-[#F59E0B] tabular-nums">{count} {language === 'hi' ? 'बार' : 'times'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#8C657B] italic">
                    {t.insights.noDataYet}
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Right Column: Recent Log History */}
          <div className="lg:col-span-5 bg-[#FFF8F9] p-6 rounded-3xl border border-[#F8D7DF] space-y-4">
            <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
              <h3 className="font-display text-base font-bold text-[#2D1222] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E25574]" />
                <span>{language === 'hi' ? 'हालिया दर्ज लॉग' : 'Recent Logged Days'}</span>
              </h3>
              <span className="text-xs font-semibold text-[#8C657B]">
                {logEntries.length} {language === 'hi' ? 'दिन' : 'records'}
              </span>
            </div>

            {logEntries.length > 0 ? (
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {logEntries
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((log) => (
                    <button
                      key={log.date}
                      onClick={() => onSelectDate(log.date)}
                      className="w-full text-left p-3 rounded-2xl bg-white border border-[#F8D7DF] hover:border-[#F48B9E] transition-all cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#2D1222]">{log.date}</span>
                        <span className="text-[#E25574] font-semibold capitalize">
                          {log.flow && log.flow !== 'none' ? `Flow: ${log.flow}` : 'No flow'}
                        </span>
                      </div>
                      {(log.symptoms.length > 0 || log.moods.length > 0) && (
                        <div className="text-[11px] text-[#5A384D] truncate">
                          {[...log.symptoms.map(getSymptomLabel), ...log.moods.map(getMoodLabel)].join(', ')}
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#8C657B] space-y-2">
                <p>{t.insights.noDataYet}</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
