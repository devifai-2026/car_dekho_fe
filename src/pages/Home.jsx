import { useState, useEffect, useRef } from 'react';

const EXAMPLE =
  'I have a family of 4, drive ~40km daily in city traffic, budget around 12 lakhs, and safety is my top concern.';

// Suggested starter prompts — pick one to fill the box, then edit freely.
const SUGGESTIONS = [
  { emoji: '👨‍👩‍👧‍👦', title: 'Safe family car', text: 'I have a family of 4, drive ~40km daily in city traffic, budget around 12 lakhs, and safety is my top concern.' },
  { emoji: '🅿️', title: 'First car, city', text: 'First-time buyer, mostly city commute under 8 lakhs, want great mileage and easy parking.' },
  { emoji: '🏔️', title: 'Luxury off-roader', text: 'Me and my wife want a luxury, premium SUV for long off-road drives in the hills for our YouTube vlogs — open to an EV.' },
];

const CHIPS = [
  { id: 'family', label: 'Family car' },
  { id: 'city-commute', label: 'Daily city commute' },
  { id: 'highway', label: 'Long highway trips' },
  { id: 'value', label: 'Best value' },
  { id: 'first-car', label: 'First car' },
];

export default function Home({ onSubmit, initial }) {
  const [text, setText] = useState(initial?.text || '');
  const [chips, setChips] = useState(initial?.chips || []);
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  // Auto-rotate the suggestion carousel until the user interacts.
  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setActive((i) => (i + 1) % SUGGESTIONS.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const toggleChip = (id) =>
    setChips((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));

  const pickSuggestion = (i) => {
    paused.current = true;
    setActive(i);
    setText(SUGGESTIONS[i].text);
  };

  const canSubmit = text.trim().length >= 10;

  return (
    <div className="screen center">
      <div className="hero">
        <h1>Tell us about your life, and we’ll find your car.</h1>
        <p className="sub">No car jargon needed — just describe how you’ll use it.</p>

        <textarea
          className="prompt"
          rows={4}
          placeholder={EXAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div
          className="suggest"
          onMouseEnter={() => (paused.current = true)}
          onMouseLeave={() => (paused.current = false)}
        >
          <span className="suggest-label">Not sure where to start? Pick one and tweak it:</span>
          <div className="suggest-viewport">
            <div className="suggest-track" style={{ transform: `translateX(-${active * 100}%)` }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="suggest-slide"
                  onClick={() => pickSuggestion(i)}
                >
                  <span className="suggest-emoji">{s.emoji}</span>
                  <span className="suggest-body">
                    <span className="suggest-title">{s.title}</span>
                    <span className="suggest-text">{s.text}</span>
                  </span>
                  <span className="suggest-use">Use this →</span>
                </button>
              ))}
            </div>
          </div>
          <div className="suggest-dots">
            {SUGGESTIONS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Suggestion ${i + 1}`}
                className={`dot ${i === active ? 'dot-on' : ''}`}
                onClick={() => { paused.current = true; setActive(i); }}
              />
            ))}
          </div>
        </div>

        <div className="chips-row">
          <span className="chips-label">Optional — tap if any apply:</span>
          <div className="chips">
            {CHIPS.map((c) => (
              <button
                key={c.id}
                className={`chip ${chips.includes(c.id) ? 'chip-on' : ''}`}
                onClick={() => toggleChip(c.id)}
                type="button"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          disabled={!canSubmit}
          onClick={() => onSubmit({ text: text.trim(), chips })}
        >
          Find my cars
        </button>
      </div>
    </div>
  );
}
