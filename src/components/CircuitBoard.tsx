import { useMemo, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { NodeId } from '../types/circuit';

type TerminalPick = { id: string; terminal: 'from' | 'to' } | null;

const nodePos: Record<NodeId, { x: number; y: number }> = {
  n1: { x: 80, y: 160 },
  n2: { x: 480, y: 160 },
  n3: { x: 280, y: 80 },
  n4: { x: 280, y: 240 }
};

function lineColor(type: string) {
  if (type === 'battery') return '#f7c948';
  if (type === 'resistor') return '#79b8ff';
  if (type === 'wire') return '#c3cad5';
  return '#c3cad5';
}

export function CircuitBoard() {
  const { stageIndex, circuit, setResistorValue, updateComponentTerminal, addWire } = useGameStore();
  const [pick, setPick] = useState<TerminalPick>(null);
  const [wireStart, setWireStart] = useState<NodeId | null>(null);

  const resistors = useMemo(() => circuit.components.filter((c) => c.type === 'resistor'), [circuit.components]);

  const onNodeClick = (node: NodeId) => {
    if (pick) {
      updateComponentTerminal(pick.id, pick.terminal, node);
      setPick(null);
      return;
    }
    if (stageIndex === 2) {
      if (!wireStart) setWireStart(node);
      else {
        addWire(wireStart, node);
        setWireStart(null);
      }
    }
  };

  return (
    <div className="panel board">
      <div style={{ width: '100%', maxWidth: 640 }}>
        <h3>Board (Wiring UI)</h3>
        <p className="small">
          端子(小円)→ノード(大円)をクリックで配線変更。Stage3はノード2点クリックでWire追加。
        </p>

        <svg width="100%" viewBox="0 0 560 320" style={{ background: '#111722', borderRadius: 8, marginTop: 8 }}>
          {circuit.components.map((c) => {
            const p1 = nodePos[c.from];
            const p2 = nodePos[c.to];
            if (!p1 || !p2) return null;
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            return (
              <g key={c.id}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={lineColor(c.type)} strokeWidth={4} />
                <text x={mx} y={my - 8} fill="#9fb3c8" fontSize={12} textAnchor="middle">
                  {c.id}:{c.type === 'resistor' && 'resistance' in c ? `${Math.round(c.resistance)}Ω` : c.type}
                </text>
                {(c.type === 'resistor' || c.type === 'wire') && (
                  <>
                    <circle
                      cx={p1.x}
                      cy={p1.y}
                      r={6}
                      fill={pick?.id === c.id && pick.terminal === 'from' ? '#ff8b8b' : '#ffffff'}
                      onClick={() => setPick({ id: c.id, terminal: 'from' })}
                      style={{ cursor: 'pointer' }}
                    />
                    <circle
                      cx={p2.x}
                      cy={p2.y}
                      r={6}
                      fill={pick?.id === c.id && pick.terminal === 'to' ? '#ff8b8b' : '#ffffff'}
                      onClick={() => setPick({ id: c.id, terminal: 'to' })}
                      style={{ cursor: 'pointer' }}
                    />
                  </>
                )}
              </g>
            );
          })}

          {Object.entries(nodePos)
            .filter(([id]) => circuit.nodes.includes(id))
            .map(([id, p]) => (
              <g key={id} onClick={() => onNodeClick(id)} style={{ cursor: 'pointer' }}>
                <circle cx={p.x} cy={p.y} r={14} fill={wireStart === id ? '#7ce38b' : '#26384f'} stroke="#5c7596" />
                <text x={p.x} y={p.y + 4} fill="#dbe8f7" fontSize={11} textAnchor="middle">
                  {id}
                </text>
              </g>
            ))}
        </svg>

        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          {resistors.map((r) => (
            <label key={r.id}>
              {r.id} Resistance (Ω): {Math.round(r.resistance)}
              <input
                style={{ width: '100%' }}
                type="range"
                min={10}
                max={1000}
                step={10}
                value={r.resistance}
                onChange={(e) => setResistorValue(Number(e.target.value), r.id)}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
