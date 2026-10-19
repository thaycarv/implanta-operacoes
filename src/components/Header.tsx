import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="mark">I</span>
        <div>
          <b>Implanta</b>
          <small>Gestão de Implantação em Empreendedorismo Social</small>
        </div>
      </div>
      <div className="topbar-tag">
        <span>Impacto Comunitário & Negócios Sociais</span>
      </div>
    </header>
  );
};
