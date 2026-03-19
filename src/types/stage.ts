import type { CircuitState, ComponentType } from './circuit';

export interface StageCondition {
  currentMin?: number;
  currentMax?: number;
  resistanceMin?: number;
  resistanceMax?: number;
  powerMax?: number;
  requiredTypes?: ComponentType[];
}

export interface Stage {
  id: string;
  titleKey: string;
  descriptionKey: string;
  starterCircuit: CircuitState;
  toolbox: ComponentType[];
  condition: StageCondition;
}
