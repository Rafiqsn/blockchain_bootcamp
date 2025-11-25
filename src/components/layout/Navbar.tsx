// src/components/layout/Navbar.tsx
import { NavLink } from "react-router-dom";
// ...

export function Navbar() {
  return (
    <nav className="top-nav">
      {/* ... brand dll ... */}
      <div className="nav-links">
        <NavLink to="/" /* className aktif dsb */>
          Dashboard
        </NavLink>

        <NavLink to="/courses">
          Courses
        </NavLink>

        <NavLink to="/certificates/my">
          My Certificates
        </NavLink>
      </div>
    </nav>
  );
}
