import type { Stage } from '../types/stage';

export const stage2: Stage = {
  id: 'stage2',
  titleKey: 'stage2.title',
  descriptionKey: 'stage2.desc',
  toolbox: ['battery', 'resistor'],
  starterCircuit: {
    nodes: ['n1', 'n2'],
    components: [
      { id: 'b1', type: 'battery', from: 'n1', to: 'n2', voltage: 9 },
      { id: 'r1', type: 'resistor', from: 'n2', to: 'n1', resistance: 220 }
    ]
  },
  condition: {
    currentMin: 0.028,
    currentMax: 0.032
  }
};
