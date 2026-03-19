import { t } from '../i18n/useI18n';
import { useGameStore } from '../store/useGameStore';
import type { Metrics } from '../types/circuit';

export function MetricsPanel({ metrics }: { metrics: Metrics }) {
  const { lang } = useGameStore();

  return (
    <div className="panel">
      <h3>Metrics</h3>
      <div className="metric"><span>{t(lang, 'metric.voltage')}</span><span>{metrics.voltage.toFixed(2)} V</span></div>
      <div className="metric"><span>{t(lang, 'metric.current')}</span><span>{metrics.current.toFixed(4)} A</span></div>
      <div className="metric"><span>{t(lang, 'metric.resistance')}</span><span>{metrics.totalResistance.toFixed(2)} Ω</span></div>
      <div className="metric"><span>{t(lang, 'metric.power')}</span><span>{metrics.power.toFixed(3)} W</span></div>
    </div>
  );
}
