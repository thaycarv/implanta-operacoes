# Implanta: Gestão de Implantação em Empreendedorismo Social

> **Aplicação Online:** [https://thaycarv.github.io/implanta-operacoes/](https://thaycarv.github.io/implanta-operacoes/)  
> **Autora & Coordenação:** Thayâne Carvalho (Engenharia de Produção & Nutrição)

O **Implanta** é um cockpit executivo desenvolvido para acompanhar a jornada completa de estruturação, prontidão operacional e autossustentabilidade de **iniciativas de empreendedorismo social e negócios de impacto comunitário**.

O projeto organiza a transição entre o diagnóstico territorial e a autonomia dos grupos produtivos, garantindo que capacitações técnicas, conformidade sanitária e regulatória, precificação de custos e canais comerciais gerem impacto socioeconômico sustentável.

---

## Acesso Rápido & Demonstração Online

Acesse o cockpit interativo diretamente pelo navegador:
* **Link Direto:** [https://thaycarv.github.io/implanta-operacoes/](https://thaycarv.github.io/implanta-operacoes/)
* **Navegação:** selecione qualquer uma das quatro iniciativas comunitárias na barra lateral para carregar sua esteira de fases, matriz de prontidão operacional (Readiness Gates) e diagnóstico de bloqueios em tempo real.

---

## O Pipeline Estruturado nos 4 Portões de Prontidão (Readiness Gates)

O ciclo de maturação é governado por 4 portões objetivos de liberação (cada portão equivale a exatamente 25% de progresso):

1. **Portão 01 — Diagnóstico & Modelagem (25%):** Mapeamento de potenciais locais, vocação produtiva e desenho do produto comunitário;
2. **Portão 02 — Capacitação & Custos (50%):** Estruturação da ficha técnica de custo por batelada de produção, controle de fluxo de caixa e padronização produtiva;
3. **Portão 03 — Embalagem & Canais (75%):** Identidade visual, conformidade de rotulagem e tabela nutricional (**RDC nº 727/2022 da Anvisa**) e abertura de canais B2B/B2C;
4. **Portão 04 — Lançamento Oficial (100%):** Go-live comercial, feiras de economia solidária, vendas recorrentes e consolidação da autonomia do grupo.

---

## Carteira Ativa de Iniciativas

* **Coletivo Tecendo Autonomia (Portão 03: Embalagem & Canais):**
  * *Setor:* Moda Sustentável & Costura Comunitária
  * *Status:* No Prazo (75% concluído — 3 de 4 portões validados). Ateliê montado e contratos de fornecimento B2B em negociação.
* **Quitanda da Terra (Portão 02: Capacitação & Custos):**
  * *Setor:* Alimentos Saudáveis & Agricultura Familiar
  * *Status:* Ponto de Atenção (50% concluído — 2 de 4 portões validados).
  * *Gargalo Operacional:* Adequação de rótulos segundo a **RDC nº 727/2022 da Anvisa** e cálculo da ficha técnica de custo de batelada das geleias artesanais.
  * *Responsável:* Thayâne Carvalho (Eng. de Produção & Nutricionista).
* **BioSaberes da Floresta (Portão 04: Lançamento Oficial):**
  * *Setor:* Biocosméticos & Extrativismo Sustentável
  * *Status:* No Prazo (75% concluído — 3 de 4 portões validados). Fórmulas artesanais homologadas e preparação para feira regional.
* **Estúdio Jovem Criativo (Concluído & Autossustentável):**
  * *Setor:* Design, Serigrafia & Economia Criativa
  * *Status:* Autossustentável (100% concluído — 4 de 4 portões validados). Cooperativa formalizada com 8 clientes regulares ativos e fundo de reinvestimento comunitário.

---

## Stack Técnica

* **Frontend:** React 18, TypeScript, Vite
* **Ícones & UI:** Lucide React (ícones vetoriais SVG sem emojis avulsos), tipografia editorial sóbria e layout em grid responsivo
* **Testes & Qualidade:** Vitest com cobertura de invariantes e validação de regras de negócio

```bash
# Instalar dependências
npm install

# Iniciar servidor local
npm run dev

# Executar testes unitários
npm test -- --run

# Gerar build de produção
npm run build
```
