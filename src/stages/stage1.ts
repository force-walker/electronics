import type { Stage } from '../types/stage';

export const stage1: Stage = {
  id: 'stage1',
  titleKey: 'stage1.title',
  descriptionKey: 'stage1.desc',
  toolbox: ['battery', 'resistor'],
  starterCircuit: {
    nodes: ['n1', 'n2'],
    components: [
      { id: 'b1', type: 'battery', from: 'n1', to: 'n2', voltage: 9 },
      { id: 'r1', type: 'resistor', from: 'n2', to: 'n1', resistance: 330 }
    ]
  },
  condition: {
    currentMin: 0.02,
    currentMax: 0.03
  }
};
