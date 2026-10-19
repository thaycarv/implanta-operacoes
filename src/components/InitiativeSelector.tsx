import React from 'react';
import { SocialInitiative } from '../types';

interface InitiativeSelectorProps {
  initiatives: SocialInitiative[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const InitiativeSelector: React.FC<InitiativeSelectorProps> = ({
  initiatives,
  selectedId,
  onSelect,
}) => {
  return (
    <aside className="initiative-sidebar">
      <div className="sidebar-header">
        <p className="eyebrow">CARTEIRA ATIVA</p>
        <h3 className="sidebar-title">Empreendimentos Sociais</h3>
        <p className="sidebar-subtitle">Selecione uma iniciativa para acompanhar a esteira e os requisitos operacionais.</p>
      </div>

      <nav className="sidebar-list" aria-label="Lista de Iniciativas">
        {initiatives.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`initiative-btn ${isSelected ? 'active' : ''} status-${item.status}`}
            >
              <div className="btn-top">
                <span className="initiative-name">{item.name}</span>
                <span className={`status-pill pill-${item.status}`}>
                  {item.statusLabel}
                </span>
              </div>
              <p className="initiative-segment">{item.segment}</p>
              <div className="sidebar-btn-meta">
                <span className="meta-beneficiaries">👥 {item.beneficiariesCount} pessoas</span>
                <span className="meta-progress">{item.progressPercentage}%</span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
