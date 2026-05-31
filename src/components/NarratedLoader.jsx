import { useState, useEffect } from 'react';

const ORDER = ['understanding', 'comparing', 'building'];
const LABELS = {
  understanding: 'Understanding what matters to you',
  comparing: 'Comparing 50+ cars',
  building: 'Building your shortlist',
};

// Rotating car-buying tips to keep the user engaged while the AI works.
const TIPS = [
  '💡 A 5-star NCAP rating can be worth more than a sunroof — safety first.',
  '💡 On-road price ≈ ex-showroom + ~10% (RTO, insurance). Budget for it.',
  '💡 Diesel pays off mainly above ~15,000 km/year; otherwise petrol is simpler.',
  '💡 CNG slashes running costs in the city, but eats into boot space.',
  '💡 A strong-hybrid can deliver 25+ kmpl with zero charging hassle.',
  '💡 For EVs, check real-world range — it’s often ~80% of the claimed figure.',
  '💡 Higher ground clearance (190mm+) helps on broken roads and speed bumps.',
  '💡 Test-drive on your actual roads — city, highway, and a rough patch.',
];

export default function NarratedLoader({ step }) {
  const activeIdx = ORDER.indexOf(step);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTip((t) => (t + 1) % TIPS.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="screen center">
      <div className="loader">
        <div className="spinner" aria-hidden />
        <ul className="loader-steps">
          {ORDER.map((s, i) => (
            <li key={s} className={i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending'}>
              {i < activeIdx ? '✓ ' : i === activeIdx ? '› ' : ''}
              {LABELS[s]}…
            </li>
          ))}
        </ul>
        <div className="loader-tip" key={tip}>
          {TIPS[tip]}
        </div>
      </div>
    </div>
  );
}
