import React, { useState } from 'react';
import { Language, DoctorSpecialist, AppointmentRequest } from '../types/cycle';
import { VERIFIED_DOCTORS } from '../utils/cycleCalculations';
import { translations } from '../i18n/translations';
import {
  Stethoscope,
  CheckCircle,
  MapPin,
  Building,
  Calendar,
  Info,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface DoctorDirectoryProps {
  language: Language;
  appointmentRequests: AppointmentRequest[];
  onAddAppointment: (req: AppointmentRequest) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  language,
  appointmentRequests,
  onAddAppointment,
}) => {
  const t = translations[language];

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<DoctorSpecialist | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    return nextWeek.toISOString().split('T')[0];
  });
  const [consultType, setConsultType] = useState<'in-clinic' | 'teleconsult'>('in-clinic');
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
    if (!selectedDoctorForBooking || !patientName.trim()) return;

    const newReq: AppointmentRequest = {
      id: `apt-${Date.now()}`,
      doctorId: selectedDoctorForBooking.id,
      doctorName: selectedDoctorForBooking.name,
      clinic: selectedDoctorForBooking.clinic,
      patientName: patientName.trim(),
      patientContact: patientContact.trim(),
      preferredDate,
      consultationType: consultType,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onAddAppointment(newReq);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDoctorForBooking(null);
      setPatientName('');
      setPatientContact('');
    }, 1500);
  };

  return (
    <section id="care" className="py-20 bg-white border-b border-[#FCE7EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E25574]">
            {language === 'hi' ? 'विशेषज्ञ परामर्श' : 'Verified Clinical Directory'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D1222] tracking-tight">
            {t.doctors.title}
          </h2>
          <p className="text-base text-[#5A384D]">
            {t.doctors.subtitle}
          </p>
        </div>

        {/* Ethical Statement Banner */}
        <div className="max-w-4xl mx-auto bg-[#FFF8F9] border border-[#F8D7DF] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#5A384D]">
          <Info className="w-5 h-5 text-[#E25574] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.doctors.directoryNotice}
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FFF8F9] border border-[#F8D7DF]">
          
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
            Showing <strong className="text-[#2D1222]">{filteredDoctors.length}</strong> verified clinical facilities
          </div>
        </div>

        {/* Active Appointments Tracker if any exist */}
        {appointmentRequests.length > 0 && (
          <div className="max-w-4xl mx-auto bg-[#FFF8F9] rounded-3xl p-5 border border-[#F8D7DF] space-y-3">
            <div className="flex items-center justify-between border-b border-[#FCE7EC] pb-2">
              <span className="text-xs font-bold text-[#2D1222] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E25574]" />
                <span>Your Active Appointment Requests</span>
              </span>
              <span className="text-xs font-semibold text-[#8C657B]">
                {appointmentRequests.length} pending
              </span>
            </div>

            <div className="space-y-2">
              {appointmentRequests.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white p-3 rounded-2xl border border-[#F8D7DF] text-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-[#2D1222]">{apt.doctorName}</span>
                    <span className="text-[#8C657B] ml-2">({apt.clinic})</span>
                    <div className="text-[11px] text-[#5A384D] mt-0.5">
                      Preferred Date: {apt.preferredDate} · Mode: {apt.consultationType}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#B45309] bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A]">
                    <Clock className="w-3 h-3" />
                    <span>Submitted to Clinic · Verification Pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Cards Grid */}
        {filteredDoctors.length > 0 ? (
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
        ) : (
          <div className="text-center py-12 bg-[#FFF8F9] rounded-3xl border border-[#F8D7DF] p-8 max-w-xl mx-auto space-y-3">
            <Search className="w-8 h-8 text-[#8C657B] mx-auto" />
            <h4 className="font-display font-bold text-base text-[#2D1222]">
              No Verified Listings Found for this Filter
            </h4>
            <p className="text-xs text-[#5A384D] leading-relaxed">
              In accordance with our strict health policy, Sakhi Cycle only displays clinical providers with verified credentials and accredited hospital affiliations.
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('all');
                setSelectedMode('all');
              }}
              className="text-xs font-semibold text-[#E25574] hover:underline cursor-pointer"
            >
              Reset Filters to All Specialties
            </button>
          </div>
        )}

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
                  <label className="font-semibold text-[#5A384D] block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#5A384D] block mb-1">Phone Number or Email</label>
                  <input
                    type="text"
                    required
                    value={patientContact}
                    onChange={(e) => setPatientContact(e.target.value)}
                    placeholder="+91 or email@domain.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#5A384D] block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#5A384D] block mb-1">Consultation Mode</label>
                    <select
                      value={consultType}
                      onChange={(e) => setConsultType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF8F9] border border-[#F8D7DF] text-[#2D1222] focus:outline-none focus:ring-2 focus:ring-[#E25574]"
                    >
                      <option value="in-clinic">{t.doctors.inPerson}</option>
                      <option value="teleconsult">{t.doctors.teleconsult}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-semibold text-white bg-gradient-to-r from-[#E25574] to-[#F48B9E] hover:from-[#D13C60] hover:to-[#E25574] rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {bookingSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Request Recorded with Clinic!</span>
                      </>
                    ) : (
                      <span>Confirm Consultation Request</span>
                    )}
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
