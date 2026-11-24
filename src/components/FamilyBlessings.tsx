import { useEffect, useMemo, useState } from 'react';
import { IMG, type ImgKey } from '../assets';
import { FAMILY_BLESSINGS } from '../content';
import type { StoredWish } from '../lib/wishes';
import { ChevronLeft, ChevronRight } from './icons';

type Card = { id: string; title: string; text: string; from: string; img: ImgKey; pos: string };

/** Photos cycled across guest wishes so neighbouring cards look different. */
const GUEST_IMGS: { img: ImgKey; pos: string }[] = [
  { img: 'hands', pos: '50% 35%' },
  { img: 'embrace', pos: '50% 40%' },
  { img: 'beach', pos: '50% 62%' },
  { img: 'wwalk', pos: '50% 50%' },
  { img: 'treehead', pos: '50% 30%' },
  { img: 'wlead', pos: '50% 35%' },
];

const toCard = (w: StoredWish, n: number): Card => ({
  id: w.id,
  title: `${w.name.split(/\s+/)[0]}’s wish`,
  text: w.message,
  from: w.name,
  ...GUEST_IMGS[n % GUEST_IMGS.length],
});

type Props = {
  /** Guests' wishes, newest first */
  guestWishes: StoredWish[];
  /** Id of a wish this visitor just sent; the carousel jumps to it */
  focusId: string | null;
};

/** Carousel of blessings: the families' words first, then every guest's wish. */
export function FamilyBlessings({ guestWishes, focusId }: Props) {
  const items = useMemo<Card[]>(
    () => [...FAMILY_BLESSINGS.map((b, n) => ({ ...b, id: `family-${n}` })), ...guestWishes.map(toCard)],
    [guestWishes],
  );
  const N = items.length;

  /* Track the shown card by id, not index: new wishes arriving while someone reads
     shift indexes, and the card on screen should stay put. */
  const [curId, setCurId] = useState(items[0].id);
  useEffect(() => {
    if (focusId) setCurId(focusId);
  }, [focusId]);

  const cur = Math.max(0, items.findIndex((c) => c.id === curId));
  const prev = () => setCurId(items[(cur + N - 1) % N].id);
  const next = () => setCurId(items[(cur + 1) % N].id);

  const b = items[cur];
  const p = items[(cur + N - 1) % N];
  const n = items[(cur + 1) % N];

  return (
    <section className="faq" id="families" aria-labelledby="families-h">
      <div className="wrap">
        <p className="eyebrow">From family &amp; friends</p>
        <h2 className="h2" id="families-h">
          Blessings From Our Families
        </h2>
        <div className="qstage">
          <button className="qside qside--prev" type="button" aria-label={`Previous blessing: ${p.title}`} onClick={prev}>
            <img loading="lazy" decoding="async" src={IMG[p.img]} alt="" style={{ objectPosition: p.pos }} />
            <span>{p.title}</span>
          </button>
          <div className="qcard" aria-live="polite">
            <img loading="lazy" decoding="async" src={IMG[b.img]} alt="" style={{ objectPosition: b.pos }} />
            {/* key re-mounts the body so the fade animation replays on every change */}
            <div className="qcard__body fade" key={b.id}>
              <span className="qmark" aria-hidden="true">
                “
              </span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
              <p className="who-sig">— {b.from}</p>
            </div>
          </div>
          <button className="qside qside--next" type="button" aria-label={`Next blessing: ${n.title}`} onClick={next}>
            <img loading="lazy" decoding="async" src={IMG[n.img]} alt="" style={{ objectPosition: n.pos }} />
            <span>{n.title}</span>
          </button>
        </div>
        <div className="qnav">
          <button className="arrow" type="button" aria-label="Previous blessing" onClick={prev}>
            <ChevronLeft />
          </button>
          <span className="qcount">
            {cur + 1} / {N}
          </span>
          <button className="arrow arrow--fill" type="button" aria-label="Next blessing" onClick={next}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
