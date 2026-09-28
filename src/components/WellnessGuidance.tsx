import React, { useState } from 'react';
import { CyclePhase, Language } from '../types/cycle';
import { translations } from '../i18n/translations';
import nutritionHero from '../assets/images/wellness_nutrition_routine_1790625177287.jpg';
import { Apple, Dumbbell, Sparkles, CupSoda, Heart } from 'lucide-react';

interface WellnessGuidanceProps {
  language: Language;
  currentPhase: CyclePhase;
}

export const WellnessGuidance: React.FC<WellnessGuidanceProps> = ({ language, currentPhase }) => {
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>(currentPhase);
  const t = translations[language];

  const phaseData = {
    menstrual: {
      title: language === 'hi' ? 'मासिक धर्म चरण (दिन १-५)' : 'Menstrual Phase (Days 1-5)',
      subtitle: language === 'hi' ? 'नवीनीकरण, विश्राम और आयरन की पूर्ति' : 'Renewal, rest, and iron replenishment',
      badgeColor: 'bg-[#FCE7EC] text-[#9B1D48] border-[#F48B9E]',
      foods: [
        language === 'hi' ? 'आयरन युक्त खाद्य पदार्थ: पालक, मेथी, चुकंदर, अनार' : 'Iron-rich foods: Spinach, beetroots, pomegranates, lentils',
        language === 'hi' ? 'स्वस्थ वसा: बादाम, अखरोट और तिल' : 'Healthy fats: Almonds, walnuts, and sesame seeds',
        language === 'hi' ? 'सुपाच्य गर्म सूप, दाल खिचड़ी और हल्दी युक्त पेय' : 'Warm comforting soups, dal khichdi, and golden turmeric milk',
      ],
      movement: [
        language === 'hi' ? 'हल्का रीस्टोरेटिव योग (बालासन, सुप्त बद्धकोणासन)' : 'Restorative gentle yoga (Child’s pose, Reclining bound angle)',
        language === 'hi' ? 'धीमी गति से टहलना (Pelvic relaxation walks)' : 'Slow mindful walks for pelvic circulation',
        language === 'hi' ? 'तीव्र कार्डियो या भारी वजन उठाने से परहेज करें' : 'Avoid intense cardio or strenuous lifting during heavy flow days',
      ],
      mindset: [
        language === 'hi' ? 'बिना अपराधबोध के विश्राम करें। शरीर को ठीक होने का समय दें।' : 'Release guilt around needing more sleep. Your body is doing profound work.',
        language === 'hi' ? 'आत्म-संवाद को कोमल रखें और सीमाओं का सम्मान करें।' : 'Practice boundary-setting and say no to draining social obligations.',
      ],
      herbal: [
        language === 'hi' ? 'अदरक और कैमोमाइल चाय ऐंठन को स्वाभाविक रूप से शांत करती है।' : 'Fresh ginger and chamomile infusion to soothe prostaglandin contractions.',
        language === 'hi' ? 'गुनगुना पानी पिएं और गर्म पानी की थैली से सिकाई करें।' : 'Sip warm water and use a hot water bottle over the lower pelvic area.',
      ],
    },
    follicular: {
      title: language === 'hi' ? 'फॉलिक्युलर चरण (दिन ६-१२)' : 'Follicular Phase (Days 6-12)',
      subtitle: language === 'hi' ? 'ऊर्जा का उदय, ताजगी और रचनात्मकता' : 'Rising estrogen, mental clarity, and renewal',
      badgeColor: 'bg-[#FFF0F3] text-[#E25574] border-[#F8D7DF]',
      foods: [
        language === 'hi' ? 'अंकुरित अनाज, किण्वित (fermented) खाद्य व ताजा सलाद' : 'Sprouted pulses, probiotic kimchi/curd, and crisp colorful salads',
        language === 'hi' ? 'बीज चक्र (Seed cycling): कद्दू (Pumpkin) और अलसी (Flax) के बीज' : 'Seed cycling: 1 tbsp organic raw pumpkin and ground flax seeds',
        language === 'hi' ? 'हल्के प्रोटीन: पनीर, टोफू, दालें और मौसमी खट्टे फल' : 'Light proteins: Paneer, tofu, chickpeas, and fresh citrus fruits',
      ],
      movement: [
        language === 'hi' ? 'मध्यम कार्डियो, जुम्बा, तैराकी और शक्ति प्रशिक्षण' : 'Moderate cardio, brisk jogging, swimming, and resistance strength training',
        language === 'hi' ? 'नई शारीरिक गतिविधियों को आजमाने का सबसे अनुकूल समय' : 'Ideal phase to try new athletic routines and challenging dance workouts',
        language === 'hi' ? 'सूर्य नमस्कार और गतिज स्ट्रेचिंग' : 'Dynamic Surya Namaskar flows and energetic mobility flows',
      ],
      mindset: [
        language === 'hi' ? 'नए प्रोजेक्ट्स की योजना बनाएं, विचार-मंथन करें।' : 'Channel your fresh mental focus into brainstorming and strategic planning.',
        language === 'hi' ? 'स्वाभाविक रूप से बढ़ा हुआ आत्मविश्वास महसूस करें।' : 'Capitalize on social energy and collaborate on inspiring creative ideas.',
      ],
      herbal: [
        language === 'hi' ? 'पुदीना (Peppermint) चाय और नींबू-खीरा डिटॉक्स पानी' : 'Peppermint tea and cucumber-infused water for refreshing cellular hydration.',
      ],
    },
    ovulation: {
      title: language === 'hi' ? 'ओव्यूलेशन व उर्वर चरण (दिन १३-१६)' : 'Ovulatory & Fertile Phase (Days 13-16)',
      subtitle: language === 'hi' ? 'चरम जीवन शक्ति, आकर्षण और सामाजिक ऊर्जा' : 'Peak vitality, confidence, and metabolic radiance',
      badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]',
      foods: [
        language === 'hi' ? 'एंटीऑक्सीडेंट युक्त जामुन, स्ट्रॉबेरी और आंवला' : 'Deep berries, Indian gooseberry (Amla), and antioxidant-rich greens',
        language === 'hi' ? 'फाइबर युक्त हरी सब्जियां जो अतिरिक्त एस्ट्रोजन के निष्कासन में मदद करें' : 'Cruciferous broccoli, cabbage, and asparagus to support liver estrogen clearance',
        language === 'hi' ? 'भरपूर पानी और इलेक्ट्रोलाइट्स' : 'High hydration with coconut water and electrolyte balance',
      ],
      movement: [
        language === 'hi' ? 'उच्च तीव्रता वाला व्यायाम (HIIT) और सर्किट ट्रेनिंग' : 'High-intensity interval training (HIIT), sprint intervals, and heavy lifting',
        language === 'hi' ? 'सहनशक्ति और शारीरिक शक्ति अपने चरम पर होती है' : 'Peak cardiovascular stamina and optimal muscular recovery window',
      ],
      mindset: [
        language === 'hi' ? 'महत्वपूर्ण बातचीत, साक्षात्कार और सामाजिक मेलजोल का उत्तम समय।' : 'Ideal moment for important presentations, negotiations, and joyful dates.',
      ],
      herbal: [
        language === 'hi' ? 'गुलाब की पंखुड़ियों की हर्बल चाय और नारियल पानी' : 'Gentle rose petal infusion and chilled tender coconut water.',
      ],
    },
    luteal: {
      title: language === 'hi' ? 'ल्यूटियल चरण (दिन १७-२८)' : 'Luteal Phase (Days 17-28)',
      subtitle: language === 'hi' ? 'पीएमएस से बचाव, आंतरिक शांति और संतुलन' : 'Progesterone rise, metabolic grounding, and PMS easing',
      badgeColor: 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]',
      foods: [
        language === 'hi' ? 'मैग्नीशियम युक्त कद्दू के बीज, डार्क चॉकलेट (७०%+) और केला' : 'Magnesium powerhouses: Dark chocolate (70%+), bananas, and pumpkin seeds',
        language === 'hi' ? 'शकरकंद, गाजर और जटिल कार्बोहाइड्रेट जो मूड को स्थिर रखें' : 'Roasted sweet potatoes, carrots, and complex grains to stabilize serotonin',
        language === 'hi' ? 'बीज चक्र: सूरजमुखी और तिल के बीज' : 'Seed cycling: 1 tbsp sunflower and sesame seeds daily',
      ],
      movement: [
        language === 'hi' ? 'धीमा पिलेट्स, पिलेट्स और शांत शाम की सैर' : 'Low-impact mat Pilates, barre, and calming evening neighborhood walks',
        language === 'hi' ? 'अत्यधिक पसीना बहाने वाले व्यायाम से बचें यदि थकान महसूस हो' : 'Shift away from exhausting HIIT if fatigue or breast tenderness surfaces',
      ],
      mindset: [
        language === 'hi' ? 'अपनी ऊर्जा को संचित करें। स्क्रीन टाइम कम करें।' : 'Protect your peace, wind down early, and minimize late-night screen light.',
        language === 'hi' ? 'भावनाओं को बिना निर्णय के स्वीकार करें।' : 'Notice emotional tenderness with curiosity instead of self-criticism.',
      ],
      herbal: [
        language === 'hi' ? 'रास्पबेरी लीफ टी और दालचीनी की चाय जो गर्भाशय को शांत रखे।' : 'Raspberry leaf tea and warm cinnamon infusion to temper PMS bloating.',
      ],
    },
  };

  const activeData = phaseData[selectedPhase];

  return (
    <section id="wellness" className="py-20 bg-[#FFF8F9] border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {t.nav.wellness}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.wellness.title}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.wellness.subtitle}
          </p>
        </div>

        {/* Phase Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {(['menstrual', 'follicular', 'ovulation', 'luteal'] as CyclePhase[]).map((phaseKey) => {
            const isSelected = selectedPhase === phaseKey;
            const phaseLabel = t.phases[phaseKey].name;

            return (
              <button
                key={phaseKey}
                onClick={() => setSelectedPhase(phaseKey)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#E25574] text-white shadow-md shadow-[#E25574]/20 scale-105'
                    : 'bg-white text-[#5A384D] border border-[#F8D7DF] hover:bg-[#FCE7EC]'
                }`}
              >
                {phaseLabel}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Still life image */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl border border-[#F8D7DF]">
              <img
                src={nutritionHero}
                alt="Nourishing foods and herbal tea arranged thoughtfully for menstrual hormone wellness"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1222]/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white space-y-1">
                  <span className="text-xs uppercase font-semibold text-[#FCE7EC]">
                    {language === 'hi' ? 'हार्मोनल संतुलन' : 'Hormone Nutrition'}
                  </span>
                  <h4 className="text-lg font-bold font-display">
                    {activeData.title}
                  </h4>
                  <p className="text-xs text-[#F8D7DF]">
                    {activeData.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Wellness Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Nourishing Foods */}
            <div className="bg-white p-5 rounded-3xl border border-[#F8D7DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#E25574]">
                <Apple className="w-5 h-5" />
                <h4 className="font-display font-bold text-sm text-[#2D1222]">
                  {t.wellness.foodsToEnjoy}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-[#5A384D]">
                {activeData.foods.map((food, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#E25574] font-bold">·</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Movement & Exercise */}
            <div className="bg-white p-5 rounded-3xl border border-[#F8D7DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#0284C7]">
                <Dumbbell className="w-5 h-5" />
                <h4 className="font-display font-bold text-sm text-[#2D1222]">
                  {t.wellness.movementStyle}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-[#5A384D]">
                {activeData.movement.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#0284C7] font-bold">·</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Mindset & Emotional Care */}
            <div className="bg-white p-5 rounded-3xl border border-[#F8D7DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#8B5CF6]">
                <Sparkles className="w-5 h-5" />
                <h4 className="font-display font-bold text-sm text-[#2D1222]">
                  {t.wellness.mindsetTip}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-[#5A384D]">
                {activeData.mindset.map((mind, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] font-bold">·</span>
                    <span>{mind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Herbal & Hydration */}
            <div className="bg-white p-5 rounded-3xl border border-[#F8D7DF] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#10B981]">
                <CupSoda className="w-5 h-5" />
                <h4 className="font-display font-bold text-sm text-[#2D1222]">
                  {t.wellness.herbalSupport}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-[#5A384D]">
                {activeData.herbal.map((herb, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#10B981] font-bold">·</span>
                    <span>{herb}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
