import React, { useState } from 'react';
import { INITIAL_INITIATIVES, PHASES } from './data/socialData';
import { Header } from './components/Header';
import { InitiativeSelector } from './components/InitiativeSelector';
import { PipelineTracker } from './components/PipelineTracker';
import { InitiativeCard } from './components/InitiativeCard';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { StatusReportModal } from './components/StatusReportModal';
import { PhaseId, SocialInitiative } from './types';

export function App() {
  const [initiatives, setInitiatives] = useState<SocialInitiative[]>(INITIAL_INITIATIVES);
  const [selectedId, setSelectedId] = useState<string>(INITIAL_INITIATIVES[0].id);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const selectedInitiative =
    initiatives.find((i) => i.id === selectedId) || initiatives[0];

  // Alternar item do checklist
  const handleToggleChecklist = (itemId: string) => {
    setInitiatives((prev) =>
      prev.map((init) => {
        if (init.id !== selectedId) return init;

        const updatedChecklist = init.readinessChecklist.map((item) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        );

        // Recalcular progresso com base na fase e checklist
        const completedCount = updatedChecklist.filter((i) => i.completed).length;
        const totalCount = updatedChecklist.length;
        const phaseIndex = PHASES.findIndex((p) => p.id === init.currentPhase);
        const basePercentage = phaseIndex * 25;
        const phasePortion = totalCount > 0 ? (completedCount / totalCount) * 25 : 0;
        const calculatedProgress = Math.min(100, Math.round(basePercentage + phasePortion));

        return {
          ...init,
          readinessChecklist: updatedChecklist,
          progressPercentage: calculatedProgress,
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
            status: 'on_track' as const,
            statusLabel: 'No Prazo',
            bottleneck: undefined,
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

      <main className="workspace">
        {/* Seletor Centralizado de Empreendimentos */}
        <InitiativeSelector
          initiatives={initiatives}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

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

        {/* Diretrizes e Princípios de Gestão de Negócios de Impacto */}
        <AboutSection />
      </main>

      {/* Rodapé Centralizado */}
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
