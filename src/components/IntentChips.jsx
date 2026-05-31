import { inrToLakhStr } from '../utils/format.js';

const fmtLakh = (inr) => inrToLakhStr(inr, 1);

// Read-only "Here's what we heard" — the trust mechanism that replaces the interview.
export default function IntentChips({ intent }) {
  if (!intent) return null;
  const chips = [];

  if (intent.budgetMax > 0) {
    chips.push(
      intent.budgetMin > 0
        ? `Budget ${fmtLakh(intent.budgetMin)}–${fmtLakh(intent.budgetMax)}`
        : `Budget under ${fmtLakh(intent.budgetMax)}`
    );
  } else {
    chips.push('No budget set — ranked on fit');
  }
  if (intent.vibe) chips.push(`Vibe: ${intent.vibe}`);
  if (intent.familySize > 0) chips.push(`For ${intent.familySize} people`);
  else if (intent.seatsMin > 0) chips.push(`${intent.seatsMin}+ seats`);
  if (intent.usage) chips.push(`Mostly ${intent.usage}`);
  (intent.terrain || []).forEach((t) => chips.push(`Terrain: ${t}`));
  (intent.useCases || []).forEach((u) => chips.push(u));
  if (intent.bodyType?.length) chips.push(intent.bodyType.join(' / '));
  if (intent.fuelType?.length) chips.push(intent.fuelType.join(' / '));
  if (intent.evOpen) chips.push('Open to EV');
  (intent.priorities || []).forEach((p) => chips.push(`Priority: ${p}`));

  return (
    <div className="intent">
      <span className="intent-label">Here’s what we heard</span>
      <div className="intent-chips">
        {chips.length ? (
          chips.map((c, i) => (
            <span key={i} className="intent-chip">
              {c}
            </span>
          ))
        ) : (
          <span className="intent-chip muted">a good all-round car</span>
        )}
      </div>
    </div>
  );
}
