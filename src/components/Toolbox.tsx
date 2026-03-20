import { stages } from '../stages';
import { useGameStore } from '../store/useGameStore';
import { t } from '../i18n/useI18n';

export function Toolbox() {
  const { lang, stageIndex, circuit, addComponent, removeComponent } = useGameStore();
  const stage = stages[stageIndex];

  return (
    <div className="panel">
      <h3>{t(lang, 'ui.toolbox')}</h3>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {stage.toolbox.map((part) => (
          <button
            key={part}
            draggable
            title="Drag to board"
            onDragStart={(e) => {
              e.dataTransfer.setData('application/x-electronics-part', part);
              e.dataTransfer.setData('text/plain', part);
              e.dataTransfer.effectAllowed = 'copy';
            }}
            onClick={() => addComponent(part)}
          >
            + {part}
          </button>
        ))}
      </div>

      <p className="small">部品をドラッグしてBoardにドロップでも追加できます</p>

      <p className="small">Components</p>
      <div style={{ display: 'grid', gap: 6 }}>
        {circuit.components.map((c) => (
          <div
            key={c.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #344258',
              borderRadius: 8,
              padding: '4px 6px'
            }}
          >
            <span className="small">
              {c.id} ({c.type}) {c.from}→{c.to}
            </span>
            <button disabled={c.type === 'battery'} onClick={() => removeComponent(c.id)}>
              -
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
