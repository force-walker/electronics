import { useMemo, useState, type MouseEventHandler } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { NodeId } from '../types/circuit';

type DragTerminal = { id: string; terminal: 'from' | 'to' } | null;

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
  const [dragTerminal, setDragTerminal] = useState<DragTerminal>(null);
  const [wireStart, setWireStart] = useState<NodeId | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);

  const resistors = useMemo(() => circuit.components.filter((c) => c.type === 'resistor'), [circuit.components]);

  const onSvgMove: MouseEventHandler<SVGSVGElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 560;
    const y = ((e.clientY - rect.top) / rect.height) * 320;
    setMouse({ x, y });
  };

  const onNodeMouseUp = (node: NodeId) => {
    if (dragTerminal) {
      updateComponentTerminal(dragTerminal.id, dragTerminal.terminal, node);
      setDragTerminal(null);
      return;
    }
    if (stageIndex === 2 && wireStart) {
      addWire(wireStart, node);
      setWireStart(null);
      return;
    }
  };

  return (
    <div className="panel board">
      <div style={{ width: '100%', maxWidth: 640 }}>
        <h3>Board (Drag Wiring)</h3>
        <p className="small">
          小円をドラッグしてノードへ接続変更。Stage3はノード→ノードをドラッグしてWire追加。
        </p>

        <svg
          width="100%"
          viewBox="0 0 560 320"
          style={{ background: '#111722', borderRadius: 8, marginTop: 8 }}
          onMouseMove={onSvgMove}
          onMouseUp={() => {
            setDragTerminal(null);
            setWireStart(null);
          }}
        >
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
                      fill={dragTerminal?.id === c.id && dragTerminal.terminal === 'from' ? '#ff8b8b' : '#ffffff'}
                      style={{ cursor: 'grab' }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDragTerminal({ id: c.id, terminal: 'from' });
                      }}
                    />
                    <circle
                      cx={p2.x}
                      cy={p2.y}
                      r={6}
                      fill={dragTerminal?.id === c.id && dragTerminal.terminal === 'to' ? '#ff8b8b' : '#ffffff'}
                      style={{ cursor: 'grab' }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDragTerminal({ id: c.id, terminal: 'to' });
                      }}
                    />
                  </>
                )}
              </g>
            );
          })}

          {dragTerminal && mouse && (() => {
            const comp = circuit.components.find((c) => c.id === dragTerminal.id);
            if (!comp) return null;
            const startNode = dragTerminal.terminal === 'from' ? comp.to : comp.from;
            const p = nodePos[startNode];
            if (!p) return null;
            return (
              <line
                x1={p.x}
                y1={p.y}
                x2={mouse.x}
                y2={mouse.y}
                stroke="#ff8b8b"
                strokeWidth={3}
                strokeDasharray="6 4"
              />
            );
          })()}

          {wireStart && mouse && (
            <line
              x1={nodePos[wireStart].x}
              y1={nodePos[wireStart].y}
              x2={mouse.x}
              y2={mouse.y}
              stroke="#7ce38b"
              strokeWidth={3}
              strokeDasharray="6 4"
            />
          )}

          {Object.entries(nodePos)
            .filter(([id]) => circuit.nodes.includes(id))
            .map(([id, p]) => (
              <g
                key={id}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  if (stageIndex === 2 && !dragTerminal) setWireStart(id);
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  onNodeMouseUp(id);
                }}
                style={{ cursor: 'pointer' }}
              >
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
