import { useState } from 'react';

export default function TreeView({ tree }) {
  return (
    <div>
      {Object.entries(tree).map(([name, children]) => (
        <TreeNode key={name} name={name} children={children} />
      ))}
    </div>
  );
}

function TreeNode({ name, children }) {
  const childEntries = Object.entries(children || {});
  const childCount = childEntries.length;
  const hasChildren = childCount > 0;
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="tree-node">
      <div 
        className="tree-node-label group tooltip-anchor" 
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren && (
          <span className={`toggle-icon ${expanded ? '' : 'collapsed'}`}>▼</span>
        )}
        <div className={`node-badge ${hasChildren ? 'has-children' : 'leaf-node'}`}>
          {name}
        </div>
        
        {/* Custom Tooltip */}
        <div className="hover-tooltip">
          <strong>Node:</strong> {name}<br/>
          <strong>Children:</strong> {childCount}
        </div>
      </div>

      {hasChildren && (
        <div
          className={`tree-children ${expanded ? 'expanded' : 'collapsed'}`}
          style={{ maxHeight: expanded ? `${childCount * 300}px` : 0 }}
        >
          {childEntries.map(([childName, grandChildren]) => (
            <TreeNode key={childName} name={childName} children={grandChildren} />
          ))}
        </div>
      )}
    </div>
  );
}
