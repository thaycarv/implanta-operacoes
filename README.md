# Implanta: Gestão de Implantações Orientada a Valor

O **Implanta** é um protótipo funcional para organização e acompanhamento de implantações de software, desde o handoff comercial até a validação do primeiro ciclo operacional e transição para Customer Success.

Consulte o [Catálogo de Melhorias](MELHORIAS.md) para detalhes da evolução do projeto.

---

## 1. O Desafio Operacional

Projetos de implantação frequentemente distribuem informações críticas entre planilhas, mensagens e controles individuais. Essa fragmentação dificulta responder perguntas essenciais:

* Em qual condição operacional o projeto realmente se encontra?
* Qual é a causa raiz que impede o próximo avanço e de onde vem a dependência?
* Quais requisitos foram entregues, testados e homologados formalmente?
* O go-live gerou valor prático ou apenas colocou o sistema em produção?

---

## 2. A Jornada Modelada

O fluxo de implantação é estruturado em nove etapas integradas:

1. Handoff comercial
2. Discovery
3. Requisitos e desenho da solução (DRN)
4. Refinamento técnico e planejamento
5. Configuração e desenvolvimento
6. Validação interna e QA
7. Homologação com o cliente (UAT)
8. Preparação e go-live
9. Primeiro ciclo operacional e transição

O ciclo operacional é considerado validado quando o cliente conclui uma operação com venda processada, estoque atualizado, caixa fechado e dados reconciliados.

---

## 3. Principais Recursos da Versão 2.0

* **Dashboard da Carteira:** Indicadores consolidados de saúde, fases, bloqueios e go-lives previstos.
* **Card de Diagnóstico Operacional:** Identificação automática da causa raiz dos bloqueios e recomendação do próximo passo.
* **Gerador de Status Report:** Exportação estruturada em um clique para atas com clientes e reuniões de alinhamento.
* **Abas Integradas por Implantação:** Visão 360 graus reunindo requisitos (DRN), testes QA/UAT, mudanças de escopo e portal do cliente em um único local.
* **Gates de Go-live e Transição:** Critérios determinísticos que condicionam o avanço operacional sem bloquear a exploração do visitante.

---

## 4. Cenários Demonstrativos

A carteira conta com implantações simuladas demonstrando diferentes tensões operacionais:

| Cenário | Tensão Operacional |
| :--- | :--- |
| **Rede Aurora** | Go-live concluído, porém ciclo operacional bloqueado por divergência crítica de caixa. |
| **Lojas Horizonte** | Falha fiscal crítica identificada durante a homologação com o cliente (UAT). |
| **Rede Prisma** | Ciclo operacional validado com pendência não crítica e transição para CS. |

---

## 5. Estrutura Técnica

* **Interface:** React 19 + TypeScript + Vite + Lucide Icons;
* **Navegação:** React Router com HashRouter (compatível com GitHub Pages);
* **Estado:** Context API e reducer para persistência no LocalStorage;
* **Qualidade:** Testes unitários com Vitest e React Testing Library.

---

## 6. Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/thaycarv/implanta-operacoes.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm run dev
   ```
4. Acesse no navegador: `http://localhost:5174/implanta-operacoes/`

---

## 7. Créditos

Projeto autoral desenvolvido por **Thayâne Carvalho**, focado em **Operações, Gestão de Projetos e Implantação de Sistemas**.
