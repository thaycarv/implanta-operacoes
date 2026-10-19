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
    <div className="selector-container">
      <div className="selector-label">
        <p className="eyebrow">CARTEIRA DE EMPREENDIMENTOS SOCIAIS</p>
        <h2>Acompanhamento da Esteira de Implantação</h2>
      </div>

      <div className="selector-buttons">
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
              <small className="initiative-segment">{item.segment}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
};
