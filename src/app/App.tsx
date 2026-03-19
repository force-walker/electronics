import { Header } from '../components/Header';
import { Toolbox } from '../components/Toolbox';
import { CircuitBoard } from '../components/CircuitBoard';
import { MetricsPanel } from '../components/MetricsPanel';
import { StagePanel } from '../components/StagePanel';
import { useGameStore } from '../store/useGameStore';
import { solveBasic } from '../engine/solverBasic';
import { hasWireOnlyShort } from '../engine/safety';

export function App() {
  const { circuit, stageIndex } = useGameStore();
  const mode = stageIndex === 0 || stageIndex === 1 ? 'single' : 'auto';
  const metrics = solveBasic(circuit, mode);
  const short = hasWireOnlyShort(circuit);

  return (
    <>
      <Header />
      <main className="layout">
        <Toolbox />
        <CircuitBoard />
        <div style={{ display: 'grid', gap: 12 }}>
          <MetricsPanel metrics={metrics} />
          <StagePanel metrics={metrics} hasShort={short} />
        </div>
      </main>
    </>
  );
}
