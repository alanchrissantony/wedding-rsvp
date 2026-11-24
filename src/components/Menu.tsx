import { useRef } from 'react';
import { COUPLE, EVENT, NAV_LINKS } from '../content';
import { useOverlay } from '../lib/useOverlay';

type Props = { open: boolean; onClose: () => void };

export function Menu({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useOverlay(open, onClose, closeRef);

  if (!open) return null;
  return (
    <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="wrap menu__top">
        <span className="nav__brand">{COUPLE.monogram}</span>
        <button className="menu__close" type="button" ref={closeRef} onClick={onClose}>
          Close
        </button>
      </div>
      <div className="wrap">
        <nav aria-label="Sections">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={onClose}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="wrap menu__foot">
        {EVENT.dateLong} · {EVENT.venue}, {EVENT.town}
      </div>
    </div>
  );
}
