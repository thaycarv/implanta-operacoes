import { Link } from 'react-router-dom'

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Implanta — página inicial">
      <span className="brand__mark" aria-hidden="true">I</span>
      <span>IMPLANTA</span>
    </Link>
  )
}
