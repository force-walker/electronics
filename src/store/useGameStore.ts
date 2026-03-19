import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CircuitState, Component, NodeId } from '../types/circuit';
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
}

const first = stages[0];

function cloneStageCircuit(stage: Stage): CircuitState {
  return structuredClone(stage.starterCircuit);
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
      }
    }),
    { name: 'electronics-mvp-store' }
  )
);
