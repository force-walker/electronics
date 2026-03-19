import type { Stage } from '../types/stage';

export const stage3: Stage = {
  id: 'stage3',
  titleKey: 'stage3.title',
  descriptionKey: 'stage3.desc',
  toolbox: ['battery', 'resistor', 'wire'],
  starterCircuit: {
    nodes: ['n1', 'n2', 'n3'],
    components: [
      { id: 'b1', type: 'battery', from: 'n1', to: 'n2', voltage: 12 },
      { id: 'r1', type: 'resistor', from: 'n2', to: 'n3', resistance: 100 },
      { id: 'r2', type: 'resistor', from: 'n3', to: 'n1', resistance: 100 }
    ]
  },
  condition: {
    resistanceMin: 150,
    resistanceMax: 250
  }
};
