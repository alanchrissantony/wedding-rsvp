import { useEffect, useRef, useState, type FormEvent } from 'react';
import { IMG } from '../assets';
import { COUPLE, EVENT } from '../content';
import { submitWish, type StoredWish, type Wish } from '../lib/wishes';
import { ArrowIcon, CheckIcon } from './icons';

type Errors = { name?: boolean; message?: boolean };

function WishForm({ onDone }: { onDone: (w: StoredWish) => void }) {
  const [w, setW] = useState<Wish>({ name: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const set = (k: keyof Wish, v: string) => {
    setW((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const wish = { name: w.name.trim(), message: w.message.trim() };
    const bad: Errors = { name: !wish.name, message: !wish.message };
    setErrors(bad);
    if (bad.name) return nameRef.current?.focus();
    if (bad.message) return msgRef.current?.focus();

    setSending(true);
    setFailed(false);
    try {
      onDone(await submitWish(wish));
    } catch {
      setFailed(true);
      setSending(false);
    }
  };

  const fieldCls = (k: keyof Errors) => `field${errors[k] ? ' bad' : ''}`;

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <div className={fieldCls('name')}>
        <label className="lab" htmlFor="f-name">
          Your name
        </label>
        <input
          ref={nameRef}
          className="input"
          id="f-name"
          name="name"
          autoComplete="name"
          placeholder="So they know who it’s from"
          value={w.name}
          onChange={(e) => set('name', e.target.value)}
        />
        <p className="err" role="alert">
          Please tell us your name.
        </p>
      </div>
      <div className={fieldCls('message')}>
        <label className="lab" htmlFor="f-msg">
          Your wishes
        </label>
        <textarea
          ref={msgRef}
          className="input"
          id="f-msg"
          name="message"
          rows={5}
          placeholder="A blessing, a prayer, a memory, or a few kind words"
          value={w.message}
          onChange={(e) => set('message', e.target.value)}
        />
        <p className="err" role="alert">
          Please write a few words.
        </p>
      </div>
      {failed && (
        <p className="err" role="alert" style={{ display: 'block' }}>
          Couldn’t send just now — please try again.
        </p>
      )}
      <button className="btn btn--block" type="submit" disabled={sending}>
        {sending ? 'Sending… ' : 'Send Wishes '}
        <ArrowIcon />
      </button>
    </form>
  );
}

function WishDone({ wish, onAgain }: { wish: Wish; onAgain: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus({ preventScroll: true }), []);
  const first = wish.name.split(/\s+/)[0];

  return (
    <div className="done" tabIndex={-1} ref={ref}>
      <div className="done__mark">
        <CheckIcon />
      </div>
      <h3>Thank You, {first}.</h3>
      <p>
        Your wishes are now among the blessings for {COUPLE.full}. We can’t wait to celebrate with you on{' '}
        {EVENT.dateShort}.
      </p>
      <div className="done__acts">
        <a className="btn btn--ghost" href={EVENT.calendarUrl} target="_blank" rel="noopener">
          Add to calendar <ArrowIcon />
        </a>
        <a className="link" href="#families">
          See it in the blessings ↑
        </a>
        <button className="link" type="button" onClick={onAgain}>
          Send another wish
        </button>
      </div>
    </div>
  );
}

export function Wishes({ onSent }: { onSent: (w: StoredWish) => void }) {
  const [sent, setSent] = useState<Wish | null>(null);
  const done = (w: StoredWish) => {
    setSent(w);
    onSent(w);
  };

  return (
    <section className="rsvp" id="wishes" aria-labelledby="wishes-h">
      <div className="wrap">
        <div className="rsvp-head">
          <h2 className="h2" id="wishes-h">
            Send Your Wishes
          </h2>
          <p className="sub">
            Leave a blessing or a few words for {COUPLE.full} as they begin their life together.
          </p>
        </div>
        <div className="rsvp__grid">
          <div className="rsvp__aside">
            <img loading="lazy" decoding="async" src={IMG.embrace} alt="" style={{ objectPosition: '50% 40%' }} />
            <dl>
              <dt>Date</dt>
              <dd>{EVENT.dateLong}</dd>
              <dt>Ceremony</dt>
              <dd>
                {EVENT.ceremony.time} · {EVENT.ceremony.place}
              </dd>
              <dt>Reception</dt>
              <dd>
                {EVENT.reception.time} · {EVENT.reception.place}
              </dd>
            </dl>
          </div>
          <div className="card">
            {sent ? <WishDone wish={sent} onAgain={() => setSent(null)} /> : <WishForm onDone={done} />}
          </div>
        </div>
      </div>
    </section>
  );
}
