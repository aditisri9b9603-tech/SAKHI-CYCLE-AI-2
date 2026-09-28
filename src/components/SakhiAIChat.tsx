import React, { useState, useRef, useEffect } from 'react';
import { CalculatedCycleState } from '../utils/cycleCalculations';
import { Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import { Sparkles, Send, Bot, User, AlertCircle, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'sakhi';
  text: string;
  timestamp: string;
}

interface SakhiAIChatProps {
  language: Language;
  cycleState: CalculatedCycleState;
}

export const SakhiAIChat: React.FC<SakhiAIChatProps> = ({ language, cycleState }) => {
  const t = translations[language];

  const defaultMessages: ChatMessage[] = [
    {
      id: 'welcome',
      sender: 'sakhi',
      text:
        language === 'hi'
          ? `नमस्ते! मैं सखी हूँ — आपकी सचेत चक्र एवं कल्याण साथी। आज आपका चक्र दिन ${cycleState.currentCycleDay} (${t.phases[cycleState.currentPhase].status}) है। आप मुझसे पीरियड्स के दर्द, पोषण, मूड या हार्मोनल बदलावों के बारे में बेझिझक कुछ भी पूछ सकती हैं।`
          : `Hello! I am Sakhi, your thoughtful menstrual wellness companion. Today you are on Cycle Day ${cycleState.currentCycleDay} (${t.phases[cycleState.currentPhase].status}). Feel free to ask me anything about cramp relief, hormone-synced foods, moods, or understanding your rhythm.`,
      timestamp: 'Just now',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputText('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          language,
          cycleContext: {
            currentCycleDay: cycleState.currentCycleDay,
            currentPhase: cycleState.currentPhase,
            daysUntilNextPeriod: cycleState.daysUntilNextPeriod,
          },
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        (language === 'hi'
          ? 'सखी आपकी सहायता के लिए तैयार है। कृपया अपने स्वास्थ्य का ध्यान रखें और पर्याप्त विश्राम करें।'
          : 'Sakhi is here to support you. Please ensure you stay well-rested and hydrated.');

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'sakhi',
        text: replyText,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Sakhi AI error:', err);
      const fallbackMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'sakhi',
        text:
          language === 'hi'
            ? 'गर्म पानी की सिकाई और कैमोमाइल चाय ऐंठन को कम करने में सहायक है। असामान्य दर्द होने पर स्त्री रोग विशेषज्ञ से मिलें।'
            : 'Warm compresses, magnesium, and gentle movement often soothe cycle discomfort. Please consult a gynaecologist for persistent or unusual pain.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    t.sakhiAi.q1,
    t.sakhiAi.q2,
    t.sakhiAi.q3,
    t.sakhiAi.q4,
  ];

  return (
    <section id="sakhi-ai" className="py-20 bg-white border-b border-[#FCE7EC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.nav.sakhiAi}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight flex items-center justify-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#E25574]" />
            <span>{t.sakhiAi.title}</span>
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.sakhiAi.subtitle}
          </p>
        </div>

        {/* Chat Card Container */}
        <div className="bg-[#FFF8F9] rounded-3xl border border-[#F8D7DF] shadow-xl shadow-[#FCE7EC]/50 overflow-hidden flex flex-col h-[600px]">
          
          {/* Chat Top Banner with Trust Badges */}
          <div className="bg-white px-6 py-3.5 border-b border-[#F8D7DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FCE7EC] flex items-center justify-center text-[#E25574]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#2D1222] block">
                  Sakhi AI Companion
                </span>
                <span className="text-[10px] text-[#10B981] font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Active · Gentle Health Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#8C657B]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="hidden sm:inline">100% Confidential</span>
            </div>
          </div>

          {/* Medical Safety Disclaimer Strip */}
          <div className="bg-[#FFF1F2] px-4 py-2 border-b border-[#FECDD3] text-[11px] text-[#9F1239] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#E11D48] shrink-0" />
            <p className="line-clamp-1 sm:line-clamp-none">
              {t.sakhiAi.safetyNotice}
            </p>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#FCE7EC] flex items-center justify-center text-[#E25574] shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#E25574] text-white rounded-tr-none'
                        : 'bg-white text-[#2D1222] rounded-tl-none border border-[#F8D7DF] shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-[#2D1222] flex items-center justify-center text-white shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FCE7EC] flex items-center justify-center text-[#E25574] shrink-0 mt-1 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-[#F8D7DF] text-xs text-[#8C657B] italic">
                  {t.sakhiAi.thinking}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Queries Chips */}
          <div className="px-4 py-2 bg-white/70 border-t border-[#F8D7DF] flex overflow-x-auto gap-2 no-scrollbar">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="px-3 py-1.5 rounded-full text-xs bg-[#FFF8F9] hover:bg-[#FCE7EC] text-[#5A384D] border border-[#F8D7DF] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#F8D7DF] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.sakhiAi.placeholder}
              disabled={loading}
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-full bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="w-10 h-10 rounded-full bg-[#E25574] hover:bg-[#D13C60] text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shrink-0"
              aria-label={t.sakhiAi.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </section>
  );
};
