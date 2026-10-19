import React from 'react';
import { PHASES } from '../data/socialData';
import { PhaseId } from '../types';

interface PipelineTrackerProps {
  currentPhase: PhaseId;
  progressPercentage: number;
}

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  currentPhase,
  progressPercentage,
}) => {
  const currentPhaseIndex = PHASES.findIndex((p) => p.id === currentPhase);

  return (
    <div className="pipeline-container">
      <div className="pipeline-header">
        <div>
          <span className="pipeline-title">Esteira de Maturação do Negócio Social</span>
          <small>4 Etapas da Modelagem ao Lançamento Comercial</small>
        </div>
        <div className="pipeline-progress-badge">
          <b>{progressPercentage}%</b> concluído
        </div>
      </div>

      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="pipeline-steps">
        {PHASES.map((phase, index) => {
          const isDone = index < currentPhaseIndex || progressPercentage === 100;
          const isCurrent = index === currentPhaseIndex && progressPercentage < 100;

          return (
            <div
              key={phase.id}
              className={`pipeline-step ${isDone ? 'step-done' : ''} ${
                isCurrent ? 'step-current' : ''
              }`}
            >
              <div className="step-marker">
                {isDone ? '✓' : phase.number}
              </div>
              <div className="step-info">
                <b>{phase.name}</b>
                <p>{phase.focus}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
