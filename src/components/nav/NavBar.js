import React from "react"
import { Link } from "react-router-dom"
import "./NavBar.css"
import "bootstrap/dist/css/bootstrap.min.css"

export const NavBar = (props) => {
  return (
    <nav className="navbar bg-light text-black flex-md-nowrap p-0 shadow">
      <ul className="nav">
        <li className="nav-item">
          <Link className="nav-link" to="/sketch">Sketch</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/sketchbook">Sketchbook</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" onClick={e => sessionStorage.clear()} to="/login">Logout</Link>
        </li>
      </ul>
    </nav>
  )
}