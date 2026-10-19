import React from 'react';
import { SocialInitiative } from '../types';

interface InitiativeCardProps {
  initiative: SocialInitiative;
  onToggleChecklist: (itemId: string) => void;
  onAdvancePhase: () => void;
  onOpenReport: () => void;
}

export const InitiativeCard: React.FC<InitiativeCardProps> = ({
  initiative,
  onToggleChecklist,
  onAdvancePhase,
  onOpenReport,
}) => {
  const allCompleted = initiative.readinessChecklist.every((item) => item.completed);

  return (
    <div className="card initiative-card">
      {/* Cabeçalho do Empreendimento */}
      <div className="card-header">
        <div>
          <div className="initiative-meta-tags">
            <span className="meta-tag community-tag">📍 {initiative.community}</span>
            <span className="meta-tag beneficiaries-tag">
              👥 {initiative.beneficiariesCount} pessoas/famílias atendidas
            </span>
          </div>
          <h3 className="card-title">{initiative.name}</h3>
          <p className="card-purpose">{initiative.purpose}</p>
        </div>

        <div className="card-coordinator-box">
          <small>COORDENAÇÃO LOCAL</small>
          <b>{initiative.coordinator}</b>
          <span className="target-date">⏱ Previsão: {initiative.targetGoLiveDate}</span>
        </div>
      </div>

      {/* Alerta de Bloqueio Operacional (se houver) */}
      {initiative.bottleneck && (
        <div className="bottleneck-card">
          <div className="bottleneck-header">
            <span className="bottleneck-badge">PONTO DE ATENÇÃO OPERACIONAL</span>
            <small>Responsável: {initiative.bottleneck.responsible}</small>
          </div>
          <h4>{initiative.bottleneck.title}</h4>
          <p>{initiative.bottleneck.description}</p>
          <div className="action-plan-box">
            <b>Plano de Ação do Gestor:</b>
            <span>{initiative.bottleneck.actionPlan}</span>
          </div>
        </div>
      )}

      {/* Checklist de Prontidão da Etapa (Gate de Liberação) */}
      <div className="checklist-section">
        <div className="checklist-header">
          <div>
            <b>Checklist de Prontidão & Critérios de Liberação</b>
            <small>Itens mandatórios para validar o avanço na esteira</small>
          </div>
          <span className="checklist-counter">
            {initiative.readinessChecklist.filter((i) => i.completed).length} de{' '}
            {initiative.readinessChecklist.length} validados
          </span>
        </div>

        <div className="checklist-items">
          {initiative.readinessChecklist.map((item) => (
            <label
              key={item.id}
              className={`checklist-item ${item.completed ? 'item-checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggleChecklist(item.id)}
              />
              <div className="item-text">
                <b>{item.title}</b>
                <small>{item.description}</small>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Barra de Ações Executivas */}
      <div className="card-actions-bar">
        <button
          type="button"
          onClick={onAdvancePhase}
          className={`advance-btn ${allCompleted ? 'ready' : 'secondary'}`}
        >
          {initiative.status === 'completed'
            ? '✓ Iniciativa Consolidada com Autonomia'
            : allCompleted
            ? 'Avançar para Próxima Etapa →'
            : 'Validar Critérios Pendentes'}
        </button>

        <button
          type="button"
          onClick={onOpenReport}
          className="report-btn"
          title="Visualizar e copiar status report para investidores"
        >
          📋 Copiar Status Report
        </button>
      </div>
    </div>
  );
};
