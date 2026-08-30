# 🤖 Diretrizes de Governança e Contribuição com IA (AGENTS.md)
**Repositório**: `Implanta: Gestão de Implantação Orientada a Valor`  
**Responsável**: Thayâne Carvalho (Gestão de Projetos & Implantação)

---

## 🎯 Objetivo & Padrão de Trabalho
Este documento estabelece o protocolo mandatório de engenharia e gestão de mudanças para qualquer agente de IA ou desenvolvedor que atue no projeto **Implanta**.

Toda e qualquer evolução técnica, correção ou melhoria deve seguir estritamente o fluxo de **Rastreabilidade e Governança**:

---

## 1. 📌 Gestão de Demandas via GitHub Issues

Nenhuma alteração de código ou funcionalidade deve ser realizada sem uma **Issue** correspondente previamente criada e categorizada:

1. **`[Correção]`** *(Bugfix)*: Resolução de falhas de renderização, quebras de jornada, inconsistências em gates de go-live ou erros de script.
2. **`[Melhoria]`** *(Enhancement)*: Refinamento de usabilidade, aprimoramento de contraste/temas, clareza metodológica ou otimização de performance.
3. **`[Nova Função]`** *(Feature)*: Criação de novos módulos, novas etapas de implantação ou integração com relatórios de status.

---

## 2. 🔀 Fluxo de Branches e Pull Requests (PRs)

1. **Nunca realizar alterações diretas na branch `main`**.
2. Criar branches nomeadas a partir da Issue correspondente:
   * `fix/nome-da-correcao`
   * `feat/nome-da-feature`
   * `refactor/nome-da-melhoria`
3. Todas as entregas e deploys devem ser gerenciados exclusivamente através de **Pull Requests** direcionados à branch `main`.

---

## 3. 📝 Estrutura Obrigatória de todo Pull Request (PR Template)

Todo Pull Request aberto deve conter obrigatoriamente as seguintes 4 seções detalhadas:

```markdown
### 🔗 Issue Vinculada
- Resolve: #[Número da Issue] (ou link para a Issue)

### 📋 O que mudou?
- Descrição clara, técnica e objetiva das alterações realizadas no código ou na arquitetura.

### ✅ Como foi validado?
- Comandos de build ou testes executados.
- Validações visuais nos temas e responsividade.
- Testes de usabilidade e integridade funcional realizados.

### ⚠️ Riscos, Limitações & Próximos Passos
- Riscos mapeados ou dependências técnicas.
- Limitações da implementação atual.
- Próximos passos e melhorias futuras recomendadas.
```

---

## 4. 🛡️ Critérios de Aceite & Governança Ética
* **Rastreabilidade de Requisitos**: Manter a consistência entre o escopo contratado (DRN) e os testes de homologação (UAT/QA).
* **Critérios Determinísticos de Go-Live**: Gates de liberação só devem ser aprovados quando os requisitos de qualidade forem validados.
* **Foco em Processos**: Diagnósticos de bloqueio devem orientar soluções técnicas e operacionais de forma construtiva.
