import { useState } from 'react';
import { INITIAL_INITIATIVES, PHASES } from './data/socialData';
import { Header } from './components/Header';
import { InitiativeSelector } from './components/InitiativeSelector';
import { PipelineTracker } from './components/PipelineTracker';
import { InitiativeCard } from './components/InitiativeCard';
import { Footer } from './components/Footer';
import { StatusReportModal } from './components/StatusReportModal';
import { PhaseId, SocialInitiative } from './types';

export function App() {
  const [initiatives, setInitiatives] = useState<SocialInitiative[]>(INITIAL_INITIATIVES);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_INITIATIVES[0].id);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const selectedInitiative =
    initiatives.find((i) => i.id === selectedId) || initiatives[0];

  // Alternar item do checklist com cálculo direto e transparente dos 4 gates
  const handleToggleChecklist = (itemId: string) => {
    setInitiatives((prev) =>
      prev.map((init) => {
        if (init.id !== selectedId) return init;

        const updatedChecklist = init.readinessChecklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        // Cada portão cumprido vale 25% (4 portões objetivos de prontidão = 100%)
        const completedCount = updatedChecklist.filter((i) => i.completed).length;
        const totalCount = updatedChecklist.length;
        const calculatedProgress = Math.round((completedCount / totalCount) * 100);

        let newStatus = init.status;
        let newStatusLabel = init.statusLabel;

        if (calculatedProgress === 100) {
          newStatus = 'completed';
          newStatusLabel = 'Autossustentável';
        } else if (init.bottleneck) {
          newStatus = 'attention';
          newStatusLabel = 'Ponto de Atenção';
        } else {
          newStatus = 'on_track';
          newStatusLabel = 'No Prazo';
        }

        return {
          ...init,
          readinessChecklist: updatedChecklist,
          progressPercentage: calculatedProgress,
          status: newStatus,
          statusLabel: newStatusLabel,
        };
      })
    );
  };

  // Avançar para a próxima etapa da esteira
  const handleAdvancePhase = () => {
    setInitiatives((prev) =>
      prev.map((init) => {
        if (init.id !== selectedId) return init;

        const currentIndex = PHASES.findIndex((p) => p.id === init.currentPhase);

        if (currentIndex < PHASES.length - 1) {
          const nextPhase = PHASES[currentIndex + 1].id;
          return {
            ...init,
            currentPhase: nextPhase as PhaseId,
            status: init.bottleneck ? ('attention' as const) : ('on_track' as const),
            statusLabel: init.bottleneck ? 'Ponto de Atenção' : 'No Prazo',
          };
        } else {
          return {
            ...init,
            status: 'completed' as const,
            statusLabel: 'Autossustentável',
            progressPercentage: 100,
          };
        }
      })
    );
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="workspace-wide">
        {/* Barra Lateral: Seleção das Iniciativas */}
        <InitiativeSelector
          initiatives={initiatives}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* Painel Principal Executivo */}
        <div className="main-content-panel">
          {/* Esteira Visual das 4 Fases */}
          <PipelineTracker
            currentPhase={selectedInitiative.currentPhase}
            progressPercentage={selectedInitiative.progressPercentage}
          />

          {/* Card Executivo Central da Iniciativa */}
          <InitiativeCard
            initiative={selectedInitiative}
            onToggleChecklist={handleToggleChecklist}
            onAdvancePhase={handleAdvancePhase}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        </div>
      </main>

      {/* Rodapé */}
      <Footer />

      {/* Modal do Status Report */}
      <StatusReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initiative={selectedInitiative}
      />
    </div>
  );
}

export default App;
