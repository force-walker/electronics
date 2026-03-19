import { stages } from '../stages';
import { t } from '../i18n/useI18n';
import { useGameStore } from '../store/useGameStore';
import { isCleared } from '../engine/evaluator';
import type { Metrics } from '../types/circuit';

export function StagePanel({ metrics, hasShort }: { metrics: Metrics; hasShort: boolean }) {
  const { lang, stageIndex } = useGameStore();
  const stage = stages[stageIndex];
  const cleared = !hasShort && isCleared(metrics, stage.condition);

  return (
    <div className="panel">
      <h3>{t(lang, stage.titleKey)}</h3>
      <p>{t(lang, stage.descriptionKey)}</p>
      <h4 style={{ marginTop: 12 }}>{t(lang, 'ui.condition')}</h4>
      <pre className="small" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(stage.condition, null, 2)}</pre>
      {hasShort && (
        <p className="stage-ng" style={{ fontWeight: 700 }}>
          ⚠ {t(lang, 'status.short')}
        </p>
      )}
      <p className={cleared ? 'stage-ok' : 'stage-ng'}>
        {cleared ? t(lang, 'status.clear') : t(lang, 'status.notyet')}
      </p>
    </div>
  );
}
