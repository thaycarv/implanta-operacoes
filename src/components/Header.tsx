import React from 'react';
import { Layers, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark-wrapper">
          <Layers className="brand-icon" aria-hidden="true" />
        </div>
        <div>
          <b>Implanta</b>
          <small>Gestão de Implantação em Empreendedorismo Social</small>
        </div>
      </div>
      <div className="topbar-right">
        <span className="author-tag">
          <ShieldCheck className="author-icon" aria-hidden="true" />
          Coordenação: Thayâne Carvalho
        </span>
        <div className="topbar-tag">
          <span>Operações & Negócios Sociais</span>
        </div>
      </div>
    </header>
  );
};
