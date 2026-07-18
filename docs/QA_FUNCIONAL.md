# Checklist de QA funcional

## Navegação e liberdade de exploração

- [x] As seis visões são acessíveis pelo menu principal.
- [x] O visitante pode entrar pelo modo livre ou pelo roteiro guiado.
- [x] O roteiro pode ser fechado, retomado e reiniciado.
- [x] Gate crítico não bloqueia a navegação.
- [x] Existe restauração geral com confirmação.
- [x] Existe restauração individual no detalhe da implantação.

## Consistência operacional

- [x] Condição operacional é derivada das mesmas regras em dashboard, carteira e detalhe.
- [x] Requisitos mantêm vínculo com pacote e testes.
- [x] QA interno e UAT permanecem separados.
- [x] Mudanças de escopo preservam classificação e impacto.
- [x] Dependências preservam origem e responsável.
- [x] Primeiro valor é diferente de go-live.
- [x] Transição para Customer Success considera primeiro valor e pendências residuais.
- [x] Capacidade da carteira é classificada por regras observáveis.

## Persistência e recuperação

- [x] Alterações do visitante são mantidas em armazenamento local.
- [x] Uma nova implantação pode ser criada sem autenticação.
- [x] Projetos demonstrativos podem ser restaurados individualmente.
- [x] A restauração geral remove projetos criados pelo visitante e recompõe os oito cenários iniciais.

## Validação técnica

- [x] Compilação TypeScript aprovada.
- [x] Build de produção aprovado.
- [x] 22 testes automatizados aprovados.
- [x] Nove testes de estresse documentados e reproduzíveis.
