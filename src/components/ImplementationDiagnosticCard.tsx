import React, { useState } from 'react'
import { AlertCircle, CheckCircle2, Copy, FileText, HelpCircle, ShieldAlert } from 'lucide-react'
import { ImplementationProject } from '../types'
import { generateProjectDiagnostic, formatExecutiveStatusReport } from '../domain/diagnostics'

interface ImplementationDiagnosticCardProps {
  project: ImplementationProject
}

export const ImplementationDiagnosticCard: React.FC<ImplementationDiagnosticCardProps> = ({ project }) => {
  const [copied, setCopied] = useState(false)
  const diagnostic = generateProjectDiagnostic(project)

  const handleCopyReport = () => {
    const reportText = formatExecutiveStatusReport(project, diagnostic)
    navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isBlocked = diagnostic.condition === 'blocked'
  const isAttention = diagnostic.condition === 'attention' || diagnostic.condition === 'delayed'

  return (
    <section className={`panel diagnostic-card ${isBlocked ? 'diagnostic-card--blocked' : isAttention ? 'diagnostic-card--attention' : 'diagnostic-card--normal'}`}>
      <div className="panel__head">
        <div>
          <div className="diagnostic-badge">
            {isBlocked ? <ShieldAlert size={16} /> : isAttention ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            <span>Diagnóstico Operacional da Implantação</span>
          </div>
          <h2>{diagnostic.title}</h2>
          <p>{diagnostic.rootCause}</p>
        </div>
        <button type="button" className="button button--secondary" onClick={handleCopyReport} title="Copiar status report formatado">
          <Copy size={16} />
          {copied ? '✓ Relatório Copiado!' : 'Copiar Status Report'}
        </button>
      </div>

      <div className="diagnostic-grid">
        <div className="diagnostic-box">
          <div className="diagnostic-box__head">
            <CheckCircle2 size={15} />
            <strong>Fatos e Indicadores Confirmados</strong>
          </div>
          <ul>
            {diagnostic.facts.map((fact, idx) => (
              <li key={idx}>{fact}</li>
            ))}
          </ul>
        </div>

        <div className="diagnostic-box">
          <div className="diagnostic-box__head">
            <HelpCircle size={15} />
            <strong>Pontos de Atenção e Riscos</strong>
          </div>
          <ul>
            {diagnostic.attentionPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="diagnostic-action-box">
        <FileText size={16} />
        <div>
          <strong>Próximo passo recomendado para a coordenação:</strong>
          <p>{diagnostic.recommendedAction}</p>
        </div>
      </div>
    </section>
  )
}
