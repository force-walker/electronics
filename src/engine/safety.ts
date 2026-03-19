import type { CircuitState } from '../types/circuit';

export function hasWireOnlyShort(circuit: CircuitState): boolean {
  const battery = circuit.components.find((c) => c.type === 'battery');
  if (!battery) return false;

  const graph = new Map<string, Set<string>>();
  const addEdge = (a: string, b: string) => {
    if (!graph.has(a)) graph.set(a, new Set());
    if (!graph.has(b)) graph.set(b, new Set());
    graph.get(a)!.add(b);
    graph.get(b)!.add(a);
  };

  for (const c of circuit.components) {
    if (c.type === 'wire') addEdge(c.from, c.to);
  }

  const start = battery.from;
  const goal = battery.to;
  const q = [start];
  const seen = new Set<string>([start]);

  while (q.length) {
    const cur = q.shift()!;
    if (cur === goal) return true;
    for (const nxt of graph.get(cur) ?? []) {
      if (!seen.has(nxt)) {
        seen.add(nxt);
        q.push(nxt);
      }
    }
  }

  return false;
}
