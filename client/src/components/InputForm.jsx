import { useState } from 'react';

export default function InputForm({ onSubmit, onClear, loading }) {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    // Only uppercase while typing to prevent cursor jumps
    setInput(e.target.value.toUpperCase());
  };

  const handleBlur = () => {
    // Strip spaces/tabs safely when the user clicks away
    setInput((prev) => prev.replace(/[ \t]+/g, ''));
  };

  const handleClear = (e) => {
    e.preventDefault();
    setInput('');
    if (onClear) onClear();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSubmit(input);
  };

  const loadExample = () => {
    setInput('A->B, A->C, B->D, X->Y, Y->Z, Z->X, P->Q, hello, A->B');
  };

  return (
    <form className="input-form glass" onSubmit={handleSubmit}>
      <label htmlFor="edge-input">Edge Data</label>
      <textarea
        id="edge-input"
        value={input}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={'A->B, A->C, B->D\nor one per line:\nX->Y\nY->Z'}
        spellCheck={false}
      />
      <div className="form-footer">
        <span className="form-hint">
          Comma or newline separated &middot;{' '}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); loadExample(); }}
            className="action-link text-accent"
          >
            Load example
          </a>
          {' '}&middot;{' '}
          <a
            href="#"
            onClick={handleClear}
            className="action-link text-muted"
          >
            Clear
          </a>
        </span>
        <button
          id="submit-btn"
          type="submit"
          className="btn-submit"
          disabled={loading || !input.trim()}
        >
          {loading ? 'Analyzing…' : 'Analyze Graph'}
        </button>
      </div>
    </form>
  );
}
