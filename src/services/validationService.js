const EDGE_PATTERN = /^([A-Z])->([A-Z])$/;

export function validateInput(data) {
  const validEdges = [];
  const invalid_entries = [];
  const duplicate_edges = [];
  const seen = new Set();

  for (const raw of data) {
    if (typeof raw !== 'string') {
      invalid_entries.push(String(raw));
      continue;
    }

    const trimmed = raw.trim();
    const match = trimmed.match(EDGE_PATTERN);

    if (!match) {
      invalid_entries.push(trimmed);
      continue;
    }

    const [, source, target] = match;

    if (source === target) {
      invalid_entries.push(trimmed);
      continue;
    }

    const key = `${source}->${target}`;

    if (seen.has(key)) {
      duplicate_edges.push(key);
      continue;
    }

    seen.add(key);
    validEdges.push([source, target]);
  }

  return { validEdges, invalid_entries, duplicate_edges };
}
