import { useEffect, useState, useCallback } from 'react';
import { socket } from './socket.js';
import { pingHealth } from './utils/api.js';
import Home from './pages/Home.jsx';
import Results from './pages/Results.jsx';
import NarratedLoader from './components/NarratedLoader.jsx';

const STEPS = {
  understanding: 'Understanding what matters to you…',
  comparing: 'Comparing 40+ cars…',
  building: 'Building your shortlist…',
};

export default function App() {
  const [view, setView] = useState('home'); // home | loading | results | error
  const [step, setStep] = useState('understanding');
  const [data, setData] = useState(null); // { intent, results, ... }
  const [intentPreview, setIntentPreview] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState({ text: '', chips: [] });
  const [waking, setWaking] = useState(false);

  // Warm the backend on load (Render free dynos spin down) so the first
  // recommend isn't blocked by a cold start. Shows a subtle hint if it's slow.
  useEffect(() => {
    let done = false;
    const slow = setTimeout(() => !done && setWaking(true), 1500);
    pingHealth().finally(() => {
      done = true;
      clearTimeout(slow);
      setWaking(false);
    });
    return () => clearTimeout(slow);
  }, []);

  useEffect(() => {
    const onIntent = (intent) => {
      setIntentPreview(intent);
      setStep('comparing');
    };
    const onCandidates = () => setStep('building');
    const onShortlist = (payload) => {
      setData(payload);
      setView('results');
    };
    const onError = (e) => {
      setError(e);
      setView('error');
    };

    socket.on('intent', onIntent);
    socket.on('candidates', onCandidates);
    socket.on('shortlist', onShortlist);
    socket.on('error', onError);
    return () => {
      socket.off('intent', onIntent);
      socket.off('candidates', onCandidates);
      socket.off('shortlist', onShortlist);
      socket.off('error', onError);
    };
  }, []);

  const submit = useCallback(({ text, chips }) => {
    setLastQuery({ text, chips });
    setIntentPreview(null);
    setData(null);
    setError(null);
    setStep('understanding');
    setView('loading');
    socket.emit('recommend', { text, chips });
  }, []);

  const reset = useCallback(() => {
    setView('home');
    setData(null);
    setError(null);
    setIntentPreview(null);
  }, []);

  return (
    <div className="app">
      {waking && view === 'home' && (
        <div className="waking">Waking up the engine… (first load can take a few seconds)</div>
      )}

      {view === 'home' && <Home onSubmit={submit} initial={lastQuery} />}

      {view === 'loading' && <NarratedLoader label={STEPS[step]} step={step} />}

      {view === 'results' && data && <Results data={data} onReset={reset} />}

      {view === 'error' && (
        <div className="screen center">
          <div className="nudge">
            <h2>Let’s get this right</h2>
            <p>{error?.message || 'Something went wrong. Please try again.'}</p>
            <button className="btn" onClick={reset}>
              Try again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
