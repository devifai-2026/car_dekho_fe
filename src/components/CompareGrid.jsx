import { useState } from 'react';
import { inrToLakhStr } from '../utils/format.js';

const PAGE = 3; // first view shows top 3

const SPEC_LABELS = {
  priceLakh: 'Price (from)',
  mileageKmpl: 'Mileage',
  rangeKm: 'Range',
  ncapStars: 'Safety',
  seats: 'Seats',
  bootLitres: 'Boot',
};

function specValue(car, key) {
  switch (key) {
    case 'priceLakh':
      return inrToLakhStr(car.priceMinINR);
    case 'mileageKmpl':
      return car.mileageKmpl ? `${car.mileageKmpl} kmpl` : '—';
    case 'rangeKm':
      return car.rangeKm ? `${car.rangeKm} km` : '—';
    case 'ncapStars':
      return car.safety?.ncapStars ? `${car.safety.ncapStars}★ NCAP` : '—';
    case 'seats':
      return `${car.seats}`;
    case 'bootLitres':
      return car.bootLitres ? `${car.bootLitres} L` : '—';
    default:
      return '—';
  }
}

// Union of specsThatMatter across the shown cars, so rows are user-relevant.
function buildRows(cars) {
  const keys = [];
  for (const c of cars) for (const k of c.specsThatMatter || []) if (!keys.includes(k)) keys.push(k);
  ['priceLakh', 'ncapStars', 'mileageKmpl', 'seats'].forEach((k) => {
    if (!keys.includes(k)) keys.push(k);
  });
  return keys.filter((k) => SPEC_LABELS[k]);
}

export default function CompareGrid({ results }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(results.length / PAGE);
  const start = page * PAGE;
  const shown = results.slice(start, start + PAGE);
  const rows = buildRows(results);

  return (
    <div className="compare">
      {pages > 1 && (
        <div className="compare-nav">
          <button className="btn btn-ghost" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span className="compare-count">
            {start + 1}–{Math.min(start + PAGE, results.length)} of {results.length}
          </span>
          <button
            className="btn btn-ghost"
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      <div className="compare-grid" style={{ gridTemplateColumns: `160px repeat(${shown.length}, 1fr)` }}>
        {/* Header row: car identity + match score */}
        <div className="cell row-head" />
        {shown.map((c) => (
          <div key={c.sku} className="cell car-head">
            <div className="rank-badge">#{c.rank}</div>
            <div className="car-name">
              {c.make} {c.model}
            </div>
            <div className="car-variant">{c.variant}</div>
            <div className="score">
              <span className="score-num">{c.matchScore}% match</span>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${c.matchScore}%` }} />
              </div>
            </div>
          </div>
        ))}

        {/* Pitch row — persuasive hook */}
        <div className="cell row-head">Why you’ll love it</div>
        {shown.map((c) => (
          <div key={c.sku + '-pitch'} className="cell pitch">
            {c.pitch}
          </div>
        ))}

        {/* Rationale row */}
        <div className="cell row-head">Why this fits</div>
        {shown.map((c) => (
          <div key={c.sku + '-r'} className="cell rationale">
            {c.rationale}
          </div>
        ))}

        {/* Spec rows (price row is visually emphasized) */}
        {rows.map((key) => (
          <Row
            key={key}
            label={SPEC_LABELS[key]}
            cars={shown}
            render={(c) => specValue(c, key)}
            highlight={key === 'priceLakh'}
          />
        ))}

        {/* Pros — highlighted "Good for you" section */}
        <div className="cell row-head head-pros">✓ Good for you</div>
        {shown.map((c) => (
          <div key={c.sku + '-p'} className="cell list cell-pros">
            <ul className="pros">
              {c.prosForUser.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Cons */}
        <div className="cell row-head">Worth knowing</div>
        {shown.map((c) => (
          <div key={c.sku + '-c'} className="cell list">
            <ul className="cons">
              {c.consForUser.length ? (
                c.consForUser.map((p, i) => <li key={i}>– {p}</li>)
              ) : (
                <li className="muted">No notable downsides for your needs</li>
              )}
            </ul>
          </div>
        ))}

        {/* Review + brochure */}
        <div className="cell row-head">Owners say</div>
        {shown.map((c) => (
          <div key={c.sku + '-rev'} className="cell review">
            <p>{c.reviewSummary}</p>
            {c.brochureUrl && (
              <a className="brochure" href={c.brochureUrl} target="_blank" rel="noreferrer">
                View brochure →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, cars, render, highlight = false }) {
  return (
    <>
      <div className={`cell row-head ${highlight ? 'head-price' : ''}`}>{label}</div>
      {cars.map((c) => (
        <div key={c.sku + '-' + label} className={`cell spec ${highlight ? 'cell-price' : ''}`}>
          {render(c)}
        </div>
      ))}
    </>
  );
}
