import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);

  const handleSubmit = async (input) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setResponseTime(null);

    try {
      const edges = input
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const startTime = performance.now();
      const res = await fetch('https://bajaj-sqaq.onrender.com/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: edges }),
      });
      const endTime = performance.now();

      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      const data = await res.json();

      if (!data.is_success) throw new Error(data.error || 'Processing failed');

      setResponseTime((endTime - startTime).toFixed(0));
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
    setResponseTime(null);
  };

  return (
    <>
      <header className="header">
        <h1>Graph Analyzer</h1>
        <p>Visualize hierarchies, detect cycles, and analyze tree structures</p>
      </header>

      <InputForm onSubmit={handleSubmit} onClear={handleClear} loading={loading} />

      {error && <div className="error-banner">{error}</div>}

      {loading && (
        <div className="loader">
          <div className="spinner" />
        </div>
      )}

      {result && <ResultView data={result} responseTime={responseTime} />}

      <footer className="footer">
        Built with focus on performance, scalability, and UX clarity.
      </footer>
    </>
  );
}
