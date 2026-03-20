import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CircuitState, Component, ComponentType, NodeId } from '../types/circuit';
import type { Stage } from '../types/stage';
import { stages } from '../stages';

type TopologyMode = 'single' | 'auto';

interface GameState {
  lang: 'ja' | 'en';
  stageIndex: number;
  circuit: CircuitState;
  topologyMode: TopologyMode;
  setLang: (lang: 'ja' | 'en') => void;
  setStage: (index: number) => void;
  resetStage: () => void;
  setResistorValue: (resistance: number, resistorId?: string) => void;
  updateComponentTerminal: (id: string, terminal: 'from' | 'to', node: NodeId) => void;
  addWire: (from: NodeId, to: NodeId) => void;
  addComponent: (type: ComponentType) => void;
  removeComponent: (id: string) => void;
}

const first = stages[0];

function cloneStageCircuit(stage: Stage): CircuitState {
  return structuredClone(stage.starterCircuit);
}

function defaultNodePair(nodes: NodeId[]): { from: NodeId; to: NodeId } {
  const from = nodes[0] ?? 'n1';
  const to = nodes[1] ?? from;
  return { from, to };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      lang: 'ja',
      stageIndex: 0,
      circuit: cloneStageCircuit(first),
      topologyMode: 'single',
      setLang: (lang) => set({ lang }),
      setStage: (index) => {
        const stage = stages[index];
        set({
          stageIndex: index,
          circuit: cloneStageCircuit(stage),
          topologyMode: index === 2 ? 'auto' : 'single'
        });
      },
      resetStage: () => {
        const stage = stages[get().stageIndex];
        set({
          circuit: cloneStageCircuit(stage),
          topologyMode: get().stageIndex === 2 ? 'auto' : 'single'
        });
      },
      setResistorValue: (resistance, resistorId) => {
        const next = structuredClone(get().circuit);
        const target = resistorId
          ? next.components.find((c) => c.id === resistorId && c.type === 'resistor')
          : next.components.find((c) => c.type === 'resistor');
        if (target && 'resistance' in target) target.resistance = resistance;
        set({ circuit: next });
      },
      updateComponentTerminal: (id, terminal, node) => {
        const next = structuredClone(get().circuit);
        const comp = next.components.find((c) => c.id === id);
        if (!comp) return;
        comp[terminal] = node;
        set({ circuit: next });
      },
      addWire: (from, to) => {
        if (from === to) return;
        const next = structuredClone(get().circuit);
        const id = `w${Date.now().toString(36)}`;
        const wire: Component = {
          id,
          type: 'wire',
          from,
          to,
          resistance: 0.0001
        };
        next.components.push(wire);
        set({ circuit: next });
      },
      addComponent: (type) => {
        const next = structuredClone(get().circuit);
        const { from, to } = defaultNodePair(next.nodes);
        const id = `${type[0]}${Date.now().toString(36)}`;

        let component: Component | null = null;
        if (type === 'resistor') {
          component = { id, type: 'resistor', from, to, resistance: 220 };
        } else if (type === 'wire') {
          component = { id, type: 'wire', from, to, resistance: 0.0001 };
        } else if (type === 'led') {
          component = { id, type: 'led', from, to, forwardVoltage: 2.0 };
        } else if (type === 'battery') {
          const batteryCount = next.components.filter((c) => c.type === 'battery').length;
          if (batteryCount > 0) return;
          component = { id, type: 'battery', from, to, voltage: 9 };
        }

        if (!component) return;
        next.components.push(component);
        set({ circuit: next });
      },
      removeComponent: (id) => {
        const next = structuredClone(get().circuit);
        const target = next.components.find((c) => c.id === id);
        if (!target || target.type === 'battery') return;
        next.components = next.components.filter((c) => c.id !== id);
        set({ circuit: next });
      }
    }),
    { name: 'electronics-mvp-store' }
  )
);
