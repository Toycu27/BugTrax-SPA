import { Link, NavLink, Outlet } from 'react-router-dom';
import React, { useContext } from 'react';
import { GlobalContext } from './js';
import { ThemeSwitch, SearchBar } from './js/shared';

export default function App() {
    const GLOBALS = useContext(GlobalContext);

    let links;
    let searchBar;
    let authLinks;

    if (GLOBALS.user) {
        links = (
            <>
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
                <li className="nav-item">
                    <NavLink className="nav-link text-uppercase" data-title="Users" to="/users">Users</NavLink>
                </li>
            </>
        );
        searchBar = (<li><SearchBar /></li>);
        authLinks = (
            <>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/user" aria-label="Account settings"><i className="bi bi-person" /></NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/logout" aria-label="Logout"><i className="bi bi-box-arrow-right" /></NavLink>
                </li>
            </>
        );
    } else {
        links = null;
        searchBar = null;
        authLinks = (
            <>
                <li className="nav-item">
                    <NavLink className="nav-link fs-6" data-title="Login" to="/demo/login">Demo</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link fs-6" data-title="Login" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link fs-6" data-title="Sign Up" to="/register">Sign Up</NavLink>
                </li>
            </>
        );
    }

    return (
        <>
            <header className="mb-5">
                <nav className="navbar navbar-expand-lg fixed-top">
                    <div className="container col-12">
                        <Link className="navbar-brand fs-3" to="/" aria-label="Brand Logo">
                            <i className="bi bi-bug-fill" />
                        </Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <i className="bi bi-list color-text-secondary fs-2" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav justify-content-start me-auto fs-6">{links}</ul>
                            <ul className="navbar-nav justify-content-end me-3 my-2"><ThemeSwitch /></ul>
                            <ul className="navbar-nav justify-content-end me-2">{searchBar}</ul>
                            <ul className="navbar-nav justify-content-end fs-4">{authLinks}</ul>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="py-5">
                <Outlet />
            </main>

            <footer className="container justify-content-center py-2">
                <div className="col-12 text-center">
                    <span>© 2022 Onur Toycu Development & Design</span>
                </div>
            </footer>
        </>
    );
}
