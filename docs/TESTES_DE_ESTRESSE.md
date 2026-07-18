# IMPLANTA — Testes de estresse

## Objetivo

Validar se o protótipo sustenta decisões reais de implantação sem reduzir a jornada a um percentual genérico. Os testes verificam rastreabilidade, criticidade, isolamento de impactos, responsabilidades, capacidade operacional e continuidade após o go-live.

## Resultado executivo

| # | Cenário testado | Regra esperada | Evidência no protótipo | Resultado |
|---|---|---|---|---|
| 1 | DRN construído incrementalmente | Pacotes podem evoluir sem perder o vínculo entre requisito e teste | Rede Aurora possui vários pacotes; todos os requisitos pertencem a um pacote e possuem QA e UAT vinculados | Aprovado |
| 2 | Mudança com impacto isolado | Uma decisão deve alterar apenas o projeto afetado | Aprovação de mudança na Casa Norte preserva integralmente os demais projetos | Aprovado |
| 3 | Divergência durante a entrega | Divergência de requisito não pode ser tratada automaticamente como defeito ou novo escopo | Mercado Viva classifica o ajuste como `requirement_divergence` antes da decisão | Aprovado |
| 4 | Falha crítica próxima ao go-live | Pendência crítica deve impedir a liberação operacional | Lojas Horizonte permanece com gate de go-live não liberado por falha fiscal | Aprovado |
| 5 | Go-live executado sem valor comprovado | Entrada em produção não equivale a primeiro valor | Rede Aurora concluiu o go-live, mas continua bloqueada por divergência na conciliação do caixa | Aprovado |
| 6 | Carteira com esforços distintos | Capacidade deve considerar o perfil do projeto, sem percentual genérico | Projetos são classificados como Padrão, Coordenação moderada ou Alta coordenação por regras explícitas | Aprovado após ajuste |
| 7 | Divergência originada no comercial | A origem do problema deve permanecer visível | Casa Norte registra divergência entre proposta e discovery com origem Comercial | Aprovado após ajuste |
| 8 | Dependência do cliente | Atraso do cliente não deve ser atribuído ao time interno | Empório Central fica em atenção e mantém a dependência associada ao Cliente | Aprovado |
| 9 | Transição parcial para Customer Success | Pendência não crítica não deve impedir toda transição, mas precisa permanecer com responsável | Rede Prisma permite transição parcial; Ponto Urbano permite transição completa; Aurora não é recomendada | Aprovado após ajuste |

## Ajustes provocados pelos testes

### 1. Classes de capacidade operacional

Foram introduzidas três classes baseadas em características observáveis:

- **Padrão:** núcleo padrão e operação simples.
- **Coordenação moderada:** multiunidade, migração parcial ou uma integração.
- **Alta coordenação:** customização, migração completa, cinco ou mais lojas ou múltiplas integrações.

A classe não representa dificuldade técnica absoluta. Ela sinaliza esforço de coordenação para apoiar distribuição de carteira e gestão de capacidade.

### 2. Transição para Customer Success

Foram definidos três resultados:

- **Não recomendada:** primeiro valor não validado ou pendência crítica aberta.
- **Transição parcial:** primeiro valor validado, com pendências residuais não críticas e responsáveis explícitos.
- **Transição completa:** primeiro valor validado e nenhuma pendência aberta.

### 3. Rastreabilidade do handoff comercial

O cenário Casa Norte passou a representar explicitamente uma divergência entre a proposta comercial e o discovery. A pendência preserva origem, responsável, prazo e impacto sem atribuir automaticamente a falha à equipe de implantação.

## Automação e reprodutibilidade

Os nove cenários estão implementados em `src/tests/stress.test.ts`. A suíte completa é executada com:

```bash
npm test -- --run
```

O teste automatizado verifica as regras de domínio e o isolamento das alterações. A experiência de interface permanece livre: alertas e gates modificam o estado simulado, mas não impedem que o visitante navegue, compare visões ou restaure os dados.

## Conclusão

Os nove testes foram aprovados. Três deles revelaram oportunidades de amadurecimento e resultaram em novas regras de capacidade, transição para Customer Success e rastreabilidade comercial. Isso demonstra que os testes foram usados para revisar o modelo — não apenas para confirmar uma solução previamente definida.
