# Mini case — IMPLANTA

## Contexto

Em operações de implantação de software, o andamento do projeto pode parecer saudável porque tarefas foram concluídas ou o sistema entrou em produção. Entretanto, requisitos, evidências, bloqueios e responsabilidades permanecem fragmentados, e o valor para o cliente ainda pode não ter sido comprovado.

## Problema

Como oferecer uma visão integrada da implantação sem transformar um processo complexo em um percentual pouco confiável ou automatizar decisões que exigem análise humana?

## Hipótese

Uma plataforma que conecte fase, condição operacional, dependências, requisitos, testes, marcos e primeiro valor pode melhorar a qualidade do acompanhamento e tornar decisões de avanço mais rastreáveis.

## Solução prototipada

Foi desenvolvido o IMPLANTA, protótipo navegável para gestão de implantações de ERP no varejo. A solução acompanha nove fases, do handoff comercial à transição para Customer Success, e apresenta visões específicas para gestão, implantação e cliente.

O sistema deriva alertas e gates a partir de regras explícitas, mas mantém a decisão sob responsabilidade humana. Uma falha crítica pode impedir o avanço operacional simulado, sem bloquear a exploração do protótipo.

## Processo de desenvolvimento

1. Definição do problema e do primeiro valor.
2. Modelagem da jornada e das responsabilidades.
3. Definição de criticidade, exceções e regras de avanço.
4. Construção de oito cenários simulados.
5. Desenvolvimento de seis visões conectadas.
6. Combinação de demonstração guiada e exploração livre.
7. Execução de nove testes de estresse.
8. Revisão do modelo a partir das falhas encontradas.

## Principais decisões

- Substituição do percentual único por múltiplas evidências de progresso.
- Separação entre QA interno e homologação do cliente.
- Distinção entre defeito, divergência, mudança de escopo, melhoria futura e configuração pendente.
- Separação entre go-live e primeiro valor.
- Transição parcial para CS quando existem apenas pendências não críticas com responsáveis definidos.
- Classificação do esforço de coordenação por características do projeto.

## Testes e aprendizados

Os testes de estresse não serviram apenas para confirmar a solução. Eles revelaram três lacunas:

- ausência de uma leitura de capacidade operacional;
- pouca visibilidade para divergências originadas no handoff comercial;
- falta de regra para transição parcial a Customer Success.

As três lacunas foram incorporadas ao produto e protegidas por testes automatizados.

## Resultado

O protótipo final possui oito implantações simuladas, três roteiros guiados, seis visões navegáveis, restauração de cenários, persistência local e 22 testes automatizados.

Mais do que demonstrar uma interface, o case evidencia capacidade de estruturar problemas, modelar processos, tratar exceções, testar hipóteses e comunicar decisões entre Operações, Projetos e Customer Success.
