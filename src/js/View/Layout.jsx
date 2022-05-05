import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useUser, Logout } from '../Auth';
import { AlertBox } from '../Form';
import axios from "axios";

export default function App({user, setUser, deleteUser}) {
  let links, authLinks;

  if (user) {
      axios.defaults.headers['Authorization'] = 'Bearer ' + user.token;

    links = (<>
        <li className="nav-item">
            <NavLink className="nav-link" to="/projects">Projects</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/milestones">Milestones</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/bugs">Bugs</NavLink>
        </li>
    </>);
    authLinks = (
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="bi bi-person-circle"></i> { user.name }
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><NavLink className="dropdown-item" to="/user"><i className="bi bi-gear"></i> Settings</NavLink></li>
            <li><Logout setUser={setUser}/></li>
          </ul>
        </li>
    );
  } else {
    links = (<></>);
    authLinks = (<>
        <li className="nav-item">
            <NavLink className="nav-link" to="/login">Login</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/register">Sign Up</NavLink>
        </li>
    </>);
  }

  return (<>
      <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid col-10">
                  <Link className="navbar-brand" to="/"><i className="bi bi-bug"></i> BugTrax</Link>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav justify-content-center me-auto">{ links }</ul>
                    <ul className="navbar-nav">{ authLinks }</ul>
                  </div>
              </div>
          </nav>
      </header>

      <main>
          <div className="container col-8 py-5 pb-5">
              <Outlet />
            <div className="row justify-content-md-center">
                <div className="col-sm-6">
                    <AlertBox />
                </div>
            </div>
        </div>
      </main>

      <footer className="fixed-bottom py-2 bg-light text-secondary">
          <div className="container-fluid col-10">
              <span>© 2022 Onur Toycu Development & Design</span>
          </div>
      </footer>

  </>);
}