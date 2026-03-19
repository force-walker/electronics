import { stages } from '../stages';
import { useGameStore } from '../store/useGameStore';
import { t } from '../i18n/useI18n';

export function Toolbox() {
  const { lang, stageIndex } = useGameStore();
  const stage = stages[stageIndex];

  return (
    <div className="panel">
      <h3>{t(lang, 'ui.toolbox')}</h3>
      <ul>
        {stage.toolbox.map((part) => (
          <li key={part}>{part}</li>
        ))}
      </ul>
      <p className="small">MVP: 配置UIは次フェーズで拡張</p>
    </div>
  );
}
