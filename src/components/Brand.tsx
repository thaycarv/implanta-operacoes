import { Link } from 'react-router-dom'

export function Brand() {
  return (
    <Link className="brand" to="/app/dashboard" aria-label="Implanta: visão geral da carteira">
      <span className="brand__mark" aria-hidden="true">I</span>
      <span>IMPLANTA</span>
    </Link>
  )
}
