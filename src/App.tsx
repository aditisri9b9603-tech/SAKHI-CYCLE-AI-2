import React, { useState, useEffect } from 'react';
import {
  CycleSettings,
  DailyLog,
  Language,
  PartnerConfig,
  AppointmentRequest,
} from './types/cycle';
import { calculateCycleState } from './utils/cycleCalculations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductTour } from './components/ProductTour';
import { CycleDial } from './components/CycleDial';
import { DailyLogger } from './components/DailyLogger';
import { CycleCalendar } from './components/CycleCalendar';
import { PersonalInsights } from './components/PersonalInsights';
import { WellnessGuidance } from './components/WellnessGuidance';
import { PartnerSupport } from './components/PartnerSupport';
import { MediaAndMusic } from './components/MediaAndMusic';
import { SakhiAIChat } from './components/SakhiAIChat';
import { PeriodProductGuide } from './components/PeriodProductGuide';
import { DoctorDirectory } from './components/DoctorDirectory';
import { CommunityAndBuddy } from './components/CommunityAndBuddy';
import { BreathingAndAffirmations } from './components/BreathingAndAffirmations';
import { PrivacyAndDataModal } from './components/PrivacyAndDataModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { Footer } from './components/Footer';

const STORAGE_KEYS = {
  SETTINGS: 'sakhi_cycle_settings_v1',
  LOGS: 'sakhi_cycle_logs_v1',
  LANG: 'sakhi_cycle_lang_v1',
  PARTNER: 'sakhi_cycle_partner_v1',
  APPOINTMENTS: 'sakhi_cycle_apts_v1',
};

