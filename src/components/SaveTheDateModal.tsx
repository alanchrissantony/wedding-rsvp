import { useRef } from 'react';
import { DAY_TIMELINE, EVENT } from '../content';
import { useOverlay } from '../lib/useOverlay';
import { CloseIcon, HeartSmall } from './icons';

type Props = { open: boolean; onClose: () => void };

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function MonthGrid() {
  const { year, month, weddingDay } = EVENT.calendar;
  const lead = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return (
    <div className="calgrid" aria-hidden="true">
      {DOW.map((d) => (
        <span key={d} className="dow">
          {d}
        </span>
      ))}
      {Array.from({ length: lead }, (_, i) => (
        <span key={`lead-${i}`} />
      ))}
      {Array.from({ length: days }, (_, i) => {
        const d = i + 1;
        const dow = (lead + i) % 7;
        const cls = ['d', dow === 0 && 'sun', d === weddingDay && 'wed']
          .filter(Boolean)
          .join(' ');
        return (
          <span key={d} className={cls}>
            {d}
            {d === weddingDay && <HeartSmall />}
          </span>
        );
      })}
    </div>
  );
}

function countdown() {
  const ms = EVENT.startUtc - Date.now();
  if (ms <= 0) return { n: '♥', label: 'Married on this day' };
  const days = Math.ceil(ms / 86400000);
  return { n: String(days), label: days === 1 ? 'day to go' : 'days to go' };
}

export function SaveTheDateModal({ open, onClose }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  useOverlay(open, onClose, boxRef, boxRef);

  if (!open) return null;
  const cd = countdown();
  return (
    <div className="modal" id="cal-modal">
      <div className="modal__scrim" onClick={onClose} />
      <div
        className="modal__box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cal-title"
        tabIndex={-1}
        ref={boxRef}
      >
        <button className="modal__x" type="button" aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </button>
        <div className="modal__cal">
          <div className="calhead">
            <b>{EVENT.calendar.monthName}</b>
            <span>{EVENT.calendar.year}</span>
          </div>
          <MonthGrid />
          <ul className="legend">
            <li>
              <i />
              Sat {EVENT.calendar.weddingDay} · {EVENT.ceremony.title} &amp; reception
            </li>
          </ul>
        </div>
        <div className="modal__info">
          <p className="eyebrow">Save the date</p>
          <h2 id="cal-title">{EVENT.dateLong}</h2>
          <p className="cd">
            <b>{cd.n}</b>
            <span>{cd.label}</span>
          </p>
          <ul className="tl">
            {DAY_TIMELINE.map((t) => (
              <li key={t.time}>
                <time>{t.time}</time>
                <span>{t.what}</span>
              </li>
            ))}
          </ul>
          <p className="where">
            {EVENT.venue}, {EVENT.town}, {EVENT.region}
          </p>
          <div className="modal__acts">
            <a className="btn" href={EVENT.calendarUrl} target="_blank" rel="noopener">
              Add to calendar
            </a>
            <a className="btn btn--ghost" href="#wishes" onClick={onClose}>
              Send wishes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
