import type { Metrics } from '../types/circuit';
import type { StageCondition } from '../types/stage';

export function isCleared(metrics: Metrics, condition: StageCondition): boolean {
  if (condition.currentMin != null && metrics.current < condition.currentMin) return false;
  if (condition.currentMax != null && metrics.current > condition.currentMax) return false;
  if (condition.resistanceMin != null && metrics.totalResistance < condition.resistanceMin) return false;
  if (condition.resistanceMax != null && metrics.totalResistance > condition.resistanceMax) return false;
  if (condition.powerMax != null && metrics.power > condition.powerMax) return false;
  return true;
}
