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

/** Large landscape screens get the landscape beach photo: the portrait one would be
    upscaled ~1.6x to cover a 1920px-wide hero and look soft. */
const WIDE = '(min-width: 1024px) and (orientation: landscape)';

type Face = readonly [x: number, y: number, dx: number, dy: number];
type Photo = { w: number; h: number; pos: readonly [number, number]; faces: { first: Face; second: Face } };

/** Natural size, object-position (fractions) and face anchors (natural px) per hero photo. */
const PHOTOS: Record<'steps' | 'beach', Photo> = {
  steps: { w: 1600, h: 2295, pos: [0.5, 0.52], faces: FACES },
  beach: { w: 1800, h: 1200, pos: [0.5, 0.9], faces: { second: [895, 645, -30, -60], first: [1055, 695, 30, -50] } },
};

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
    const wide = window.matchMedia(WIDE);
    const place = () => {
      const { w, h, pos, faces } = wide.matches ? PHOTOS.beach : PHOTOS.steps;
      img.style.objectPosition = `${pos[0] * 100}% ${pos[1] * 100}%`;
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      const s = Math.max(W / w, H / h);
      const ox = (W - w * s) * pos[0];
      const oy = (H - h * s) * pos[1];
      const k = Math.min(1, W / 900);
      const pairs = [
        [firstRef.current, faces.first],
        [secondRef.current, faces.second],
      ] as const;
      for (const [el, [x, y, dx, dy]] of pairs) {
        if (!el) continue;
        el.style.left = `${ox + x * s + dx * k}px`;
        el.style.top = `${oy + y * s + dy * k}px`;
      }
    };
    place();
    img.addEventListener('load', place);
    window.addEventListener('resize', place);
    wide.addEventListener('change', place);
    return () => {
      img.removeEventListener('load', place);
      window.removeEventListener('resize', place);
      wide.removeEventListener('change', place);
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
      <picture>
        <source media={WIDE} srcSet={IMG.beach} />
        <img
          className="hero__img"
          ref={imgRef}
          src={IMG.steps}
          alt={`${COUPLE.first} and ${COUPLE.second} together`}
        />
      </picture>
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
