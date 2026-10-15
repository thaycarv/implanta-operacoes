import { Link } from 'react-router-dom'

export function Brand() {
  return (
    <Link className="brand" to="/app/implantacoes" aria-label="Implanta: ficha executiva e projetos">
      <span className="brand__mark" aria-hidden="true">I</span>
      <span>IMPLANTA</span>
    </Link>
  )
}
