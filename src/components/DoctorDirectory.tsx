import React, { useState } from 'react';
import { Language, DoctorSpecialist } from '../types/cycle';
import { VERIFIED_DOCTORS } from '../utils/cycleCalculations';
import { translations } from '../i18n/translations';
import { Stethoscope, CheckCircle, MapPin, Video, Building, Calendar, Info, PhoneCall } from 'lucide-react';

interface DoctorDirectoryProps {
  language: Language;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ language }) => {
  const t = translations[language];

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorSpecialist | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredDoctors = VERIFIED_DOCTORS.filter((doc) => {
    const matchesSpecialty = selectedSpecialty === 'all' || doc.specialtyKey === selectedSpecialty;
    const matchesMode =
      selectedMode === 'all' ||
      doc.consultationTypeKey === 'allModes' ||
      doc.consultationTypeKey === selectedMode;
    return matchesSpecialty && matchesMode;
  });

  const getSpecialtyName = (key: string) => {
    return (t.doctors as any)[key] || key;
  };

  const handleBook = (doc: DoctorSpecialist) => {
    setSelectedDoctorForBooking(doc);
    setBookingSuccess(false);
  };

  const confirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDoctorForBooking(null);
    }, 2000);
  };

  return (
    <section id="doctors" className="py-20 bg-white border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {language === 'hi' ? 'विशेषज्ञ परामर्श' : 'Verified Medical Directory'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.doctors.title}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.doctors.subtitle}
          </p>
        </div>

        {/* Ethical Statement Banner */}
        <div className="max-w-4xl mx-auto mb-10 bg-[#FFF8F9] border border-[#F8D7DF] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#5A384D]">
          <Info className="w-5 h-5 text-[#E25574] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.doctors.directoryNotice}
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="max-w-4xl mx-auto mb-10 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF]">
          
          {/* Specialty Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#2D1222] whitespace-nowrap">{t.doctors.filterSpecialty}</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
            >
              <option value="all">{t.doctors.filterAll}</option>
              <option value="pcos">{t.doctors.pcos}</option>
              <option value="endometriosis">{t.doctors.endometriosis}</option>
              <option value="adolescent">{t.doctors.adolescent}</option>
              <option value="fertility">{t.doctors.fertility}</option>
              <option value="general">{t.doctors.general}</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#2D1222] whitespace-nowrap">{t.doctors.filterConsult}</span>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
            >
              <option value="all">{t.doctors.allModes}</option>
              <option value="inPerson">{t.doctors.inPerson}</option>
              <option value="teleconsult">{t.doctors.teleconsult}</option>
            </select>
          </div>

          <div className="text-xs text-[#8C657B]">
            Showing <strong className="text-[#2D1222]">{filteredDoctors.length}</strong> verified clinics
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#FFF8F9] rounded-3xl p-6 border border-[#F8D7DF] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Doctor Name & Verification Marker */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#2D1222]">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-[#8C657B]">{doc.qualification}</p>
                  </div>
                  <span className="p-1.5 rounded-full bg-[#ECFDF5] text-[#10B981]" title={t.doctors.verifiedSpecialist}>
                    <CheckCircle className="w-4 h-4" />
                  </span>
                </div>

                {/* Specialty Tag */}
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE7EC] text-[#9B1D48] border border-[#F8D7DF]">
                  {getSpecialtyName(doc.specialtyKey)}
                </div>

                {/* Clinic & Location Details */}
                <div className="space-y-1.5 text-xs text-[#5A384D] pt-1">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-[#E25574] shrink-0" />
                    <span className="font-medium text-[#2D1222]">{doc.clinic}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8C657B] shrink-0" />
                    <span>{doc.city}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-3.5 h-3.5 text-[#8C657B] shrink-0" />
                    <span>{doc.experienceYears} {t.doctors.experience}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#8C657B]">Languages:</span>
                    <span>{doc.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-[#F8D7DF]">
                <button
                  onClick={() => handleBook(doc)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.doctors.bookAppointment}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Appointment Scheduling Modal */}
        {selectedDoctorForBooking && (
          <div className="fixed inset-0 z-50 bg-[#2D1222]/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#F8D7DF] shadow-2xl space-y-5 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-3">
                <h3 className="font-display text-lg font-bold text-[#2D1222]">
                  {t.doctors.bookAppointment}
                </h3>
                <button
                  onClick={() => setSelectedDoctorForBooking(null)}
                  className="text-xs text-[#8C657B] hover:text-[#2D1222]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-sm text-[#2D1222]">{selectedDoctorForBooking.name}</p>
                <p className="text-[#5A384D]">{selectedDoctorForBooking.clinic} · {selectedDoctorForBooking.city}</p>
              </div>

              <form onSubmit={confirmBooking} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-[#5A384D] block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5A384D] block mb-1">Phone Number or Email</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 or email@domain.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5A384D] block mb-1">Preferred Consultation Type</label>
                  <select className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]">
                    <option value="in-clinic">{t.doctors.inPerson}</option>
                    <option value="video">{t.doctors.teleconsult}</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-md transition-all cursor-pointer"
                  >
                    {bookingSuccess ? 'Appointment Request Sent!' : 'Confirm Consultation Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
