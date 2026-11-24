import { useEffect, useRef, useState } from 'react';
import { bow } from '../assets';
import { COUPLE, VOWS } from '../content';
import { Ornament } from './icons';

const STICK = 64; // sticky offset under the bar, px
const STRAND_COLORS = ['#e8c56a', '#c99a3a', '#f3dc94'];

function Tassel({ side }: { side: 'l' | 'r' }) {
  return (
    <svg className={`tassel tassel--${side}`} viewBox="0 0 22 78" aria-hidden="true">
      <path d="M11 0 V10" stroke="#c99a3a" strokeWidth="1.4" />
      <circle cx="11" cy="14" r="5" fill="url(#gold)" />
      <path d="M6.5 19 h9 l-1 5 h-7 z" fill="url(#gold)" />
      {Array.from({ length: 9 }, (_, i) => {
        const x0 = (8 + i * 0.75).toFixed(2);
        const x1 = (3 + i * 2.1).toFixed(2);
        const x2 = (1.5 + i * 2.4).toFixed(2);
        return (
          <path
            key={i}
            d={`M${x0} 24 C${x0} 44 ${x1} 60 ${x2} 77`}
            stroke={STRAND_COLORS[i % 3]}
            strokeWidth="0.9"
            fill="none"
          />
        );
      })}
    </svg>
  );
}

function Roll({ pos }: { pos: 'top' | 'bot' }) {
  return (
    <div className={`roll roll--${pos}`} aria-hidden="true">
      <span className="band" />
      <span className="knob knob--l" />
      <span className="knob knob--r" />
      <Tassel side={pos === 'top' ? 'r' : 'l'} />
    </div>
  );
}

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** A parchment scroll that unrolls as the page scrolls past it. */
export function Vows() {
  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLDivElement>(null);
  const [isStatic] = useState(prefersReduced);

  useEffect(() => {
    const sec = secRef.current;
    const stage = stageRef.current;
    const inner = inRef.current;
    if (!sec || !stage || !inner) return;

    const measure = () => {
      stage.style.setProperty('--full', `${Math.min(inner.offsetHeight, window.innerHeight - STICK - 180)}px`);
      if (isStatic) return;
      const cur = stage.style.getPropertyValue('--open');
      stage.style.setProperty('--open', '1');
      const full = stage.offsetHeight;
      stage.style.setProperty('--open', cur || '0');
      sec.style.height = `${full + Math.round(window.innerHeight * 1.1)}px`;
    };

    if (isStatic) {
      stage.style.setProperty('--open', '1');
      stage.style.setProperty('--seal', '1');
      measure();
      return;
    }

    const update = () => {
      tick = false;
      const travelled = STICK - sec.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, travelled / (window.innerHeight * 1.1)));
      const raw = Math.min(1, Math.max(0, (p - 0.1) / 0.68));
      const seal = Math.min(1, raw / 0.2);
      const o = Math.min(1, Math.max(0, (raw - 0.14) / 0.86));
      stage.style.setProperty('--seal', seal.toFixed(4));
      stage.style.setProperty('--open', (1 - Math.pow(1 - o, 3)).toFixed(4));
    };
    let tick = false;
    const onScroll = () => {
      if (!tick) {
        tick = true;
        requestAnimationFrame(update);
      }
    };
    const onResize = () => {
      measure();
      update();
    };
    let alive = true;

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.fonts?.ready?.then(() => alive && onResize());
    return () => {
      alive = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [isStatic]);

  return (
    <section className={`vowsec${isStatic ? ' static' : ''}`} id="vows" aria-labelledby="vows-h" ref={secRef}>
      <div className="vowsec__stage" ref={stageRef}>
        <div className="vowsec__head">
          <p className="eyebrow">Our promise</p>
          <h2 className="h2" id="vows-h">
            The Vows We’ll Make
          </h2>
        </div>
        <div className="scroll">
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
              <radialGradient id="gold" cx=".35" cy=".3" r=".8">
                <stop offset="0" stopColor="#fff3c8" />
                <stop offset=".35" stopColor="#e6c264" />
                <stop offset=".75" stopColor="#a87d26" />
                <stop offset="1" stopColor="#6b4c12" />
              </radialGradient>
            </defs>
          </svg>
          <Roll pos="top" />
          <div className="paper">
            <div className="paper__in" ref={inRef}>
              <Ornament />
              <p className="paper__title">Our Vows</p>
              <p className="vow">
                {VOWS.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
              <p className="sign">{COUPLE.full}</p>
              <Ornament />
            </div>
          </div>
          <Roll pos="bot" />
          <img className="bow" src={bow} alt="" aria-hidden="true" />
          <div className="vowsec__hint" aria-hidden="true">
            <svg viewBox="0 0 14 20" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="1" width="12" height="18" rx="6" />
              <path d="M7 5v4" />
            </svg>
            Scroll to unroll
          </div>
        </div>
      </div>
    </section>
  );
}
