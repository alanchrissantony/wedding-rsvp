import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { IMG, coupleMark } from '../assets';
import { COUPLE, FACES } from '../content';
import { CalendarHeartIcon } from './icons';

type Props = {
  heroRef: RefObject<HTMLElement>;
  onOpenMenu: () => void;
  onOpenDate: () => void;
};

const SEEN_KEY = 'dateSeen';

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

export function Hero({ heroRef, onOpenMenu, onOpenDate }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const firstRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);
  const [shake, setShake] = useState(() => !readSeen());

  /* Name labels follow the faces in the cover-cropped photo. */
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const img = imgRef.current;
    if (!hero || !img) return;
    const place = () => {
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      const w = img.naturalWidth || 1200;
      const h = img.naturalHeight || 1800;
      const s = Math.max(W / w, H / h);
      const ox = (W - w * s) * 0.5;
      const oy = (H - h * s) * 0.52;
      const k = Math.min(1, W / 900);
      const pairs = [
        [firstRef.current, FACES.first],
        [secondRef.current, FACES.second],
      ] as const;
      for (const [el, [x, y, dx, dy]] of pairs) {
        if (!el) continue;
        el.style.left = `${ox + x * (w / 1200) * s + dx * k}px`;
        el.style.top = `${oy + y * (h / 1800) * s + dy * k}px`;
      }
    };
    place();
    img.addEventListener('load', place);
    window.addEventListener('resize', place);
    return () => {
      img.removeEventListener('load', place);
      window.removeEventListener('resize', place);
    };
  }, [heroRef]);

  useEffect(() => {
    if (shake) return;
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* storage unavailable: nothing to remember */
    }
  }, [shake]);

  const openDate = () => {
    setShake(false);
    onOpenDate();
  };

  return (
    <header className="hero" id="top" ref={heroRef}>
      <img
        className="hero__img"
        ref={imgRef}
        src={IMG.steps}
        alt={`${COUPLE.first} and ${COUPLE.second} seated together on the steps`}
      />
      <nav className="nav" aria-label="Main">
        <div className="wrap">
          <a className="nav__brand" href="#top">
            {COUPLE.monogram}
          </a>
          <img className="nav__mark" src={coupleMark} alt="" aria-hidden="true" />
          <button className="nav__menu" type="button" onClick={onOpenMenu}>
            Menu
          </button>
        </div>
      </nav>
      <span className="who who--r" ref={secondRef}>
        {COUPLE.first}
      </span>
      <span className="who who--l" ref={firstRef}>
        {COUPLE.second}
      </span>
      <h1 className="hero__sr">{COUPLE.full} are getting married</h1>
      <p className="tagline">
        Two hearts, one love,
        <br />
        <span className="tagline__l2">
          one life together.
          <svg className="swash" viewBox="0 0 200 16" aria-hidden="true">
            <path
              d="M3 13.2 Q100 -1.5 197 13.2 Q198.6 14.6 196.6 14.6 Q100 4.2 3.4 14.6 Q1.4 14.6 3 13.2 Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </p>
      <button
        className={`cal-btn${shake ? ' shake' : ''}`}
        type="button"
        aria-haspopup="dialog"
        aria-controls="cal-modal"
        onClick={openDate}
      >
        <span className="cal-btn__icon">
          <CalendarHeartIcon />
        </span>
        <span className="cal-btn__txt">Save the date</span>
      </button>
      <div className="hero__dome" />
    </header>
  );
}
