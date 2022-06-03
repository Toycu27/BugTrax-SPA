import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { SearchBar } from '../Form';
import axios from "axios";

export default function App({user}) {
  let links, searchBar, authLinks;

  if (user) {
      axios.defaults.headers['Authorization'] = 'Bearer ' + user.token;

    links = (<>
        <li className="nav-item">
            <NavLink className="nav-link text-uppercase" data-title="Projects" to="/projects">Projects</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link text-uppercase" data-title="Milestones" to="/milestones">Milestones</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link text-uppercase" data-title="Bugs" to="/bugs">Bugs</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link text-uppercase" data-title="Statistics" to="/statistics">Statistics</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link text-uppercase" data-title="Board" to="/board">Board</NavLink>
        </li>
    </>);
    searchBar = (<SearchBar />);
    authLinks = (<>
        <li className="nav-item">
            <NavLink className="nav-link" to="/user"><i className="bi bi-person"></i></NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link" to="/logout"><i className="bi bi-box-arrow-right"></i></NavLink>
        </li>
    </>);
  } else {
    links = (<></>);
    searchBar = (<></>);
    authLinks = (<>
        <li className="nav-item">
            <NavLink className="nav-link fs-6" data-title="Login" to="/login">Login</NavLink>
        </li>
        <li className="nav-item">
            <NavLink className="nav-link fs-6" data-title="Sign Up" to="/register">Sign Up</NavLink>
        </li>
    </>);
  }

  return (<>
      <header className="mb-6">
          <nav className="navbar navbar-expand-lg navbar-light fixed-top">
              <div className="container col-12">
                  <Link className="navbar-brand fs-3" to="/"><i className="bi bi-bug-fill"></i>Bx</Link>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul className="navbar-nav justify-content-start me-auto fs-6">{links}</ul>
                      <ul className="navbar-nav justify-content-end me-3">{searchBar}</ul>
                      <ul className="navbar-nav justify-content-end fs-4">{authLinks}</ul>
                  </div>
              </div>
          </nav>
      </header>

      <main className="py-5">
          <Outlet />
      </main>

      <footer className="row justify-content-center p-2">
          <div className="col-12 text-dark text-center">
              <span>© 2022 Onur Toycu Development & Design</span>
          </div>
      </footer>
  </>);
}