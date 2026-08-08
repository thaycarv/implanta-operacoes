# IMPLANTA — Gestão de implantações orientada a valor

Protótipo funcional de uma plataforma para acompanhar implantações de software do handoff comercial à validação do primeiro ciclo operacional.

**Demo:** [thaycarv.github.io/implanta-operacoes](https://thaycarv.github.io/implanta-operacoes/)

> O projeto é um case de produto e operações. Os dados são fictícios e todas as alterações feitas durante a exploração ficam somente no navegador do visitante.

## O problema

Projetos de implantação costumam distribuir informações entre planilhas, documentos de requisitos, ferramentas de desenvolvimento, mensagens e controles individuais. Essa fragmentação dificulta responder perguntas essenciais:

- Em que condição operacional o projeto realmente está?
- O que impede o próximo avanço e de onde vem a dependência?
- Quais requisitos foram entregues, testados e homologados?
- Uma mudança é defeito, divergência, novo escopo ou melhoria futura?
- O go-live produziu valor ou apenas colocou o sistema em produção?

## A proposta

O IMPLANTA conecta a jornada de implantação em uma única experiência navegável. O modelo combina regras explícitas com validação humana: o sistema sinaliza bloqueios e impactos, mas não substitui a decisão do responsável.

O ciclo operacional é validado quando o cliente conclui uma operação com venda processada, estoque atualizado, caixa fechado e dados reconciliados.

## Jornada modelada

1. Handoff comercial
2. Discovery
3. Requisitos e desenho da solução — DRN
4. Refinamento técnico e planejamento
5. Configuração e desenvolvimento
6. Validação interna e QA
7. Homologação com o cliente — UAT
8. Preparação e go-live
9. Primeiro ciclo operacional e transição

## O que pode ser explorado

- Dashboard da carteira com indicadores, fases, riscos e dependências.
- Lista pesquisável e filtrável de implantações.
- Detalhe da jornada, marcos, pendências e ciclo operacional.
- DRN estruturado com rastreabilidade entre necessidade, requisito, teste e aceite.
- QA interno e UAT separados, com gate operacional de go-live.
- Análise e decisão de mudanças de escopo.
- Portal simplificado para o cliente.
- Criação de uma nova implantação.
- Demonstração guiada opcional e exploração livre.
- Restauração geral ou individual dos cenários.

### Fluxo sugerido para conhecer o protótipo

1. Abra a demonstração e escolha um dos três roteiros guiados.
2. Consulte o dashboard para entender a condição da carteira.
3. Entre no detalhe de uma implantação e observe fase, pendências, capacidade e validação operacional.
4. Navegue por requisitos, testes e mudanças para acompanhar a rastreabilidade da decisão.
5. Compare a visão interna com o portal simplificado do cliente.

O roteiro pode ser fechado a qualquer momento e não restringe a navegação livre.

## Cenários demonstrativos

A carteira contém oito implantações simuladas. Três possuem roteiros guiados:

| Cenário | Tensão operacional |
|---|---|
| Rede Aurora | Go-live concluído, mas ciclo operacional bloqueado por divergência crítica no caixa |
| Lojas Horizonte | Falha fiscal crítica identificada na homologação do cliente |
| Rede Prisma | Ciclo operacional validado com pendência não crítica e transição parcial para CS |

## Decisões de produto

- Não existe percentual único de progresso. A leitura combina fase, cobertura de requisitos, marcos e gates.
- Criticidade é orientada por regra e confirmada por uma pessoa.
- Pendências preservam origem, responsável, prazo e impacto.
- Mudanças não alteram silenciosamente a linha de base.
- Um alerta crítico restringe o avanço operacional simulado, nunca a navegação do visitante.
- Capacidade é classificada por características observáveis, sem score genérico.
- Go-live e geração de valor são estados diferentes.

## Regras centrais do modelo

- **Condição operacional:** deriva de pendências críticas, atrasos, validações e encerramento; não é informada manualmente como um simples status.
- **Gate de go-live:** considera requisitos bloqueadores e os resultados mais recentes de QA e UAT.
- **Ciclo operacional validado:** exige venda processada, estoque atualizado, caixa fechado e dados reconciliados.
- **Rastreabilidade:** requisitos se relacionam com pacotes, testes, evidências e mudanças de escopo.
- **Capacidade:** representa esforço de coordenação a partir de atributos observáveis do projeto.
- **Transição para CS:** é avaliada separadamente do encerramento técnico da implantação.

## Testes de estresse

O modelo foi submetido a nove testes. Três deles revelaram lacunas e produziram ajustes nas regras de capacidade, handoff comercial e transição para Customer Success.

Consulte [a documentação completa dos testes](docs/TESTES_DE_ESTRESSE.md) e o [checklist de QA funcional](docs/QA_FUNCIONAL.md).

## Stack e arquitetura

- React, TypeScript e Vite
- React Router com `HashRouter`, compatível com GitHub Pages
- Context API e reducer para regras e estado compartilhado
- LocalStorage para persistência da exploração
- Vitest e Testing Library
- Lucide Icons
- GitHub Actions para testes, build e publicação

### Organização do código

```text
src/
├── components/   componentes reutilizáveis, layout e demonstração guiada
├── data/         carteira simulada e cenários de demonstração
├── domain/       regras puras de condição, gates, capacidade e transição
├── pages/        páginas e fluxos navegáveis
├── state/        Context API, reducer e persistência local
├── tests/        testes de domínio, estado, estresse e interface
└── types/        contratos TypeScript do modelo
```

O estado compartilhado é controlado por um reducer. As regras que podem ser testadas sem interface ficam em `src/domain`, enquanto `src/data/seed.ts` monta os oito cenários iniciais. O navegador persiste a exploração em `localStorage` usando a chave `implanta.portfolio.v1`.

## Executar localmente

Pré-requisitos:

- Node.js 22 ou versão compatível
- npm

```bash
npm ci
npm run dev
```

Validação completa:

```bash
npm test
npm run build
```

Para visualizar localmente o build gerado:

```bash
npm run preview
```

## Estado da validação

- 6 visões navegáveis
- 8 implantações simuladas
- 3 roteiros guiados
- 9 testes de estresse
- 22 testes automatizados aprovados
- Build de produção aprovado

| Suíte | Cobertura principal |
|---|---|
| `domain.test.ts` | condição, gates, indicadores e transição |
| `state.test.ts` | reducer, criação, restauração e persistência |
| `stress.test.ts` | cenários operacionais extremos e regras de negócio |
| `App.test.tsx` | renderização e navegação essencial da aplicação |

A publicação em GitHub Pages executa instalação limpa, testes e build antes do deploy.

## Evolução recente

O Portal do Cliente passou a ler o parâmetro `project` da URL. Com isso, cada etapa da demonstração guiada abre o cliente correto, inclusive a Rede Prisma, e a troca em “Visualizar como” mantém a URL sincronizada.

A revisão técnica também tornou a persistência tolerante a falhas do navegador, adicionou um estado vazio ao Portal do Cliente, fixou as versões das dependências e incluiu testes de integração para os links de cliente dos roteiros guiados. O seletor de implantação compartilhado foi extraído para um componente reutilizável.

## Limites do protótipo

O projeto não possui backend, autenticação ou integração com sistemas reais. Os dados são simulados e persistidos apenas no navegador. O objetivo é validar modelagem operacional, regras do processo, experiência de uso e comunicação entre áreas.

Também não fazem parte do escopo atual colaboração simultânea, controle de acesso por perfil, trilha de auditoria persistente, notificações e sincronização entre dispositivos.

## Próximas melhorias técnicas

- Adicionar uma migração explícita para futuras versões do estado persistido.
- Comunicar visualmente ao visitante quando o navegador não puder persistir uma alteração.
- Tratar parâmetros de projeto inválidos com uma mensagem dedicada em vez de usar apenas o cenário padrão.
- Ampliar testes de acessibilidade, teclado e comportamento responsivo.
- Dividir páginas mais densas em componentes menores para facilitar manutenção e revisão.

## Autoria

Projeto autoral de **Thayâne Carvalho Oliveira**, Engenheira de Produção com experiência em Operações, Processos, Projetos e implantação de software.

Este projeto complementa o [Prioriza Operações](https://github.com/thaycarv/prioriza-operacoes): enquanto o Prioriza organiza a entrada e priorização de demandas, o IMPLANTA acompanha uma jornada de entrega até a comprovação de valor.
