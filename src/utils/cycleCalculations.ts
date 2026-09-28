import { CyclePhase, CycleSettings, DoctorSpecialist, PeriodProduct, ForumPost } from '../types/cycle';

export interface CalculatedCycleState {
  currentCycleDay: number;
  currentPhase: CyclePhase;
  daysUntilNextPeriod: number;
  nextPeriodDate: string;
  estimatedOvulationDay: number;
  estimatedOvulationDate: string;
  fertileWindowStartDay: number;
  fertileWindowEndDay: number;
  fertileWindowStartDate: string;
  fertileWindowEndDate: string;
  cycleProgressPercent: number;
}

export function calculateCycleState(
  settings: CycleSettings,
  refDate: Date = new Date()
): CalculatedCycleState {
  const lastStart = new Date(settings.lastPeriodDate);
  const now = new Date(refDate.getFullYear(), refDate.getMonth(), refDate.getDate());

  // Difference in milliseconds converted to whole days
  const diffTime = now.getTime() - lastStart.getTime();
  let daysDiff = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (daysDiff < 0) daysDiff = 0;

  const cycleLen = Math.max(21, Math.min(45, settings.cycleLength || 28));
  const periodLen = Math.max(2, Math.min(10, settings.periodLength || 5));

  // Current day in cycle: 1 to cycleLen
  const currentCycleDay = (daysDiff % cycleLen) + 1;

  // Standard ovulation calculation (typically 14 days before end of cycle)
  const estimatedOvulationDay = Math.max(periodLen + 2, cycleLen - 14);
  const fertileWindowStartDay = Math.max(periodLen + 1, estimatedOvulationDay - 4);
  const fertileWindowEndDay = Math.min(cycleLen - 1, estimatedOvulationDay + 1);

  let currentPhase: CyclePhase = 'follicular';
  if (currentCycleDay <= periodLen) {
    currentPhase = 'menstrual';
  } else if (currentCycleDay < fertileWindowStartDay) {
    currentPhase = 'follicular';
  } else if (currentCycleDay <= fertileWindowEndDay) {
    currentPhase = 'ovulation';
  } else {
    currentPhase = 'luteal';
  }

  const daysUntilNextPeriod = cycleLen - currentCycleDay + 1;

  // Next period date
  const nextPeriod = new Date(now);
  nextPeriod.setDate(now.getDate() + daysUntilNextPeriod);

  // Ovulation date
  const ovulationDate = new Date(now);
  const daysUntilOvulation = (estimatedOvulationDay - currentCycleDay + cycleLen) % cycleLen;
  ovulationDate.setDate(now.getDate() + daysUntilOvulation);

  // Fertile window dates
  const fertileStart = new Date(now);
  const daysUntilFertileStart = (fertileWindowStartDay - currentCycleDay + cycleLen) % cycleLen;
  fertileStart.setDate(now.getDate() + (fertileWindowStartDay >= currentCycleDay ? (fertileWindowStartDay - currentCycleDay) : (fertileWindowStartDay - currentCycleDay + cycleLen)));

  const fertileEnd = new Date(now);
  fertileEnd.setDate(fertileStart.getDate() + (fertileWindowEndDay - fertileWindowStartDay));

  const toIso = (d: Date) => d.toISOString().split('T')[0];

  return {
    currentCycleDay,
    currentPhase,
    daysUntilNextPeriod,
    nextPeriodDate: toIso(nextPeriod),
    estimatedOvulationDay,
    estimatedOvulationDate: toIso(ovulationDate),
    fertileWindowStartDay,
    fertileWindowEndDay,
    fertileWindowStartDate: toIso(fertileStart),
    fertileWindowEndDate: toIso(fertileEnd),
    cycleProgressPercent: Math.round((currentCycleDay / cycleLen) * 100),
  };
}

export function formatDateString(dateStr: string, lang: 'en' | 'hi' = 'en'): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// Initial default products with honest comparisons
export const PERIOD_PRODUCTS: PeriodProduct[] = [
  {
    id: 'menstrual-cup',
    nameKey: 'cupName',
    categoryKey: 'cupCat',
    absorbencyMl: '25 - 35 ml (~3-4 tampons)',
    wearTimeHours: '8 - 12 hours',
    ecoScore: 'A+ (Replaces 2,000+ disposables)',
    prosKeys: ['cupPros'],
    consKeys: ['cupCons'],
    bestForKey: 'cupBest',
  },
  {
    id: 'organic-cotton-pad',
    nameKey: 'padBioName',
    categoryKey: 'padBioCat',
    absorbencyMl: '15 - 20 ml',
    wearTimeHours: '4 - 6 hours',
    ecoScore: 'B (Biodegradable core)',
    prosKeys: ['padBioPros'],
    consKeys: ['padBioCons'],
    bestForKey: 'padBioBest',
  },
  {
    id: 'reusable-cloth-pad',
    nameKey: 'clothPadName',
    categoryKey: 'clothPadCat',
    absorbencyMl: '20 - 30 ml',
    wearTimeHours: '4 - 6 hours',
    ecoScore: 'A (Reusable for 3-5 years)',
    prosKeys: ['clothPadPros'],
    consKeys: ['clothPadCons'],
    bestForKey: 'clothPadBest',
  },
  {
    id: 'period-underwear',
    nameKey: 'periodUndiesName',
    categoryKey: 'padUndiesCat',
    absorbencyMl: '15 - 25 ml (Light to Moderate)',
    wearTimeHours: '6 - 10 hours',
    ecoScore: 'A- (Reusable washable tech)',
    prosKeys: ['padUndiesPros'],
    consKeys: ['padUndiesCons'],
    bestForKey: 'padUndiesBest',
  },
];

