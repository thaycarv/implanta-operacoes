import React, { useState } from 'react';
import { SocialInitiative } from '../types';
import { PHASES } from '../data/socialData';
import { FileText, X, Check, Copy } from 'lucide-react';

interface StatusReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiative: SocialInitiative;
}

export const StatusReportModal: React.FC<StatusReportModalProps> = ({
  isOpen,
  onClose,
  initiative,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPhaseInfo = PHASES.find((p) => p.id === initiative.currentPhase);

  const reportText = `*Status Report Executivo: Implanta (Empreendedorismo Social)*
Iniciativa: ${initiative.name}
Segmento: ${initiative.segment}
Território: ${initiative.community}
Coordenação Local: ${initiative.coordinator}
Impacto: ${initiative.beneficiariesCount} pessoas/famílias atendidas
Data do Diagnóstico: ${new Date().toLocaleDateString('pt-BR')}

*1. Situação da Esteira de Implantação:*
- Etapa Atual: ${currentPhaseInfo?.number} - ${currentPhaseInfo?.name}
- Foco da Etapa: ${currentPhaseInfo?.focus}
- Progresso Geral: ${initiative.progressPercentage}%
- Status: ${initiative.statusLabel}
- Previsão de Lançamento: ${initiative.targetGoLiveDate}

*2. Critérios de Prontidão da Fase:*
${initiative.readinessChecklist
  .map((item) => `${item.completed ? '[X]' : '[ ]'} ${item.title}: ${item.description}`)
  .join('\n')}

*3. Diagnóstico de Bloqueio & Ações do Gestor:*
${
  initiative.bottleneck
    ? `- Ponto de Atenção: ${initiative.bottleneck.title}\n- Causa-Raiz: ${initiative.bottleneck.description}\n- Plano de Ação: ${initiative.bottleneck.actionPlan}\n- Responsável: ${initiative.bottleneck.responsible}`
    : '- Operação sem impedimentos bloqueantes. Esteira de implantação seguindo conforme o cronograma planejado.'
}

*4. Resumo de Impacto & Próximos Passos:*
${initiative.purpose}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              <FileText className="modal-title-icon" aria-hidden="true" />
              Status Report Executivo
            </h3>
            <small>Relatório pronto para envio a conselhos, comitês e investidores de impacto</small>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar modal">
            <X className="modal-close-icon" aria-hidden="true" />
          </button>
        </div>

        <textarea
          className="report-textarea"
          readOnly
          value={reportText}
          rows={14}
        />

        <div className="modal-actions">
          <button className="secondary" onClick={onClose}>
            Fechar
          </button>
          <button className="primary" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="btn-icon" aria-hidden="true" />
                Copiado com sucesso!
              </>
            ) : (
              <>
                <Copy className="btn-icon" aria-hidden="true" />
                Copiar Relatório
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
