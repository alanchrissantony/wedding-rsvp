import { useCallback, useEffect, useRef, useState } from 'react';
import { IMG } from '../assets';
import { COUPLE, WORDS } from '../content';
import { ChevronLeft, ChevronRight } from './icons';

const GAP = 16;

export function Words() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setAtStart(t.scrollLeft < 4);
    setAtEnd(t.scrollLeft + t.clientWidth > t.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  const go = (dir: 1 | -1) => {
    const t = trackRef.current;
    const card = t?.querySelector('.scard');
    if (!t || !card) return;
    t.scrollBy({ left: dir * (card.getBoundingClientRect().width + GAP), behavior: 'smooth' });
  };

  return (
    <section className="story" id="words" aria-labelledby="words-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 className="h2" id="words-h">
            In Each Other’s
            <br />
            Words.
          </h2>
          <div className="arrows">
            <button className="arrow" type="button" aria-label="Previous" disabled={atStart} onClick={() => go(-1)}>
              <ChevronLeft />
            </button>
            <button className="arrow arrow--fill" type="button" aria-label="Next" disabled={atEnd} onClick={() => go(1)}>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="track" ref={trackRef} tabIndex={0} aria-label="In each other’s words" onScroll={sync}>
          {WORDS.map((s) => (
            <article className="scard" key={s.title}>
              <img src={IMG[s.img]} alt={s.alt} style={{ objectPosition: s.pos }} />
              <h3>{s.title}</h3>
              <p>“{s.text}”</p>
              <p className="scard__sig">— {COUPLE[s.from]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
