import React, { useState } from 'react';
import { Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import {
  Activity,
  Heart,
  LineChart,
  Apple,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import trackingImage from '../assets/images/product_cycle_tracking_1790625165870.jpg';
import nutritionImage from '../assets/images/wellness_nutrition_routine_1790625177287.jpg';

interface ProductTourProps {
  language: Language;
  onNavigateTo: (sectionId: string) => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({ language, onNavigateTo }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const t = translations[language];

  const steps = [
    {
      id: 'step-1',
      targetSection: 'tracker',
      title: t.tour.step1Title,
      description: t.tour.step1Desc,
      icon: Activity,
      tag: 'Phase Ring',
      features: [
        'Real-time 4-phase biological mapping',
        'Transparent estimate notices (non-medical)',
        'Customizable cycle & period length',
      ],
      featuresHi: [
        '४ शारीरिक चरणों का लाइव मैपिंग',
        'स्पष्ट अनुमान सूचनाएं (गैर-चिकित्सीय)',
        'अनुकूलन योग्य चक्र और पीरियड अवधि',
      ],
      previewType: 'dial',
    },
    {
      id: 'step-2',
      targetSection: 'log',
      title: t.tour.step2Title,
      description: t.tour.step2Desc,
      icon: Heart,
      tag: 'Daily Logger',
      features: [
        'Flow intensity from spotting to heavy',
        'Physical symptoms: cramps, headaches, bloating',
        'Water hydration and sleep hour tracking',
      ],
      featuresHi: [
        'हल्के धब्बों से लेकर भारी स्राव तक रिकॉर्ड',
        'शारीरिक लक्षण: ऐंठन, सिरदर्द, सूजन',
        'जल सेवन और नींद के घंटों का हिसाब',
      ],
      previewType: 'image-tracking',
    },
    {
      id: 'step-3',
      targetSection: 'insights',
      title: t.tour.step3Title,
      description: t.tour.step3Desc,
      icon: LineChart,
      tag: 'Pattern Insights',
      features: [
        'Cycle regularity analysis across months',
        'Most frequent symptom occurrences',
        'Proactive PMS preparation window',
      ],
      featuresHi: [
        'महीनों भर में चक्र नियमितता का विश्लेषण',
        'बार-बार उभरने वाले लक्षणों की पहचान',
        'पीएमएस (PMS) से पहले तैयारी का सुझाव',
      ],
      previewType: 'insights',
    },
    {
      id: 'step-4',
      targetSection: 'wellness',
      title: t.tour.step4Title,
      description: t.tour.step4Desc,
      icon: Apple,
      tag: 'Hormone Sync',
      features: [
        'Iron-rich nourishment for menstrual days',
        'Magnesium & grounding food for luteal phase',
        'Phase-appropriate movement: yin yoga vs. cardio',
      ],
      featuresHi: [
        'पीरियड्स के दिनों में आयरन युक्त आहार',
        'ल्यूटियल चरण में मैग्नीशियम व सुपाच्य भोजन',
        'चरण-अनुकूल योग व व्यायाम दिनचर्या',
      ],
      previewType: 'image-nutrition',
    },
    {
      id: 'step-5',
      targetSection: 'sakhi-ai',
      title: t.tour.step5Title,
      description: t.tour.step5Desc,
      icon: Sparkles,
      tag: 'Sakhi AI',
      features: [
        'Empathetic, compassionate wellness conversations',
        'Grounded in clinical science & non-judgmental',
        'Clear medical disclaimers & gynaecologist referral',
      ],
      featuresHi: [
        'संवेदनशील और आत्मीय स्वास्थ्य संवाद',
        'महिला स्वास्थ्य विज्ञान पर आधारित मार्गदर्शन',
        'स्पष्ट चिकित्सीय अस्वीकरण व डॉक्टर परामर्श सुझाव',
      ],
      previewType: 'ai',
    },
    {
      id: 'step-6',
      targetSection: 'privacy',
      title: t.tour.step6Title,
      description: t.tour.step6Desc,
      icon: Lock,
      tag: 'Local Privacy',
      features: [
        'Saved exclusively on your device local storage',
        'Zero tracking, zero analytics profiling, no ads',
        'One-click full JSON export or complete data erase',
      ],
      featuresHi: [
        'केवल आपके फोन/कंप्यूटर के ब्राउज़र में सुरक्षित',
        'कोई ट्रैकर नहीं, कोई विज्ञापन नहीं, कोई डेटा बिक्री नहीं',
        'एक क्लिक में डेटा डाउनलोड या पूर्ण विलोपन',
      ],
      previewType: 'privacy',
    },
  ];

  return (
    <section id="tour" className="py-20 bg-gradient-to-b from-[#FFF8F9] via-white to-[#FFF8F9] border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.tour.eyebrow}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight text-balance">
            {t.tour.heading}
          </h2>
          <p className="text-base sm:text-lg text-[#5A384D] leading-relaxed">
            {t.tour.subheading}
          </p>
        </div>

        {/* Product Tour Step Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-10 no-scrollbar justify-start sm:justify-center border-b border-[#FCE7EC]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E25574] text-white shadow-md shadow-[#E25574]/20 scale-[1.02]'
                    : 'bg-[#FDF2F4] text-[#5A384D] hover:bg-[#FCE7EC] hover:text-[#2D1222]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E25574]'}`} />
                <span>
                  0{idx + 1}. {step.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tour Step Feature Card (Storytelling Spotlight) */}
        {(() => {
          const cur = steps[activeStep];
          const Icon = cur.icon;
          const currentFeatures = language === 'hi' ? cur.featuresHi : cur.features;

          return (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F8D7DF] shadow-xl shadow-[#FCE7EC]/50 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all duration-300">
              
              {/* Left Column: Text & Features Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FCE7EC] flex items-center justify-center text-[#E25574]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#8C657B] uppercase tracking-wider">
                      Tour Step 0{activeStep + 1} of 06
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2D1222] tracking-tight">
                      {cur.title}
                    </h3>
                  </div>
                </div>

                <p className="text-base text-[#5A384D] leading-relaxed">
                  {cur.description}
                </p>

                {/* Key Benefits List */}
                <div className="space-y-3 pt-2">
                  {currentFeatures.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-sm text-[#2D1222]">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Link to the Feature Component */}
                <div className="pt-4 flex items-center gap-4">
                  <button
                    onClick={() => onNavigateTo(cur.targetSection)}
                    className="px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{t.tour.jumpToStep}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="text-xs sm:text-sm font-medium text-[#8C657B] hover:text-[#2D1222] transition-colors cursor-pointer"
                  >
                    {language === 'hi' ? 'अगला कदम देखें →' : 'Next tour step →'}
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Preview Card */}
              <div className="lg:col-span-6 bg-[#FFF8F9] rounded-2xl p-4 sm:p-6 border border-[#F8D7DF]">
                {cur.previewType === 'image-tracking' ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-md">
                    <img
                      src={trackingImage}
                      alt="Pastel pink cycle tracking journal with rose petals and herbal tea"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#F8D7DF] text-xs text-[#2D1222] flex items-center justify-between">
                      <span className="font-semibold">Quick Body Check-in</span>
                      <span className="text-[#E25574] font-medium">Logged · Day 14</span>
                    </div>
                  </div>
                ) : cur.previewType === 'image-nutrition' ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-md">
                    <img
                      src={nutritionImage}
                      alt="Nourishing foods for menstrual wellness with fresh berries and herbal tea"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-[#F8D7DF] text-xs text-[#2D1222] flex items-center justify-between">
                      <span className="font-semibold">Phase-Synced Nutrition</span>
                      <span className="text-[#10B981] font-medium">Antioxidants & Hydration</span>
                    </div>
                  </div>
                ) : cur.previewType === 'dial' ? (
                  <div className="bg-white p-6 rounded-2xl border border-[#F8D7DF] space-y-4 text-center">
                    <div className="w-36 h-36 mx-auto rounded-full border-8 border-[#FCE7EC] border-t-[#E25574] border-r-[#FB7185] flex flex-col items-center justify-center">
                      <span className="text-xs uppercase tracking-wider text-[#8C657B]">Cycle Day</span>
                      <span className="text-3xl font-bold font-display text-[#2D1222]">14</span>
                      <span className="text-[10px] text-[#E25574] font-semibold">Fertile Window</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-left text-xs">
                      <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF]">
                        <span className="text-[#8C657B] block text-[11px]">Period Length</span>
                        <span className="font-bold text-[#2D1222]">5 Days</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF]">
                        <span className="text-[#8C657B] block text-[11px]">Cycle Length</span>
                        <span className="font-bold text-[#2D1222]">28 Days</span>
                      </div>
                    </div>
                  </div>
                ) : cur.previewType === 'insights' ? (
                  <div className="bg-white p-6 rounded-2xl border border-[#F8D7DF] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-2">
                      <span className="text-xs font-semibold text-[#2D1222]">Cycle Regularity</span>
                      <span className="text-xs font-bold text-[#10B981]">94% Consistent</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-[#8C657B]">Monthly Phase Distribution</div>
                      <div className="h-4 w-full bg-[#FCE7EC] rounded-full flex overflow-hidden">
                        <div className="bg-[#E25574] w-[18%]" title="Menstrual" />
                        <div className="bg-[#F8A5B5] w-[25%]" title="Follicular" />
                        <div className="bg-[#F59E0B] w-[15%]" title="Ovulation" />
                        <div className="bg-[#8B5CF6] w-[42%]" title="Luteal" />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#8C657B]">
                        <span>Menstrual (5d)</span>
                        <span>Ovulation (4d)</span>
                        <span>Luteal (12d)</span>
                      </div>
                    </div>
                  </div>
                ) : cur.previewType === 'ai' ? (
                  <div className="bg-white p-5 rounded-2xl border border-[#F8D7DF] space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#FCE7EC] pb-2.5">
                      <Sparkles className="w-4 h-4 text-[#E25574]" />
                      <span className="text-xs font-bold text-[#2D1222]">Sakhi AI Health Companion</span>
                    </div>
                    <div className="bg-[#FFF8F9] p-3 rounded-xl border border-[#F8D7DF] text-xs text-[#5A384D] space-y-1">
                      <p className="font-semibold text-[#2D1222]">“How can I naturally ease cramps today?”</p>
                      <p className="leading-relaxed">
                        Heat therapy on the lower pelvis, warm chamomile tea, and gentle child’s pose relieve prostaglandins. Remember, dates are estimates.
                      </p>
                    </div>
                    <div className="text-[10px] text-[#8C657B] italic">
                      ✓ Backed by General Health Science · Strict Gynaecologist Referral Advice
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-[#F8D7DF] space-y-4 text-center">
                    <div className="w-14 h-14 mx-auto rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981]">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h4 className="font-display font-bold text-base text-[#2D1222]">
                      Your Health Stays In Your Hands
                    </h4>
                    <p className="text-xs text-[#5A384D]">
                      Stored strictly inside your device’s LocalStorage. No third-party data tracking or profiling ever.
                    </p>
                  </div>
                )}
              </div>

            </div>
          );
        })()}

      </div>
    </section>
  );
};