export default function App() {
  // 1. Language state
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch (e) {
      console.warn('Storage write failed', e);
    }
  };

  // 2. Cycle Settings state
  const [settings, setSettings] = useState<CycleSettings>(() => {
    const today = new Date();
    const defaultLastDate = new Date(today);
    defaultLastDate.setDate(today.getDate() - 13);
    const dateStr = defaultLastDate.toISOString().split('T')[0];

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Settings parse failed', e);
    }

    return {
      lastPeriodDate: dateStr,
      cycleLength: 28,
      periodLength: 5,
    };
  });

  const handleUpdateSettings = (newSettings: CycleSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (e) {
      console.warn('Settings write failed', e);
    }
  };

  // 3. Daily Logs state
  const [logs, setLogs] = useState<Record<string, DailyLog>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Logs parse failed', e);
    }

    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() - 13);
    const d1Str = d1.toISOString().split('T')[0];

    const d2 = new Date(today);
    d2.setDate(today.getDate() - 12);
    const d2Str = d2.toISOString().split('T')[0];

    const d3 = new Date(today);
    const d3Str = d3.toISOString().split('T')[0];

    return {
      [d1Str]: {
        date: d1Str,
        flow: 'medium',
        symptoms: ['cramps', 'backache', 'fatigue'],
        moods: ['sensitive', 'exhausted'],
        energy: 'low',
        waterGlasses: 6,
        sleepHours: 8,
        notes: 'First day of period. Warm chamomile tea helped soothe cramps.',
        updatedAt: d1.toISOString(),
      },
      [d2Str]: {
        date: d2Str,
        flow: 'light',
        symptoms: ['headache', 'bloating'],
        moods: ['calm'],
        energy: 'medium',
        waterGlasses: 7,
        sleepHours: 7.5,
        notes: 'Flow tapering down, gentle walk in the evening.',
        updatedAt: d2.toISOString(),
      },
      [d3Str]: {
        date: d3Str,
        flow: 'none',
        symptoms: ['tenderBreasts'],
        moods: ['happy', 'creative'],
        energy: 'high',
        waterGlasses: 8,
        sleepHours: 8,
        notes: 'Feeling radiant and energized today.',
        updatedAt: d3.toISOString(),
      },
    };
  });

  const handleSaveLog = (newLog: DailyLog) => {
    setLogs((prev) => {
      const updated = { ...prev, [newLog.date]: newLog };
      try {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Logs write failed', e);
      }
      return updated;
    });
  };

  // 4. Partner Configuration (Flo Partners Inspiration)
  const [partnerConfig, setPartnerConfig] = useState<PartnerConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PARTNER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Partner storage read failed', e);
    }

    return {
      isPaired: false,
      partnerCode: 'SAKHI-PTNR-7294',
      partnerName: '',
      permissions: {
        sharePhase: false,
        shareSupportTips: false,
        shareFertileWindow: false,
        customSupportNotes: '',
      },
      connectedAt: null,
    };
  });

  const handleUpdatePartnerConfig = (newConfig: PartnerConfig) => {
    setPartnerConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEYS.PARTNER, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Partner storage write failed', e);
    }

    // Sync to server backend
    fetch('/api/partner/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerCode: newConfig.partnerCode,
        permissions: newConfig.permissions,
        cycleState: calculateCycleState(settings),
      }),
    }).catch((err) => console.warn('Partner server sync error:', err));
  };

  // 5. Doctor Appointment Requests
  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Appointments storage read failed', e);
    }
    return [];
  });

  const handleAddAppointment = (req: AppointmentRequest) => {
    setAppointmentRequests((prev) => {
      const updated = [req, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Appointment storage write failed', e);
      }
      return updated;
    });

    // Sync to server backend
    fetch('/api/doctor/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    }).catch((err) => console.warn('Appointment server sync error:', err));
  };

  // 6. WhatsApp Share Modal state
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppModalText, setWhatsAppModalText] = useState('');

  const handleOpenWhatsAppModal = (text: string) => {
    setWhatsAppModalText(text);
    setWhatsAppModalOpen(true);
  };

  // 7. Selected date for calendar & logger
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // 8. Privacy Modal
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // 9. Calculated cycle state
  const cycleState = calculateCycleState(settings);

  // Clear data handler
  const handleClearAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.LOGS);
      localStorage.removeItem(STORAGE_KEYS.PARTNER);
      localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    } catch (e) {
      console.warn('Storage remove failed', e);
    }
    const today = new Date();
    today.setDate(today.getDate() - 13);
    setSettings({
      lastPeriodDate: today.toISOString().split('T')[0],
      cycleLength: 28,
      periodLength: 5,
    });
    setLogs({});
    setPartnerConfig({
      isPaired: false,
      partnerCode: 'SAKHI-PTNR-7294',
      partnerName: '',
      permissions: {
        sharePhase: false,
        shareSupportTips: false,
        shareFertileWindow: false,
        customSupportNotes: '',
      },
      connectedAt: null,
    });
    setAppointmentRequests([]);
  };

  // Smooth scroll handler
  const handleNavigateTo = (sectionId: string) => {
    if (sectionId === 'privacy') {
      setPrivacyModalOpen(true);
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F9] text-[#2D1222] flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onNavigateTo={handleNavigateTo}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        {/* 1. Hero Section with High-Fidelity Wellness Image & Scrim */}
        <HeroSection
          language={language}
          cycleState={cycleState}
          onTrackClick={() => handleNavigateTo('tracker')}
          onTourClick={() => handleNavigateTo('tour')}
        />

        {/* 2. Flo-Inspired Interactive Product Tour */}
        <ProductTour
          language={language}
          onNavigateTo={handleNavigateTo}
        />

        {/* 3. Interactive Cycle Dial & Predictions */}
        <CycleDial
          language={language}
          settings={settings}
          cycleState={cycleState}
          onUpdateSettings={handleUpdateSettings}
          onQuickLogClick={() => handleNavigateTo('log')}
        />

        {/* 4. Daily Body & Mind Logger */}
        <DailyLogger
          language={language}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          logs={logs}
          onSaveLog={handleSaveLog}
        />

        {/* 5. Cycle Calendar & Forecast */}
        <CycleCalendar
          language={language}
          settings={settings}
          logs={logs}
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            handleNavigateTo('log');
          }}
        />

        {/* 6. Personal Rhythm Insights Dashboard */}
        <PersonalInsights
          language={language}
          settings={settings}
          logs={logs}
          onSelectDate={(date) => {
            setSelectedDate(date);
            handleNavigateTo('log');
          }}
        />

        {/* 7. Phase-Synced Wellness & Nutrition Guidance */}
        <WellnessGuidance
          language={language}
          currentPhase={cycleState.currentPhase}
        />

        {/* 8. Flo Partners Inspired Experience (Partner Support & Education) */}
        <PartnerSupport
          language={language}
          currentPhase={cycleState.currentPhase}
          partnerConfig={partnerConfig}
          onUpdatePartnerConfig={handleUpdatePartnerConfig}
          onOpenWhatsAppModal={handleOpenWhatsAppModal}
        />

        {/* 9. Media & Music (YouTube verified guides & Spotify Bollywood playlists) */}
        <MediaAndMusic
          language={language}
        />

        {/* 10. Sakhi AI Health & Cycle Companion */}
        <SakhiAIChat
          language={language}
          cycleState={cycleState}
        />

        {/* 11. Verified Period Product Guide */}
        <PeriodProductGuide
          language={language}
        />

        {/* 12. Clinical Gynaecologist Directory & Secure Appointments */}
        <DoctorDirectory
          language={language}
          appointmentRequests={appointmentRequests}
          onAddAppointment={handleAddAppointment}
        />

        {/* 13. Sakhi Community Forum & Cycle Buddy */}
        <CommunityAndBuddy
          language={language}
        />

        {/* 14. Somatic 4-7-8 Breathing Tool & Daily Affirmations */}
        <BreathingAndAffirmations
          language={language}
        />
      </main>

      {/* Quiet Footer */}
      <Footer
        language={language}
        onNavigateTo={handleNavigateTo}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Privacy & Data Stewardship Modal */}
      <PrivacyAndDataModal
        language={language}
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        settings={settings}
        logs={logs}
        onClearAllData={handleClearAllData}
      />

      {/* WhatsApp Share Consent & Preview Modal */}
      <WhatsAppShareModal
        language={language}
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        defaultText={whatsAppModalText}
      />
    </div>
  );
}
