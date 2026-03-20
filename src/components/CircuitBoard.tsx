import { useMemo, useState, type DragEventHandler, type MouseEventHandler } from 'react';
import { useGameStore } from '../store/useGameStore';
import type { ComponentType, NodeId } from '../types/circuit';

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

function nearestTwoNodes(x: number, y: number, nodes: NodeId[]): [NodeId, NodeId] | null {
  const list = nodes
    .map((id) => {
      const p = nodePos[id];
      if (!p) return null;
      const d = Math.hypot(p.x - x, p.y - y);
      return { id, d };
    })
    .filter((v): v is { id: NodeId; d: number } => !!v)
    .sort((a, b) => a.d - b.d);

  if (list.length < 2) return null;
  return [list[0].id, list[1].id];
}

export function CircuitBoard() {
  const { stageIndex, circuit, setResistorValue, updateComponentTerminal, addWire, addComponentBetween } =
    useGameStore();
  const [dragTerminal, setDragTerminal] = useState<DragTerminal>(null);
  const [pickTerminal, setPickTerminal] = useState<DragTerminal>(null);
  const [wireStart, setWireStart] = useState<NodeId | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [isDropTarget, setIsDropTarget] = useState(false);

  const resistors = useMemo(() => circuit.components.filter((c) => c.type === 'resistor'), [circuit.components]);

  const onSvgMove: MouseEventHandler<SVGSVGElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 560;
    const y = ((e.clientY - rect.top) / rect.height) * 320;
    setMouse({ x, y });
  };

  const onNodeMouseUp = (node: NodeId) => {
    const active = dragTerminal ?? pickTerminal;
    if (active) {
      updateComponentTerminal(active.id, active.terminal, node);
      setDragTerminal(null);
      setPickTerminal(null);
      return;
    }
    if (stageIndex === 2 && wireStart) {
      addWire(wireStart, node);
      setWireStart(null);
      return;
    }
  };

  const onDragOver: DragEventHandler<SVGSVGElement> = (e) => {
    if (
      e.dataTransfer.types.includes('application/x-electronics-part') ||
      e.dataTransfer.types.includes('text/plain')
    ) {
      e.preventDefault();
      setIsDropTarget(true);
    }
  };

  const onDrop: DragEventHandler<SVGSVGElement> = (e) => {
    const part = (e.dataTransfer.getData('application/x-electronics-part') ||
      e.dataTransfer.getData('text/plain')) as ComponentType;
    if (!part) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 560;
    const y = ((e.clientY - rect.top) / rect.height) * 320;
    const pair = nearestTwoNodes(x, y, circuit.nodes);
    if (pair) addComponentBetween(part, pair[0], pair[1]);

    setIsDropTarget(false);
  };

  return (
    <div className="panel board">
      <div style={{ width: '100%', maxWidth: 640 }}>
        <h3>Board (Drag Wiring)</h3>
        <p className="small">小円をドラッグ（または小円クリック→ノードクリック）で接続変更。部品ボタンは盤面へドロップで追加。</p>

        <svg
          width="100%"
          viewBox="0 0 560 320"
          style={{
            background: isDropTarget ? '#152133' : '#111722',
            borderRadius: 8,
            marginTop: 8,
            outline: isDropTarget ? '2px dashed #7ce38b' : 'none'
          }}
          onMouseMove={onSvgMove}
          onMouseUp={() => {
            setDragTerminal(null);
            setWireStart(null);
          }}
          onDragEnter={(e) => {
            if (
              e.dataTransfer.types.includes('application/x-electronics-part') ||
              e.dataTransfer.types.includes('text/plain')
            )
              setIsDropTarget(true);
          }}
          onDragLeave={() => setIsDropTarget(false)}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {circuit.components.map((c, idx) => {
            const p1 = nodePos[c.from];
            const p2 = nodePos[c.to];
            if (!p1 || !p2) return null;
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const label = `${c.id}:${c.type === 'resistor' && 'resistance' in c ? `${Math.round(c.resistance)}Ω` : c.type}`;
            const labelY = my - 12 - (idx % 3) * 16;
            const labelW = Math.max(64, label.length * 6.8);
            return (
              <g key={c.id}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={lineColor(c.type)} strokeWidth={4} />
                <rect x={mx - labelW / 2 - 4} y={labelY - 12} width={labelW + 8} height={16} rx={4} fill="#0b1220cc" />
                <text x={mx} y={labelY} fill="#c5d5e8" fontSize={13} textAnchor="middle">
                  {label}
                </text>

                <>
                  <circle
                    cx={p1.x}
                    cy={p1.y}
                    r={6}
                    fill={
                      (dragTerminal?.id === c.id && dragTerminal.terminal === 'from') ||
                      (pickTerminal?.id === c.id && pickTerminal.terminal === 'from')
                        ? '#ff8b8b'
                        : '#ffffff'
                    }
                    style={{ cursor: 'grab' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDragTerminal({ id: c.id, terminal: 'from' });
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPickTerminal({ id: c.id, terminal: 'from' });
                    }}
                  />
                  <circle
                    cx={p2.x}
                    cy={p2.y}
                    r={6}
                    fill={
                      (dragTerminal?.id === c.id && dragTerminal.terminal === 'to') ||
                      (pickTerminal?.id === c.id && pickTerminal.terminal === 'to')
                        ? '#ff8b8b'
                        : '#ffffff'
                    }
                    style={{ cursor: 'grab' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDragTerminal({ id: c.id, terminal: 'to' });
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPickTerminal({ id: c.id, terminal: 'to' });
                    }}
                  />
                </>
              </g>
            );
          })}

          {dragTerminal && mouse && (() => {
            const comp = circuit.components.find((c) => c.id === dragTerminal.id);
            if (!comp) return null;
            const startNode = dragTerminal.terminal === 'from' ? comp.to : comp.from;
            const p = nodePos[startNode];
            if (!p) return null;
            return <line x1={p.x} y1={p.y} x2={mouse.x} y2={mouse.y} stroke="#ff8b8b" strokeWidth={3} strokeDasharray="6 4" />;
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
                <text x={p.x} y={p.y + 4} fill="#dbe8f7" fontSize={12} textAnchor="middle">
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
