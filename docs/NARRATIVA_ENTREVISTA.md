# Narrativa para entrevista — IMPLANTA

## Versão curta

“O IMPLANTA é um protótipo de gestão de implantações de software que acompanha a jornada do handoff comercial até o primeiro valor do cliente. Eu parti de um problema que conheço da operação: o projeto pode avançar entre várias áreas e até entrar em produção sem existir uma visão integrada de requisitos, bloqueios, responsabilidades e valor comprovado.

Modelei nove fases, criei oito cenários simulados e conectei dashboard, DRN, QA, homologação, mudanças de escopo e portal do cliente. Uma decisão importante foi não usar um percentual único de progresso. O projeto mostra fase, condição operacional, cobertura de requisitos, marcos e gates.

Depois submeti o modelo a nove testes de estresse. Três revelaram lacunas e me fizeram incluir classificação de capacidade, rastreabilidade de divergências comerciais e transição parcial para Customer Success. O resultado é um protótipo navegável e testável que demonstra como eu organizo processos complexos, trato exceções e transformo aprendizados em melhoria do modelo.”

## Estrutura para aprofundar

### Situação

Informações de uma implantação ficam distribuídas entre documentos, planilhas, ferramentas técnicas e conversas. Isso dificulta enxergar condição real, responsáveis, riscos e valor para o cliente.

### Tarefa

Criar um modelo que integrasse a jornada sem simplificar indevidamente o processo e sem entregar decisões críticas a uma automação.

### Ação

- defini o primeiro valor antes de desenhar as telas;
- modelei fases, gates, exceções e responsabilidades;
- conectei necessidade, requisito, entrega, teste e homologação;
- criei cenários com riscos de origens diferentes;
- desenvolvi demonstração guiada sem bloquear a exploração;
- executei testes de estresse e corrigi as lacunas encontradas.

### Resultado

Uma aplicação com seis visões, oito projetos simulados, três roteiros guiados e 22 testes automatizados. O case conecta Operações, Projetos e Customer Success e mostra evolução em relação ao Prioriza.

## Perguntas prováveis

### Por que não usar um percentual de progresso?

Porque percentuais podem misturar entregas de relevâncias diferentes. Um projeto com muitas tarefas simples concluídas ainda pode ter um requisito fiscal crítico em aberto. Preferi combinar fase, cobertura de requisitos, marcos e gates.

### Por que separar go-live de primeiro valor?

Porque colocar o sistema em produção não garante que o cliente conseguiu operar com sucesso. O primeiro valor exige venda, estoque, caixa e dados reconciliados no ciclo real.

### A plataforma toma decisões automaticamente?

Não. Ela aplica regras para sinalizar riscos e impedir um avanço operacional incoerente no cenário, mas mantém validação e justificativa humanas. A navegação do visitante nunca é bloqueada.

### O que os testes mudaram?

Os testes revelaram que o modelo inicial não tratava bem capacidade da carteira, divergência originada no comercial e transição parcial para CS. Esses pontos foram modelados, implementados e documentados.

### Qual é a relação com sua experiência?

O projeto traduz uma vivência de acompanhamento simultâneo de implantações entre discovery, requisitos, desenvolvimento, testes e homologação. Ele transforma essa experiência em um modelo operacional reproduzível e testável.

### Como o IMPLANTA complementa o Prioriza?

O Prioriza trata a entrada, análise e priorização de demandas. O IMPLANTA avança para a gestão de uma jornada mais longa, com dependências entre áreas, controle de escopo, gates de qualidade e comprovação de valor ao cliente.
