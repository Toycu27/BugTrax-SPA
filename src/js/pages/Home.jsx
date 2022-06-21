import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="container">
            <div className="row mb-3 mt-1">
                <div className="col text-center"><h1>BugTrax</h1></div>
            </div>

            <div className="row mb-4">
                <div className="col text-center">
                    <Link data-title="Demo Login" to="/demo/login">
                        <button className="btn btn-primary fs-6 px-5" type="button">Demo Login</button>
                    </Link>
                </div>
            </div>

            <div className="row g-4 mb-3">
                <div className="col text-center">
                    <p className="fw-normal mb-3 fs-4">
                        Bug Tracking Software Designed for the Web
                        <br />
                        Make it easy for Developers to locate critical information
                    </p>
                </div>
            </div>

            <div className="row mb-3 justify-content-center">
                <div className="col-auto">
                    <ul className="ms-5">
                        <li>Bug Form is web specific</li>
                        <li>Entity Pages with filters</li>
                        <li>Kanban Board with filters</li>
                        <li>Navigation searchbar</li>
                        <li>Project statistics</li>
                        <li>Comment function</li>
                    </ul>
                </div>
                <div className="col-auto">
                    <ul className="ms-5">
                        <li>Login and registration</li>
                        <li>Full responsive design</li>
                        <li>Auto light and dark mode</li>
                    </ul>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col p-1 bg-secondary">
                    <div id="carouselCaptions" className="carousel carousel-fade carousel-dark slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="/screenshot_01.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_02.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_03.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_04.webp" className="d-block w-100" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="/screenshot_05.webp" className="d-block w-100" alt="..." />
                            </div>
                        </div>
                        <button className="carousel-control-prev bg-secondary" type="button" data-bs-target="#carouselCaptions" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true" />
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next bg-secondary" type="button" data-bs-target="#carouselCaptions" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true" />
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
