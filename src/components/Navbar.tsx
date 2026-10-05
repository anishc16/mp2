import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <NavLink className="brand" to="/" aria-label="Pokédex Explorer home">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Pokédex Explorer</span>
        </NavLink>
        <div className="nav-links">
          <NavLink to="/" end>List</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
        </div>
      </nav>
    </header>
  )
}
