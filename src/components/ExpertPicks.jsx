import { lakhStr } from '../utils/format.js';

// Optional "stretch a little" upsell — simple grid cards, no comparison.
export default function ExpertPicks({ picks }) {
  if (!picks || !picks.length) return null;

  return (
    <section className="expert">
      <div className="expert-head">
        <h3>★ Expert’s picks — worth a small stretch</h3>
        <p>A little above your shortlist (≈₹2–5L more), but a noticeable step up for what you want.</p>
      </div>
      <div className="expert-grid">
        {picks.map((p) => (
          <div key={p.sku} className="expert-card">
            <span className="expert-badge">{p.headline}</span>
            <div className="expert-name">
              {p.make} {p.model}
            </div>
            <div className="expert-variant">{p.variant}</div>
            <div className="expert-price">{lakhStr(p.priceLakh)}</div>
            <p className="expert-why">{p.whyStretch}</p>
            {p.extraFeatures?.length > 0 && (
              <ul className="expert-extras">
                {p.extraFeatures.map((f, i) => (
                  <li key={i}>＋ {f}</li>
                ))}
              </ul>
            )}
            {p.brochureUrl && (
              <a className="brochure" href={p.brochureUrl} target="_blank" rel="noreferrer">
                View brochure →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
