import { useEffect, useRef, useState } from 'react';
import { fetchWishes, type StoredWish } from './lib/wishes';
import { Blessing } from './components/Blessing';
import { FamilyBlessings } from './components/FamilyBlessings';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { Menu } from './components/Menu';
import { Wishes } from './components/Wishes';
import { SaveTheDateModal } from './components/SaveTheDateModal';
import { Schedule } from './components/Schedule';
import { StickyBar } from './components/StickyBar';
import { Words } from './components/Words';
import { Vows } from './components/Vows';

/** How often an open page checks for wishes other guests have sent. */
const POLL_MS = 15_000;

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const openMenu = () => setMenuOpen(true);

  /* Guest wishes are shared: load everyone's, poll for new ones while the tab is visible,
     and show a just-sent one immediately. */
  const [guestWishes, setGuestWishes] = useState<StoredWish[]>([]);
  const [justSent, setJustSent] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchWishes().then((ws) => {
        if (!alive) return;
        // keep the same array when nothing is new, so the carousel doesn't re-render every poll
        setGuestWishes((cur) => {
          const next = mergeWishes(cur, ws);
          return next.length === cur.length ? cur : next;
        });
      });
    const visible = () => document.visibilityState === 'visible';
    const onVisibility = () => visible() && load();

    load();
    const timer = window.setInterval(() => visible() && load(), POLL_MS);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  const onSent = (w: StoredWish) => {
    setGuestWishes((cur) => mergeWishes([w], cur));
    setJustSent(w.id);
  };

  return (
    <div className="page">
      <StickyBar heroRef={heroRef} onOpenMenu={openMenu} />
      <Hero heroRef={heroRef} onOpenMenu={openMenu} onOpenDate={() => setDateOpen(true)} />
      <main>
        <Intro />
        <Vows />
        <Words />
        <Blessing />
        <Schedule />
        <FamilyBlessings guestWishes={guestWishes} focusId={justSent} />
        <Wishes onSent={onSent} />
      </main>
      <SaveTheDateModal open={dateOpen} onClose={() => setDateOpen(false)} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

/** Newest first, without duplicates (a just-sent wish may also arrive in the initial load). */
function mergeWishes(a: StoredWish[], b: StoredWish[]) {
  const seen = new Set<string>();
  return [...a, ...b]
    .filter((w) => !seen.has(w.id) && seen.add(w.id))
    .sort((x, y) => y.at - x.at);
}
