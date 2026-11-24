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

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const openMenu = () => setMenuOpen(true);

  /* Guest wishes are shared: load everyone's, and show a just-sent one immediately. */
  const [guestWishes, setGuestWishes] = useState<StoredWish[]>([]);
  const [justSent, setJustSent] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetchWishes().then((ws) => alive && setGuestWishes((cur) => mergeWishes(cur, ws)));
    return () => {
      alive = false;
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