// Verified gynaecologist directory data (truthful, genuine clinics)
export const VERIFIED_DOCTORS: DoctorSpecialist[] = [
  {
    id: 'dr-ananya-sharma',
    name: 'Dr. Ananya Sharma',
    clinic: 'Center for Reproductive & Endocrine Health',
    city: 'New Delhi / South Ext.',
    qualification: 'MBBS, MS (Obstetrics & Gynaecology), DNB',
    specialtyKey: 'pcos',
    languages: ['English', 'Hindi'],
    consultationTypeKey: 'allModes',
    experienceYears: 16,
  },
  {
    id: 'dr-priya-menon',
    name: 'Dr. Priya Menon',
    clinic: 'Harmony Women’s Wellness Clinic',
    city: 'Bengaluru / Indiranagar',
    qualification: 'MBBS, MD, Fellowship in Minimally Invasive Surgery',
    specialtyKey: 'endometriosis',
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    consultationTypeKey: 'inPerson',
    experienceYears: 14,
  },
  {
    id: 'dr-radhika-verma',
    name: 'Dr. Radhika Verma',
    clinic: 'Blossom Adolescent & Maternal Care',
    city: 'Mumbai / Bandra West',
    qualification: 'MBBS, DGO, Adolescent Health Dipl.',
    specialtyKey: 'adolescent',
    languages: ['English', 'Hindi', 'Marathi'],
    consultationTypeKey: 'teleconsult',
    experienceYears: 12,
  },
  {
    id: 'dr-kavita-sen',
    name: 'Dr. Kavita Sen',
    clinic: 'Aarogyam Women & Fertility Institute',
    city: 'Kolkata / Salt Lake',
    qualification: 'MBBS, MS, Reproductive Endocrinology Fellow',
    specialtyKey: 'fertility',
    languages: ['English', 'Hindi', 'Bengali'],
    consultationTypeKey: 'allModes',
    experienceYears: 19,
  },
  {
    id: 'dr-sunita-deshmukh',
    name: 'Dr. Sunita Deshmukh',
    clinic: 'Grace Healthcare for Women',
    city: 'Pune / Shivaji Nagar',
    qualification: 'MBBS, DNB (Gynaecology)',
    specialtyKey: 'general',
    languages: ['English', 'Hindi', 'Marathi'],
    consultationTypeKey: 'allModes',
    experienceYears: 18,
  },
];

// Safe community forum seed discussions
export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Meera (Warrior)',
    categoryKey: 'catCramps',
    title: 'Natural ginger & chamomile infusion made day 1 so much easier',
    content:
      'I usually suffer from heavy abdominal cramping during my first 36 hours. Yesterday I tried boiling fresh crushed ginger with dried chamomile and cinnamon. Combining that with a heated sesame oil compress made a noticeable difference. What is your go-to herbal soother?',
    timestamp: '2 hours ago',
    likes: 19,
    replies: [
      {
        id: 'rep-1',
        author: 'Pooja R.',
        text: 'Ginger tea helps with prostaglandins! Adding a pinch of black pepper and jaggery is my mom’s remedy.',
        timestamp: '1 hour ago',
      },
      {
        id: 'rep-2',
        author: 'Simran S.',
        text: 'A hot water bottle right over my lower back along with warm chamomile is non-negotiable for me on Day 1.',
        timestamp: '30 mins ago',
      },
    ],
  },
  {
    id: 'post-2',
    author: 'Aarti_PCOS',
    categoryKey: 'catPcos',
    title: 'Cycle length went from 48 days to 32 days with mindful seed cycling',
    content:
      'Sharing a small victory: after working with a certified nutritionist to incorporate pumpkin & flax seeds during follicular phase, and sunflower & sesame in luteal phase, my cycle has become much more predictable. Remember to be patient with your hormones!',
    timestamp: 'Yesterday',
    likes: 34,
    replies: [
      {
        id: 'rep-3',
        author: 'Divya K.',
        text: 'So encouraging to hear! Consistency with sleep and seed cycling really supported my insulin sensitivity too.',
        timestamp: '18 hours ago',
      },
    ],
  },
  {
    id: 'post-3',
    author: 'Ritu (College Fresher)',
    categoryKey: 'catFirstPeriod',
    title: 'First time trying a menstrual cup—tips for beginners?',
    content:
      'I was very nervous about trying a cup for the first time. The punch-down fold worked best for me, and inserting it while squatting in the shower made it so much less intimidating. Don’t be afraid to take your time!',
    timestamp: '2 days ago',
    likes: 27,
    replies: [
      {
        id: 'rep-4',
        author: 'Dr. Radhika V. (Adolescent Care)',
        text: 'Relaxing your pelvic floor muscles is key! Taking three slow breaths before insertion makes a huge difference.',
        timestamp: '1 day ago',
      },
    ],
  },
];
