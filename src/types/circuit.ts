export type Lang = 'ja' | 'en';

export type ComponentType = 'battery' | 'resistor' | 'led' | 'wire';

export type NodeId = string;
export type ComponentId = string;

export interface BaseComponent {
  id: ComponentId;
  type: ComponentType;
  from: NodeId;
  to: NodeId;
}

export interface BatteryComponent extends BaseComponent {
  type: 'battery';
  voltage: number;
}

export interface ResistorComponent extends BaseComponent {
  type: 'resistor';
  resistance: number;
}

export interface LedComponent extends BaseComponent {
  type: 'led';
  forwardVoltage: number;
}

export interface WireComponent extends BaseComponent {
  type: 'wire';
  resistance: number;
}

export type Component = BatteryComponent | ResistorComponent | LedComponent | WireComponent;

export interface CircuitState {
  nodes: NodeId[];
  components: Component[];
}

export interface Metrics {
  voltage: number;
  totalResistance: number;
  current: number;
  power: number;
}
