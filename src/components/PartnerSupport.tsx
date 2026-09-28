import React, { useState } from 'react';
import { CyclePhase, Language, PartnerConfig } from '../types/cycle';
import { translations } from '../i18n/translations';
import { PARTNER_QUIZ_ITEMS } from '../utils/cycleCalculations';
import {
  HeartHandshake,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Share2,
  Sparkles,
  Eye,
  HelpCircle,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MessageCircle,
} from 'lucide-react';

interface PartnerSupportProps {
  language: Language;
  currentPhase: CyclePhase;
  partnerConfig: PartnerConfig;
  onUpdatePartnerConfig: (config: PartnerConfig) => void;
  onOpenWhatsAppModal: (text: string) => void;
}

export const PartnerSupport: React.FC<PartnerSupportProps> = ({
  language,
  currentPhase,
  partnerConfig,
  onUpdatePartnerConfig,
  onOpenWhatsAppModal,
}) => {
  const t = translations[language];

  const [viewMode, setViewMode] = useState<'user' | 'partner'>('user');
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form state for permissions
  const [sharePhase, setSharePhase] = useState(partnerConfig.permissions.sharePhase);
  const [shareSupportTips, setShareSupportTips] = useState(partnerConfig.permissions.shareSupportTips);
  const [shareFertileWindow, setShareFertileWindow] = useState(partnerConfig.permissions.shareFertileWindow);
  const [customNotes, setCustomNotes] = useState(partnerConfig.permissions.customSupportNotes);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(partnerConfig.partnerCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PartnerConfig = {
      ...partnerConfig,
      permissions: {
        sharePhase,
        shareSupportTips,
        shareFertileWindow,
        customSupportNotes: customNotes,
      },
    };
    onUpdatePartnerConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDisconnect = () => {
    const updated: PartnerConfig = {
      ...partnerConfig,
      isPaired: false,
      permissions: {
        sharePhase: false,
        shareSupportTips: false,
        shareFertileWindow: false,
        customSupportNotes: '',
      },
      connectedAt: null,
    };
    setSharePhase(false);
    setShareSupportTips(false);
    setShareFertileWindow(false);
    setCustomNotes('');
    onUpdatePartnerConfig(updated);
  };

  const handleAnswerQuiz = (qId: string, optionKey: string) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionKey }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    PARTNER_QUIZ_ITEMS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctOptionKey) {
        score += 1;
      }
    });
    return score;
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  // Support tips mapping based on phase
  const getPhaseSupportTips = (phase: CyclePhase) => {
    if (phase === 'menstrual') return t.partner.practicalTipsMenstrual;
    if (phase === 'follicular') return t.partner.practicalTipsFollicular;
    if (phase === 'ovulation') return t.partner.practicalTipsOvulation;
    return t.partner.practicalTipsLuteal;
  };

  const phaseTips = getPhaseSupportTips(currentPhase);
  const phaseInfo = t.phases[currentPhase];

  return (
    <section id="partner" className="py-20 bg-gradient-to-b from-[#FFF8F9] via-white to-[#FFF8F9] border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.partner.partnerHeroKicker}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.partner.partnerHeroTitle}
          </h2>
          <p className="text-base text-[#5A384D] leading-relaxed">
            {t.partner.partnerHeroDesc}
          </p>

          {/* Toggle between User Control View and Partner Limited View */}
          <div className="pt-4 flex justify-center">
            <div className="bg-[#FFF8F9] p-1.5 rounded-full border border-[#F8D7DF] shadow-xs flex items-center gap-2">
              <button
                onClick={() => setViewMode('user')}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'user'
                    ? 'bg-[#E25574] text-white shadow-xs'
                    : 'text-[#5A384D] hover:text-[#2D1222]'
                }`}
              >
                {t.partner.viewAsUserBtn}
              </button>

              <button
                onClick={() => setViewMode('partner')}
                className={`px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'partner'
                    ? 'bg-[#2D1222] text-white shadow-xs'
                    : 'text-[#5A384D] hover:text-[#2D1222]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.partner.viewAsPartnerBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. USER CONTROL VIEW */}
        {viewMode === 'user' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left Column: Invite & Pairing Controls */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#F8D7DF] shadow-md space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
                  01. Invite & Pair
                </span>
                <h3 className="font-display text-xl font-bold text-[#2D1222]">
                  {t.partner.inviteTitle}
                </h3>
                <p className="text-xs text-[#5A384D] leading-relaxed">
                  {t.partner.inviteDesc}
                </p>
              </div>

              {/* Pairing Code Card */}
              <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#F8D7DF] space-y-2.5">
                <span className="text-xs font-semibold text-[#8C657B]">
                  {t.partner.codeLabel}
                </span>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#2D1222] tracking-wider">
                    {partnerConfig.partnerCode}
                  </span>

                  <button
                    onClick={handleCopyCode}
                    className="px-3.5 py-1.5 rounded-xl bg-[#FCE7EC] hover:bg-[#F8D7DF] text-[#9B1D48] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? t.partner.copied : t.partner.copyCode}</span>
                  </button>
                </div>
              </div>

              {/* Share via WhatsApp Consent Button */}
              <button
                onClick={() =>
                  onOpenWhatsAppModal(
                    `${t.whatsapp.inviteText}${partnerConfig.partnerCode}\n\nJoin here: ${window.location.origin}`
                  )
                }
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#075E54] border border-[#25D366]/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{t.partner.shareViaWhatsApp}</span>
              </button>

              {/* Strict Privacy Commitment Box */}
              <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#F8D7DF] space-y-1.5 text-xs text-[#5A384D]">
                <div className="flex items-center gap-1.5 font-bold text-[#2D1222]">
                  <Lock className="w-4 h-4 text-[#10B981]" />
                  <span>{t.partner.lockedTitle}</span>
                </div>
                <p className="leading-relaxed text-[11px] text-[#8C657B]">
                  {t.partner.lockedDesc}
                </p>
              </div>

              {/* Disconnect Option */}
              {partnerConfig.isPaired && (
                <div className="pt-2 border-t border-[#F8D7DF]">
                  <button
                    onClick={handleDisconnect}
                    className="w-full py-2.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                  >
                    {t.partner.disconnectPartner}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Granular Sharing Permissions Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#F8D7DF] shadow-md space-y-6">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
                  02. Permission Dashboard
                </span>
                <h3 className="font-display text-xl font-bold text-[#2D1222]">
                  {t.partner.permissionsTitle}
                </h3>
                <p className="text-xs text-[#5A384D] leading-relaxed">
                  {t.partner.permissionsDesc}
                </p>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-4">
                
                {/* 1. Share General Cycle Phase */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF]">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[#2D1222] block">
                      {t.partner.sharePhase}
                    </label>
                    <p className="text-[11px] text-[#8C657B]">
                      Shows only the high-level phase name (e.g. &quot;Menstrual Phase&quot; or &quot;Luteal Phase&quot;) without raw biological dates.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={sharePhase}
                    onChange={(e) => setSharePhase(e.target.checked)}
                    className="w-5 h-5 text-[#E25574] rounded-md focus:ring-[#E25574] mt-0.5 cursor-pointer"
                  />
                </div>

                {/* 2. Share Practical Support Tips */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF]">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[#2D1222] block">
                      {t.partner.shareSupportTips}
                    </label>
                    <p className="text-[11px] text-[#8C657B]">
                      Provides suggestions on how your partner can support you today (e.g. warm tea, heating pad, quiet evening).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareSupportTips}
                    onChange={(e) => setShareSupportTips(e.target.checked)}
                    className="w-5 h-5 text-[#E25574] rounded-md focus:ring-[#E25574] mt-0.5 cursor-pointer"
                  />
                </div>

                {/* 3. Share Fertile Window (Educational Estimate) */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF]">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-[#2D1222] block">
                      {t.partner.shareFertileWindow}
                    </label>
                    <p className="text-[11px] text-[#8C657B]">
                      Shares educational estimated fertile window for family planning. Strictly labeled as a statistical estimate.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareFertileWindow}
                    onChange={(e) => setShareFertileWindow(e.target.checked)}
                    className="w-5 h-5 text-[#E25574] rounded-md focus:ring-[#E25574] mt-0.5 cursor-pointer"
                  />
                </div>

                {/* 4. Custom Support Preferences Note */}
                <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF] space-y-2">
                  <label className="text-xs font-bold text-[#2D1222] block">
                    {t.partner.customNoteLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder={t.partner.customNotePlaceholder}
                    className="w-full text-xs p-3 rounded-xl bg-white border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-md transition-all cursor-pointer"
                  >
                    {t.partner.savePermissions}
                  </button>

                  {savedSuccess && (
                    <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Preferences Saved!</span>
                    </div>
                  )}
                </div>

              </form>
            </div>

          </div>
        )}

        {/* 2. PARTNER'S LIMITED-ACCESS EXPERIENCE (Flo Partners Inspiration) */}
        {viewMode === 'partner' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            
            {/* Banner explaining limited view */}
            <div className="bg-[#2D1222] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#FCE7EC] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Flo Partners Style Educational View</span>
                </span>
                <button
                  onClick={() => setViewMode('user')}
                  className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition-colors"
                >
                  Exit Demo
                </button>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {t.partner.partnerGreeting}
              </h3>
              <p className="text-xs sm:text-sm text-[#F8D7DF] leading-relaxed max-w-2xl">
                You have been given access to general educational insights by your partner. Personal logs, flow, and medical details are strictly kept private.
              </p>
            </div>

            {/* Current Shared Rhythm Status */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D7DF] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C657B]">
                  {t.partner.partnerPhaseStatus}
                </span>

                {partnerConfig.permissions.sharePhase ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE7EC] text-[#9B1D48] border border-[#F8D7DF]">
                    {phaseInfo.status}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    {t.partner.phaseHiddenByPartner}
                  </span>
                )}
              </div>

              {partnerConfig.permissions.sharePhase ? (
                <div className="space-y-2 text-xs sm:text-sm text-[#5A384D] leading-relaxed">
                  <h4 className="font-bold text-base text-[#2D1222]">
                    {phaseInfo.name}
                  </h4>
                  <p>{phaseInfo.summary}</p>
                </div>
              ) : (
                <div className="text-xs text-[#8C657B] italic">
                  Your partner has chosen to keep their exact cycle phase private today. You can still explore the helpful guidance and quiz below!
                </div>
              )}

              {/* Custom Personal Note from User if set */}
              {partnerConfig.permissions.customSupportNotes && (
                <div className="bg-[#FFF8F9] p-4 rounded-2xl border border-[#F8D7DF] text-xs space-y-1">
                  <span className="font-semibold text-[#E25574] block">
                    💬 Note from your partner:
                  </span>
                  <p className="text-[#2D1222] italic">
                    &quot;{partnerConfig.permissions.customSupportNotes}&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Practical Support Suggestions */}
            {partnerConfig.permissions.shareSupportTips && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D7DF] shadow-md space-y-5">
                <div className="flex items-center gap-2 text-[#E25574]">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="font-display text-lg font-bold text-[#2D1222]">
                    {t.partner.todaySupportTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {phaseTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF] text-xs text-[#2D1222] flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Partner Cycle IQ Quiz */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#F8D7DF] shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
                <div className="flex items-center gap-2 text-[#E25574]">
                  <HelpCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#2D1222]">
                      {t.partner.quizTitle}
                    </h3>
                    <p className="text-xs text-[#8C657B]">{t.partner.quizDesc}</p>
                  </div>
                </div>

                {quizSubmitted && (
                  <div className="text-right">
                    <span className="text-xs text-[#8C657B] block">{t.partner.quizScoreLabel}</span>
                    <strong className="text-lg font-bold text-[#10B981]">
                      {calculateQuizScore()} / {PARTNER_QUIZ_ITEMS.length}
                    </strong>
                  </div>
                )}
              </div>

              {/* Questions */}
              <div className="space-y-5">
                {PARTNER_QUIZ_ITEMS.map((q, idx) => {
                  const qText = (t.partner as any)[q.questionKey] || '';
                  const expText = (t.partner as any)[q.explanationKey] || '';
                  const selected = quizAnswers[q.id];
                  const isCorrect = selected === q.correctOptionKey;

                  return (
                    <div key={q.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF] space-y-3 text-xs">
                      <div className="font-bold text-[#2D1222]">
                        Q{idx + 1}. {qText}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {q.options.map((opt) => {
                          const isOptionSelected = selected === opt.key;
                          let btnClass = 'bg-white text-[#5A384D] border-[#F8D7DF] hover:bg-[#FDF2F4]';

                          if (quizSubmitted) {
                            if (opt.key === q.correctOptionKey) {
                              btnClass = 'bg-[#ECFDF5] text-[#065F46] border-[#10B981] font-bold';
                            } else if (isOptionSelected) {
                              btnClass = 'bg-[#FFF1F2] text-[#9F1239] border-[#E11D48]';
                            }
                          } else if (isOptionSelected) {
                            btnClass = 'bg-[#E25574] text-white border-[#E25574] font-semibold';
                          }

                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleAnswerQuiz(q.id, opt.key)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${btnClass}`}
                            >
                              <span>
                                {opt.key}) {language === 'hi' ? opt.textHi : opt.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`p-3 rounded-xl text-[11px] leading-relaxed ${isCorrect ? 'bg-[#ECFDF5] text-[#065F46]' : 'bg-[#FFFBEB] text-[#92400E]'}`}>
                          <strong>{isCorrect ? '✓ Correct! ' : '💡 Fact: '}</strong>
                          {expText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz Submit & Reset */}
              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < PARTNER_QUIZ_ITEMS.length}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-[#E25574] hover:bg-[#D13C60] rounded-full shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Check Answers
                  </button>
                ) : (
                  <button
                    onClick={resetQuiz}
                    className="px-5 py-2 text-xs font-semibold text-[#5A384D] bg-[#FCE7EC] hover:bg-[#F8D7DF] rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.partner.quizRestart}</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
