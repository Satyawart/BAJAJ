export default function ValidationFeedback({ invalidEntries = [], duplicateEdges = [] }) {
  if (!invalidEntries.length && !duplicateEdges.length) return null;

  return (
    <section className="validation-section">
      <h2 className="section-title">Validation</h2>

      <div className="glass" style={{ padding: '20px 24px' }}>
        {invalidEntries.length > 0 && (
          <div className="validation-group">
            <div className="validation-header">
              <span className="validation-icon invalid">✕</span>
              <span className="validation-label">Invalid Entries</span>
              <span className="validation-count">{invalidEntries.length}</span>
            </div>
            <div className="tag-list">
              {invalidEntries.map((entry, i) => (
                <span key={i} className="tag invalid">{entry || '(empty)'}</span>
              ))}
            </div>
          </div>
        )}

        {duplicateEdges.length > 0 && (
          <div className="validation-group">
            <div className="validation-header">
              <span className="validation-icon duplicate">!</span>
              <span className="validation-label">Duplicate Edges</span>
              <span className="validation-count">{duplicateEdges.length}</span>
            </div>
            <div className="tag-list">
              {duplicateEdges.map((edge, i) => (
                <span key={i} className="tag duplicate">{edge}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
