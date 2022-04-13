import React from 'react';
import { Link } from 'react-router-dom';
import "../css/styles.css";

const Header = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> 
          DevConnector
        </Link>
      </h1>
      <ul>
        <li>
          <a>
            Developers
          </a>
        </li>
        <li>
          <Link to="/register">
            Register
          </Link>
        </li>
        <li>
          <Link to="/login">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Header