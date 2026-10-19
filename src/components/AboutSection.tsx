import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section className="about-section">
      <div className="about-header">
        <p className="eyebrow">METODOLOGIA & GOVERNANÇA</p>
        <h2>Princípios de Gestão de Negócios de Impacto</h2>
        <p className="lede">
          O Implanta estrutura a transição entre o acolhimento inicial da comunidade e a sustentabilidade financeira do empreendimento, garantindo que o impacto social se converta em autonomia de longo prazo.
        </p>
      </div>

      <div className="principles-list">
        <div className="principle-item">
          <span className="principle-num">01</span>
          <div>
            <b>Autonomia Comunitária:</b>
            <p>
              A meta da implantação é transferir conhecimentos práticos para que as lideranças locais assumam a gestão contínua do negócio.
            </p>
          </div>
        </div>

        <div className="principle-item">
          <span className="principle-num">02</span>
          <div>
            <b>Viabilidade & Precificação Justa:</b>
            <p>
              Impacto sustentável exige rigor em custos: precificar o trabalho dignamente, controlar despesas e gerar excedente comunitário.
            </p>
          </div>
        </div>

        <div className="principle-item">
          <span className="principle-num">03</span>
          <div>
            <b>Critérios de Prontidão sem Burocracia:</b>
            <p>
              Avançar de fase só ocorre quando o produto e os processos estão homologados, protegendo a reputação do coletivo perante os clientes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
