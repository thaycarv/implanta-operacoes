# Checklist de QA Funcional: IMPLANTA

## Navegacao e Interatividade

- [x] O cockpit centralizado carrega instantaneamente sem erros de renderizacao.
- [x] O seletor de iniciativas permite alternar fluidamente entre as 4 organizacoes comunitarias.
- [x] O rastreador de fases (Pipeline Tracker) reflete corretamente a etapa ativa e a conclusao de cada iniciativa.
- [x] O modal de Status Report Executivo abre com dados formatados e fecha ao clicar no botao ou no backdrop.
- [x] A secao "Sobre o Implanta" exibe com clareza os pilares metodologicos e as 4 fases do modelo.

## Integridade Operacional

- [x] Cada iniciativa exibe seu percentual de conclusao e badge de saude operacional coerente (Atencao, No Prazo, Concluido).
- [x] O card de diagnostico de bloqueio aparece exclusivamente quando a iniciativa possui um impedimento ativo (ex: Quitanda da Terra).
- [x] A matriz de prontidao operacional (Readiness) agrupa os requisitos essenciais com status visuais claros (Concluido, Em Andamento, Bloqueado).
- [x] Os planos de acao identificam causa raiz, impacto no cronograma, acao corretiva, responsavel e prazo de conclusao.

## Validacao Tecnica

- [x] Compilacao TypeScript estrita aprovada sem warnings ou erros (`tsc -b`).
- [x] Build de producao Vite executado com sucesso (`npm run build`).
- [x] Ausencia total de caracteres proibidos (zero em-dashes ou tracos duplos).
- [x] Responsividade validada para telas desktop, tablets e smartphones.
