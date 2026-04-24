export function processGraph(validEdges) {
  const adjacency = new Map();
  const allNodes = new Set();

  for (const [source, target] of validEdges) {
    allNodes.add(source);
    allNodes.add(target);
    if (!adjacency.has(source)) adjacency.set(source, []);
    adjacency.get(source).push(target);
  }

  const components = findComponents(allNodes, validEdges);
  const hierarchies = [];

  for (const component of components) {
    if (detectCycle(component, adjacency)) {
      const root = [...component].sort()[0];
      hierarchies.push({ root, tree: {}, has_cycle: true });
    } else {
      const { treeAdj, roots } = buildTreeStructure(component, validEdges);
      for (const root of roots) {
        const tree = buildTree(root, treeAdj);
        const depth = calcDepth(root, treeAdj);
        hierarchies.push({ root, tree, depth });
      }
    }
  }

  return { hierarchies, summary: buildSummary(hierarchies) };
}

function findComponents(allNodes, validEdges) {
  const undirected = new Map();

  for (const [s, t] of validEdges) {
    if (!undirected.has(s)) undirected.set(s, []);
    if (!undirected.has(t)) undirected.set(t, []);
    undirected.get(s).push(t);
    undirected.get(t).push(s);
  }

  const visited = new Set();
  const components = [];

  for (const node of allNodes) {
    if (visited.has(node)) continue;

    const component = new Set();
    const stack = [node];
    visited.add(node);

    while (stack.length > 0) {
      const current = stack.pop();
      component.add(current);

      for (const neighbor of (undirected.get(current) || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
}

function detectCycle(component, adjacency) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  for (const node of component) color.set(node, WHITE);

  function dfs(node) {
    color.set(node, GRAY);
    for (const neighbor of (adjacency.get(node) || [])) {
      if (!component.has(neighbor)) continue;
      if (color.get(neighbor) === GRAY) return true;
      if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
    }
    color.set(node, BLACK);
    return false;
  }

  for (const node of component) {
    if (color.get(node) === WHITE && dfs(node)) return true;
  }
  return false;
}

function buildTreeStructure(component, validEdges) {
  const treeAdj = new Map();
  const parentMap = new Map();

  for (const [source, target] of validEdges) {
    if (!component.has(source) || !component.has(target)) continue;
    if (!parentMap.has(target)) {
      parentMap.set(target, source);
      if (!treeAdj.has(source)) treeAdj.set(source, []);
      treeAdj.get(source).push(target);
    }
  }

  const roots = [...component].filter(n => !parentMap.has(n));
  return { treeAdj, roots };
}

function buildTree(node, adjacency) {
  const tree = {};
  for (const child of (adjacency.get(node) || [])) {
    tree[child] = buildTree(child, adjacency);
  }
  return tree;
}

function calcDepth(node, adjacency) {
  const children = adjacency.get(node) || [];
  if (children.length === 0) return 1;

  let max = 0;
  for (const child of children) {
    max = Math.max(max, calcDepth(child, adjacency));
  }
  return 1 + max;
}

function buildSummary(hierarchies) {
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = '';
  let maxDepth = 0;

  for (const h of hierarchies) {
    if (h.has_cycle) {
      total_cycles++;
    } else {
      total_trees++;
      if (h.depth > maxDepth || (h.depth === maxDepth && h.root < largest_tree_root)) {
        maxDepth = h.depth;
        largest_tree_root = h.root;
      }
    }
  }

  return { total_trees, total_cycles, largest_tree_root };
}
