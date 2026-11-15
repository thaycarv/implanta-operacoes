# Diretrizes de Contribuição

Este repositório segue fluxo rastreável para alterações de código, interface e documentação.

## Fluxo via Issue e Pull Request
1. Abra uma **Issue** utilizando os modelos em `.github/ISSUE_TEMPLATE/`.
2. Trabalhe em uma branch dedicada (`fix/`, `feat/` ou `refactor/`).
3. Abra um **Pull Request** usando `.github/PULL_REQUEST_TEMPLATE.md` e vinculando a Issue (`Resolve #N`).

## Portões de Qualidade
Antes do merge, confirme no ambiente local e no GitHub Actions:
- `npm run lint` (`oxlint`)
- `npm test -- --run` (`vitest`)
- `npm run build` (`tsc -b && vite build`)

Preserve `prefers-reduced-motion: reduce` e o `ErrorBoundary` na raiz da aplicação.
