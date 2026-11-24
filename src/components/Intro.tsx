import { IMG } from '../assets';
import { COUPLE, EVENT } from '../content';

export function Intro() {
  return (
    <section className="intro" aria-labelledby="intro-h">
      <div className="wrap intro__grid">
        <img
          className="intro__photo"
          src={IMG.window}
          alt={`${COUPLE.first} and ${COUPLE.second} framed in a window, black and white`}
        />
        <div className="intro__body">
          <h2 className="h2" id="intro-h">
            {COUPLE.full} Are Getting Married.
          </h2>
          <p className="small">
            Together with our families, we joyfully invite you to join us at {EVENT.venue} in {EVENT.town} as we 
            celebrate our wedding day, surrounded by love, faith, and the blessings of those closest to us.
          </p>
          <p className="intro__facts">
            <span>
              <b>{EVENT.dateLong}</b>
            </span>
            <span>
              {EVENT.ceremony.title} at {EVENT.ceremony.time}
            </span>
            <span>Reception at {EVENT.reception.time}</span>
          </p>
        </div>
        <div className="pair" aria-hidden="true">
          <img src={IMG.treehead} alt="" />
          <img src={IMG.wlead} alt="" style={{ objectPosition: '50% 35%' }} />
        </div>
      </div>
    </section>
  );
}
