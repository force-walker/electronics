import { stages } from '../stages';
import { useGameStore } from '../store/useGameStore';
import { t } from '../i18n/useI18n';

export function Header() {
  const { lang, setLang, stageIndex, setStage, resetStage } = useGameStore();

  return (
    <div className="panel" style={{ margin: 12, marginBottom: 0 }}>
      <h2>{t(lang, 'app.title')}</h2>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          {t(lang, 'ui.lang')}:{' '}
          <select value={lang} onChange={(e) => setLang(e.target.value as 'ja' | 'en')}>
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </label>

        <label>
          {t(lang, 'ui.stage')}:{' '}
          <select value={stageIndex} onChange={(e) => setStage(Number(e.target.value))}>
            {stages.map((s, i) => (
              <option value={i} key={s.id}>
                {t(lang, s.titleKey)}
              </option>
            ))}
          </select>
        </label>

        <button onClick={resetStage}>{t(lang, 'ui.reset')}</button>
      </div>
    </div>
  );
}
