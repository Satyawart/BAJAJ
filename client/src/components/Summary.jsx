import { useState, useEffect } from 'react';

function useCountUp(endValue, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * endValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [endValue, duration]);

  return count;
}

export default function Summary({ summary }) {
  const { total_trees, total_cycles, largest_tree_root } = summary;
  const animTrees = useCountUp(total_trees);
  const animCycles = useCountUp(total_cycles);

  return (
    <section className="summary-section">
      <h2 className="section-title">Summary</h2>
      <div className="summary-grid">
        <div className="summary-card glass">
          <div className="value value-trees">{animTrees}</div>
          <div className="label">Trees</div>
        </div>
        <div className="summary-card glass">
          <div className="value value-cycles">{animCycles}</div>
          <div className="label">Cycles</div>
        </div>
        <div className="summary-card glass root-highlight">
          <div className="value value-root">{largest_tree_root || '—'}</div>
          <div className="label">Largest Root</div>
        </div>
      </div>
    </section>
  );
}
