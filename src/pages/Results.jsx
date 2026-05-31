import IntentChips from '../components/IntentChips.jsx';
import CompareGrid from '../components/CompareGrid.jsx';
import ExpertPicks from '../components/ExpertPicks.jsx';

export default function Results({ data, onReset }) {
  const { intent, results, expertPicks, overallNote, degraded } = data;

  return (
    <div className="screen results">
      <header className="results-head">
        <button className="btn btn-ghost back" onClick={onReset}>
          ← Start over
        </button>
        <h2>Based on what you told us, start here.</h2>
      </header>

      <IntentChips intent={intent} />

      {results.length === 0 ? (
        <div className="nudge">
          <p>We couldn’t find a close match. Try widening your budget or removing a preference.</p>
        </div>
      ) : (
        <>
          <p className="why-line">
            These {results.length} are your strongest fits — compared side by side on what matters to you.
          </p>
          <CompareGrid results={results} />
          {overallNote && <p className="overall-note">{overallNote}</p>}
          <ExpertPicks picks={expertPicks} />
        </>
      )}
    </div>
  );
}
