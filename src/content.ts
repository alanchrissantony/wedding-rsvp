import type { ImgKey } from './assets';

/* Everything a guest reads lives here, so names, dates and venue can be swapped in one place. */

export const COUPLE = {
  monogram: 'V & A',
  first: 'Vinu',
  second: 'Anagha',
  full: 'Vinu & Anagha',
};

export const EVENT = {
  dateLong: 'Saturday, 28 November 2026',
  dateShort: '28 Nov',
  ceremony: { title: 'Holy Matrimony', time: '11 am', place: 'St. Thomas Syro-Malabar Church' },
  reception: { title: 'Wedding Reception', time: '12.30 pm', place: 'The United Club' },
  /** 11 am IST in UTC, used by the countdown */
  startUtc: Date.UTC(2026, 10, 28, 5, 30),
  venue: 'St. Thomas Syro-Malabar Church',
  town: 'Mangalassery',
  region: 'Kerala',
  calendarUrl:
    'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Vinu+%26+Anagha%27s+wedding&dates=20261128T053000Z/20261128T090000Z&location=St.+Thomas+Syro-Malabar+Church,+Mangalassery',
  /** Month shown in the save-the-date modal */
  calendar: { year: 2026, month: 10, monthName: 'November', weddingDay: 28 },
};

/** Hero name labels: face position in the 1200×1800 hero photo, plus a px offset. */
export const FACES = {
  second: [445, 711, -36, -70],
  first: [553, 747, 40, -58],
} as const;

export const VOWS = [
  'I take you as my partner, my closest friend, and my home.',
  'I promise to listen before I answer,',
  'to hold your hand on the easy days and the hard ones,',
  'to keep laughing with you,',
  'to honour your family as my own,',
  'to grow with you, and never away from you,',
  'and to choose you again, every morning,',
  'for as long as we both shall live.',
];

export const BLESSING = {
  eyebrow: 'A blessing',
  title: 'Love Never Fails',
  verse:
    'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It always protects, always trusts, always hopes, always perseveres.',
  cite: '1 Corinthians 13:4–7',
};

/**
 * "In each other's words": placeholder lines — Vinu & Anagha should replace `text`
 * (and `title` if they like) with their own words. `from` is 'first' (Vinu) or 'second' (Anagha).
 */
export type Word = { img: ImgKey; pos: string; alt: string; title: string; text: string; from: 'first' | 'second' };
export const WORDS: Word[] = [
  { img: 'wlead', pos: '50% 35%', alt: 'Anagha leading Vinu by the hand through the trees', title: 'Lead the way', text: 'Wherever she’s going, I’ll follow. She usually knows the way anyway.', from: 'first' },
  { img: 'treehead', pos: '50% 30%', alt: 'Anagha resting her head on Vinu’s shoulder under the trees', title: 'His calm', text: 'When everything gets loud, he’s the quiet place I come back to.', from: 'second' },
  { img: 'wwalk', pos: '50% 45%', alt: 'Walking hand in hand through the casuarina grove', title: 'Her laugh', text: 'She makes every ordinary day feel like a small celebration.', from: 'first' },
  { img: 'embrace', pos: '50% 40%', alt: 'An embrace by a tree', title: 'Home', text: 'I stopped looking for home the day I found him.', from: 'second' },
  { img: 'vwalk', pos: '50% 62%', alt: 'Walking along the verandah', title: 'Her patience', text: 'She listens before she answers. I’m still learning that from her.', from: 'first' },
  { img: 'vkiss', pos: '50% 72%', alt: 'A kiss on the forehead on the verandah', title: 'Every morning', text: 'He chooses me again every day, and I’ll keep choosing him.', from: 'second' },
];

/**
 * `map` is what Google Maps searches for. If the pin lands in the wrong place,
 * replace it with the exact place name from Google Maps, or with coordinates
 * like '9.9312,76.2673'.
 */
export const SCHEDULE = [
  { title: 'Holy Matrimony', when: 'Sat 28 Nov · 11 am · St. Thomas Syro-Malabar Church Mangalassery', text: "A day of love, faith, and celebration awaits. From the sacred wedding ceremony to the joyful moments that follow, here's how we'll celebrate our special day together.", map: 'St. Thomas Syro-Malabar Church, Mangalassery, Kerala' },
  { title: 'Wedding Reception', when: 'Sat 28 Nov · 12.30 pm · The United Club Mangalassery', text: 'Following the wedding ceremony, join us for an afternoon of celebration, laughter, and togetherness. We\'d love to share good food, joyful moments, and the happiness of our new beginning with all our family and friends.', map: 'The United Club, Mangalassery, Kerala' },
];

/** Shorter timeline shown in the save-the-date modal */
export const DAY_TIMELINE = [
  { time: '11 am', what: 'Holy Matrimony, St. Thomas Syro-Malabar Church' },
  { time: '12.30 pm', what: 'Reception, The United Club' },
];

/** Placeholder blessings — replace `text` and `from` with the families' real words. */
export type FamilyBlessing = { title: string; text: string; from: string; img: ImgKey; pos: string };
export const FAMILY_BLESSINGS: FamilyBlessing[] = [
  { title: 'May your home be full of peace', text: 'May God fill your home with peace, your table with laughter, and your hearts with patience for each other.', from: 'Vinu’s parents', img: 'treehead', pos: '50% 30%' },
  { title: 'Welcome to our family', text: 'We prayed for the right person to walk beside our daughter. Vinu, we are so glad it is you.', from: 'Anagha’s parents', img: 'wlead', pos: '50% 35%' },
  { title: 'Love that grows', text: 'Love the way we did, a little more every year, through every season God gives you.', from: 'Grandparents', img: 'vkiss', pos: '50% 68%' },
  { title: 'Keep Christ at the centre', text: 'Let Him be the third strand in your cord. Pray together, forgive quickly, and nothing will break what you build.', from: 'Godparents', img: 'vwalk', pos: '50% 60%' },
  { title: 'Always in your corner', text: 'We’ve teased you both for years. Now we get to cheer for you, forever.', from: 'Brothers & sisters', img: 'window', pos: '50% 45%' },
];

export const NAV_LINKS = [
  { href: '#vows', label: 'Our Vows' },
  { href: '#words', label: 'Our Words' },
  { href: '#blessing', label: 'Blessing' },
  { href: '#schedule', label: 'Schedule' },
  { href: '#families', label: 'Family Blessings' },
  { href: '#wishes', label: 'Send Wishes' },
];
