import { useState } from 'react';
import Summary from './Summary';
import TreeView from './TreeView';
import ValidationFeedback from './ValidationFeedback';

export default function ResultView({ data, responseTime }) {
  const [copied, setCopied] = useState(false);
  const { hierarchies, summary, invalid_entries, duplicate_edges } = data;

  const hasValidation = invalid_entries?.length > 0 || duplicate_edges?.length > 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="results">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
        <div className="response-time">
          {responseTime && `Analysis completed in ${responseTime} ms`}
        </div>
        <button onClick={handleCopy} className={`btn-copy ${copied ? 'copied' : ''}`}>
          {copied ? '✓ Copied!' : 'Copy JSON'}
        </button>
      </div>

      {summary && <Summary summary={summary} />}

      {hierarchies?.length > 0 ? (
        <section className="hierarchies-section">
          <h2 className="section-title">Hierarchies</h2>
          {hierarchies.map((h, i) => (
            <HierarchyCard key={i} hierarchy={h} index={i} />
          ))}
        </section>
      ) : (
        <section className="hierarchies-section empty-hierarchies glass" style={{ animationDelay: '0.2s' }}>
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </div>
          <p>No valid hierarchies or cycles found based on the provided input.</p>
        </section>
      )}

      {hasValidation && (
        <ValidationFeedback
          invalidEntries={invalid_entries}
          duplicateEdges={duplicate_edges}
        />
      )}
    </div>
  );
}

function HierarchyCard({ hierarchy, index }) {
  const { root, tree, depth, has_cycle } = hierarchy;
  const isCyclic = !!has_cycle;
  const hasChildren = tree && Object.keys(tree).length > 0;

  return (
    <div 
      className={`hierarchy-card glass ${isCyclic ? 'cyclic' : ''}`}
      style={{ animationDelay: `${0.1 + (index * 0.08)}s` }}
    >
      <div className="hierarchy-header">
        <div className={`root-badge ${isCyclic ? 'cycle' : 'tree'}`}>{root}</div>
        <div className="hierarchy-meta">
          <div className="root-label">Root: {root}</div>
          <div className="meta-detail">
            {isCyclic ? 'Cyclic component' : `${countNodes(tree) + 1} nodes`}
          </div>
        </div>
        {isCyclic && <span className="cycle-tag">Cycle</span>}
        {!isCyclic && depth && <span className="depth-tag">Depth {depth}</span>}
      </div>

      {isCyclic ? (
        <div className="empty-tree">Cycle detected — tree cannot be constructed</div>
      ) : hasChildren ? (
        <div className="tree-container">
          <TreeView tree={tree} />
        </div>
      ) : (
        <div className="empty-tree">Leaf node — no children</div>
      )}
    </div>
  );
}

function countNodes(tree) {
  if (!tree) return 0;
  const keys = Object.keys(tree);
  return keys.reduce((sum, k) => sum + 1 + countNodes(tree[k]), 0);
}
