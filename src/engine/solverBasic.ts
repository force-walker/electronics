import type { CircuitState, Metrics } from '../types/circuit';

function getBattery(circuit: CircuitState) {
  return circuit.components.find((c) => c.type === 'battery');
}

function getResistors(circuit: CircuitState) {
  return circuit.components.filter((c) => c.type === 'resistor');
}

function parallel(rValues: number[]): number {
  const sumInv = rValues.reduce((acc, r) => acc + 1 / r, 0);
  return sumInv > 0 ? 1 / sumInv : Infinity;
}

function detectResistorTopology(circuit: CircuitState): 'single' | 'series' | 'parallel' {
  const battery = getBattery(circuit);
  const resistors = getResistors(circuit);
  if (!battery || resistors.length <= 1) return 'single';

  const a = battery.from;
  const b = battery.to;

  const allAcrossBattery = resistors.every(
    (r) => (r.from === a && r.to === b) || (r.from === b && r.to === a)
  );
  if (allAcrossBattery) return 'parallel';

  const nodes = new Set<string>();
  const degree = new Map<string, number>();
  for (const r of resistors) {
    nodes.add(r.from);
    nodes.add(r.to);
    degree.set(r.from, (degree.get(r.from) ?? 0) + 1);
    degree.set(r.to, (degree.get(r.to) ?? 0) + 1);
  }

  const isSimplePath =
    (degree.get(a) ?? 0) === 1 &&
    (degree.get(b) ?? 0) === 1 &&
    [...nodes].filter((n) => n !== a && n !== b).every((n) => (degree.get(n) ?? 0) === 2) &&
    resistors.length === nodes.size - 1;

  return isSimplePath ? 'series' : 'series';
}

export function solveBasic(circuit: CircuitState, mode: 'single' | 'auto'): Metrics {
  const battery = getBattery(circuit);
  const voltage = battery && 'voltage' in battery ? battery.voltage : 0;
  const rs = getResistors(circuit).map((c) => c.resistance).filter((r) => r > 0);

  let totalResistance = Infinity;

  if (mode === 'single') {
    totalResistance = rs[0] ?? Infinity;
  } else {
    const topology = detectResistorTopology(circuit);
    if (topology === 'parallel') totalResistance = parallel(rs);
    else totalResistance = rs.reduce((a, b) => a + b, 0);
  }

  const current = totalResistance > 0 && Number.isFinite(totalResistance) ? voltage / totalResistance : 0;
  const power = voltage * current;

  return {
    voltage,
    totalResistance: Number.isFinite(totalResistance) ? totalResistance : 0,
    current,
    power
  };
}
