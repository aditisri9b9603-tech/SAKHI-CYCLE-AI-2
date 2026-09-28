import React from 'react';
import { Language } from '../types/cycle';
import { PERIOD_PRODUCTS } from '../utils/cycleCalculations';
import { translations } from '../i18n/translations';
import { ShieldCheck, Droplet, Clock, Leaf, Check, AlertCircle } from 'lucide-react';

interface PeriodProductGuideProps {
  language: Language;
}

export const PeriodProductGuide: React.FC<PeriodProductGuideProps> = ({ language }) => {
  const t = translations[language];

  return (
    <section id="care" className="py-20 bg-[#FFF8F9] border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {language === 'hi' ? 'स्वच्छता व उत्पाद' : 'Hygiene & Product Guide'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.products.title}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.products.subtitle}
          </p>
        </div>

        {/* Product Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERIOD_PRODUCTS.map((prod) => {
            const name = (t.products as any)[prod.nameKey] || prod.nameKey;
            const category = (t.products as any)[prod.categoryKey] || prod.categoryKey;
            const pros = (t.products as any)[prod.prosKeys[0]] || '';
            const cons = (t.products as any)[prod.consKeys[0]] || '';
            const bestFor = (t.products as any)[prod.bestForKey] || '';

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl p-6 border border-[#F8D7DF] shadow-md shadow-[#FCE7EC]/30 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="space-y-4">
                  {/* Category & Name */}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
                      {category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#2D1222] mt-1">
                      {name}
                    </h3>
                  </div>

                  {/* Quantitative Specs */}
                  <div className="space-y-2 bg-[#FFF8F9] p-3 rounded-2xl border border-[#F8D7DF] text-xs text-[#5A384D]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#8C657B]">
                        <Droplet className="w-3.5 h-3.5 text-[#E25574]" />
                        <span>{t.products.capacity}:</span>
                      </span>
                      <strong className="text-[#2D1222]">{prod.absorbencyMl}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#8C657B]">
                        <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>{t.products.wearTime}:</span>
                      </span>
                      <strong className="text-[#2D1222]">{prod.wearTimeHours}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[#8C657B]">
                        <Leaf className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{t.products.ecoRating}:</span>
                      </span>
                      <strong className="text-[#10B981]">{prod.ecoScore.split(' ')[0]}</strong>
                    </div>
                  </div>

                  {/* Pros & Considerations */}
                  <div className="space-y-2.5 text-xs text-[#5A384D]">
                    <div>
                      <span className="font-bold text-[#10B981] block mb-0.5">
                        ✓ {t.products.pros}:
                      </span>
                      <p className="leading-relaxed">{pros}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#8C657B] block mb-0.5">
                        ⚠️ {t.products.cons}:
                      </span>
                      <p className="leading-relaxed">{cons}</p>
                    </div>
                  </div>
                </div>

                {/* Best For Footer */}
                <div className="pt-4 mt-4 border-t border-[#FCE7EC] text-xs">
                  <span className="font-semibold text-[#2D1222] block mb-0.5">
                    {t.products.bestFor}:
                  </span>
                  <p className="text-[#8C657B]">{bestFor}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
