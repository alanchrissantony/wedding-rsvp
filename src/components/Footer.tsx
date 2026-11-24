import { COUPLE, EVENT } from '../content';

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p className="foot__mark" aria-hidden="true">
          {COUPLE.full}
        </p>
        <div className="foot__grid">
          <div className="foot__left">
            <p>We can’t wait to celebrate with you.</p>
            <a className="btn btn--ghost" href="#wishes" style={{ justifySelf: 'start' }}>
              Send your wishes
            </a>
          </div>
          <div className="foot__cols">
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="#words">Our words</a></li>
                <li><a href="#blessing">Blessing</a></li>
                <li><a href="#schedule">Schedule</a></li>
                <li><a href="#families">Family blessings</a></li>
                <li><a href="#wishes">Send wishes</a></li>
              </ul>
            </div>
            <div>
              <h4>The Day</h4>
              <ul>
                <li>{EVENT.dateLong}</li>
                <li>
                  {EVENT.ceremony.title} {EVENT.ceremony.time}, {EVENT.ceremony.place}
                </li>
                <li>
                  Reception {EVENT.reception.time}, {EVENT.reception.place}
                </li>
                <li>
                  {EVENT.town}, {EVENT.region}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="foot__bar">
          <span>© 2026{COUPLE.full}</span>
          <a href="#top">Scroll to the Top</a>
        </div>
      </div>
    </footer>
  );
}
